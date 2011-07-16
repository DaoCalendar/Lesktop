

using System;
using System.Web;
using System.Web.Configuration;
using System.Configuration;
using Lesktop;

namespace Lesktop.Web
{
	public class Config : IHttpHandler
	{
		public void ProcessRequest(HttpContext context)
		{
			String config_js = String.Format(
				@"
				if(window.Lesktop == undefined) window.Lesktop = {{}};
				var ClientMode = (window.external != undefined && window.external.Version != undefined);
				Lesktop.Config = {{
					ServiceUrl: '{0}',
					ResPath: '{1}',
					Version: '{2}',
					ResAbsolutePath: '{3}'		
				}};",
				ServerImpl.Instance.ServiceUrl,
				ServerImpl.Instance.ResPath,
				ServerImpl.Instance.Version,
				ServerImpl.Instance.ServiceUrl.EndsWith("/") ? ServerImpl.Instance.ServiceUrl + ServerImpl.Instance.ResPath : ServerImpl.Instance.ServiceUrl + "/" + ServerImpl.Instance.ResPath
			);

			context.Response.ContentType = "application/x-javascript";
			context.Response.Write(config_js);
		}

		public bool IsReusable
		{
			get { return false; }
		}
	}
}