
if(window.external != undefined && window.external.Lesktop != undefined)
{
	document.write(('<link href="{RESPATH}/Themes/Default/skin.css" rel="stylesheet" type="text/css" />').replace(/{RESPATH}/ig, window.external.ResAbsolutePath));
	
	document.write(('<script src="{RESPATH}/Core/Config.js" type="text/javascript"><' + '/script>').replace(/{RESPATH}/ig, window.external.ResAbsolutePath));
	document.write(('<script src="{RESPATH}/Core/Common.js" type="text/javascript"><' + '/script>').replace(/{RESPATH}/ig, window.external.ResAbsolutePath));
	document.write(('<script src="{RESPATH}/Core/Extent.js" type="text/javascript"><' + '/script>').replace(/{RESPATH}/ig, window.external.ResAbsolutePath));
	document.write(('<script src="{RESPATH}/Core/UI.js" type="text/javascript"><' + '/script>').replace(/{RESPATH}/ig, window.external.ResAbsolutePath));
	document.write(('<script src="{RESPATH}/Core/Sub.js" type="text/javascript"><' + '/script>').replace(/{RESPATH}/ig, window.external.ResAbsolutePath));
}
else
{
	document.write('<script src="WinScript.ashx" type="text/javascript"><' + '/script>');
}