//该脚本由客户端使用，Web版请引用Config.ashx
if(window.Lesktop == undefined) window.Lesktop = {};
var ClientMode = (window.external != undefined && window.external.Version != undefined);

Lesktop.Config = {
	ServiceUrl: window.external.ServiceUrl,
	ResPath: window.external.ResPath,
	ResAbsolutePath: window.external.ResAbsolutePath,
	Version: window.external.Version	
};