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
                    <vertical padding="15 10" bg="#eeeeee">
                        <ScrollView h="auto" layout_weight="25">
                            <vertical h="auto" layout_weight="25">
                                <card contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px">
                                    <vertical id="deiveceBaseInfo" visibility="visible">
                                        <text text="基本信息:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                                        <horizontal h="80px">
                                            <text text="屏幕宽度:" textColor="#210303" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="屏幕宽度" text="" textColor="#210303" textSize="16sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="80px">
                                            <text text="屏幕高度:" textColor="#210303" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="屏幕高度" text="" textColor="#210303" textSize="16sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="80px">
                                            <text text="DPI:" textColor="#210303" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="DPI" text="" textColor="#210303" textSize="16sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="80px">
                                            <text text="设备UUID:" textColor="#210303" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="设备UUID" text="" textColor="#210303" textSize="16sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                        <horizontal h="80px">
                                            <text text="当前版本号:" textColor="#210303" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                                            <text id="当前版本号" text="" textColor="#210303" textSize="16sp" h="*" w="*" gravity="left|center" layout_weight="2" />
                                        </horizontal>
                                    </vertical>
                                </card>
                            </vertical>
                        </ScrollView>
                        <horizontal layout_weight="1" gravity="center" w="*" marginTop="30px">
                            <button id="help" layout_gravity="center"  text="使用介绍" w="300px" style="Widget.AppCompat.Button.Colored" bg="#827f7f" />
                            <button id="gitee" layout_gravity="center"  text="开源地址" w="300px" marginLeft="50px" style="Widget.AppCompat.Button.Colored" bg="#ff5723" />
                        </horizontal>
                    </vertical>
                </frame>
                <frame>
                    <vertical padding="15 10" bg="#eeeeee">
                        <card contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px">
                            <vertical margin="5 2" layout_gravity="center" bg="#ffffff">
                                <Switch h="30" text="无障碍服务" id="autoService" checked="true" />
                                <Switch h="30" text="悬浮窗" id="floatyPermission" checked="true" />
                                <Switch h="30" text="前台服务" id="foregroundService" checked="true" />
                                <Switch h="30" text="无障碍稳定模式" id="stableMode" checked="true" />
                                <Switch h="30" text="截图权限" id="screenCapturePermission" checked="true" />
                                <Switch h="30" text="后台弹出权限" id="backgroundOpenPermission" checked="true" />
                            </vertical>
                        </card>
                    </vertical>
                </frame>
                <frame>
                    <vertical padding="15 10" bg="#eeeeee">
                        <ScrollView h="auto" layout_weight="25">
                            <vertical id="uiView">
                            </vertical>
                        </ScrollView>
                        <horizontal layout_weight="1" gravity="center" marginTop="30px">
                            <button id="loadSetting" layout_gravity="center" text="载入配置" style="Widget.AppCompat.Button.Colored" bg="#827f7f" />
                            <button id="saveSetting" layout_gravity="center" text="保存配置" style="Widget.AppCompat.Button.Colored" bg="#ff5723" marginLeft="1px" marginRight="1px" />
                            <button id="startScript" layout_gravity="center" text="启动脚本" style="Widget.AppCompat.Button.Colored" bg="#04a9f5" marginLeft="1px" marginRight="1px"/>
							<button id="runUi" layout_gravity="center" text="运行程序" style="Widget.AppCompat.Button.Colored" bg="#827f7f" />
                        </horizontal>
                    </vertical>
                </frame>
                <frame>
                    <button id="clearLog" text="清空日志" gravity="center" layout_gravity="right" padding="0" h="40" w="80" />
                    <globalconsole id="globalconsole" w="*" h="*" />
                </frame>
            </viewpager>
        </vertical>
    </drawer>
);


//设置滑动页面的标题
ui.viewpager.setTitles(["设备信息", "权限设置", "功能设置", "运行日志"]);
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
ui["当前版本号"].attr("text", curVersionName)

