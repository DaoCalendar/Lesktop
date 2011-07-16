
Lesktop.UI = {PagePanel: null};

(function(){

function InitUI(callback)
{
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

	document.oncontextmenu = function() { return false; }

	Lesktop.LoadModules(
		function()
		{
			Lesktop.UI.PagePanel = Lesktop.GetModule("PagePanel.js").Desktop;		
			if (callback != undefined) callback();
		},
		alert,
		["Controls.js", "PagePanel.js"]
	);
}

Lesktop.InitUI = InitUI;

})();