"ui";
ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="华仔AutoJs工具箱" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <vertical padding="15 10" bg="#e3e0e0">
                        <ScrollView h="auto" layout_weight="25">
                            <vertical h="auto" layout_weight="25" >
                                <card contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px">
                                    <vertical id="deiveceBaseInfo" visibility="visible">
                                        <text text="基本信息:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                                        <horizontal h="60px">
                                            <text text="屏幕宽度:" textColor="#210303" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="屏幕宽度" text="" textColor="#210303" textSize="14sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="60px">
                                            <text text="屏幕高度:" textColor="#210303" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="屏幕高度" text="" textColor="#210303" textSize="14sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="60px">
                                            <text text="DPI:" textColor="#210303" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="DPI" text="" textColor="#210303" textSize="14sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="60px">
                                            <text text="设备UUID:" textColor="#210303" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="设备UUID" text="" textColor="#210303" textSize="14sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="60px">
                                            <text text="当前版本号:" textColor="#210303" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="当前版本号" text="" textColor="#210303" textSize="14sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                    </vertical>
                                </card>
                                
                                <card contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px" marginTop="30px">
                                    <vertical layout_gravity="center" bg="#ffffff">
                                        <text text="权限设置:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                                        <Switch h="20"  textSize="14sp" text="无障碍服务" id="autoService" checked="true" />
                                        <horizontal>
                                            <text textSize="12sp" text="必要权限(可通过adb或者root实现保活)"/>
                                        </horizontal>
                                        
                                        <Switch h="20" textSize="14sp" text="悬浮窗" id="floatyPermission" checked="true" marginTop="5px"/>
                                        <horizontal>
                                            <text textSize="12sp" text="必要权限(弹窗提示信息依赖)"/>
                                        </horizontal>
                                        
                                        <Switch h="20" textSize="14sp" text="前台服务" id="foregroundService" checked="true" marginTop="5px"/>
                                        <horizontal>
                                            <text textSize="12sp" text="必要权限(增加程序后台存活率)"/>
                                        </horizontal>
                                        
                                        <Switch h="20" textSize="14sp" text="后台运行权限" id="backgroundOpenPermission" marginTop="5px" checked="false"/>
                                        <horizontal>
                                            <text textSize="12sp" text="必要权限(权限管理-后台运行权限,请手动设置)"/>
                                        </horizontal>
                                        
                                        <Switch h="20" textSize="14sp" text="忽略电池优化" id="battery" marginTop="5px" checked="false"/>
                                        <horizontal>
                                            <text textSize="12sp" text="必要权限(省电策略-无限制,请手动设置)"/>
                                        </horizontal>
                                    </vertical>
                                </card>
                                
                                <card contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px" marginTop="30px" marginBottom="20px">
                                    <vertical layout_gravity="center" bg="#ffffff">
                                        <text text="使用说明:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                                        <horizontal>
                                            <text textSize="14sp" text="1、按要求设置进行必要权限设置,建议在权限管理中开启所有权限。"/>
                                        </horizontal>
                                        <horizontal marginTop="6px">
                                            <text textSize="14sp" text="2、查看学习指南,进行服务端部署。"/>
                                        </horizontal>
                                        <horizontal marginTop="6px">
                                            <text textSize="14sp" text="3、功能设置,配置服务端IP,连接服务端,再到服务端进行操作。"/>
                                        </horizontal>
                                        <horizontal marginTop="6px">
                                            <text textSize="14sp" text="4、功能设置-文件管理,编辑和运行本地脚本文件。"/>
                                        </horizontal>
                                    </vertical>
                                </card>
                            </vertical>
                        </ScrollView>
                        <horizontal layout_weight="1" gravity="center" w="*" marginTop="30px">
                            <button id="help" layout_gravity="center"  text="学习指南" w="300px" style="Widget.AppCompat.Button.Colored" bg="#827f7f" foreground="?selectableItemBackground"/>
                            <button id="gitee" layout_gravity="center"  text="开源地址" w="300px" marginLeft="50px" style="Widget.AppCompat.Button.Colored" bg="#ff5723" foreground="?selectableItemBackground"/>
                        </horizontal>
                    </vertical>
                </frame>
                <frame>
                    <vertical padding="15 10" bg="#e3e0e0">
                        <ScrollView h="auto" layout_weight="25">
                            <vertical id="uiView">
                            </vertical>
                        </ScrollView>
                        <horizontal layout_weight="1" gravity="center" marginTop="30px">
                            <button id="saveSetting" layout_gravity="center" text="保存配置" style="Widget.AppCompat.Button.Colored" bg="#ff5723" marginRight="1px" foreground="?selectableItemBackground"/>
                            <button id="startScript" layout_gravity="center" text="连接服务端" style="Widget.AppCompat.Button.Colored" bg="#04a9f5" marginLeft="1px" marginRight="1px" foreground="?selectableItemBackground"/>
                            <button id="runUi" layout_gravity="center" text="文件管理" style="Widget.AppCompat.Button.Colored" bg="#827f7f" foreground="?selectableItemBackground"/>
                        </horizontal>
                    </vertical>
                </frame>
                <frame>
                    <button id="clearLog" text="清空日志" gravity="center" alpha="0.5" layout_gravity="right" padding="0" h="40" w="80" foreground="?selectableItemBackground"/>
                    <globalconsole id="globalconsole" w="*" h="*" />
                </frame>
            </viewpager>
        </vertical>
    </drawer>
);


