<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SampleWindow.aspx.cs" Inherits="Lesktop_SampleWindow" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title></title>

	<script src="Core/WinScript.js" type="text/javascript"></script>

	<script language="javascript" type="text/javascript">
		function init()
		{
			Lesktop.InitUI(OnInitUI);
		}

		function OnInitUI()
		{
			Lesktop.LoadModules(
				function()
				{
					var Controls = Lesktop.GetModule("Controls.js");
					var SampleModule = Lesktop.GetModule("SampleModule.js");
					var config = {
						Left: 0, Top: 0, Width: Lesktop.UI.PagePanel.GetClientWidth(), Height: Lesktop.UI.PagePanel.GetClientHeight(),
						Parent: Lesktop.UI.PagePanel,
						AnchorStyle: Controls.AnchorStyle.All
					};
					new SampleModule.SampleCtrl(config);
				},
				function(ex)
				{
					Lesktop.Utility.ShowError(ex.toString())
				},
				["SampleModule.js"]
			);
		}
	</script>

</head>
<body>
	<form id="form1" runat="server">
	<div>
	</div>
	</form>
</body>
</html>
