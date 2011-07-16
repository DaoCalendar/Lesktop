<%@ WebHandler Language="C#" Class="Lesktop.UIDesigner" %>

using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Xml;

namespace Lesktop
{
    /// <summary>
    ///Lesktop 的摘要说明
    /// </summary>
    public class UIDesigner : IHttpHandler
    {
        public UIDesigner()
        {
        }

        static String GetParam(XmlElement elem, String name)
        {
            if (elem.HasAttribute(name))
            {
                return elem.GetAttribute(name);
            }
            else
            {
                XmlNodeList ns = elem.GetElementsByTagName(name);
                return ns.Count > 0 ? ns[0].InnerText : String.Empty;
            }
        }

        static void WriteFile(string file, string content)
        {
            using (Stream stream = File.Open(file, FileMode.Create, FileAccess.Write))
            {
                try
                {
                    Byte[] temp = Encoding.UTF8.GetBytes(content);
                    stream.Write(temp, 0, temp.Length);
                }
                finally
                {
                    stream.Close();
                }
            }
        }

        static void AppendFile(string file, params string[] contents)
        {
            using (Stream stream = File.Open(file, FileMode.Append, FileAccess.Write))
            {
                try
                {
                    foreach (string content in contents)
                    {
                        Byte[] temp = Encoding.UTF8.GetBytes(content);
                        stream.Write(temp, 0, temp.Length);
                    }
                }
                finally
                {
                    stream.Close();
                }
            }
        }

        static void ReduceBkFile(string file)
        {
            string[] content = File.ReadAllLines(file);
            StringBuilder builder = new StringBuilder();
            if (content.Length > 50)
            {
                for (int s = content.Length - 50; s < content.Length; s++)
                {
                    if (builder.Length > 0) builder.Append("\r\n");
                    builder.Append(content[s]);
                }
                File.WriteAllText(file, builder.ToString(), Encoding.UTF8);
            }
        }

        static String ReadFile(string file)
        {
            using (Stream stream = File.OpenRead(file))
            {
                try
                {
                    Byte[] temp = new Byte[stream.Length];
                    stream.Read(temp, 0, temp.Length);
                    return Encoding.UTF8.GetString(temp);
                }
                finally
                {
                    stream.Close();
                }
            }
        }

        static void CreateParentDirectory(string path)
        {
            if (!Directory.Exists(Path.GetDirectoryName(path))) Directory.CreateDirectory(Path.GetDirectoryName(path));
        }

        static DateTime BaseDateTime = new DateTime(1970, 1, 1, 0, 0, 0);

        public interface IRenderJson
        {
            void RenderJson(StringBuilder builder);
        }

        public class JsonText : IRenderJson
        {
            static JsonText m_EmptyObject = new JsonText("{}");

            static public JsonText EmptyObject
            {
                get { return m_EmptyObject; }
            }

            static JsonText m_EmptyArray = new JsonText("[]");

            static public JsonText EmptyArray
            {
                get { return m_EmptyArray; }
            }

            String m_Value;

            public JsonText(String value)
            {
                m_Value = value;
            }

            void IRenderJson.RenderJson(StringBuilder builder)
            {
                builder.Append(m_Value);
            }
        }