//设置滑动页面的标题
ui.viewpager.setTitles(["设备信息", "功能设置", "运行日志"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);
activity.setSupportActionBar(ui.toolbar)

let permission = require("./permission.js")
permission.init()

let config = require('./common/config.js')
// 导入公共常量类
let commonConstant = require('./common/commonConstant.js')
// 公共储存对象
var commonStorage = storages.create("zjh336.cn" + config.commonScriptKey);
let utils = require('./common/utils.js')
let deviceUUID = utils.getDeviceUUID()
ui['设备UUID'].attr('text', deviceUUID)

const resources = context.getResources();
const densityDpi = resources.getDisplayMetrics().densityDpi;
const density = resources.getDisplayMetrics().density;

ui["屏幕宽度"].attr("text", device.width)
ui["屏幕高度"].attr("text", device.height)
ui["DPI"].attr("text", densityDpi)

// 当前版本信息
let curVersionName = app.versionName
let hotUpdateVersion = commonStorage.get("hotUpdateVersion")
ui["当前版本号"].attr("text", curVersionName + (hotUpdateVersion ? `[${hotUpdateVersion}]` : ""))

// 初始化ui设置
function initUiSetting() {
    // 初始化公共ui设置 
    ui.inflate(
        `<card contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px">
            <vertical>
                <text text="公共参数设置:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                <horizontal h="68px">
                    <text text="服务端IP:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="服务端IP" inputType="text" hint="请输入服务端ip" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="服务端Port:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="服务端Port" inputType="text" hint="服务端Port,默认9998" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="访问密码:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="访问密码" inputType="text" hint="WEB端操作设备所需" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="ws日志:" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <Switch id="webSocketLog" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="自动运行:" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <Switch id="自动运行" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="调试模式:" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <Switch id="debugModel" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px" id="调试延时" visibility="gone">
                    <text text="调试延时:" textSize="14sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <input id="debugSleep" hint="请填写延时毫秒数,建议1000" h="*" w="*" margin="0" textSize="14sp" padding="15px 0 0 0" bg="#ffffff" inputType="text" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px" id="绘制偏移" visibility="gone">
                    <text text="竖屏绘制y偏移:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="canvasOffset" hint="默认0,刘海屏建议110" h="*" w="*" margin="0" textSize="14sp" padding="15px 0 0 0" bg="#ffffff" inputType="text" gravity="left|center" layout_weight="2" />
                </horizontal>
				<horizontal h="68px" id="远程脚本日志" visibility="gone">
                    <text text="远程脚本日志:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <Switch id="showRemtoeExecScriptContent" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
				<horizontal h="68px">
                    <text text="显示截图配置:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <Switch id="显示截图配置" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
				<horizontal h="68px" id="截图点击文字" visibility="gone">
                    <text text="截图点击文字:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="otherClickText" inputType="text" hint="申请截图权限时要点击的文字" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="标准宽度:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="standardWidth" inputType="number" hint="请输入标准宽度" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="标准高度:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="standardHeight" inputType="number" hint="请输入标准高度" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px" visibility="gone">
                    <text text="标准坐标转换:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <Switch id="standardConvert" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <text text="非标准分辨率生效:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                <text text="在标准分辨率下,以坐标轴最大值的一半为基数,设置值为系数,可进行双向坐标偏移" textSize="14sp" h="*" w="*" gravity="left|center" />
                <horizontal h="68px">
                    <text text="x偏移系数:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="x偏移系数" inputType="number" hint="请输入x偏移系数0-100" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="68px">
                    <text text="y偏移系数:" textSize="14sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="y偏移系数" inputType="number" hint="请输入y偏移系数0-100" textSize="14sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
            </vertical>
        </card>`,
        ui.uiView,
        true
    )


    // 初始化公共ui设置 
    ui.inflate(
        <card contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px" marginTop="30px" marginBottom="20px">
            <vertical layout_gravity="center" bg="#ffffff">
                <text text="参数说明:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                <horizontal>
                    <text textSize="14sp" text="注意：修改参数后,必须重新连接服务端后生效。"/>
                </horizontal>
                <horizontal>
                    <text textSize="14sp" text="1、服务端IP地址,如果是本地部署,请填写与当前设备同一网段的服务端IP。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="2、服务端Port,如果本地部署修改了Port则需要修改,否则保持空值即可。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="3、访问密码,按需设置即可。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="4、ws日志,测试服务端连接情况时开启,其余时候均可关闭。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="5、自动运行,app启动后,自动连接服务端。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="6、调试模式,开启后,服务端远程操作和运行代码时,APP会有额外的效果,方便调试代码。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="7、调试延时,调试模式开启后生效,封装图色API运行时绘制匹配框的等待延时,增加延时有助于查看匹配效果。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="8、竖屏绘制y偏移,调试模式开启后生效,竖屏模式下的绘制框偏移效果,刘海屏模式下绘制有偏差,需要调整该值。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="9、远程脚本日志,调试模式开启后生效,服务端远程操作和运行代码时,APP会额外输出远程执行的代码。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="10、显示截图配置,用于显示申请截图权限的额外关键字,设置完成后,建议隐藏,否则有可能会自动点击到配置框。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="10、截图点击文字,申请截图权限的额外关键字,常见的包括立即开始、允许、同意,如有其它类型,在此配置即可。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="11、标准宽度,默认读取设备宽度,服务端进行多分辨率测试时需要用到,一般无需修改。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="12、标准高度,默认读取设备高度,服务端进行多分辨率测试时需要用到,一般无需修改。"/>
                </horizontal>
                <horizontal marginTop="6px">
                    <text textSize="14sp" text="13、x偏移系数,服务端进行多分辨率测试时需要用到,一般无需修改。"/>
                </horizontal>
                 <horizontal marginTop="6px">
                    <text textSize="14sp" text="14、y偏移系数,服务端进行多分辨率测试时需要用到,一般无需修改。"/>
                </horizontal>
            </vertical>
        </card>,
        ui.uiView,
        true
    )

    let 文字识别插件 = commonStorage.get("文字识别插件") || "谷歌"
    utils.initOcr(文字识别插件)

    let standardWidth = commonStorage.get('standardWidth')
    let standardHeight = commonStorage.get('standardHeight')
    if (!standardWidth) {
        commonStorage.put('standardWidth', device.width)
    }
    if (!standardHeight) {
        commonStorage.put('standardHeight', device.height)
    }

    // 调试模式监听
    utils.switchChangeEvent("debugModel", (checked) => {
        ui["调试延时"].attr("visibility", checked ? "visible" : "gone");
        ui["绘制偏移"].attr("visibility", checked ? "visible" : "gone");
        ui["远程脚本日志"].attr("visibility", checked ? "visible" : "gone");
    })

    // 显示截图配置监听
    utils.switchChangeEvent("显示截图配置", (checked) => {
        ui["截图点击文字"].attr("visibility", checked ? "visible" : "gone");
    })


    // 读取公共缓存数据
    utils.getUICacheData(commonConstant.commonSettingKey, commonStorage)


    let 服务端IP = commonStorage.get('服务端IP')
    if (服务端IP) {
        let 自动运行 = commonStorage.get("自动运行") || false
        if (自动运行) {
            toastLog("自动运行")
            startScriptFun()
            // 开启了自动运行后回到主页
            if (auto.service) {
                home();
            }
        }
    }
}


// 开始脚本
function startScriptFun(callback) {
    let remoteIp = ui['服务端IP'].attr("text")
    if (!remoteIp) {
        toast("请先设置服务端ip")
        return
    }
    commonStorage.put("服务端IP", remoteIp)
    const btnContent = ui.startScript.attr("text")
    toast(btnContent)
    const afterBtnContent = "连接服务端" === btnContent ? "断开服务端" : "连接服务端"
    ui.startScript.attr("text", afterBtnContent)
    if (btnContent === "连接服务端") {
        // 启动脚本之前 先存储数据
        utils.setUICacheData(commonConstant.commonSettingKey, commonStorage);
        // 在运行脚本
        runScript = engines.execScriptFile("./runScript.js");
    } else {
        const myScript = engines.myEngine()
        const all = engines.all()
        all.forEach(item => {
            if (item.id !== myScript.id) {
                item.forceStop()
            }
        });
        utils.timerStopPushLog();
    }
}

// 初始化ui
initUiSetting()
ui.startScript.on("click", () => {
    startScriptFun()
})

ui.runUi.on("click", () => {
    engines.execScriptFile("./fileManager.js")
})

ui.help.on("click", () => {
    app.openUrl("https://www.zjh336.cn/?id=2126")
})
ui.gitee.on("click", () => {
    app.openUrl("https://gitee.com/zjh336/")
})
// 保存设置按钮
ui.saveSetting.on("click", () => {
    // 设置公共缓存数据
    utils.setUICacheData(commonConstant.commonSettingKey, commonStorage)
    toastLog("保存成功！")
})
/* // 加载设置按钮
ui.loadSetting.on("click", () => {
    // 读取公共缓存数据
    utils.getUICacheData(commonConstant.commonSettingKey, commonStorage)
    toast("载入成功！")
}) */

ui.clearLog.on("click", () => {
    ui.globalconsole.clear()
})


// 刷新ui
events.broadcast.on("refreshUI", function() {
    // 读取公共缓存数据
    utils.getUICacheData(commonConstant.commonSettingKey, commonStorage)
});


function getCurrentTime() {
    var date = new Date(); //当前时间
    var month = zeroFill(date.getMonth() + 1); //月
    var day = zeroFill(date.getDate()); //日
    var hour = zeroFill(date.getHours()); //时
    //当前时间
    var curTime = date.getFullYear() + month + day +
        hour;
    return curTime;
}

function zeroFill(i) {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return String(i);
    }
}


