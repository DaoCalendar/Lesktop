Lesktop.DesktopHtmlWindow = (window.external != undefined && window.external.DesktopHtmlWindow != undefined) ? window.external.DesktopHtmlWindow : parent;
Lesktop.Taskbar = Lesktop.DesktopHtmlWindow.Lesktop.Taskbar;
Lesktop.Desktop = Lesktop.DesktopHtmlWindow.Lesktop.Desktop;
Lesktop.WindowManagement = Lesktop.DesktopHtmlWindow.Lesktop.WindowManagement;
Lesktop.Global = Lesktop.DesktopHtmlWindow.Lesktop.Global;

function Initialize(win)
{
	if (win == undefined) win = null;
	CurrentWindow = win;

	if (Lesktop.GetBrowser() == "IE")
	{
		try
		{
			document.execCommand("BackgroundImageCache", false, true);
		}
		catch (ex)
		{
		}
	}

	var enableSelTag = {
		"TEXTAREA": "",
		"INPUT": ""
	};

	document.onselectstart = function(evt)
	{
		var e = new Lesktop.Event(evt, window);
		return (e.GetTarget().tagName != undefined && enableSelTag[e.GetTarget().tagName.toUpperCase()] != undefined)
	}

	Lesktop.Utility.AttachEvent(
		document, "keydown",
		function()
		{
			if (event.keyCode == 116 || (event.ctrlKey && event.keyCode == 82))
			{
				event.keyCode = 0;
				event.returnValue = false;
				return false;
			}
			if (event.keyCode == 70 && event.ctrlKey && !event.altKey && !event.shiftKey)
			{
				event.keyCode = 0;
				event.returnValue = false;
				return false;
			}
		}
	);

	if (!ClientMode)
	{
		Lesktop.Utility.AttachEvent(
			document, "mousedown",
			function()
			{
				CurrentWindow.BringToTop();
			}
		);
	}

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
		Lesktop.CreateWindow = parent.Lesktop.CreateWindow;
		Lesktop.CreateMenu = parent.Lesktop.CreateMenu;
	}

	if (window.init != undefined) window.init();
	return true;
}