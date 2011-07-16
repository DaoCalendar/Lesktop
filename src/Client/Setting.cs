using System;
using System.Xml;

namespace Client
{
	public class Setting
	{
		static Setting m_Instance = new Setting();

		public static Setting Instance { get { return m_Instance; } }

		string path_ = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location) + "\\Setting.conf";
		string service_url_ = "", res_path_ = "";

		public String ServiceUrl { get { return service_url_; } }
		public String ResPath { get { return res_path_; } }
		
		private Setting()
		{
		}

		public void Load()
		{
			try
			{
				XmlDocument doc = new XmlDocument();
				doc.Load(path_);

				service_url_ = (doc.DocumentElement.GetElementsByTagName("ServiceUrl")[0] as XmlElement).InnerText;
				res_path_ = (doc.DocumentElement.GetElementsByTagName("ResPath")[0] as XmlElement).InnerText;
			}
			catch
			{
				throw new Exception("读取配置文件失败!");
			}
		}
	}
}