let waitTimes = 0
files.createWithDirs("/sdcard/autoJsToolsLog/")
// 获取当前时间字符串
let currenTimes = getCurrentTime()
console.setGlobalLogConfig({
    file: "/sdcard/autoJsToolsLog/log" + currenTimes + ".txt"
})

threads.start(() => {
    try {
        while (true) {
            sleep(1000)
            let tempTimes = getCurrentTime()
            if (currenTimes !== tempTimes) {
                currenTimes = tempTimes
                console.setGlobalLogConfig({
                    file: "/sdcard/autoJsToolsLog/log" + currenTimes + ".txt"
                })
            }
        }
    } catch (error) {
        console.error("错误", error)
    }
})
if (!$power_manager.isIgnoringBatteryOptimizations()) {
    console.log("未开启忽略电池优化，尝试申请权限");
    $power_manager.requestIgnoreBatteryOptimizations();
}
// 监听广播
var receiver = new JavaAdapter(android.content.BroadcastReceiver, {
    onReceive: function(context, intent) {
        switch (intent.action) {
            case Intent.ACTION_CONFIGURATION_CHANGED:
                events.broadcast.emit("orientationchange", '');
                break;
        }
    },
});
var filter = new IntentFilter();
// 屏幕旋转
filter.addAction(Intent.ACTION_CONFIGURATION_CHANGED);
context.registerReceiver(receiver, filter);
events.on("exit", function() {
    receiver && context.unregisterReceiver(receiver);
});

