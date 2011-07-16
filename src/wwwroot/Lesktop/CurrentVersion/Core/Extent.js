var CurrentWindow = null;

Lesktop.WindowAnchorStyle = {};
Lesktop.WindowAnchorStyle.Left = 1;
Lesktop.WindowAnchorStyle.Right = 1 << 1;
Lesktop.WindowAnchorStyle.Top = 1 << 2;
Lesktop.WindowAnchorStyle.Bottom = 1 << 3;
Lesktop.WindowAnchorStyle.All = 15;

if (window.ClientMode == undefined || !window.ClientMode)
{
	Lesktop.Post = function(url, data, type, timeout, handler)
	{
		try
		{
			var request = null;

			if (window.XMLHttpRequest)
			{
				request = new XMLHttpRequest();
			}
			else if (window.ActiveXObject)
			{
				request = new ActiveXObject("Microsoft.XMLHttp");
			}

			request.onreadystatechange = function()
			{
				if (request.readyState == 4)
				{
					try
					{
						switch (request.status)
						{
							case 200:
								{
									Lesktop.Session.WriteLog(String.format("Post Success: Url = {1}, status = {0}, ResponseText = '{2}'", request.status, url, request.responseText));
									if (request.responseText != "")
										handler.onsuccess(request.status, request.responseText);
									else
										handler.onerror("Server Error", "\u670D\u52A1\u5668\u9519\u8BEF!");
									break;
								}
							default:
								{
									handler.onerror(request.status, request.statusText);
									Lesktop.Session.WriteLog(String.format("Post Error : status = {0}, statusText = {1}, Url = {2}", request.status, request.statusText, url));
									break;
								}
						}
					}
					catch (ex)
					{
						handler.onerror(ex.mame, ex.message);
					}
					if (timer != null) clearTimeout(timer);
					request = null;
					timer = null;
				}
			}
			var timer = null;
			if (timeout > 0)
			{
				timer = setTimeout(
					function()
					{
						if (request != null)
						{
							request.onreadystatechange = function() { };
							request.abort();
							request = null;
							handler.onabort();
						}
					},
					timeout
				);
			}

			request.open("POST", url, true);
			request.setRequestHeader("Content-Type", type);
			request.send(data);
			return {
				Abort: function()
				{
					if (timer != null) clearTimeout(timer);
					if (request != null)
					{
						Lesktop.Session.WriteLog(String.format("Post Abort: Url = {0}", url));
						request.onreadystatechange = function() { };
						request.abort();
						request = null;
						handler.onabort();
					}
					timer = null;
				}
			}
		}
		catch (ex)
		{
			handler.onerror(new Lesktop.Exception(ex.name, ex.message));
		}
	}
}
else
{
	Lesktop.Post = function(url, data, type, timeout, handler)
	{
		window.external.Post(url, data, type, timeout, handler);
	}
}

