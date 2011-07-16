
var Window = null;

(function()
{

	var BorderCursorCss = [
		"nw-resize", "n-resize", "ne-resize",
		"w-resize", "default", "e-resize",
		"sw-resize", "s-resize", "se-resize"
	];

	function MoveCallback(action, data, e)
	{
		if (action == "moving")
		{
			var diffX = e.GetEvent().clientX - data.PreCurLeft;
			var diffY = e.GetEvent().clientY - data.PreCurTop;
			if (data.Action == "move")
			{
				data.Window.Move(data.PreLeft + diffX, data.PreTop + diffY);
			}
			else
			{
				var newLeft = data.PreLeft, newTop = data.PreTop, newWidth = data.PreWidth, newHeight = data.PreHeight;
				if (data.Action == 0)
				{
					newLeft = data.PreLeft + diffX;
					newTop = data.PreTop + diffY;
					newWidth = data.PreWidth - diffX;
					newHeight = data.PreHeight - diffY;

					if (newWidth < data.MinWidth)
					{
						newLeft -= data.MinWidth - newWidth;
						newWidth = data.MinWidth;
					}

					if (newHeight < data.MinHeight)
					{
						newTop -= data.MinHeight - newHeight;
						newHeight = data.MinHeight;
					}
				}
				else if (data.Action == 1)
				{
					newTop = data.PreTop + diffY;
					newHeight = data.PreHeight - diffY;

					if (newHeight < data.MinHeight)
					{
						newTop -= data.MinHeight - newHeight;
						newHeight = data.MinHeight;
					}
				}
				else if (data.Action == 2)
				{
					newTop = data.PreTop + diffY;
					newWidth = data.PreWidth + diffX;
					newHeight = data.PreHeight - diffY;

					if (newWidth < data.MinWidth)
					{
						newWidth = data.MinWidth;
					}

					if (newHeight < data.MinHeight)
					{
						newTop -= data.MinHeight - newHeight;
						newHeight = data.MinHeight;
					}
				}
				else if (data.Action == 3)
				{
					newLeft = data.PreLeft + diffX;
					newWidth = data.PreWidth - diffX;

					if (newWidth < data.MinWidth)
					{
						newLeft -= data.MinWidth - newWidth;
						newWidth = data.MinWidth;
					}
				}
				else if (data.Action == 5)
				{
					newWidth = data.PreWidth + diffX;

					if (newWidth < data.MinWidth)
					{
						newWidth = data.MinWidth;
					}
				}
				else if (data.Action == 6)
				{
					newLeft = data.PreLeft + diffX;
					newWidth = data.PreWidth - diffX;
					newHeight = data.PreHeight + diffY;

					if (newWidth < data.MinWidth)
					{
						newLeft -= data.MinWidth - newWidth;
						newWidth = data.MinWidth;
					}

					if (newHeight < data.MinHeight)
					{
						newHeight = data.MinHeight;
					}
				}
				else if (data.Action == 7)
				{
					newHeight = data.PreHeight + diffY;

					if (newHeight < data.MinHeight)
					{
						newHeight = data.MinHeight;
					}
				}
				else if (data.Action == 8)
				{
					newWidth = data.PreWidth + diffX;
					newHeight = data.PreHeight + diffY;

					if (newWidth < data.MinWidth)
					{
						newWidth = data.MinWidth;
					}

					if (newHeight < data.MinHeight)
					{
						newHeight = data.MinHeight;
					}
				}

				data.Window.Move(newLeft, newTop);
				data.Window.Resize(newWidth, newHeight);
			}
		}
		else if (action == "end")
		{
		}
	}

	function WindowBkImage(config)
	{
		var m_Config = Lesktop.Utility.Clone(config);

		var dom_ = document.createElement("DIV");

		dom_.innerHTML =
		"<table cellspacing='0' cellpadding='0'>" +
			"<tbody>" +
				"<tr><td></td><td></td><td></td></tr>" +
				"<tr><td></td><td></td><td></td></tr>" +
				"<tr><td></td><td></td><td></td></tr>" +
			"</tbody>" +
		"</table>";

		dom_.className = m_Config.Css;

		dom_.style.left = "0px";
		dom_.style.top = "0px";

		function resize(width, height)
		{
			var xs = [m_Config.Horiz[0], width - (m_Config.Horiz[0] + m_Config.Horiz[2]), m_Config.Horiz[2]];
			var ys = [m_Config.Vertical[0], height - (m_Config.Vertical[0] + m_Config.Vertical[2]), m_Config.Vertical[2]];

			for (var x = 0; x < 3; x++)
			{
				for (var y = 0; y < 3; y++)
				{
					var cell = dom_.firstChild.rows[y].cells[x];
					cell.style.width = xs[x] + 'px';
					cell.style.height = ys[y] + 'px';
				}
			}
		}

		this.Resize = resize;

		this.GetDom = function() { return dom_; };

		for (var x = 0; x < 3; x++)
		{
			for (var y = 0; y < 3; y++)
			{
				var cell = dom_.firstChild.rows[y].cells[x];
				cell.className = m_Config.Css + "_block_" + (y * 3 + x);
				cell.style.padding = '0px';
				cell.style.margin = '0px';
			}
		}

		resize(m_Config.Horiz[0] + m_Config.Horiz[1] + m_Config.Horiz[2], m_Config.Vertical[0] + m_Config.Vertical[1] + m_Config.Vertical[2]);
	}

	/*
	config = {
	Left:0
	Top:0
	Width:100
	Height:100
	Css:"window"
	HasMinButton:true
	HasMaxButton:true
	Resizable:true
	Title:{
	Height:18
	InnerHTML:""
	}
	BorderWidth:6,
	OnClose:null
	}
	*/

	Window = function(config)
	{
		var This = this;

		if (config == undefined) config = {};

		var config_ = {};
		config_.Left = Lesktop.Utility.IsNull(config.Left, 100);
		config_.Top = Lesktop.Utility.IsNull(config.Top, 100);
		config_.Width = Lesktop.Utility.IsNull(config.Width, 400);
		config_.Height = Lesktop.Utility.IsNull(config.Height, 300);
		config_.MinWidth = Lesktop.Utility.IsNull(config.MinWidth, Math.min(config_.Width, 400));
		config_.MinHeight = Lesktop.Utility.IsNull(config.MinHeight, Math.min(config_.Height, 300));
		config_.HasMinButton = Lesktop.Utility.IsNull(config.HasMinButton, true);
		config_.HasMaxButton = Lesktop.Utility.IsNull(config.HasMaxButton, true);
		config_.Resizable = Lesktop.Utility.IsNull(config.Resizable, true);
		config_.ShowInTaskbar = Lesktop.Utility.IsNull(config.ShowInTaskbar, config_.HasMinButton);
		config_.Css = Lesktop.Utility.IsNull(config.Css, "window");
		config_.BorderWidth = Lesktop.Utility.IsNull(config.BorderWidth, 6);
		config_.Tag = Lesktop.Utility.IsNull(config.Tag, null);
		config_.AnchorStyle = Lesktop.Utility.IsNull(config.AnchorStyle, Lesktop.WindowAnchorStyle.Left | Lesktop.WindowAnchorStyle.Top);

		if (config.Title == undefined)
		{
			config_.Title = {
				Height: 18,
				InnerHTML: ""
			};
		}
		else
		{
			config_.Title = {};
			config_.Title.Height = Lesktop.Utility.IsNull(config.Title.Height, 18);
			config_.Title.InnerHTML = Lesktop.Utility.IsNull(config.Title.InnerHTML, "");
		}

		config_.OnClose = Lesktop.Utility.IsNull(config.OnClose, null);

		Lesktop.IWindow.apply(this);

		This.GetLeft = function() { return config_.Left; }
		This.GetTop = function() { return config_.Top; }
		This.GetWidth = function() { return config_.Width; }
		This.GetHeight = function() { return config_.Height; }
		This.GetClientWidth = function() { return config_.Width - config_.BorderWidth * 2; };
		This.GetClientHeight = function() { return config_.Height - config_.BorderWidth * 2 - config_.Title.Height; };
		This.GetMinClientWidth = function() { return config_.MinWidth - config_.BorderWidth * 2; };
		This.GetMinClientHeight = function() { return config_.MinHeight - config_.BorderWidth * 2 - config_.Title.Height; };

		This.GetDom = function()
		{
			return dom_;
		}

		This.Resize = function(width, height)
		{
			bk_.Resize(width, height);

			config_.Width = width;
			config_.Height = height;

			var ws = [config_.BorderWidth, config_.Width - config_.BorderWidth * 2, config_.BorderWidth];
			var hs = [config_.BorderWidth, config_.Height - config_.BorderWidth * 2, config_.BorderWidth];

			if (config_.Title.Height > 0)
			{
				title_div_.style.width = ws[1] + "px";
				title_div_.style.height = config_.Title.Height + "px";
			}

			waiting_div_.style.width = ws[1] + "px";
			waiting_div_.style.height = "24px";
			waiting_div_.style.left = ws[0] + "px";
			waiting_div_.style.top = (hs[0] + config_.Title.Height) + "px";

			background_.style.width = width + "px";
			background_.style.height = height + "px";

			browser_.width = ws[1];
			browser_.height = hs[1] - config_.Title.Height;

			client_.style.width = ws[1] + "px";
			client_.style.height = (hs[1] - config_.Title.Height) + "px";

			if (config_.BorderWidth > 0)
			{
				for (var x = 0; x < 3; x++)
				{
					for (var y = 0; y < 3; y++)
					{
						var i = y * 3 + x;
						broder_div_.childNodes[i].style.width = ws[x] + "px";
						broder_div_.childNodes[i].style.height = hs[y] + "px";
					}
				}
			}

			dom_.style.width = width + "px";
			dom_.style.height = height + "px";

			disabled_div_.style.width = width + "px";
			disabled_div_.style.height = height + "px";

			This.OnResize.Call(This);
		}

		This.GetAnchorStyle = function()
		{
			return config_.AnchorStyle;
		}

		This.Move = function(left, top)
		{
			config_.Left = left;
			config_.Top = top;
			dom_.style.left = left + "px";
			dom_.style.top = top + "px";
		}

		This.MoveEx = function(position, x, y, relativeParent)
		{
			var left, top;

			var width = This.GetWidth();
			var height = This.GetHeight();

			if (x == undefined || x == null) x = 0;
			if (y == undefined || y == null) y = 0;

			if (parent_ == undefined || parent_ == null) relativeParent = false;

			var rect = null;
			if (relativeParent && parent_ != null)
				rect = { Width: parent_.GetWidth(), Height: parent_.GetHeight(), Top: parent_.GetTop(), Left: parent_.GetLeft() };
			else
				rect = { Width: Lesktop.Desktop.GetWidth(), Height: Lesktop.Desktop.GetHeight(), Top: 0, Left: 0 };

			position = position.toUpperCase();

			var align;
			var verticalAlign;

			if (position == 'CENTER')
			{
				align = "MIDDLE";
				verticalAlign = "MIDDLE";
			}
			else
			{
				var ps = position.split("|");
				align = ps.length > 0 ? ps[0] : "NULL";
				verticalAlign = ps.length > 1 ? ps[1] : "NULL";
			}

			switch (align)
			{
				case "LEFT":
					left = 0;
					break;
				case "RIGHT":
					left = rect.Width - width;
					break;
				case "MIDDLE":
					left = Math.round((rect.Width - width) / 2);
					break;
				default:
					left = 0;
			}
			left += rect.Left + x;

			switch (verticalAlign)
			{
				case "TOP":
					top = 0;
					break;
				case "BOTTOM":
					top = rect.Height - height;
					break;
				case "MIDDLE":
					top = Math.round((rect.Height - height) / 2);
					break;
				default:
					top = 0;
			}
			top += rect.Top + y;

			if (left < 0) left = 0;
			if (top < 0) top = 0;
			This.Move(left, top);
		}

		This.Show = function(isTop)
		{
			if (dom_.style.display != "block")
			{
				if (parent_ != null) parent_.Show();
				dom_.style.display = "block";
				if (child_ != null) child_.Show();
			}

			if (waiting_count_ <= 0)
			{
				waiting_count_ = 0;
				waiting_div_.style.display = "block";
				waiting_div_.style.display = "none";
			}

			This.SetTop();
		}

		This.ShowWindow = function(cmd)
		{
			This.Show(false);
		}

		This.Hide = function()
		{
			if (dom_.style.display != "none")
			{
				if (child_ != null) child_.Hide();
				dom_.style.display = "none";
				if (parent_ != null) parent_.Hide();
				This.OnHidden.Call(This);
			}
		}

		This.Minimum = function()
		{
			This.Hide();
		}

		This.Close = function()
		{
			Lesktop.Desktop.RemoveWindow(This);
			This.OnClosed.Call(This);
		}

		var parent_ = null;
		var child_ = null;

		This.GetParent = function()
		{
			return parent_;
		}

		This.SetParent = function(p)
		{
			if (parent_ != p)
			{
				var preParent = parent_;
				parent_ = p;
				if (preParent != null) preParent.AddChild(null);
				if (parent_ != null) parent_.AddChild(This);
			}
		}

		This.GetFirstParent = function()
		{
			return parent_ == null ? This : parent_.GetFirstParent();
		}

		This.GetChild = function()
		{
			return child_;
		}

		This.AddChild = function(c)
		{
			if (child_ != c)
			{
				var preChild = child_;
				child_ = c;
				if (preChild != null) preChild.SetParent(null);
				if (child_ != null) child_.SetParent(This);
			}
		}

		This.GetLastChild = function()
		{
			return child_ == null ? This : child_.GetLastChild();
		}

		This.SetTop = function()
		{
			if (!This.IsTop())
			{
				var w = This.GetFirstParent();
				while (w != null)
				{
					Lesktop.Desktop.SetTop(w);
					w = w.GetChild();
				}
			}
		}

		This.Disable = function()
		{
			disabled_div_.style.display = "block";
		}

		This.Enable = function()
		{
			disabled_div_.style.display = "none";
		}

		This.ShowDialog = function(parent, pos, left, top, relativeParent, callback)
		{
			var p = parent.GetLastChild();
			p.AddChild(This);
			This.MoveEx(pos, left, top, relativeParent);
			p.Disable();
			This.OnClosed.Attach(
				function()
				{
					p.Enable();
					This.SetParent(null);
					if (callback != null) callback(This);
				}
			);
			This.Show();
			parent.Show();
		}

		var html_window_ = null;

		This.GetHtmlWindow = function()
		{
			return html_window_;
		}

		var isload_ = false;

		This.IsLoad = function()
		{
			return isload_;
		}

		This.Load = function(src, onload_callback)
		{
			This.Waiting("\u6B63\u5728\u8F7D\u5165\u7A97\u53E3...");
			Lesktop.Utility.AttachEvent(
			browser_, "load",
				function()
				{
					This.Completed();
					isload_ = true;
					try
					{
						html_window_ = browser_.contentWindow;
						Lesktop.Utility.AttachEvent(
							html_window_.document, "mousedown",
							function()
							{
					    		try
					    		{
					    			if (html_window_.document.activeElement == null)
					    			{
					    				html_window_.document.body.focus();
					    			}
					    			else
					    			{
					    				html_window_.document.activeElement.focus();
					    			}
					    		}
					    		catch (ex)
					    		{
					    		}
							}
						);
						browser_.contentWindow.Initialize(This);
					}
					catch (ex)
					{
						return;
					}
					if (onload_callback != undefined) onload_callback();
					This.OnLoad.Call(This);
				}
			);

			browser_.src = src;
		}

		This.Navigate = function(src)
		{
			This.Waiting("\u6B63\u5728\u8F7D\u5165\u7A97\u53E3...");
			Lesktop.Utility.AttachEvent(
				browser_, "load",
				function()
				{
					This.Completed();
					isload_ = true;
				}
			);

			browser_.src = src;
		}

		var waiting_count_ = 0;

		This.Waiting = function(text)
		{
			waiting_count_++;

			waiting_div_.innerHTML = String.format("<div>{0}</div>", (text != "" ? text : "\u6B63\u5728\u52A0\u8F7D..."));

			if (waiting_count_ > 0)
			{
				waiting_div_.style.display = "block";
			}
		}

		This.Completed = function()
		{
			waiting_count_--;

			if (waiting_count_ <= 0)
			{
				waiting_count_ = 0;
				waiting_div_.style.display = "none";
			}
		}

		This.CompleteAll = function()
		{
			waiting_count_ = 0;
			waiting_div_.style.display = "none";
		}

		This.Reset = function()
		{
			This.CompleteAll();
		}

		This.Notify = function()
		{
			if (task_ != null)
			{
				task_.Shine(true);
			}
		}

		var tag_ = null;

		This.GetTag = function()
		{
			return tag_;
		}

		This.SetTag = function(tag)
		{
			tag_ = tag;
		}

		This.GetTitle = function()
		{
			return title_text_.innerHTML;
		}

		This.SetTitle = function(title)
		{
			title_text_.innerHTML = title;
			if (task_ != null) task_.SetText(title);
		}

		This.IsTop = function()
		{
			return Lesktop.Desktop.IsTop(This.GetLastChild());
		}

		This.IsVisible = function()
		{
			return dom_.style.display != "none";
		}

		This.BringToTop = function()
		{
			Lesktop.Desktop.SetTop(This);
		}

		This.GetFrame = function()
		{
			return browser_;
		}

		This.GetClient = function()
		{
			return client_;
		}

		This.SetMode = function(mode)
		{
			if (mode == 0)
			{
				client_.style.display = "none";
				browser_.style.display = "block";
			}
			else
			{
				client_.style.display = "block";
				browser_.style.display = "none";
			}
		}

		This.GetClientCoord = function(x, y)
		{
			var coord = Lesktop.Utility.GetClientCoord(browser_);
			coord.X += x;
			coord.Y += y;
			var desktopCoord = Lesktop.Utility.GetClientCoord(Lesktop.Desktop.GetDom());
			coord.X -= desktopCoord.X;
			coord.Y -= desktopCoord.Y;
			return coord;
		}

		var dom_ = document.createElement("DIV");

		dom_.tabIndex = -1;
		dom_.style.outline = 'none';
		dom_.style.padding = "0px";
		dom_.style.margin = "0px";
		dom_.style.borderWidth = "0px";
		dom_.style.position = "absolute";
		dom_.className = config_.Css;

		dom_.innerHTML =
		"<div>" +
		"</div>" +
		"<div class='border' style='position:absolute; z-Index:2;'>" +
			"<div style='float:left;font-size:1px;'></div>" +
			"<div style='float:left;font-size:1px;'></div>" +
			"<div style='float:left;font-size:1px;'></div>" +
			"<div style='float:left;font-size:1px;'></div>" +
			"<div style='float:left;'>" +
				"<div class='title'>" +
					"<div class='icon' style='float:left;'></div>" +
					"<div class='text' style='float:left;'></div>" +
					"<div class='closeButton' style='float:right;'></div>" +
					"<div class='maxButton' style='float:right;'></div>" +
					"<div class='restoreButton' style='float:right;'></div>" +
					"<div class='minButton' style='float:right;'></div>" +
				"</div>" +
				"<iframe frameBorder='0' allowTransparency='true' style='background-color:transparent;'></iframe>" +
				"<div class='client' style='diaplay:none;'></div>" +
			"</div>" +
			"<div style='float:left;font-size:1px;'></div>" +
			"<div style='float:left;font-size:1px;'></div>" +
			"<div style='float:left;font-size:1px;'></div>" +
			"<div style='float:left;font-size:1px;'></div>" +
		"</div>" +
		"<div style='display:none; z-Index:4;' class='disabled'></div>" +
		"<div style='display:none; z-Index:5;' class='waiting'></div>";

		var bk_ = new WindowBkImage(
			{
				Css: (config_.BorderWidth == 0 && config_.Title.Height == 0) ? "background_noborder" : "background",
				Horiz: [6, 100, 6],
				Vertical: [24, 100, 6]
			}
		);
		dom_.replaceChild(bk_.GetDom(), dom_.firstChild);

		dom_.onselectstart = function(evt)
		{
			var e = new Lesktop.Event(evt, window);

			if (e.GetTarget().tagName != undefined && e.GetTarget().tagName.toUpperCase() != 'DIV')
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		var background_ = dom_.childNodes[0];
		var broder_div_ = dom_.childNodes[1];

		for (var x = 0; x < 3; x++)
		{
			for (var y = 0; y < 3; y++)
			{
				var i = y * 3 + x;
				if (i != 4)
				{
					broder_div_.childNodes[i].style.display = config_.BorderWidth > 0 ? "block" : "none";
				}
			}
		}

		var disabled_div_ = dom_.childNodes[2];
		var waiting_div_ = dom_.childNodes[3];

		var title_div_ = broder_div_.childNodes[4].firstChild;
		title_div_.style.display = config_.Title.Height > 0 ? "block" : "none";

		var browser_ = broder_div_.childNodes[4].childNodes[1];

		var client_ = broder_div_.childNodes[4].childNodes[2];
		client_.style.display = "none"

		var title_text_ = title_div_.childNodes[1];
		var close_button_ = title_div_.childNodes[2];
		var max_button_ = title_div_.childNodes[3];
		var restore_button_ = title_div_.childNodes[4];
		var min_button_ = title_div_.childNodes[5];

		max_button_.style.display = "none";
		restore_button_.style.display = "none";

		title_text_.innerHTML = config_.Title.InnerHTML;

		min_button_.style.display = config_.HasMinButton ? "block" : "none";

		dom_.onmousedown = function()
		{
			This.SetTop();
		}

		title_div_.onmousedown = function()
		{
			var e = new Lesktop.Event(arguments[0]);

			if (e.GetTarget() == title_div_ ||
				e.GetTarget() == title_div_.childNodes[0] ||
				e.GetTarget() == title_div_.childNodes[1])
			{
				var data = {
					Window: This,
					PreLeft: config_.Left,
					PreTop: config_.Top,
					PreCurLeft: e.GetEvent().clientX,
					PreCurTop: e.GetEvent().clientY,
					Action: "move"
				};

				Lesktop.Desktop.EnterMove(MoveCallback, data, "move");
			}
		}

		if (config_.BorderWidth > 0)
		{
			for (var i = 0; i < 9; i++)
			{
				if (config_.Resizable)
				{
					broder_div_.childNodes[i].style.cursor = BorderCursorCss[i];
					if (i != 4)
					{
						(function(block, index, cursor, win, c)
						{

							block.onmousedown = function()
							{
								var e = new Lesktop.Event(arguments[0]);

								if (e.GetTarget() != block) return;

								var data = {
									Window: win,
									PreLeft: win.GetLeft(),
									PreTop: win.GetTop(),
									PreWidth: win.GetWidth(),
									PreHeight: win.GetHeight(),
									PreCurLeft: e.GetEvent().clientX,
									PreCurTop: e.GetEvent().clientY,
									MinWidth: c.MinWidth,
									MinHeight: c.MinHeight,
									Action: index
								};

								Lesktop.Desktop.EnterMove(MoveCallback, data, cursor);
							}
						})(broder_div_.childNodes[i], i, BorderCursorCss[i], This, config_);
					}
				}
			}
		}

		close_button_.onclick = function()
		{
			if (config_.OnClose == null) This.Close();
			else config_.OnClose(This);
		}

		min_button_.onclick = function()
		{
			This.Hide();
		}

		This.Hide();

		var task_ = null;

		if (config_.ShowInTaskbar)
		{
			task_ = Lesktop.Desktop.AddTask(This);
			This.OnClosed.Attach(
				function()
				{
					Lesktop.Desktop.RemoveTask(This);
				}
			);
		}

		Lesktop.Desktop.AddWindow(This);
		This.Resize(config_.Width, config_.Height);
		This.Move(config_.Left, config_.Top);
	}

})();
