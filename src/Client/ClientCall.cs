using System;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

namespace Client
{
	[System.Runtime.InteropServices.ComVisibleAttribute(true)]
	public class ClientCall
	{
		Form window_frame_ = null;
		WebBrowser browser_ = null;

		public ClientCall(WebBrowser b, Form windor_frame)
		{
			browser_ = b;
			window_frame_ = windor_frame;
		}

		public object WindowFrameCtrl
		{
			get { return window_frame_; }
		}

		public object CreateWindow(object config)
		{
			Window win = null;
			win = new Window();
			win.Init(config);
			return win.IWindow;
		}

		public void ShowError(string message)
		{
			MessageBox.Show(browser_, message, "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
		}

		public void ShowWarning(string message)
		{
			MessageBox.Show(browser_, message, "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
		}

		public String Version
		{
			get { return Assembly.GetExecutingAssembly().GetName().Version.ToString(); }
		}

		public Window.IWindowImpl OutputPanel
		{
			get { return null; }
		}

		public object DesktopHtmlWindow
		{
			get { return Global.Desktop.IWindow.GetHtmlWindow(); }
		}

		public String ServiceUrl
		{
			get { return Setting.Instance.ServiceUrl; }
		}

		public String ResPath
		{
			get { return Setting.Instance.ResPath; }
		}

		public String ResAbsolutePath
		{
			get { return Setting.Instance.ServiceUrl.EndsWith("/") ? Setting.Instance.ServiceUrl + Setting.Instance.ResPath : Setting.Instance.ServiceUrl + "/" + Setting.Instance.ResPath; }
		}

		public bool Lesktop
		{
			get { return true; }
		}

		public void ExitApplication()
		{
			Application.Exit();
		}

		public String GradScreen()
		{
			int width = Screen.PrimaryScreen.Bounds.Width;
			int height = Screen.PrimaryScreen.Bounds.Height;
			Bitmap bmp = new Bitmap(width, height);
			using (Graphics g = Graphics.FromImage(bmp))
			{
				g.CopyFromScreen(0, 0, 0, 0, new Size(width, height));
			}
			GradScreenForm screen = new GradScreenForm(bmp);
			if (screen.ShowDialog() == DialogResult.OK)
			{
				string tempFile = String.Format(@"{0}\{1}.jpg", Path.GetTempPath(), Guid.NewGuid().ToString().Replace("-", ""));
				screen.ResultBitmap.Save(tempFile, System.Drawing.Imaging.ImageFormat.Jpeg);
				return tempFile;
			}
			else
			{
				return String.Empty;
			}
		}

		public object CreateMenu(object config)
		{
			return new Menu(browser_, config);
		}
	}
}