        public static void RenderJson(StringBuilder builder, object obj)
        {

            if (obj is IRenderJson)
            {
                (obj as IRenderJson).RenderJson(builder);
            }
            else if (obj is Exception)
            {
                builder.AppendFormat("{{\"__DataType\":\"Exception\",\"__Value\":{{\"Name\":\"{0}\",\"Message\":\"{1}\"}}}}", obj.GetType().Name, TransferCharJavascript((obj as Exception).Message));
            }
            else if (obj.GetType() == typeof(DateTime))
            {
                DateTime val = (DateTime)obj;
                RenderHashJson(
                    builder,
                    "__DataType", "Date",
                    "__Value", (val - BaseDateTime).TotalMilliseconds
                );
            }
            else if (obj is IDictionary)
            {
                int count = 0;
                builder.Append("{");
                foreach (DictionaryEntry ent in (obj as IDictionary))
                {
                    if (count > 0) builder.Append(",");
                    builder.AppendFormat("\"{0}\":", TransferCharJavascript(ent.Key.ToString()));
                    RenderJson(builder, ent.Value);
                    count++;
                }
                builder.Append("}");
            }
            else if (obj is IList)
            {
                IList list = obj as IList;
                builder.Append("[");
                for (int i = 0; i < list.Count; i++)
                {
                    if (i > 0) builder.Append(",");
                    RenderJson(builder, list[i]);

                }
                builder.Append("]");
            }
            else if (obj is ICollection)
            {
                ICollection list = obj as ICollection;
                builder.Append("[");
                int count = 0;
                foreach (object val in list)
                {
                    if (count > 0) builder.Append(",");
                    RenderJson(builder, val);
                    count++;
                }
                builder.Append("]");
            }
            else if (obj is UInt16 || obj is UInt32 || obj is UInt64 || obj is Int16 || obj is Int32 || obj is Int64 || obj is Double || obj is Decimal || obj is long)
            {
                builder.Append(obj.ToString());
            }
            else if (obj is System.Drawing.Rectangle)
            {
                System.Drawing.Rectangle rect = (System.Drawing.Rectangle)obj;

                RenderHashJson(
                    builder,
                    "Left", rect.Left,
                    "Top", rect.Top,
                    "Width", rect.Width,
                    "Height", rect.Height
                );
            }
            else if (obj is bool)
            {
                builder.Append((bool)obj ? "true" : "false");
            }
            else
            {
                builder.Append("\"");
                builder.Append(TransferCharJavascript(obj.ToString()));
                builder.Append("\"");
            }
        }

        public static String RenderHashJson(params object[] ps)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append("{");
            for (int i = 0; i < ps.Length; i += 2)
            {
                if (i > 0) builder.Append(",");
                builder.AppendFormat("\"{0}\":", ps[i].ToString());
                RenderJson(builder, ps[i + 1]);
            }
            builder.Append("}");
            return builder.ToString();
        }

        public static void RenderHashJson(StringBuilder builder, params object[] ps)
        {
            builder.Append("{");
            for (int i = 0; i < ps.Length; i += 2)
            {
                if (i > 0) builder.Append(",");
                builder.AppendFormat("\"{0}\":", ps[i].ToString());
                RenderJson(builder, ps[i + 1]);
            }
            builder.Append("}");
        }

        public static string TransferCharJavascript(string s)
        {
            StringBuilder ret = new StringBuilder();
            foreach (char c in s)
            {
                switch (c)
                {
                    case '\r':
                    case '\t':
                    case '\n':
                    case '\f':
                    case '\v':
                    case '\"':
                    case '\\':
                    case '\'':
                    case '<':
                    case '>':
                    case '\0':
                        ret.AppendFormat("\\u{0:X4}", (int)c);
                        break;
                    default:
                        ret.Append(c);
                        break;
                }
            }
            return ret.ToString();
        }

        bool IHttpHandler.IsReusable
        {
            get { return false; }
        }

