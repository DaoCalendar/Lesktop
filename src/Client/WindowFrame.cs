using System;
using System.Drawing;
using System.Windows.Forms;

namespace Client
{
	[System.Runtime.InteropServices.ComVisibleAttribute(true)]
	public class WindowFrame : Form
	{
		String guid = Guid.NewGuid().ToString();

		WebBrowser browser_;
		string suspend_load_url_ = null, url_;
		object window_;
		object client_call_ = null;

		protected override CreateParams CreateParams
		{
			get
			{
				CreateParams cp = base.CreateParams;
				unchecked
				{
					cp.Style |= (int)(0x00080000 | 0x00010000 | 0x00020000);
				}
				return cp;
			}
		}

		public WindowFrame()
		{
			StartPosition = FormStartPosition.Manual;
			FormBorderStyle = FormBorderStyle.None;
			MaximumSize = new Size(SystemInformation.WorkingArea.Width, SystemInformation.WorkingArea.Height);

			Resize += new EventHandler(WindowFrame_Resize);
			browser_ = new WebBrowser();
			browser_.Left = 0;
			browser_.Top = 0;
			browser_.Width = Width;
			browser_.Height = Height;
			browser_.ScrollBarsEnabled = false;
			browser_.IsWebBrowserContextMenuEnabled = false;
			browser_.Anchor = AnchorStyles.Left | AnchorStyles.Top | AnchorStyles.Right | AnchorStyles.Bottom;
			browser_.Url = new Uri("about:blank");

			Controls.Add(browser_);
			browser_.ObjectForScripting = new ClientCall(browser_, this);
		}

		void WindowFrame_Resize(object sender, EventArgs e)
		{
			if (browser_.Document != null && browser_.Url != null && browser_.Url.ToString().ToLower() != "about:blank")
			{
				Utility.InvokeMethod(browser_.Document.Window.DomWindow, "OnWindowResize", Width, Height);
			}
		}

		protected int border_width_ = 6, title_height_ = 18;
		bool resizable_ = true, has_min_button_ = true, has_max_button_ = true;

		public Int32 TitleHeight
		{
			get { return title_height_; }
		}

		public Int32 BorderWidth
		{
			get { return border_width_; }
		}

		virtual public void Init(
			int left, int top, int width, int height,
			int borderWidth, int titleHeight,
			bool isResizable, bool hasMin, bool hasMax,
			int minWidth, int minHeight,
			string text
		)
		{
			Bounds = new Rectangle(left, top, width, height);

			border_width_ = borderWidth;
			title_height_ = titleHeight;
			resizable_ = isResizable;
			has_min_button_ = hasMin;
			has_max_button_ = hasMax;
			_minWidth = minWidth;
			_minHeight = minHeight;
			Text = text;

			this.MinimumSize = new Size(minWidth, minHeight);

			browser_.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(browser1_DocumentCompleted);
			browser_.Url = new Uri(String.Format("{0}/{1}/Client/WindowFrame.htm", Setting.Instance.ServiceUrl, Setting.Instance.ResPath));
		}

		private void browser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
		{
			if (browser_.Url == e.Url && browser_.Url.ToString().ToLower() != "about:blank")
			{
				window_ = Utility.InvokeMethod(
					browser_.Document.Window.DomWindow, "Create",
					Width, Height, border_width_, title_height_, resizable_, has_min_button_, has_max_button_, Text
				);
				if (suspend_load_url_ != null)
				{
					url_ = suspend_load_url_;
					Utility.InvokeMethod(window_, "Load", suspend_load_url_);
				}
			}
		}

		Int32 _minWidth = 200, _minHeight = 200;
		protected Int32 _borderWidth = 6, _titleHeight = 18;
		private bool _isResizable = true;

		int _preX, _preY, _preLeft, _preTop, _preWidth, _preHeight;
		int _pos;

		public void js_onmousedown(int pos)
		{
			_preX = Cursor.Position.X;
			_preY = Cursor.Position.Y;
			_preLeft = Left;
			_preTop = Top;
			_preWidth = Width;
			_preHeight = Height;
			_pos = pos;
			SetCursor();
			Capture = true;

		}