function strToArr(str) {
    if (!str) {
        return [];
    }
    //防止保活时,连环回调放入空字符,去掉末尾没用的字符串
    return str.replace(/:$/, "").split(":");
}
try {
    importClass(android.os.Handler);
    importClass(android.database.ContentObserver);
    let curPackage = auto.service ? currentPackage() : "com.zjh336.cn.tools"

    //保活白名单数组,也可以时其他应用的服务名,这里是autojspro的
    const whiteList = [curPackage + "/com.stardust.autojs.core.accessibility.AccessibilityService"];
    const contentResolver = context.getContentResolver();
    let lastArr = strToArr(Settings.Secure.getString(contentResolver, "enabled_accessibility_services"));
    let contentObserver = JavaAdapter(
        ContentObserver, {
            onChange(b) {
                let service = "";
                let str = Settings.Secure.getString(contentResolver, "enabled_accessibility_services");
                let newArr = strToArr(str);
                if (newArr.length > lastArr.length) {
                    newArr.some(item => {
                        service = item;
                        return !lastArr.includes(item);
                    });
                    console.log("开启了----", service);
                } else if (newArr.length < lastArr.length) {
                    lastArr.some(item => {
                        service = item;
                        return !newArr.includes(item);
                    });
                    //这里可以做一些保活处理
                    if (service && whiteList.includes(service)) {
                        try {
                            newArr.push(service);
                            let success = Settings.Secure.putString(contentResolver, "enabled_accessibility_services", newArr.join(":"));
                            console.log(`${success ? "保活成功" : "保活失败"}----${service}`);
                        } catch (error) {
                            console.log("没有权限----", error);
                        }
                    } else {
                        console.log("关闭了----", service);
                    }
                }
                lastArr = newArr;
            },
        },
        new Handler()
    );
    contentResolver.registerContentObserver(Settings.Secure.getUriFor("enabled_accessibility_services"), true, contentObserver);
    events.on("exit", () => {
        contentResolver.unregisterContentObserver(contentObserver);
    });
} catch (e) {
    console.error(e);
}
//保持脚本运行
setInterval(() => {}, 1000);