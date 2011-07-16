if (!this.JSON) { this.JSON = {} } (function() { function f(n) { return n < 10 ? "0" + n : n } if (typeof Date.prototype.toJSON !== "function") { Date.prototype.toJSON = function(key) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) { return this.valueOf() } } var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function(a) { var c = meta[a]; return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + string + '"' } function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === "object" && typeof value.toJSON === "function") { value = value.toJSON(key) } if (typeof rep === "function") { value = rep.call(holder, key, value) } switch (typeof value) { case "string": return quote(value); case "number": return isFinite(value) ? String(value) : "null"; case "boolean": case "null": return String(value); case "object": if (!value) { return "null" } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === "[object Array]") { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || "null" } v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]"; gap = mind; return v } if (rep && typeof rep === "object") { length = rep.length; for (i = 0; i < length; i += 1) { k = rep[i]; if (typeof k === "string") { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v) } } } } else { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ": " : ":") + v) } } } } v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}"; gap = mind; return v } } if (typeof JSON.stringify !== "function") { JSON.stringify = function(value, replacer, space) { var i; gap = ""; indent = ""; if (typeof space === "number") { for (i = 0; i < space; i += 1) { indent += " " } } else { if (typeof space === "string") { indent = space } } rep = replacer; if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) { throw new Error("JSON.stringify") } return str("", { "": value }) } } if (typeof JSON.parse !== "function") { JSON.parse = function(text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === "object") { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v } else { delete value[k] } } } } return reviver.call(holder, key, value) } cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function(a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) { j = eval("(" + text + ")"); return typeof reviver === "function" ? walk({ "": j }, "") : j } throw new SyntaxError("JSON.parse") } } } ());
		
function Break()
{
}

