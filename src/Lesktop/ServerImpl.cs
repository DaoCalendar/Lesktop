using System.Configuration;
using System.Web;
using System.Web.Configuration;

namespace Lesktop
{
    public class ServerImpl
    {
        static ServerImpl m_Instance = new ServerImpl();

        static public ServerImpl Instance
        {
            get
            {
                m_Instance.Initialize(HttpContext.Current);
                return m_Instance;
            }
        }

        string service_url_;
        string res_path_;
        string version_;

        bool is_init_ = false;

        object init_lock_ = new object();

        public void Initialize(HttpContext context)
        {
            lock (init_lock_)
            {
                if (!is_init_)
                {
                    service_url_ = context.Request.ApplicationPath == "/" ? "/Lesktop" : context.Request.ApplicationPath + "/Lesktop";
                    res_path_ = Config.AppSettings.Settings["ResPath"].Value;
                    version_ = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString();
                    is_init_ = true;
                }
            }
        }

        public Configuration Config
        {
            get { return WebConfigurationManager.OpenWebConfiguration(service_url_); }
        }

        public string ServiceUrl
        {
            get { return service_url_; }
        }

        public string ResPath
        {
            get { return res_path_; }
        }

        public string Version
        {
            get { return version_; }
        }
    }
}
