using System;

namespace Custom
{
	public class ApplicationInfo
	{
		static ApplicationInfo m_Instance = new ApplicationInfo();

		public static ApplicationInfo Instance
		{
			get { return m_Instance; }
		}

		private ApplicationInfo()
		{
		}

		public const String AssemblyTitle = "云骞即时通讯软件";

		public const String AssemblyCompany = "云骞";

		public const String AssemblyProduct = "云骞即时通讯软件";

		public const String AssemblyCopyright = "Copyright © 云骞 2011";

		public const String ReleaseVersion = "1.0.0.0";
	}
}