String.format = function(fmt)
{
	var params = arguments;
	var pattern = /{{|{[1-9][0-9]*}|\x7B0\x7D/g;
	return fmt.replace(
		pattern,
		function(p)
		{
			if (p == "{{") return "{";
			return params[parseInt(p.substr(1, p.length - 2), 10) + 1]
		}
	);
}

String.compareIngoreCase = function(str1, str2)
{
	return str1.toLowerCase() == str2.toLowerCase();
}

if(window.Lesktop == undefined) window.Lesktop = {};

(function(){

Lesktop.Params = (function()
{
	var search = window.location.search.substr(1, window.location.search.length - 1);
	if (search == "") return {};
	var pairs = search.split("&");
	var params = {};
	for (var i in pairs)
	{
		var vs = pairs[i].split("=");
		params[vs[0]] = vs[1];
	}
	return params;
})();

var ua = navigator.userAgent.toLowerCase();

var m_Browser = "";
if ((/msie ([\d.]+)/).test(ua)) m_Browser = "IE";
else if ((/firefox\/([\d.]+)/).test(ua)) m_Browser = "Firefox";
else if ((/chrome\/([\d.]+)/).test(ua)) m_Browser = "Chrome";
else if ((/qt\/([\d.]+)/).test(ua)) m_Browser = "Chrome";

Lesktop.GetBrowser = function()
{
	return m_Browser;
}

Lesktop.Utility = {};

Lesktop.Utility.IsNull = function()
{
	for (var i = 0; i < arguments.length; i++)
	{
		var arg = arguments[i];
		if (arg != undefined && arg != null) return arg;
	}
	return null;
}

Lesktop.Utility.AttachEvent = function(elem, evtName, handler)
{
	if (elem.attachEvent)
	{
		elem.attachEvent("on" + evtName, handler);
	}
	else if (elem.addEventListener)
	{
		elem.addEventListener(evtName, handler, false);
	}
}

Lesktop.Utility.DetachEvent = function(elem, evtName, handler)
{
	if (elem.detachEvent)
	{
		elem.detachEvent("on" + evtName, handler);
	}
	else if (elem.addEventListener)
	{
		elem.removeEventListener(evtName, handler, false);
	}
}

Lesktop.Utility.AttachButtonEvent = function(elem, normal_css, hover_css, press_css)
{
	Lesktop.Utility.AttachEvent(
		elem, "mousedown",
		function(evt)
		{
			if (evt == undefined) evt = window.event;

			if (Lesktop.Utility.GetButton(evt) == "Left")
			{
				elem.className = press_css;
			}
		}
	);
	Lesktop.Utility.AttachEvent(
		elem, "mouseup",
		function(evt)
		{
			if (evt == undefined) evt = window.event;
			elem.className = normal_css;
		}
	);
	Lesktop.Utility.AttachEvent(
		elem, "mouseover",
		function(evt)
		{
			if (evt == undefined) evt = window.event;

			if (elem.className != press_css)
			{
				elem.className = hover_css;
			}
		}
	);
	Lesktop.Utility.AttachEvent(
		elem, "mouseout",
		function(evt)
		{
			elem.className = normal_css;
		}
	);
}

Lesktop.Utility.Clone = function(val)
{
	if (val == null)
	{
		return null
	}
	else if (val.constructor == Array)
	{
		var a = new Array()
		for (i in val)
		{
			a[i] = Lesktop.Utility.Clone(val[i])
		}
		return a
	}
	else if (val.constructor == Object)
	{
		var a = new Object()
		for (c in val)
		{
			a[c] = Lesktop.Utility.Clone(val[c])
		}
		return a
	}
	else if (val.constructor == Number)
	{
		return val
	}
	else if (val.constructor == String)
	{
		return val
	}
	else if (val.constructor == Date)
	{
		return val
	}
	else
		return val;
}

Lesktop.Utility.DisableSelect = function(elem, disableChildren)
{
	if (disableChildren == undefined) disableChildren = false;

	if (Lesktop.GetBrowser() == "IE")
	{
		if (elem.setAttribute != undefined) elem.setAttribute("unselectable", "on");

		if (disableChildren)
		{
			for (var i = 0; i < elem.childNodes.length; i++)
			{
				Lesktop.Utility.DisableSelect(elem.childNodes[i], true);
			}
		}
	}
}

Lesktop.Utility.GetButton = function(evt)
{
	if (evt.which != undefined)
	{
		if (evt.which == 1) return "Left";
		else if (evt.which == 3) return "Right";
		else return "";
	}
	else
	{
		if (evt.button == 1) return "Left";
		else if (evt.button == 2) return "Right";
		else return "";
	}
}

Lesktop.Utility.IsTextNode = function(node)
{
	return node.innerHTML == undefined;
}

var m_ScrollTitleInternal = null;
var m_ScrollTitleCount = 0;
var m_Title = "";

Lesktop.Utility.ScrollTitle = function(title)
{
	try
	{
		Lesktop.Utility.StopScrollTitle();
		m_ScrollTitleCount = 1;
		m_Title = title;
		document.title = m_Title;
		m_ScrollTitleInternal = setInterval(
			function()
			{
				try
				{
					m_ScrollTitleCount = (m_ScrollTitleCount + 1) % m_Title.length;
					document.title = m_Title.substr(m_ScrollTitleCount, m_Title.length - m_ScrollTitleCount) + "        " + m_Title.substr(0, m_ScrollTitleCount);
				}
				catch(ex)
				{
				}
			},
			100
		);
	}
	catch(ex)
	{
	}
}

Lesktop.Utility.StopScrollTitle = function()
{
	try
	{
		if (m_ScrollTitleInternal != null)
		{
			clearInterval(m_ScrollTitleInternal);
			m_ScrollTitleCount = 0;

			if (Lesktop.Session != undefined)
			{
				if (Lesktop.Session.GetUserName() == "" || Lesktop.Session.GetUserName() == null) document.title = "";
				else document.title = String.format("\u6B22\u8FCE\u60A8 {0}", Lesktop.Session.GetUserInfo().Nickname);
			}
		}
	}
	catch(ex)
	{
	}
}

function _ClearHtml(builder, node)
{
	for (var i = 0; i < node.childNodes.length; i++)
	{
		var n = node.childNodes[i];
		if (Lesktop.Utility.IsTextNode(n))
		{
			if (n.textContent) builder.push(n.textContent);
			else if (n.nodeValue) builder.push(n.nodeValue);
		}
		else
		{
			_ClearHtml(builder, n);
		}
	}
}

Lesktop.Utility.ClearHtml = function(node)
{
	var builder = [];
	_ClearHtml(builder, node);
	return builder.join("");
}

Lesktop.Utility.GetInnerHTML = function(nodes)
{
	var builder = [];
	for (var i = 0; i < nodes.length; i++)
	{
		if (!Lesktop.Utility.IsTextNode(nodes[i]))
		{
			builder.push(nodes[i].innerHTML);
		}
		else
		{
			if (nodes[i].textContent) builder.push(nodes[i].textContent.replace(/\</ig, function() { return "&lt;"; }));
			else if (nodes[i].nodeValue) builder.push(nodes[i].nodeValue.replace(/\</ig, function() { return "&lt;"; }));
		}
	}
	return builder.join("");
}

Lesktop.Utility.GetInnerText = function(node)
{
    if (node.innerText != undefined) return node.innerText;
    else if (node.textContent != undefined) return node.textContent;
    else if (node.nodeValue != undefined) return node.nodeValue;
}

Lesktop.Utility.EncodeUrl = function(url)
{
	var temp = [];
	for (var i = 0; i < url.length; i++)
	{
		var ascii = url.charCodeAt(i);
		temp.push("%");
		temp.push(acrii.toString(16));
	}
	return temp.join("");
}

Lesktop.Utility.GetClientCoord = function(obj)
{
	if (obj.getBoundingClientRect != undefined)
	{
		var bodyRect = document.body.getBoundingClientRect();
		var rect = obj.getBoundingClientRect();
		return { X: rect.left - bodyRect.left, Y: rect.top - bodyRect.top };
	}
	else
	{
		if (Lesktop.GetBrowser() == "IE")
		{
			var offsetParent = obj.offsetParent;
			if (offsetParent == null)
			{
				return { X: obj.offsetLeft, Y: obj.offsetTop };
			}
			else
			{
				var offset = Lesktop.Utility.GetClientCoord(offsetParent);
				return { X: obj.offsetLeft + offset.X, Y: obj.offsetTop + offset.Y };
			}
		}
		else
		{
			var offsetParent = obj.offsetParent;
			if (offsetParent == null)
			{
				return { X: obj.offsetLeft, Y: obj.offsetTop };
			}
			else
			{
				var offset = Lesktop.Utility.GetClientCoord(offsetParent);
				var coord = { X: offsetParent.clientLeft + obj.offsetLeft + offset.X, Y: offsetParent.clientTop + obj.offsetTop + offset.Y };
				return coord;
			}
		}
	}
}

Lesktop.Utility.PreventDefault = function(evt)
{
	if (evt.preventDefault != undefined)
	{
		evt.preventDefault();
	}
	else
	{
		evt.returnValue = false;
	}
}

Lesktop.Utility.CancelBubble = function(evt)
{
	if (evt && evt.stopPropagation) evt.stopPropagation();
	else evt.cancelBubble = true;
}

Lesktop.Utility.GetTarget = function(evt)
{
	if (evt.target != undefined) return evt.target;
	if (evt.srcElement != undefined) return evt.srcElement;
	return null;
}

Lesktop.Utility.TransferCharForXML = function(str)
{
	var res = str.replace(
		/&|\x3E|\x3C|\x5E|\x22|\x27|[\x00-\x1F]|\t/g,
		function(s)
		{
			var ascii = s.charCodeAt(0)
			return "&#" + ascii.toString(10) + ";";
		}
	)
	return res;
}

Lesktop.Utility.TransferCharForJavascript = function(s)
{
	var newStr = s.replace(
		/[\x26\x27\x3C\x3E\x0D\x0A\x22\x2C\x5C\x00]/g,
		function(c)
		{
			ascii = c.charCodeAt(0)
			return '\\u00' + (ascii < 16 ? '0' + ascii.toString(16) : ascii.toString(16))
		}
	);
	return newStr;
}

var AllowHtmlTag = {
	"A": "A",
	"I": "I",
	"B": "B",
	"U": "U",
	"P": "P",
	"TH": "TH",
	"TD": "TD",
	"TR": "TR",
	"OL": "OL",
	"UL": "UL",
	"LI": "LI",
	"BR": "BR",
	"H1": "H1",
	"H2": "H2",
	"H3": "H3",
	"H4": "H4",
	"H5": "H5",
	"H6": "H6",
	"H7": "H7",
	"EM": "EM",
	"PRE": "PRE",
	"DIV": "DIV",
	"IMG": "IMG",
	"CITE": "CITE",
	"SPAN": "SPAN",
	"FONT": "FONT",
	"CODE": "CODE",
	"TABLE": "TABLE",
	"TBODY": "TBODY",
	"SMALL": "SMALL",
	"THEAD": "THEAD",
	"CENTER": "CENTER",
	"STRONG": "STRONG",
	"BLOCKQUOTE": "BLOCKQUOTE"
};

var HtmlBeginTagRegex = /<[^\/][^<>]+>/ig;
var HtmlEndTagRegex = /<\/[^\s<>\/]+>/ig;

Lesktop.Utility.ReplaceHtml = function(text)
{
	var newText = text.toString().replace(
		HtmlBeginTagRegex,
		function(html)
		{
			return html.replace(
				/[^\s<>\/]+/i,
				function(tag)
				{
					if (AllowHtmlTag[tag.toUpperCase()] == undefined) return "_tag";
					else return tag;
				}
			)
			.replace(
				/[^a-zA-Z]expression|[^a-zA-Z]on|[^a-zA-Z]javascript/ig,
				function(str)
				{
					return str.substr(0, 1) + "_" + str.substr(1, str.length - 1);
				}
			);
		}
	)
	.replace(
		HtmlEndTagRegex,
		function(html)
		{
			return html.replace(
				/[^\s<>\/]+/i,
				function(tag)
				{
					if (AllowHtmlTag[tag.toUpperCase()] == undefined) return "_tag";
					else return tag;
				}
			)
		}
	);
	return newText;
}

Lesktop.Event = function(evt, win)
{
	if (win == undefined) win = window;
	if (evt == undefined) evt = win.event;

	this.PreventDefault = function()
	{
		if (evt.preventDefault != undefined)
		{
			evt.preventDefault();
		}
		else
		{
			evt.returnValue = false;
		}
	}

	this.CancelBubble = function()
	{
		if (evt && evt.stopPropagation) evt.stopPropagation();
		else evt.cancelBubble = true;
	}

	this.GetTarget = function()
	{
		if (evt.target != undefined) return evt.target;
		if (evt.srcElement != undefined) return evt.srcElement;
		return null;
	}

	this.GetEvent = function()
	{
		return evt;
	}

	this.GetButton = function()
	{
		if ((evt.which != undefined && evt.which == 1) || evt.button == 1) return "Left";
		else if ((evt.which != undefined && evt.which == 3) || evt.button == 2) return "Right"
		else return "";
	}
}

Lesktop.Exception = function(name, msg)
{
	this.Name = name;
	this.Message = msg;

	this.toString = function()
	{
		return name + ":" + msg;
	}
}

Lesktop.Delegate = function()
{
	var all = [];

	var This = this;

	This.Call = function()
	{
		var ret = null;
		for (var index in all)
		{
			ret = all[index].apply(This, arguments);
		}
		return ret;
	}

	This.Attach = function(func)
	{
		all.push(func);
	}

	This.Detach = function(func)
	{
		var index = 0;
		for (index in all)
		{
			if (all[index] == func) break;
		}
		if (index < all.length)
		{
			delete all[index];
			all.splice(index, 1);
		}
	}
	
	This.DetachAll = function()
	{
		all = [];
	}
}

Lesktop.Object = function()
{
	this.GetType = function()
	{
		return "Object";
	}

	this.is = function(typeName)
	{
		return typeName == this.GetType();
	}
}

Lesktop.CreateObject = function(type)
{
	var obj = {};
	Lesktop[type].call(obj);
	return obj;
}

var m_Count = 100000000;

Lesktop.GenerateUniqueId = function()
{
	m_Count++;
	return 'ID' + m_Count;
}

var m_ParseBaseDate = new Date(1970, 0, 1, 0, 0, 0);

var ParseContructors = {
	Date: function(value)
	{
		var val = new Date();
		val.setTime(value + m_ParseBaseDate.getTime());
		return val;
	},
	Exception: function(value)
	{
		return new Lesktop.Exception(value.Name, value.Message);
	}
};

Lesktop.Utility.ParseJson = function(str, contructors)
{
	try
	{
		var val = JSON.parse(
			str,
			function(key, value)
			{
				if (value != null && typeof value == "object" && value.__DataType != undefined)
				{
					if (ParseContructors[value.__DataType] != undefined)
					{
						return ParseContructors[value.__DataType](value.__Value);
					}
					else if (contructors != undefined && contructors[value.__DataType] != undefined)
					{
						return contructors[value.__DataType](value.__Value);
					}
					else
					{
						return value;
					}
				}
				else
				{
					return value;
				}
			}
		);
	}
	catch (ex)
	{
		throw ex;
	}
	return val;
}

Lesktop.Utility.RenderJson = function(val)
{
	if (val == null)
	{
		return null
	}
	else if (val.constructor == Array)
	{
		var builder = [];
		builder.push("[");
		for (var index in val)
		{
			if (index > 0) builder.push(",");
			builder.push(Lesktop.Utility.RenderJson(val[index]));
		}
		builder.push("]");
		return builder.join("");
	}
	else if (val.constructor == Object)
	{
		var builder = [];
		builder.push("{");
		var index = 0;
		for (var key in val)
		{
			if (index > 0) builder.push(",");
			builder.push(String.format("\"{0}\":{1}", key, Lesktop.Utility.RenderJson(val[key])));
			index++;
		}
		builder.push("}");
		return builder.join("");
	}
	else if (val.constructor == Boolean)
	{
		return val.toString();
	}
	else if (val.constructor == Number)
	{
		return val.toString();
	}
	else if (val.constructor == String)
	{
		return String.format('"{0}"', Lesktop.Utility.TransferCharForJavascript(val));
	}
	else if (val.constructor == Date)
	{
		return String.format('{"__DataType":"Date","__Value":{0}}', val.getTime() - m_ParseBaseDate.getTime());
	}
	else if (val.RenderJson != undefined)
	{
		return val.RenderJson();
	}
}

Lesktop.Path = function()
{
}

Lesktop.Path.GetFullPath = function(path)
{
	return String.format("/{0}/{1}", Lesktop.Session.GetUserName(), path);
}

Lesktop.Path.GetRelativePath = function(parent, sub)
{
	if (parent.length > sub.length) return null;

	parentPath = parent.toUpperCase();
	subPath = sub.toUpperCase();

	if (parentPath == subPath) return "";
	var index = subPath.indexOf(parentPath);
	if (index == 0 && subPath.charAt(parentPath.length) == '/')
	{
		return sub.substr(parentPath.length + 1, subPath.length - parentPath.length);
	}
	else
	{
		return null;
	}

}

Lesktop.Path.GetFileName = function(fullName)
{
	var index = fullName.lastIndexOf("/")
	var name = (index == -1 ? fullName : fullName.substring(index + 1, fullName.length));
	return name;
}

Lesktop.Path.GetFileExtension = function(fullName)
{
	var index = fullName.lastIndexOf(".")
	var ext = (index == -1 ? "" : fullName.substring(index, fullName.length));
	return ext;
}

Lesktop.Path.GetDirectoryName = function(fullName)
{
	var index = fullName.lastIndexOf("/")
	switch (index)
	{
		case -1:
			return null;
		case 0:
			return "/";
		default:
			return fullName.substring(0, index);
	}
}

Lesktop.Path.GetFileNameNoExtention = function(fullName)
{
	var index = fullName.lastIndexOf("/")
	var name = (index == -1 ? fullName : fullName.substring(index + 1, fullName.length));
	index = name.lastIndexOf(".");
	return index == -1 ? name : name.substring(0, index);
}

Lesktop.Path.Join = function()
{
	var path = "";
	for (var i = 0; i < arguments.length; i++)
	{
		if (arguments[i] != undefined && arguments[i] != null && arguments[i] != "")
		{
			if (arguments[i].charAt(arguments[i].length - 1) != '/') path += '/';
			path += arguments[i];
		}
	}
	return path;
}

})();