        void IHttpHandler.ProcessRequest(HttpContext context)
        {
            string baseDirectory = context.Server.MapPath("~");
            while (baseDirectory.EndsWith("\\")) baseDirectory = baseDirectory.Substring(0, baseDirectory.Length - 1);

            Configuration config = WebConfigurationManager.OpenWebConfiguration(context.Request.ApplicationPath == "/" ? "/Lesktop" : context.Request.ApplicationPath + "/Lesktop");
            string res_path = config.AppSettings.Settings["ResPath"].Value;

            System.IO.Stream inputStream = context.Request.InputStream;
            Byte[] buffer = new Byte[inputStream.Length];
            inputStream.Read(buffer, 0, (int)inputStream.Length);
            string content = context.Request.ContentEncoding.GetString(buffer);

            XmlDocument doc = new XmlDocument();
            doc.LoadXml(content);

            StringBuilder builder = new StringBuilder();
            Exception error = null;

            try
            {
                switch (GetParam(doc.DocumentElement, "Command"))
                {
                    case "Create":
                        {
                            String path = GetParam(doc.DocumentElement, "Path");
                            String solution = String.Format(@"{0}\Solution\{1}.lesktop", baseDirectory, path);
                            String backup = String.Format(@"{0}\Solution\{1}.lesktop.bk", baseDirectory, path);
                            String code = String.Format(@"{0}\Lesktop\{2}\Module\{1}.js", baseDirectory, path, res_path);
                            String css = String.Format(@"{0}\Lesktop\{2}\Themes\Default\{1}.css", baseDirectory, path, res_path);

                            CreateParentDirectory(solution);
                            CreateParentDirectory(backup);
                            CreateParentDirectory(code);
                            CreateParentDirectory(css);

                            if (File.Exists(solution)) throw new Exception(String.Format(@"'Solution/{0}.lesktop' 已存在！", path));
                            if (File.Exists(backup)) throw new Exception(String.Format(@"'Solution/{0}.lesktop.bk' 已存在！", path));
                            if (File.Exists(code)) throw new Exception(String.Format(@"'UI/{0}.js' 已存在！", path));
                            if (File.Exists(css)) throw new Exception(String.Format(@"'Themes/Default/{0}.css' 已存在！", path));

                            try
                            {
                                WriteFile(solution, GetParam(doc.DocumentElement, "Solution"));
                            }
                            catch
                            {
                                File.Delete(solution);
                                throw;
                            }
                            WriteFile(backup, String.Empty);
                            WriteFile(code, String.Empty);
                            WriteFile(css, String.Empty);
                            //WriteFile(global, String.Empty);

                            break;
                        }
                    case "Open":
                        {
                            String path = GetParam(doc.DocumentElement, "Path");
                            String solution = String.Format(@"{0}\Solution\{1}.lesktop", baseDirectory, path);
                            String backup = String.Format(@"{0}\Solution\{1}.lesktop.bk", baseDirectory, path);
                            String code = String.Format(@"{0}\Lesktop\{2}\Module\{1}.js", baseDirectory, path, res_path);
                            String css = String.Format(@"{0}\Lesktop\{2}\Themes\Default\{1}.css", baseDirectory, path, res_path);

                            RenderHashJson(
                                builder,
                                "Solution", ReadFile(solution)
                            );

                            break;
                        }
                    case "Save":
                        {
                            String path = GetParam(doc.DocumentElement, "Path");
                            String solution = String.Format(@"{0}\Solution\{1}.lesktop", baseDirectory, path);
                            String backup = String.Format(@"{0}\Solution\{1}.lesktop.bk", baseDirectory, path);
                            String code = String.Format(@"{0}\Lesktop\{2}\Module\{1}.js", baseDirectory, path, res_path);
                            String css = String.Format(@"{0}\Lesktop\{2}\Themes\Default\{1}.css", baseDirectory, path, res_path);

                            CreateParentDirectory(solution);
                            CreateParentDirectory(backup);
                            CreateParentDirectory(code);
                            CreateParentDirectory(css);

                            WriteFile(solution, GetParam(doc.DocumentElement, "Solution"));

                            string bk_content = RenderHashJson(
                                "CreatedTime", DateTime.Now,
                                "Solution", GetParam(doc.DocumentElement, "Solution")
                            );
                            AppendFile(backup, bk_content, ",\r\n");
                            ReduceBkFile(backup);
                            WriteFile(code, GetParam(doc.DocumentElement, "Code"));
                            break;
                        }
                }
            }
            catch (Exception ex)
            {
                error = ex;
            }

            String ret = null;

            if (error != null)
            {
                ret = RenderHashJson(
                    "Result", "FAIL",
                    "Exception", error
                );
            }
            else
            {
                if (builder.Length > 0)
                {
                    ret = RenderHashJson(
                        "Result", "OK",
                        "Data", new JsonText(builder.ToString())
                    );
                }
                else
                {
                    ret = RenderHashJson(
                        "Result", "OK"
                    );
                }
            }
            context.Response.Write(ret);
        }
    }

}