using System;
using System.Web;

namespace Lesktop.Web
{
	public class WinScript : IHttpHandler
	{
		static string EmbedJsFormat =
		"document.write('<link href=\"{2}/Themes/Default/skin.css\" rel=\"stylesheet\" type=\"text/css\" />');\r\n" +
		"document.write('<script src=\"{2}/Core/Config.ashx\" type=\"text/javascript\"><'+'/script>');\r\n" +
		"document.write('<script src=\"{2}/Core/Common.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
		"document.write('<script src=\"{2}/Core/Extent.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
		"document.write('<script src=\"{2}/Core/UI.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
		"document.write('<script src=\"{2}/Core/Sub.js\" type=\"text/javascript\"><'+'/script>');\r\n";

		public void ProcessRequest(HttpContext context)
		{
			string js = String.Format(
				EmbedJsFormat,
				ServerImpl.Instance.ServiceUrl,
				ServerImpl.Instance.ResPath,
				ServerImpl.Instance.ServiceUrl + "/" + ServerImpl.Instance.ResPath,
				ServerImpl.Instance.Version
			);

			context.Response.ContentType = "application/x-javascript";
			context.Response.Write(js);
		}

		public bool IsReusable
		{
			get { return false; }
		}

	}
}