(function(){

var m_Modules = {};
var m_ModulesArray = [];

var m_ModuleCtorFormat =
"\r\n" +
"var Module=this;\r\n" +
"Module.DirectoryName='{0}';\r\n" +
"Module.FileName='{1}';\r\n" +
"Module.GetResourceUrl = function(relativePath)\r\n" +
"{\r\n" +
"	return Lesktop.GetUrl(Module.DirectoryName+'/'+relativePath);\r\n" +
"};\r\n" +
"\r\n" +
"{2}\r\n" +
"Module.Initialize=(typeof(init)=='undefined'?null:init);\r\n" +
"Module.Dispose=(typeof(dispose)=='undefined'?null:dispose);\r\n";

function CreateModule(path, ctor)
{
	var module = {};
	module.DirectoryName = Lesktop.Path.GetDirectoryName(path);
	module.FileName = path;
	module.GetResourceUrl = function(relativePath)
	{
		return Lesktop.GetUrl(module.DirectoryName + '/' + relativePath);
	}
	ctor.call(module, module);

	return module;
}

function CreateHttpRequest()
{
	var request = null;
	if (window.XMLHttpRequest)
	{
		request = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		request = new ActiveXObject("Microsoft.XMLHttp");
	}
	return request;
}

function GetModuleText(callback, errorCallback, xmlUrl)
{
	var request = CreateHttpRequest();
	if (request)
	{
		var url = xmlUrl;
		request.open("GET", url, true);
		request.onreadystatechange = function()
		{
			if (request.readyState == 4)
			{
				try
				{
					switch (request.status)
					{
						case 200:
							callback(request.responseText);
							break;
						default:
							if (errorCallback) errorCallback(new Lesktop.Exception("Server Error", request.statusText));
					}
				}
				catch (ex)
				{
					errorCallback(new Lesktop.Exception(ex.name, ex.message));
				}
				finally
				{
					request = null;
				}
			}
		}
		request.send("");
	}
}

function LoadCss(href)
{
	var e = document.createElement("link");
	e.rel = "StyleSheet";
	e.type = "text/css";
	e.href = Lesktop.GetUrl(href);
	var hs = document.getElementsByTagName("head");
	if (hs.length > 0) hs[0].appendChild(e);
	return e;
}

function Link(rel, href, type)
{
	var e = document.createElement("link");
	e.rel = rel
	e.type = type
	e.href = href;
	var hs = document.getElementsByTagName("head");
	if (hs.length > 0) hs[0].appendChild(e); 
	return e;
}

function GetUrl(path)
{
	var baseUrl = (Lesktop.Config.ServiceUrl == "/" ? "" : Lesktop.Config.ServiceUrl) + "/" + Lesktop.Config.ResPath;
	return encodeURI(baseUrl + "/" + path);
}

function RegisterModule(path, ctor)
{
	var fullpath = "Module/" + path;
	m_Modules[fullpath.toUpperCase()] = CreateModule(fullpath, ctor);
}

function LoadModules(completeCallback, errorCallback, paths, index)
{
	function fail(ex)
	{
		errorCallback(ex);
	}

	if (index == undefined) index = 0;

	var path = "Module/" + paths[index];

	var moduleId = path.toUpperCase();
	if (m_Modules[moduleId] == null)
	{
		GetModuleText(load, fail, GetUrl(path));
	}
	else
	{
		loadComplete();
	}

	function load(text)
	{
		var moudle_ctor = new Function(
				String.format(m_ModuleCtorFormat, Lesktop.Path.GetDirectoryName(path), path, text, false)
			);
		var moudle = new moudle_ctor();
		if (moudle.Initialize != null)
			moudle.Initialize(complete, fail);
		else
			complete();
		function complete()
		{
			if (m_Modules[moduleId] == null)
			{
				m_Modules[moduleId] = moudle;
				m_ModulesArray.push(moudle);
			}
			loadComplete();
		}
	}

	function loadComplete()
	{
		if (index == paths.length - 1)
			completeCallback();
		else
			LoadModules(completeCallback, errorCallback, paths, index + 1);
	}
}

function GetModule(path)
{
	var moduleId = "MODULE/" + path.toUpperCase();
	return m_Modules[moduleId];
}

function Invoke(completeCallback, errorCallback, objs, asynMethod, continueIfError, completeOneCallback)
{
	function callOne(index)
	{
		var obj = objs[index];
		if (obj[asynMethod] != null)
		{
			try
			{
				obj[asynMethod].call(obj, complete, function(ex) { error(ex, obj); });
			}
			catch (ex)
			{
				error(ex, obj);
			}
		}
		else
			complete();
		function complete()
		{
			if (completeOneCallback != undefined) completeOneCallback(obj);
			if (index == objs.length - 1) completeCallback(); else callOne(index + 1);
		}
		function error(msg, o)
		{
			errorCallback(msg, o);
			if (!continueIfError || index == objs.length - 1) completeCallback(); else callOne(index + 1);
		}
	}
	if (objs.length > 0) callOne(0); else completeCallback();
}

function Call(completeCallback, errorCallback, funcs, caller, continueIfError, completeOneCallback)
{
	function callOne(index)
	{
		var func = funcs[index];
		if (func != null)
		{
			try
			{
				func.call(caller, complete, error);
			}
			catch (ex)
			{
				error(ex);
			}
		}
		else
			complete();
		function complete()
		{
			if (completeOneCallback != undefined) completeOneCallback(obj);
			if (index == funcs.length - 1) completeCallback(); else callOne(index + 1);
		}
		function error(msg)
		{
			errorCallback(msg);
			if (!continueIfError || index == funcs.length - 1) completeCallback(); else callOne(index + 1);
		}
	}
	if (objs.length > 0) callOne(0); else completeCallback();
}

function Dispose(completeCallback, errorCallback)
{
	function fail(ex, m)
	{
		errorCallback(ex);
	}

	m_ModulesArray.reverse();
	Invoke(completeCallback, fail, m_ModulesArray, "Dispose", true, completeOneCallback);
	function completeOneCallback(m)
	{
	}
}

Lesktop.GetUrl = GetUrl;
Lesktop.LoadCss = LoadCss;
Lesktop.Link = Link;
Lesktop.LoadModules = LoadModules;
Lesktop.GetModule = GetModule;
Lesktop.Dispose = Dispose;
Lesktop.Invoke = Invoke;
Lesktop.Call = Call;

})();

Lesktop.IWindow = function()
{
	this.ShowDialog = function(parent) { }

	this.Show = function() { }

	this.Hide = function() { }

	this.Minimum = function() { }

	this.Close = function() { }

	this.Move = function() { }

	this.MoveEx = function() { }

	this.Resize = function() { }

	this.GetTag = function() { }

	this.SetTag = function() { }

	this.GetTitle = function() { }

	this.SetTitle = function() { }

	this.IsTop = function() { }

	this.IsVisible = function() { }

	this.BringToTop = function() { }

	this.Load = function(url, callback) { }

	this.GetHtmlWindow = function() { }

	this.OnLoad = new Lesktop.Delegate();

	this.OnResize = new Lesktop.Delegate();

	this.OnClosed = new Lesktop.Delegate();

	this.OnHidden = new Lesktop.Delegate();

	this.OnNotify = new Lesktop.Delegate();

	this.GetClientWidth = function() { };

	this.GetClientHeight = function() { };

	this.GetClientCoord = function() { };

	this.Notify = function() { }
}

Lesktop.GetPageUrl = function(url)
{
	return String.format("{0}{1}/{2}", Lesktop.Config.ServiceUrl == "/" ? "" : Lesktop.Config.ServiceUrl + "/", Lesktop.Config.ResPath, url);
}

Lesktop.GetResourceUrl = function(url)
{
	return String.format("{0}{1}/{2}", Lesktop.Config.ServiceUrl == "/" ? "" : Lesktop.Config.ServiceUrl + "/", Lesktop.Config.ResPath, url);
}

Lesktop.Utility.ShowWarning = function(text)
{
	if (ClientMode) window.external.ShowWarning(text);
	else alert(text);
}

Lesktop.Utility.ShowError = function(text)
{
	if (ClientMode) window.external.ShowError(text);
	else alert(text);
}