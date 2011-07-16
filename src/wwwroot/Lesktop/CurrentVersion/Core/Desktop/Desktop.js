Lesktop.Desktop = (function()
{
	var obj = {};

	var dom_ = null;
	var scroll_dom_ = null;
	var move_div_ = null;
	var move_var_ = null;

	function body_onmousemove()
	{
		if (move_var_ != null)
		{
			move_var_.Callback("moving", move_var_.Data, new Lesktop.Event(arguments[0]));
		}
	}

	function body_onmouseup()
	{
		if (move_var_ != null)
		{
			move_div_.style.cursor = move_var_.Cursor;
			move_div_.style.display = "none";
			move_var_.Callback("end", move_var_.Data, new Lesktop.Event(arguments[0]));
			move_var_ = null;
		}
	}

	var all_ = [];

	function Find(win)
	{
		var i = 0;
		for (; i < all_.length && all_[i] != win; i++);
		return i < all_.length ? i : -1;
	}

	obj.AddWindow = function(win)
	{
		dom_.appendChild(win.GetDom());
		win.GetDom().style.zIndex = all_.length > 0 ? parseInt(all_[all_.length - 1].GetDom().style.zIndex) + 1 : 10000;
		all_.push(win);
	}

	obj.RemoveWindow = function(win)
	{
		var index = Find(win);
		if (index >= 0)
		{
			dom_.removeChild(win.GetDom());
			all_.splice(index, 1);
		}
	}

	obj.GetDom = function()
	{
		return dom_;
	}


	obj.GetScrollDom = function()
	{
		return scroll_dom_;
	}

	obj.SetTop = function(win)
	{
		if (all_.length > 0 && win != all_[all_.length - 1])
		{
			var index = Find(win);
			if (index == -1) return;
			all_.splice(index, 1);
			var zIndex = parseInt(all_[all_.length - 1].GetDom().style.zIndex) + 1;
			win.GetDom().style.zIndex = zIndex;
			all_.push(win);

			if (zIndex > 100000)
			{
				for (var i = 0; i < all_.length; i++) all_[i].GetDom().style.zIndex = i + 10000;
			}
		}
	}

	obj.IsTop = function(win)
	{
		if (all_.length <= 0) return false;
		return all_[all_.length - 1] == win;
	}

	obj.EnterMove = function(callback, data, cursor)
	{
		move_var_ = {
			Callback: callback,
			Data: data,
			PreCursor: move_div_.style.cursor
		};

		move_div_.style.cursor = cursor;
		move_div_.style.display = "block";
	}

	obj.GetWidth = function()
	{
		return Math.max(document.documentElement.clientWidth, 200);
	}

	obj.GetHeight = function()
	{
		return Math.max(document.documentElement.clientHeight, 200);
	}

	var _width = 0, _height = 0;

	function Resize(width, height)
	{
		for (var i in all_)
		{
			try
			{
				var win = all_[i];
				var anchorStyle = win.GetAnchorStyle();
				var needResize = false, needMove = false;
				var newLeft = win.GetLeft(), newTop = win.GetTop(), newWidth = win.GetWidth(), newHeight = win.GetHeight();

				if ((anchorStyle & Lesktop.WindowAnchorStyle.Left) == 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Right) == 0)
				{
				}
				else if ((anchorStyle & Lesktop.WindowAnchorStyle.Left) != 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Right) == 0)
				{
				}
				else if ((anchorStyle & Lesktop.WindowAnchorStyle.Left) == 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Right) != 0)
				{
					newLeft += (width - _width);
					needMove = true;
				}
				else if ((anchorStyle & Lesktop.WindowAnchorStyle.Left) != 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Right) != 0)
				{
					newWidth += (width - _width);
					needResize = true;
				}

				if ((anchorStyle & Lesktop.WindowAnchorStyle.Top) == 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Bottom) == 0)
				{
				}
				else if ((anchorStyle & Lesktop.WindowAnchorStyle.Top) != 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Bottom) == 0)
				{
				}
				else if ((anchorStyle & Lesktop.WindowAnchorStyle.Top) == 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Bottom) != 0)
				{
					newTop += (height - _height);
					needMove = true;
				}
				else if ((anchorStyle & Lesktop.WindowAnchorStyle.Top) != 0 && (anchorStyle & Lesktop.WindowAnchorStyle.Bottom) != 0)
				{
					newHeight += (height - _height);
					needResize = true;
				}

				if (needMove) win.Move(newLeft, newTop);
				if (needResize) win.Resize(newWidth, newHeight);
			}
			catch (ex)
			{
			}
		}
		move_div_.style.width = width + "px";
		move_div_.style.height = height + "px";
		Lesktop.Taskbar.Move();
		Lesktop.Taskbar.Resize();
		_width = width;
		_height = height;
	}

	obj.Create = function()
	{
		if (dom_ == null)
		{
			scroll_dom_ = document.createElement("DIV");
			scroll_dom_.style.width = "10px";
			scroll_dom_.style.height = "10px";
			scroll_dom_.style.zIndex = "100000000";
			scroll_dom_.style.position = "absolute";
			document.body.appendChild(scroll_dom_);

			dom_ = document.createElement("DIV");
			dom_.className = "desktop";
			dom_.style.width = "10px";
			dom_.style.height = "10px";
			dom_.style.left = "0px";
			dom_.style.top = "0px";
			dom_.innerHTML = "<div class='move_div'></div>";
			move_div_ = dom_.firstChild;
			move_div_.style.display = "none";
			scroll_dom_.appendChild(dom_);

			move_div_.style.width = document.documentElement.clientWidth + "px";
			move_div_.style.height = document.documentElement.clientHeight + "px";

			scroll_dom_.style.left = document.documentElement.scrollLeft + "px";
			scroll_dom_.style.top = document.documentElement.scrollTop + "px";

			Lesktop.Utility.AttachEvent(
				window, "resize",
				function()
				{
					Resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
				}
			);

			Lesktop.Utility.AttachEvent(
				window, "scroll",
				function()
				{
					scroll_dom_.style.left = document.documentElement.scrollLeft + "px";
					scroll_dom_.style.top = document.documentElement.scrollTop + "px";
				}
			);

			var enableSelTag = {
				"TEXTAREA": "",
				"INPUT": ""
			};

			dom_.onselectstart = function(evt)
			{
				var e = new Lesktop.Event(evt, window);

				if (e.GetTarget().tagName != undefined && enableSelTag[e.GetTarget().tagName.toUpperCase()] != undefined)
				{
					return true;
				}
				else
				{
					return false;
				}
			}

			document.oncontextmenu = function(evt)
			{
				return move_div_.style.display == "none";
			}

			Lesktop.Utility.AttachEvent(document.body, "mousemove", body_onmousemove);
			Lesktop.Utility.AttachEvent(document.body, "mouseup", body_onmouseup);

			Lesktop.Utility.AttachEvent(
				document.body, "mousedown",
				function()
				{
					if (popup_dom_ != null)
					{
						dom_.removeChild(popup_dom_);
						move_div_.style.display = "none";
						popup_dom_.style.display = "none";
						popup_dom_ = null;
					}
				}
			);

			Lesktop.Taskbar.Create();
			Resize(document.documentElement.clientWidth, document.documentElement.clientHeight);
		}
	}

	var popup_dom_ = null;

	obj.Popup = function(dom, x, y)
	{
		if (popup_dom_ != null)
		{
			dom_.removeChild(popup_dom_);
			move_div_.style.display = "none";
			popup_dom_.style.display = "none";
			popup_dom_ = null;
		}
		popup_dom_ = dom;
		move_div_.style.display = "block";
		move_div_.style.cursor = "default";
		popup_dom_.style.display = "block";
		dom_.appendChild(popup_dom_);
	}

	obj.Unpopup = function(dom)
	{
		if (popup_dom_ != null && popup_dom_ == dom)
		{
			dom_.removeChild(popup_dom_);
			move_div_.style.display = "none";
			popup_dom_.style.display = "none";
			popup_dom_ = null;
		}
	}

	return obj;

})();

