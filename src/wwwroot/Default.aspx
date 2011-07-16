<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    
    <script src="Lesktop/Embed.ashx" language="javascript" type="text/javascript"></script>
    <script language="javascript" type="text/javascript">
    window.onload = function()
    {
		Initialize();
    }
    
    function init()
    {
		var sample_window = Lesktop.CreateWindow(
			{
				Left: 200, Top: 150, Width: 600, Height: 450,
				Title: { InnerHTML: "测试" },
				HasMinButton: false,
				OnClose: function(form)
				{
					form.Hide();
				}
			}
		);
		sample_window.MoveEx("CENTER", -16, -32, true);
		sample_window.Show();
		sample_window.Load(Lesktop.GetPageUrl("SampleWindow.aspx"));
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
