using System;
using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Management;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace Client
{
	static class Global
	{
		public static Window Desktop = null;
	}

	static class Program
	{
		/// <summary>
		/// 应用程序的主入口点。
		/// </summary>
		[STAThread]
		static void Main()
		{
			Setting.Instance.Load();

			AppDomain.CurrentDomain.UnhandledException += new UnhandledExceptionEventHandler(CurrentDomain_UnhandledException);
			Application.ThreadException += new ThreadExceptionEventHandler(Application_ThreadException);
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);

			Global.Desktop = new Window();
			Global.Desktop.Init(0, 0, 600 + 6 * 2, 400 + 6 * 2 + 18, 6, 18, false, true, false, 600 + 6 * 2, 400 + 6 * 2 + 18, "");
			Global.Desktop.IWindow.Load("Client/Desktop.htm", null);

			Application.Run();
		}

		static void WriteCrash(string content)
		{
			try
			{
				if (!Directory.Exists(AppDomain.CurrentDomain.BaseDirectory + "crash"))
				{
					Directory.CreateDirectory(AppDomain.CurrentDomain.BaseDirectory + "crash");
				}
				File.WriteAllText(
					String.Format("{0}crash/{1:yyyyMMddHHmmss}.txt", AppDomain.CurrentDomain.BaseDirectory, DateTime.Now),
					content
				);
			}
			catch
			{
			}
		}

		static void Application_ThreadException(object sender, ThreadExceptionEventArgs e)
		{
			try
			{
				String log = String.Format(
					"{0}:\r\n   {2}\r\n\r\nStackTrace:\r\n{1}\r\n\r\nModules:\r\n{3}\r\nProcesses:\r\n{4}\r\n系统信息:\r\n{5}",
					e.Exception.GetType().Name,
					e.Exception.StackTrace,
					e.Exception.Message,
					GetModules(),
					GetProcesses(),
					GetSystemInfo()
				);
				WriteCrash(log);
			}
			catch
			{
			}
		}

		static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
		{
			try
			{
				Exception ex = e.ExceptionObject as Exception;
				if (ex != null)
				{
					String log = String.Format(
						"{0}:\r\n   {2}\r\n\r\nStackTrace:\r\n{1}\r\n\r\nModules:\r\n{3}\r\nProcesses:\r\n{4}\r\n系统信息:\r\n{5}",
						ex.GetType().Name,
						ex.StackTrace,
						ex.Message,
						GetModules(),
						GetProcesses(),
						GetSystemInfo()
					);
					WriteCrash(log);
				}
				else
				{
					String log = String.Format(
						"UnhandledException: {0}\r\nModules:\r\n{1}\r\nProcesses:\r\n{2}\r\n系统信息:\r\n{3}",
						e.ExceptionObject.GetType().FullName,
						GetModules(),
						GetProcesses(),
						GetSystemInfo()
					);
					WriteCrash(log);
				}
			}
			catch
			{
			}
		}

		private static String GetProcesses()
		{
			try
			{
				StringBuilder processesStr = new StringBuilder();
				Process[] processes = Process.GetProcesses();
				foreach (Process process in processes)
				{
					try
					{
						processesStr.AppendFormat("   {0}\r\n", process.MainModule.FileName);
					}
					catch
					{
					}
				}
				return processesStr.ToString();
			}
			catch
			{
				return String.Empty;
			}
		}

		private static String GetModules()
		{
			try
			{
				StringBuilder modules = new StringBuilder();
				Process cur = Process.GetCurrentProcess();
				for (int i = 0; i < cur.Modules.Count; i++)
				{
					try
					{
						ProcessModule m = cur.Modules[i];
						modules.AppendFormat("   {0}\r\n", m.FileName);
					}
					catch
					{
					}
				}
				return modules.ToString();
			}
			catch
			{
				return String.Empty;
			}
		}

		private static String GetSystemInfo()
		{
			try
			{
				Hashtable hash_info = new Hashtable();
				StringBuilder infos = new StringBuilder();

				ManagementClass mClass = new ManagementClass("Win32_OperatingSystem");
				ManagementObjectCollection moCollection = mClass.GetInstances();
				if (moCollection.Count > 0)
				{
					foreach (ManagementObject mObject in moCollection)
					{
						if (infos.Length == 0)
						{
							infos.AppendFormat("    操作系统名称：{0}\r\n", mObject["Caption"]);
							infos.AppendFormat("    操作系统版本：{0}\r\n", Environment.OSVersion);
							infos.AppendFormat("    总的物理内存：{0:#0.00}M\r\n", Convert.ToDouble(mObject["TotalVisibleMemorySize"]) / 1024);
							infos.AppendFormat("    可用物理内存：{0:#0.00}M\r\n", Convert.ToDouble(mObject["FreePhysicalMemory"]) / 1024);
							infos.AppendFormat("    总的虚拟内存：{0:#0.00}M\r\n", Convert.ToDouble(mObject["TotalVirtualMemorySize"]) / 1024);
							infos.AppendFormat("    可用虚拟内存：{0:#0.00}M\r\n", Convert.ToDouble(mObject["FreeVirtualMemory"]) / 1024);
							infos.AppendFormat("    页面文件大小：{0:#0.00}M\r\n", Convert.ToDouble(mObject["SizeStoredInPagingFiles"]) / 1024);
							infos.AppendFormat("    系统目录：    {0}\r\n", mObject["SystemDirectory"]);
							infos.AppendFormat("    Windows目录： {0}\r\n", mObject["WindowsDirectory"]);
						}
					}
				}
				return infos.ToString();
			}
			catch
			{
				return String.Empty;
			}
		}
	}
}