// 初始化ui设置
function initUiSetting() {
    // 初始化公共ui设置 
    ui.inflate(
        <card marginBottom="40px" contentPadding="50px 20px 50px 20px" cardBackgroundColor="#ffffff" cardCornerRadius="15px" cardElevation="15px">
            <vertical>
                <text text="公共参数设置:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                <horizontal h="80px">
                    <text text="服务端IP:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="服务端IP" inputType="text" hint="请输入服务端ip" textSize="16sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="访问密码:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="访问密码" inputType="text" hint="WEB端操作设备所需" textSize="16sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="ws日志:" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <Switch id="webSocketLog" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="自动运行:" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <Switch id="自动运行" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="调试模式:" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <Switch id="debugModel" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px" id="调试延时" visibility="gone">
                    <text text="调试延时:" textSize="16sp" h="*" w="400px" gravity="left|center" layout_weight="1" />
                    <input id="debugSleep" hint="请填写延时毫秒数,建议1000" h="*" w="*" margin="0" textSize="16sp" padding="15px 0 0 0" bg="#ffffff" inputType="text" gravity="left|center" layout_weight="2" />
                </horizontal>
				<horizontal h="80px" id="远程脚本日志" visibility="gone">
                    <text text="远程脚本日志:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <Switch id="showRemtoeExecScriptContent" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="标准宽度:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="standardWidth" inputType="number" hint="请输入标准宽度" textSize="16sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="标准高度:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="standardHeight" inputType="number" hint="请输入标准高度" textSize="16sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="标准坐标转换:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <Switch id="standardConvert" checked="false" h="*" w="*" gravity="left|center" layout_weight="2" />
                </horizontal>
                <text text="非标准分辨率生效:" textSize="22sp" textColor="#210303" marginBottom="5px" />
                <text text="在标准分辨率下,以坐标轴最大值的一半为基数,设置值为系数,可进行双向坐标偏移" textSize="16sp" h="*" w="*" gravity="left|center" />
                <horizontal h="80px">
                    <text text="x偏移系数:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="x偏移系数" inputType="number" hint="请输入x偏移系数0-100" textSize="16sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
                </horizontal>
                <horizontal h="80px">
                    <text text="y偏移系数:" textSize="16sp" h="*" w="450px" gravity="left|center" layout_weight="1" />
                    <input id="y偏移系数" inputType="number" hint="请输入y偏移系数0-100" textSize="16sp" h="*" w="*" margin="0" bg="#ffffff" padding="15px 0 0 0" gravity="left|center" layout_weight="2" />
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
		ui["远程脚本日志"].attr("visibility", checked ? "visible" : "gone");
    })

    // 读取公共缓存数据
    utils.getUICacheData(commonConstant.commonSettingKey, commonStorage)


    let 服务端IP = commonStorage.get('服务端IP')
    if (服务端IP) {
        let 自动运行 = commonStorage.get("自动运行") || false
        if (自动运行) {
            toastLog("自动运行")
            startScriptFun()
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
    const afterBtnContent = "启动脚本" === btnContent ? "停止脚本" : "启动脚本"
    ui.startScript.attr("text", afterBtnContent)
    if (btnContent === "启动脚本") {
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
	let uiPath = commonStorage.get('uiPath') || "/sdcard/appSync/main.js"
	if(files.exists(uiPath)){
		 engines.execScriptFile(uiPath)
	} else {
		toastLog('本地文件'+uiPath+'不存在,请先创建!')
	}
})

ui.help.on("click", () => {
    app.openUrl("https://www.zjh336.cn/?id=2109")
})
ui.gitee.on("click",()=>{
    app.openUrl("https://gitee.com/zjh336/")
})
// 保存设置按钮
ui.saveSetting.on("click", () => {
    // 设置公共缓存数据
    utils.setUICacheData(commonConstant.commonSettingKey, commonStorage)
    toastLog("保存成功！")
})
// 加载设置按钮
ui.loadSetting.on("click", () => {
    // 读取公共缓存数据
    utils.getUICacheData(commonConstant.commonSettingKey, commonStorage)
    toast("载入成功！")
})

ui.clearLog.on("click", () => {
    ui.globalconsole.clear()
})


// 刷新ui
events.broadcast.on("refreshUI", function () {
    // 读取公共缓存数据
    utils.getUICacheData(commonConstant.commonSettingKey, commonStorage)
});


function getCurrentTime() {
    var date = new Date();//当前时间
    var month = zeroFill(date.getMonth() + 1);//月
    var day = zeroFill(date.getDate());//日
    var hour = zeroFill(date.getHours());//时
    //当前时间
    var curTime = date.getFullYear() + month + day
        + hour;
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
// 监听广播
var receiver = new JavaAdapter(android.content.BroadcastReceiver, {
    onReceive: function (context, intent) {
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
events.on("exit", function () {
    receiver && context.unregisterReceiver(receiver);
});

//保持脚本运行
setInterval(() => { }, 1000);