Lesktop.LoadCss("Themes/Default/SampleModule.css");

var Controls = null;
var Window = null, Control = null;

function init(completeCallback, errorCallback)
{
    function LoadModulesComplete()
    {
        Controls = Lesktop.GetModule("Controls.js");

        Control = Lesktop.GetModule("Controls.js").Control;

        _init(completeCallback, errorCallback);
    }

    Lesktop.LoadModules(
        LoadModulesComplete, errorCallback,
        ["Controls.js"]
    );
}

function _init(completeCallback, errorCallback)
{
    try
    {
        //初始化代码，初始化完成后必须调用completeCallback;
        completeCallback();
    }
    catch (ex)
    {
        errorCallback(new Lesktop.Exception(ex.mame, ex.message));
    }
}



function dispose(completeCallback, errorCallback)
{
    _dispose(completeCallback, errorCallback);
}

function _dispose(completeCallback, errorCallback)
{
    try
    {
        //卸载代码，卸载完成后必须调用completeCallback;
        completeCallback();
    }
    catch (ex)
    {
        errorCallback(new Lesktop.Exception(ex.mame, ex.message));
    }
}

//共享全局变量和函数，在此定义的变量和函数将由该应用程序的所有实例共享



Module.SampleCtrl = SampleCtrl;

function SampleCtrl(config)
{
    var This = this;
    var OwnerForm = this;
    
    
    
    var width = config.Width, height = config.Height;
    config.Width=610;
    config.Height=425;

    Control.call(This, config);

    var Base = {
        GetType: This.GetType,
        is: This.is
    };

    This.GetType = function() { return "SampleCtrl"; }
    This.is = function(type) { return type == This.GetType() ? true : Base.is(type); }
    
    var tab1 = new Controls.SimpleTabControl({"Left":1,"Top":1,"Width":607,"Height":423,"AnchorStyle":Controls.AnchorStyle.Left|Controls.AnchorStyle.Right|Controls.AnchorStyle.Top|Controls.AnchorStyle.Bottom,"Parent":This,"Text":"","Css":"simple_tab","Tabs":[{"Text":"标签1","Width":80,"IsSelected":true},{"Text":"标签2","Width":80,"IsSelected":false}],"BorderWidth":1});
    
    
    
    tab1.OnSelectedTab.Attach(
        function(index,preIndex)
        {
            
        }
    )
    
    This.Resize(width,height);

    

}

