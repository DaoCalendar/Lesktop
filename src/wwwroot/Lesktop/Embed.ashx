<%@ WebHandler Language="C#" Class="Embed" %>

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using System.Web.Configuration;
using Lesktop;

public class Embed : IHttpHandler
{

	static string EmbedJsFormat =
	"document.write('<link href=\"{2}/Themes/Default/Desktop/Desktop.css\" rel=\"stylesheet\" type=\"text/css\" />');\r\n" +
	"document.write('<script src=\"{2}/Core/Config.ashx\" type=\"text/javascript\"><'+'/script>');\r\n" +
	"document.write('<script src=\"{2}/Core/Common.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
	"document.write('<script src=\"{2}/Core/Extent.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
	"document.write('<script src=\"{2}/Core/Main.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
	"document.write('<script src=\"{2}/Core/Desktop/Desktop.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
	"document.write('<script src=\"{2}/Core/Desktop/Menu.js\" type=\"text/javascript\"><'+'/script>');\r\n" +
	"document.write('<script src=\"{2}/Core/Desktop/Window.js\" type=\"text/javascript\"><'+'/script>');\r\n";

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