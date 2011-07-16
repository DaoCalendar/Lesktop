try
{	
	if (window.external != undefined && window.external.Version != undefined && window.external.Version != Lesktop.Config.Version)
	{
		window.external.ShowError("\u5BA2\u6237\u7AEF\u7248\u672C\u4E0D\u517C\u5BB9\uFF0C\u8BF7\u5347\u7EA7\u81F3 " + Lesktop.Config.Version + "！");
		window.external.ExitApplication();
	}
}
catch (ex)
{
}

Lesktop.WindowManagement = (function()
{
	var m_All = [];

	var obj = {};

	obj.Add = function(win)
	{
		m_All.push(win);
	}

	obj.Remove = function(win)
	{
		var i = 0;
		for (; i < m_All.length && m_All[i] != win; i++);
		if (i < m_All.length) m_All.splice(i, 1);
	}

	obj.Notify = function(cmd, data)
	{
		for (var i in m_All)
		{
			try
			{
				m_All[i].OnNotify.Call(cmd, data);
			}
			catch (ex)
			{
			}
		}
	}

	return obj;
})();

Lesktop.Global = {};

Lesktop.Global.ExitApplication = function()
{
	if(ClientMode) window.external.ExitApplication();
}

function IsDebug()
{
	return window.external != undefined && window.external.Debug;
}

Lesktop.DesktopHtmlWindow = window;

function Initialize(win)
{
	if (win == undefined) win = null;
	CurrentWindow = win;
	
	if (ClientMode)
	{
		Lesktop.CreateWindow = function(config)
		{
			var _config = {};
			_config.Left = Lesktop.Utility.IsNull(config.Left, 100);
			_config.Top = Lesktop.Utility.IsNull(config.Top, 100);
			_config.Width = Lesktop.Utility.IsNull(config.Width, 400);
			_config.Height = Lesktop.Utility.IsNull(config.Height, 300);
			_config.MinWidth = Lesktop.Utility.IsNull(config.MinWidth, Math.min(_config.Width, 400));
			_config.MinHeight = Lesktop.Utility.IsNull(config.MinHeight, Math.min(_config.Height, 300));
			_config.HasMinButton = Lesktop.Utility.IsNull(config.HasMinButton, true);
			_config.HasMaxButton = Lesktop.Utility.IsNull(config.HasMaxButton, true);
			_config.Resizable = Lesktop.Utility.IsNull(config.Resizable, true);
			_config.Css = Lesktop.Utility.IsNull(config.Css, "window");
			_config.BorderWidth = Lesktop.Utility.IsNull(config.BorderWidth, 6);
			_config.ShowInTaskbar = Lesktop.Utility.IsNull(config.ShowInTaskbar, _config.HasMinButton);
			_config.Tag = Lesktop.Utility.IsNull(config.Tag, null);
			_config.AllowDrop = Lesktop.Utility.IsNull(config.AllowDrop, false);
			_config.TopMost = Lesktop.Utility.IsNull(config.TopMost, false);
			_config.TranslateAccelerator = Lesktop.Utility.IsNull(config.TranslateAccelerator, null);

			if (config.Title == undefined)
			{
				_config.Title = {
					Height: 18,
					InnerHTML: ""
				};
			}
			else
			{
				_config.Title = {};
				_config.Title.Height = Lesktop.Utility.IsNull(config.Title.Height, 18);
				_config.Title.InnerHTML = Lesktop.Utility.IsNull(config.Title.InnerHTML, "");
			}

			_config.OnClose = Lesktop.Utility.IsNull(config.OnClose, null);

			var win = window.external.CreateWindow(_config);
			Lesktop.WindowManagement.Add(win);
			win.OnClosed.Attach(function(w) { Lesktop.WindowManagement.Remove(w); });
			return win;
		}

		Lesktop.CreateMenu = function(config)
		{
			return window.external.CreateMenu(config);
		}
	}
	else
	{
		Lesktop.Utility.AttachEvent(
			document, "mousemove",
			function()
			{
				Lesktop.Utility.StopScrollTitle();
			}
		);
		Lesktop.CreateWindow = function(config)
		{
			var win = new Window(config);
			Lesktop.WindowManagement.Add(win);
			win.OnClosed.Attach(function(w) { Lesktop.WindowManagement.Remove(w); });
			return win;
		}

		Lesktop.CreateMenu = function(config)
		{
			var menu = new Menu(config);
			return menu;
		}
	}

	Lesktop.Desktop.Create();
	Lesktop.Taskbar.Show();

	if (window.init != undefined)
	{
		window.init();
	}

	return true;
}