Lesktop.Taskbar = (function()
{
	var obj = {};

	var dom_ = null;
	var task_container_ = null;
	var task_btn_ = null;

	obj.Resize = function()
	{
		dom_.style.width = (Lesktop.Desktop.GetWidth() - 32) + "px";
		dom_.style.height = "28px";
		var width = Math.round((Lesktop.Desktop.GetWidth() - 380) / 156 - 0.5) * 156 + 4;
		if (width < 0) width = 0;
		task_container_.style.width = width + "px";

		task_btn_.style.display = task_container_.scrollHeight > 24 ? "block" : "none";
	}

	obj.Move = function()
	{
		dom_.style.left = "16px";
		dom_.style.top = (Lesktop.Desktop.GetHeight() - 28) + "px";
	}

	obj.Create = function()
	{
		dom_ = document.createElement("DIV");
		dom_.className = "taskbar";
		dom_.innerHTML = String.format(
			"<div class='icon'></div>" +
			"<div class='style=\"display:none;\"'></div><div class='task_container'></div><div class='udbtn'><div class='up_btn'></div><div class='down_btn'></div></div>" +
			"<div class='link_container'>[<a href='javascript:void(0);'>\u9000\u51FA</a>]</div>"
		);
		task_container_ = dom_.childNodes[2];
		task_btn_ = dom_.childNodes[3];

		Lesktop.Utility.AttachButtonEvent(task_btn_.childNodes[0], "up_btn", "up_btn_hover", "up_btn_press");
		Lesktop.Utility.AttachButtonEvent(task_btn_.childNodes[1], "down_btn", "down_btn_hover", "down_btn_press");

		task_btn_.childNodes[0].onmousedown = function()
		{
			var scrollTop = task_container_.scrollTop;
			if (scrollTop % 24 == 0) task_container_.scrollTop = (Math.round(scrollTop / 24) - 1) * 24;
			else task_container_.scrollTop = Math.round(scrollTop / 24 - 0.5) * 24;
		}

		task_btn_.childNodes[1].onmousedown = function()
		{
			var scrollTop = task_container_.scrollTop;
			if (scrollTop % 24 == 0) task_container_.scrollTop = (Math.round(scrollTop / 24) + 1) * 24;
			else task_container_.scrollTop = (Math.round(scrollTop / 24 - 0.5) + 1) * 24;
		}

		obj.Resize();
		obj.Move();
		obj.Hide();
		Lesktop.Desktop.GetDom().appendChild(dom_);
	}

	obj.Show = function()
	{
		dom_.style.display = "block";

		obj.Resize();
	}

	obj.Hide = function()
	{
		dom_.style.display = "none";
	}

	function TaskbarItem(win)
	{
		var This = this;

		var title = win.GetTitle();

		var dom = document.createElement("DIV");

		dom.innerHTML = title;

		dom.className = "task";

		dom.onclick = function()
		{
			if (win.IsVisible())
			{
				if (win.IsTop()) win.Hide();
				else win.BringToTop();
			}
			else
			{
				win.Show();
			}
		}

		Lesktop.Utility.AttachButtonEvent(dom, "task", "task_hover", "task_press");

		this.Shine = function(highlight)
		{
			if (highlight == undefined) highlight = false;
			var count = 6;
			var interval = setInterval(
				function()
				{
					if (count > 0)
					{
						switch (count)
						{
							case 1:
							case 3:
							case 5:
								dom.className = "task";
								break;
							case 2:
							case 4:
							case 6:
								dom.className = "task_highlight";
								break;
						}
						count--;
					}
					else
					{
						dom.className = (highlight ? "task_highlight" : "task");
						clearInterval(interval);
					}
				},
				200
			);
		}

		this.GetDom = function()
		{
			return dom;
		}

		this.GetWindow = function()
		{
			return win;
		}

		this.SetText = function(text)
		{
			dom.innerHTML = text;
		}
	}

	var tasks_ = [];

	obj.AddTask = function(win)
	{
		var task = new TaskbarItem(win);

		tasks_.push(task);

		task_container_.appendChild(task.GetDom());

		obj.Resize();

		return task;
	}

	obj.RemoveTask = function(win)
	{
		var i = 0;
		for (; i < tasks_.length && tasks_[i].GetWindow() != win; i++);
		if (i < tasks_.length)
		{
			task_container_.removeChild(tasks_[i].GetDom());
			tasks_.splice(i, 1);
			obj.Resize();
		}
	}

	return obj;

})();