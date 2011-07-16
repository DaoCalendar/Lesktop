
var Control = null;
var AnchorStyle = null;
var Controls = null;

var Config = {};

function init(completeCallback, errorCallback)
{
	Lesktop.LoadModules(
		function()
		{
			Controls = Lesktop.GetModule("Controls.js");

			Control = Lesktop.GetModule("Controls.js").Control;
			AnchorStyle = Lesktop.GetModule("Controls.js").AnchorStyle;

			DocumentPanel = new DocumentPanelCtor();
			Module.Desktop = new DesktopCtor();

			completeCallback();
		},
		errorCallback,
		["Controls.js"]
	);
}

function dispose(competeCallback, errorCallback)
{
	try
	{
		competeCallback();
	}
	catch (ex)
	{
		errorCallback(ex);
	}
}

function DocumentPanelCtor()
{
	var This = this;
	var config = {
		Parent: null,
		Left: 0,
		Top: 0,
		Width: Math.max(document.documentElement.clientWidth, window.CurrentWindow == undefined ? 0 : CurrentWindow.GetClientWidth()),
		Height: Math.max(document.documentElement.clientHeight, window.CurrentWindow == undefined ? 0 : CurrentWindow.GetClientHeight()),
		Css: ""
	}

	Control.call(This, config);

	var Base = {
		GetType: This.GetType,
		is: This.is
	}

	This.is = function(type) { return type == this.GetType() ? true : Base.is(type); }
	This.GetType = function() { return "DocumentPanel"; }

	This.GetDom().style.overflow = "hidden";

	if (window.CurrentWindow != undefined)
	{
		window.CurrentWindow.OnResize.Attach(
			function()
			{
				var minWidth = CurrentWindow.GetMinClientWidth();
				var minHeight = CurrentWindow.GetMinClientHeight();
				var width = (CurrentWindow.GetClientWidth() > minWidth) ? CurrentWindow.GetClientWidth() : minWidth;
				var height = (CurrentWindow.GetClientHeight() > minHeight) ? CurrentWindow.GetClientHeight() : minHeight;
				This.Resize(width, height);
			}
		);
	}
	else
	{
		window.onresize = function()
		{
			var minWidth = 200;
			var minHeight = 200;
			var width = (document.documentElement.clientWidth > minWidth) ? document.documentElement.clientWidth : minWidth;
			var height = (document.documentElement.clientHeight > minHeight) ? document.documentElement.clientHeight : minHeight;
			This.Resize(width, height);
		};
	}

	if (document.getElementById("__lesktop_container") == undefined)
	{
		document.body.appendChild(This.GetDom());
	}
	else
	{
		document.getElementById("__lesktop_container").appendChild(This.GetDom());
	}
}

function DesktopCtor()
{
	var This = this;

	var config = {
		Parent: DocumentPanel,
		Left: 0,
		Top: 0,
		Width: DocumentPanel.GetWidth(),
		Height: DocumentPanel.GetHeight(),
		Css: "desktop",
		AnchorStyle: AnchorStyle.All
	}
	Control.call(This, config);
	var Base = {
		GetType: This.GetType,
		is: This.is
	}
	This.is = function(type) { return type == this.GetType() ? true : Base.is(type); }
	This.GetType = function() { return "Desktop"; }

	var m_MoveDiv = document.createElement("DIV");
	m_MoveDiv.style.position = "absolute";
	m_MoveDiv.style.display = 'none';
	m_MoveDiv.style.zIndex = '100000';
	m_MoveDiv.style.left = '0px';
	m_MoveDiv.style.top = '0px';
	m_MoveDiv.className = 'moveBackground';
	m_MoveDiv.setAttribute("unselectable", "on");

	This.GetDom().appendChild(m_MoveDiv);

	This.GetDom().style.overflow = "hidden";

	This.GetDom().onscroll = function()
	{
		var dom = This.GetDom();
		if (dom.scrollLeft > 0 || dom.scrollTop > 0)
		{
			dom.scrollLeft = 0;
			dom.scrollTop = 0;
		}
	}

	var m_Items = {};

	This.EnterMove = function(cursor)
	{
		m_MoveDiv.style.width = This.GetWidth() + 'px';
		m_MoveDiv.style.height = This.GetHeight() + 'px';
		m_MoveDiv.style.display = 'block';
		Lesktop.Utility.DisableSelect(m_MoveDiv, true);
		m_MoveDiv.style.cursor = (cursor == undefined ? "default" : cursor);
	}

	This.LeaveMove = function()
	{
		m_MoveDiv.style.display = 'none';
	}

	This.AddWindow = function(wnd)
	{
		This.AddControl(wnd);
	}

	This.RemoveWindow = function(wnd)
	{
		This.RemoveControl(wnd);
	}
}

function TaskbarItem(dialog, title)
{
	var This = this;

	this.title = function(newTitle)
	{
	}

	this.SetText = function(text)
	{
	}

	this.Shine = function(highlight)
	{
	}
}

function TaskbarCtor()
{
	var This = this;

	var items = {};

	this.AddTask = function(dialog, title)
	{
		var item = new TaskbarItem();
		items[Lesktop.GenerateUniqueId()] = item;
		return item;
	}

	this.RemoveTask = function(item)
	{
		for (var k in items)
		{
			if (items[k] == item)
			{
				delete items[k];
				break;
			}
		}
	}
}

var MoveVar = null;

function body_onmousemove(evt)
{
	if (MoveVar != null)
	{
		if (evt == undefined) evt = event;
		MoveVar.Object.scrollLeft = MoveVar.PreScrollLeft - (evt.clientX - MoveVar.PreClientX);
	}
}

function body_onmouseup(evt)
{
	MoveVar = null;
}

if (document.attachEvent)
{
	document.attachEvent(
		"onmousemove",
		function(evt)
		{
			if (evt == null) evt = window.event;
			body_onmousemove(evt);
		}
	);
	document.attachEvent(
		"onmouseup",
		function(evt)
		{
			if (evt == null) evt = window.event;
			body_onmouseup(evt);
		}
	);
}
else if (document.addEventListener)
{
	document.addEventListener(
		"mousemove",
		function(evt)
		{
			if (evt == null) evt = window.event;
			return body_onmousemove(evt);
		},
		false
	)
	document.addEventListener(
		"mouseup",
		function(evt)
		{
			if (evt == null) evt = window.event;
			return body_onmouseup(evt);
		},
		false
	)
}