		protected override void OnMouseMove(MouseEventArgs e)
		{
			if (Capture)
			{
				int difX = Cursor.Position.X - _preX;
				int difY = Cursor.Position.Y - _preY;

				int newLeft = Left, newTop = Top, newWidth = Width, newHeight = Height;

				if (_pos == 4)
				{
					Location = new Point(_preLeft + difX, _preTop + difY);
				}
				else
				{
					if (_isResizable)
					{
						switch (_pos)
						{
						case 0:
							newLeft = _preLeft + difX;
							newTop = _preTop + difY;
							newWidth = _preWidth - difX;
							newHeight = _preHeight - difY;
							if (newWidth < _minWidth)
							{
								newLeft -= _minWidth - newWidth;
								newWidth = _minWidth;
							}
							if (newHeight < _minHeight)
							{
								newTop -= _minHeight - newHeight;
								newHeight = _minHeight;
							}
							break;
						case 1:
							newTop = _preTop + difY;
							newHeight = _preHeight - difY;
							if (newHeight < _minHeight)
							{
								newTop -= _minHeight - newHeight;
								newHeight = _minHeight;
							}
							break;
						case 2:
							newTop = _preTop + difY;
							newWidth = _preWidth + difX;
							newHeight = _preHeight - difY;
							if (newWidth < _minWidth)
							{
								newWidth = _minWidth;
							}
							if (newHeight < _minHeight)
							{
								newTop -= _minHeight - newHeight;
								newHeight = _minHeight;
							}
							break;
						case 3:
							newLeft = _preLeft + difX;
							newWidth = _preWidth - difX;
							if (newWidth < _minWidth)
							{
								newLeft -= _minWidth - newWidth;
								newWidth = _minWidth;
							}
							break;
						case 5:
							newWidth = _preWidth + difX;
							if (newWidth < _minWidth)
							{
								newWidth = _minWidth;
							}
							break;
						case 6:
							newLeft = _preLeft + difX;
							newWidth = _preWidth - difX;
							newHeight = _preHeight + difY;
							if (newWidth < _minWidth)
							{
								newLeft -= _minWidth - newWidth;
								newWidth = _minWidth;
							}
							if (newHeight < _minHeight)
							{
								newHeight = _minHeight;
							}
							break;
						case 7:
							newHeight = _preHeight + difY;
							if (newHeight < _minHeight)
							{
								newHeight = _minHeight;
							}
							break;
						case 8:
							newWidth = _preWidth + difX;
							newHeight = _preHeight + difY;
							if (newWidth < _minWidth)
							{
								newWidth = _minWidth;
							}
							if (newHeight < _minHeight)
							{
								newHeight = _minHeight;
							}
							break;
						}

						Bounds = new Rectangle(newLeft, newTop, newWidth, newHeight);
						Refresh();
					}
				}
			}
		}

		private void SetCursor()
		{
			if (_pos == 4)
			{
				Cursor = Cursors.SizeAll;
			}
			else
			{
				if (_isResizable)
				{
					switch (_pos)
					{
					case 0:
						Cursor = Cursors.SizeNWSE;
						break;
					case 1:
						Cursor = Cursors.SizeNS;
						break;
					case 2:
						Cursor = Cursors.SizeNESW;
						break;
					case 3:
						Cursor = Cursors.SizeWE;
						break;
					case 5:
						Cursor = Cursors.SizeWE;
						break;
					case 6:
						Cursor = Cursors.SizeNESW;
						break;
					case 7:
						Cursor = Cursors.SizeNS;
						break;
					case 8:
						Cursor = Cursors.SizeNWSE;
						break;
					default:
						Cursor = Cursors.Default;
						break;
					}
				}
				else
				{
					Cursor = Cursors.Default;
				}
			}
		}

		public ClientCoord GetClientCoord(int x, int y)
		{
			object mp = Utility.InvokeMethod(window_, "MapCoord", x, y);
			Point p = new Point(Convert.ToInt32(Utility.GetProperty(mp, "X")), Convert.ToInt32((Utility.GetProperty(mp, "Y"))));
			p = browser_.PointToScreen(p);
			return new ClientCoord(p.X, p.Y);
		}

		protected override void OnMouseUp(MouseEventArgs e)
		{
			Capture = false;
		}

		protected virtual void OnClose()
		{
		}

		protected virtual void OnWindowLoad(object window)
		{
		}

		protected void LoadWindow(string url)
		{
			if (window_ != null) { url_ = url; Utility.InvokeMethod(window_, "Load", url); }
			else suspend_load_url_ = url;
		}

		[System.Runtime.InteropServices.DllImport("user32.dll")]
		static extern Int32 ShowWindow(IntPtr handle, Int32 nCmdWindow);

		public void js_close()
		{
			OnClose();
		}

		public void js_minimum()
		{
			ShowWindow(Handle, 7);
			WindowState = FormWindowState.Minimized;
		}

		public void js_maximum()
		{
			ShowWindow(Handle, 3);
			WindowState = FormWindowState.Maximized;
			Refresh();
		}

		public void js_restore()
		{
			ShowWindow(Handle, 1);
			WindowState = FormWindowState.Normal;
			Refresh();
		}

		public void js_onload(object window)
		{
			OnWindowLoad(window);
		}

		public object ClientCall
		{
			get { return client_call_; }
		}

		protected WebBrowser Browser
		{
			get { return browser_; }
		}

		protected String Url
		{
			get { return url_; }
		}

		protected object WindowFrameDom
		{
			get { return window_; }
		}

	}
}
