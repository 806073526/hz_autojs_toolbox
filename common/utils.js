importClass(android.widget.Toast);
importClass(android.view.Gravity);
importClass(android.os.Build);
importClass("java.io.FileOutputStream")
importClass("java.io.IOException")
importClass("java.io.InputStream")
importClass("java.net.MalformedURLException")
importClass("java.net.URL")
importClass("java.net.URLConnection")
importClass("java.util.ArrayList")

importClass(java.io.FileReader);
importClass("android.os.BatteryManager");
importClass(android.content.IntentFilter);
importClass(android.os.HardwarePropertiesManager);
importClass(android.app.ActivityManager);
importClass(java.io.BufferedReader);
importClass(java.io.InputStreamReader);
importClass(java.io.File);
importClass(java.io.RandomAccessFile);
importClass(android.os.Process);
importClass(java.util.Scanner);
importClass(java.util.HashMap);
//importClass(java.util.ArrayList);
importClass(java.lang.ProcessBuilder);
importClass(android.net.ConnectivityManager);
importClass(android.net.TrafficStats);

//importPackage(android.content)
let config = require("./config.js")
let commonConstant = require("./commonConstant.js")
let toastCustom = null;
let view = null



var canvasFloat
// 监听自定义toast方法
events.broadcast.on("closeFloat", function () {
    if (canvasFloat) {
        canvasFloat.close();
    }
});
events.on("exit", function () {
    if (canvasFloat) {
        canvasFloat.close();
    }
    floaty.closeAll();
});
let utilsObj = {}


// 核数
var kernelCount = 0
try {
    kernelCount = files.listDir("/sys/devices/system/cpu/", function (name) {
        return /cpu[0-9]+/.test(name);
    }).length;
} catch (error) {
}

// 随机字符串
let getRandomString = (num) => {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let nums = "";
    for (let i = 0; i < num; i++) {//这里是几位就要在这里不改变
        let id = parseInt(Math.random() * 61);
        nums += chars[id];
    }
    return nums;
}


// 数据map
let dataMap = {}
let commonStorage = storages.create("zjh336.cn" + config.commonScriptKey);
// 获取设备uuid
let deviceUUID = commonStorage.get('deviceUUID')
if (!deviceUUID) {
    // 安卓10及以上 取androidId   10以下 取IMEI
    deviceUUID = config.SDK_API_VERSION > 28 ? device.getAndroidId() : device.getIMEI()
    if (!deviceUUID) {
        deviceUUID = getRandomString(16);
    }
    commonStorage.put("deviceUUID", deviceUUID)
}

// 分辨率 以竖屏标准看
utilsObj.getScreenWidth = () => {
    let screenWidth = commonStorage.get("standardWidth") || device.width
    return screenWidth;
}

utilsObj.getScreenHeight = () => {
    let screenHeight = commonStorage.get("standardHeight") || device.height
    return screenHeight;
}

utilsObj.timerStopPushLog = () => {
    let timerStorage = storages.create("zjh336.cn_timer");
    timerStorage.put('stop', 'stop');
}


let curOcrName = commonStorage.get("文字识别插件") || "谷歌"

// 浩然文字识别
let hrOcr = null
// tomato文字识别
let tomatoOcr = null
// tomato文字识别类
let tomatoOcrClass = null
// 谷歌ocr
let MLKitOCR = null
let googleOcr = null


// 文字控件点击
utilsObj.textFindOneClick = (content, times) => {
    let one = text(content).findOne(times)
    if (one != null) {
        one.clickCenter();
    }
}




// 获取屏幕方向
utilsObj.getOrientation = () => {
    // 1 竖屏 2横屏
    let orientation = context.getResources().getConfiguration().orientation

    // 宽大于高 平板
    if(device.width > device.height){
        // 转换一下方向
        orientation = orientation === 1 ? 2 : 1
    // 高大于宽 手机
    }
    return orientation;
}

utilsObj.getTempPackageInfo = () => {
    let pm = context.getPackageManager();
    let pkgInfo = pm.getPackageArchiveInfo("/sdcard/华仔部落_佣兵战纪_临时更新包.apk", PackageManager.GET_ACTIVITIES);
    let appInfo = pkgInfo ? pkgInfo.applicationInfo : null
    let packageName = pkgInfo ? appInfo.packageName : ""; // 得到包名
    let version = pkgInfo ? pkgInfo.versionName : ""; // 得到版本信息
    console.log("临时安装包", packageName, version)
}

/**
 * 获取本地最新版本apk信息
 * @param {String} newApkName 
 */
utilsObj.getLocalApkInfoByNewVersion = (newApkName) => {
    let pm = context.getPackageManager();
    let pkgInfo = pm.getPackageArchiveInfo("/sdcard/" + newApkName, PackageManager.GET_ACTIVITIES);
    let appInfo = pkgInfo ? pkgInfo.applicationInfo : null
    let packageName = pkgInfo ? appInfo.packageName : ""; // 得到包名
    let version = pkgInfo ? pkgInfo.versionName : ""; // 得到版本信息
    return version
}

// 下载文件
utilsObj.downLoadFile = (downloadFileUrl, loaclFileUrl, callback) => {
    try {
        let url = new URL(downloadFileUrl);
        let conn = url.openConnection(); //URLConnection
        let inStream = conn.getInputStream(); //InputStream
        let fs = new FileOutputStream("/sdcard/" + loaclFileUrl); //FileOutputStream
        var connLength = conn.getContentLength(); //int
        let startTime = java.lang.System.currentTimeMillis();
        let buffer = util.java.array('byte', 1024); //byte[]
        // buffer = new byte[1204]; //byte[]
        let prevTime = java.lang.System.currentTimeMillis();
        let bytePrev = 0; //前一次记录的文件大小
        var byteSum = 0; //总共读取的文件大小
        var byteRead; //每次读取的byte数
        threads.start(() => {
            while (true) {
                var 当前写入的文件大小 = byteSum
                var 百分比 = parseInt(当前写入的文件大小 / connLength * 100)
                toastLog(loaclFileUrl + '已下载：' + 百分比 + "%")
                if (当前写入的文件大小 >= connLength) {
                    if (callback) {
                        callback()
                    }
                    break;
                }
                sleep(3000)
            }
        })
        while ((byteRead = inStream.read(buffer)) != -1) {
            byteSum += byteRead;
            //当前时间
            currentTime = java.lang.System.currentTimeMillis();
            fs.write(buffer, 0, byteRead); //读取
        }
    } catch (error) {
        console.error(error)
    }
}

// cpu核心数
utilsObj.getCpuCoreCount = () => {
    return kernelCount;
}

// cpu占有率
utilsObj.getCpuPercentage = () => {
    let curVal = 0
    let totalVal = 0
    try {
        for (var i = 0; i < kernelCount; i++) {
            let value = files.read("/sys/devices/system/cpu/cpu" + i + "/cpufreq/scaling_cur_freq");
            value = parseInt(parseInt(value) / 1000);
            curVal += value

            let value1 = files.read("/sys/devices/system/cpu/cpu" + i + "/cpufreq/cpuinfo_max_freq");
            value1 = parseInt(parseInt(value1) / 1000);
            totalVal += value1
        }
    } catch (error) {
        console.log(error)
    }
    return totalVal === 0 ? '0%' : ((curVal / totalVal) * 100).toFixed(2) + "%"
}

// cpu温度
utilsObj.getCpuTemperature = () => {
    let val = ''
    /* ------------------cpu----------------------------------------------------- */
    try {
        let filePath = "/sys/class/thermal/thermal_zone0/temp";
        let r = files.read(filePath);
        r = parseInt(parseInt(r) / 1000);
        val = r + "℃"
    } catch (error) {
    }
    return val
}

// gpu温度
utilsObj.getGpuTemperature = () => {
    let val = ''
    /* ------------------gpu----------------------------------------------------- */
    try {
        filePath = "/sys/class/thermal/thermal_zone36/temp";
        r = files.read(filePath);
        r = parseInt(parseInt(r) / 1000);
        val = r + "℃"
    } catch (error) {
    }
    return val
}


utilsObj.getCpuAbi = () => {
    return Build.CPU_ABI
}


utilsObj.recycleNull = (imageObj) => {
    if (imageObj !== null) {
        imageObj.recycle();
    }
    imageObj = null;
};


utilsObj.initOcr = (ocrName) => {
    curOcrName = ocrName
    // commonStorage.put("文字识别插件", ocrName)
    try {
        // 如果有则先关闭
        if (tomatoOcr) {
            tomatoOcr.end()
        }
        if ("浩然" === ocrName) {
            let hrOcrPackage = "com.hraps.ocr32"
            let cpuAbi = utilsObj.getCpuAbi()
            let 位数 = "32位"
            // 64
            if (cpuAbi === 'arm64-v8a') {
                hrOcrPackage = "com.hraps.ocr"
                位数 = "64位"
            } else if (cpuAbi === 'armeabi-v7a') {
                hrOcrPackage = "com.hraps.ocr32"
                位数 = "32位"
            }
            hrOcr = hrOcr || $plugins.load(hrOcrPackage);
            console.log("初始化浩然ocr" + 位数)
        } else if ("tomato" === ocrName) {
            tomatoOcrClass = tomatoOcrClass || $plugins.load('com.tomato.ocr');
            tomatoOcr = new tomatoOcrClass();
            console.log("初始化tomatoOcr64位")
        } else if ("谷歌" === ocrName) {
            MLKitOCR = $plugins.load('org.autojs.autojspro.plugin.mlkit.ocr');
            googleOcr = new MLKitOCR();
            console.log("初始化谷歌OCR")
        }
    } catch (error) {
        alert("文字识别插件初始化错误")
        console.error("文字识别插件初始化错误", error)
    }
}


/**
 * 获取deviceUUID
 * @returns 
 */
utilsObj.getDeviceUUID = () => {
    return deviceUUID;
}

/**
 * 根据业务名多条件匹配
 * @param {Object} pageSetting 页面参数 取commonConstant的pageSetting_业务
 * @param {Image} allScreenImg 全屏图片
 */
utilsObj.multipleConditionMatchingByServiceName = (serviceName, allScreenImg) => {
    // 获取 配置的业务 的页面对象
    let pageSetting = utilsObj.getCurPageStting(serviceName);
    // 调用封装方法返回多条件匹配页面名称
    let pageName = utilsObj.multipleConditionMatchingByPageSetting(pageSetting, allScreenImg);
    return pageName;
}


// 处理业务参数
utilsObj.handlerPageStting = (pageSetting) => {
    let curPageSetting = {}
    // 收集key
    let keys = Object.keys(pageSetting);
    keys.forEach(key => {
        // 读取配置 
        let obj = pageSetting[key]
        // 获取分辨率对应的值
        let pageSetingObj = obj[device.width + "_" + device.height]

        let notNeedConvert = false;
        // 如果当前不是标准的分辨率 且获取到了特定的分辨率的配置
        if (!utilsObj.getIsStandard() && pageSetingObj) {
            notNeedConvert = true;
        }
        // 未适配当前设备 则读取标准的
        pageSetingObj = pageSetingObj || obj[commonStorage.get('standardWidth') + "_" + commonStorage.get('standardHeight')]
        pageSetingObj.notNeedConvert = notNeedConvert;
        // 重新写入配置
        curPageSetting[key] = pageSetingObj
    })
    // 返回配置项
    return curPageSetting;
}


/**
 * 根据参数多条件匹配
 * @param {Object} pageSetting 页面参数 取commonConstant的pageSetting_业务
 * @param {Image} allScreenImg 全屏图片
 * @param {Array} joinMatchingPageKeysArray 参与匹配的页面参数key数组
 */
utilsObj.multipleConditionMatchingByPageSetting = (pageSetting, allScreenImg, joinMatchingPageKeysArray) => {
	// 关闭特征匹配 特征匹配不稳定
	commonStorage.put("closeFeatures",true);
    // 获取参与匹配的页面key
    let joinMatchingPageKeys = joinMatchingPageKeysArray || utilsObj.getJoinMatchingPageKey()

    if (joinMatchingPageKeysArray && joinMatchingPageKeysArray.length) {
        // 处理页面参数 分辨率适配
        pageSetting = utilsObj.handlerPageStting(pageSetting);
    }

    // 寻找第一个匹配上的页面
    let firstMatchingPageKey = joinMatchingPageKeys.find((settingKey) => {
        // 获取页面配置对象
        let pageSetingObj = pageSetting[settingKey];
        if (!pageSetingObj) {
            return false;
        }
        // 获取关系映射对象
        let relationObj = pageSetingObj["relation"] || JSON.parse(JSON.stringify(commonConstant.relationDeafult));
        // 总映射关系
        let totalRelation = relationObj["total"]

        // 设置临时参数
        commonStorage.put("notNeedConvert", pageSetingObj["notNeedConvert"] ? true : false)

        let curSettingKey = "【" + settingKey + "】"
        // 总匹配数量
        let mathchingCount = 0;
        try {
            // 文字识别结果
            let analysisChartResult = utilsObj.matchingAnalysisChart(totalRelation, relationObj["analysisChart"], pageSetingObj["analysisChart"], allScreenImg)
            if (analysisChartResult) {
                mathchingCount += 1
                if ("or" === totalRelation) {
                    return true;
                }
            }

            // 多点找色结果
            let multipleColorResult = utilsObj.matchingMultipleColor(totalRelation, relationObj["multipleColor"], pageSetingObj["multipleColor"], allScreenImg)
            if (multipleColorResult) {
                mathchingCount += 1
                if ("or" === totalRelation) {
                    return true;
                }
            }

            // 区域找图结果(区域特征匹配)
            let multipleImgResult = utilsObj.matchingRegionalFindImg(totalRelation, relationObj["multipleImg"], pageSetingObj["multipleImg"], allScreenImg)
            if (multipleImgResult) {
                mathchingCount += 1
                if ("or" === totalRelation) {
                    return true;
                }
            }

            if ("and" === totalRelation && mathchingCount === 3 && commonStorage.get("debugModel")) {
                console.verbose("总:" + curSettingKey + "匹配成功")
            }
        } catch (error) {
            console.error("多条件匹配错误", error)
            // 清除临时参数
            commonStorage.remove("notNeedConvert")
        }
        // 清除临时参数
        commonStorage.remove("notNeedConvert")
        // 总映射关系为且时 总匹配数量为3 为true 否则为 false
        return "and" === totalRelation && mathchingCount === 3
    })
    // 回收图片
    utilsObj.recycleNull(allScreenImg);
    console.info("当前页:【" + (firstMatchingPageKey || "无匹配") + "】")
	commonStorage.remove("closeFeatures")
    return firstMatchingPageKey || ""
}


// 匹配区域找图(区域特征匹配)
utilsObj.matchingRegionalFindImg = (totalRelation, relation, multipleImgArr, img) => {
    // 匹配数量
    let matchingCount = 0;
    if (!multipleImgArr || !multipleImgArr.length) {
        // 总映射关系为且时，匹配条件为空，默认为true     总映射关系为或时，匹配条件为空，默认为false
        return totalRelation === "and";
    }

    for (let i = 0; i < multipleImgArr.length; i++) {
        let item = multipleImgArr[i]
        // 获取坐标
        let position = item["position"]
        // 获取阈值
        let threshold = item["threshold"] || 100
        // 获取最大值
        let maxVal = item["maxVal"] || 255
        // 颜色值
        let color = item["color"]
        // 图片相似度
        let imgThreshold = item["imgThreshold"]
        // 文件路径
        let pathName = item["pathName"]
        // 是否开启灰度化
        let isOpenGray = item["isOpenGray"] === 1
        // 是否开启阈值化
        let isOpenThreshold = item["isOpenThreshold"] === 1

        // 大图缩放[0.1-1]
        let bigScale = item["bigScale"] || 1
        // 小图缩放[0.1-1]
        let smallScale = item["smallScale"] || 1
        // 特征相似度
        let featuresThreshold = item["featuresThreshold"] || 0.8

        // 绘图信息
        let canvasMsg = item["canvasMsg"] || ""

        // 读取目标图片
        let targetImg = images.read(pathName);
        // 区域找图或者找特征
        let p = utilsObj.regionalFindImgOrFeatures(img, targetImg, position[0], position[1], position[2], position[3], threshold, maxVal, imgThreshold, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
        // 回收图片
        utilsObj.recycleNull(targetImg);
        // 找到了图片(特征)
        if (p && p.x != -1) {
            // 累计匹配数量
            matchingCount += 1
            // 或者关系
            if ("or" === relation) {
                // 跳出循环
                break;
            }
        }
    }
    // 并且关系
    if ("and" === relation) {
        return multipleImgArr.length === matchingCount
        // 或者关系
    } else if ("or" === relation) {
        return matchingCount >= 1
    } else {
        return false;
    }
}

// 匹配多点找色
utilsObj.matchingMultipleColor = (totalRelation, relation, multipleColorArr, img) => {
    // 匹配数量
    let matchingCount = 0;
    if (!multipleColorArr || !multipleColorArr.length) {
        // 总映射关系为且时，匹配条件为空，默认为true     总映射关系为或时，匹配条件为空，默认为false
        return totalRelation === "and";
    }
    for (let i = 0; i < multipleColorArr.length; i++) {
        let item = multipleColorArr[i]
        // 获取坐标
        let position = item["position"]
        // 获取阈值
        let threshold = item["threshold"] || 100
        // 获取最大值
        let maxVal = item["maxVal"] || 255
        // 颜色值
        let color = item["color"]
        // 颜色阈值
        let colorThreshold = item["colorThreshold"]
        // 颜色其他项
        let colorOther = item["colorOther"]
        // 是否开启灰度化
        let isOpenGray = item["isOpenGray"] === 1
        // 是否开启阈值化
        let isOpenThreshold = item["isOpenThreshold"] === 1
        // 绘图信息
        let canvasMsg = item["canvasMsg"] || ""

        // 灰度化、阈值化区域多点找色
        let p = utilsObj.regionalFindMultipleColor2(img, position[0], position[1], position[2], position[3], threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold, canvasMsg)

        // 找到了颜色
        if (p && p.x != -1) {
            // 累计匹配数量
            matchingCount += 1
            // 或者关系
            if ("or" === relation) {
                // 跳出循环
                break;
            }
        }
    }
    // 并且关系
    if ("and" === relation) {
        return multipleColorArr.length === matchingCount
        // 或者关系
    } else if ("or" === relation) {
        return matchingCount >= 1
    } else {
        return false;
    }
}

// 匹配文字识别条件
utilsObj.matchingAnalysisChart = (totalRelation, relation, analysisChartArr, img) => {
    // 匹配数量
    let matchingCount = 0;
    if (!analysisChartArr || !analysisChartArr.length) {
        // 总映射关系为且时，匹配条件为空，默认为true     总映射关系为或时，匹配条件为空，默认为false
        return totalRelation === "and";
    }
    for (let i = 0; i < analysisChartArr.length; i++) {
        let item = analysisChartArr[i]
        // 获取坐标
        let position = item["position"]
        // 获取匹配内容
        let matchingContext = item["context"]
        // 获取阈值
        let threshold = item["threshold"] || 100
        // 获取最大值
        let maxVal = item["maxVal"] || 255
        // 匹配类型
        let matchingType = item["matchingType"] || "contains"
        // 绘图信息
        let canvasMsg = item["canvasMsg"] || ""
        // 是否开启灰度化
        let isOpenGray = item["isOpenGray"] === 1
        // 是否开启阈值化
        let isOpenThreshold = item["isOpenThreshold"] === 1


        if (commonStorage.get('debugModel')) {
            console.log("【OCR目标值】", matchingContext)
        }
        // 灰度化、阈值化区域识别文字
        let resultContent = utilsObj.regionalAnalysisChart2(img, position[0], position[1], position[2], position[3], threshold, maxVal, isOpenGray, isOpenThreshold, canvasMsg)
        // 包含 或者 相等
        if ((matchingType === "contains" && resultContent.indexOf(matchingContext) !== -1) || (matchingType === "equals" && resultContent === matchingContext)) {
            // 累计匹配数量
            matchingCount += 1
            // 或者关系
            if ("or" === relation) {
                // 跳出循环
                break;
            }
        }
    }
    // 并且关系
    if ("and" === relation) {
        return analysisChartArr.length === matchingCount
        // 或者关系
    } else if ("or" === relation) {
        return matchingCount >= 1
    } else {
        return false;
    }
}



/**
 * 获取业务操作参数
 * @param {*} pageName 页面名称
 * @param {*} operateSymbol 操作标志
 */
utilsObj.getServiceOperateParam = (pageName, operateSymbol) => {
    // 获取页面参数
    let pageParam = commonConstant.serviceOperateParam[pageName];
    // 获取业务参数
    let serviceParam = pageParam ? pageParam[operateSymbol] : null
    // 未取到业务参数直接返回
    if (!serviceParam) {
        return null;
    }
    // 获取分辨率对应的值
    let serviceParamObj = serviceParam[device.width + "_" + device.height]

    let notNeedConvert = false;
    // 如果当前不是标准的分辨率 且获取到了特定的分辨率的配置
    if (!utilsObj.getIsStandard() && serviceParamObj) {
        notNeedConvert = true;
    }
    // 未适配当前设备 则读取标准的
    serviceParamObj = serviceParamObj || serviceParam[commonStorage.get('standardWidth') + "_" + commonStorage.get('standardHeight')]
    serviceParamObj.notNeedConvert = notNeedConvert;
    return serviceParamObj;
}
/**
 * 执行业务操作
 * @param {*} pageName 页面名称
 * @param {*} operateSymbol 操作标志
 * @param {*} functionName 方法名称
 * @param {*} successCall 回调函数
 * @param {*} extendParam 拓展参数
 */
utilsObj.executeServiceOperate = (pageName, operateSymbol, functionName, successCall, extendParam) => {
    // 获取业务参数对象
    let serviceOperateParam = utilsObj.getServiceOperateParam(pageName, operateSymbol);
    if (!serviceOperateParam) {
        // 未获取到直接返回
        return;
    }
    // 截全屏
    let img = captureScreen();

    if (extendParam) {
        Object.assign(serviceOperateParam, extendParam);
    }
    // 设置临时参数
    commonStorage.put("notNeedConvert", serviceOperateParam.notNeedConvert ? true : false)

    // 解构参数
    let { position, context, threshold, maxVal, pathName, imgThreshold, color, colorOther, colorThreshold, matchingCount, transparentMask, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg, openSplit } = serviceOperateParam

    let x1 = position[0];
    let y1 = position[1];
    let x2 = position[2];
    let y2 = position[3];
    let matchingImgPath = pathName;
    let matchingContent = context;
    // 读取图片
    let targetImg = null;

    // 结果
    let result;

    // 根据方法名执行参数
    switch (functionName) {
        // 区域找图
        case "regionalFindImg2":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 	区域找图点击
        case "regionalClickImg2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingImgPath, imgThreshold, isOpenGray, isOpenThreshold, successCall);
            break;
        // 区域文字识别	
        case "regionalAnalysisChart2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 区域文字识别返回对象数组	
        case "regionalAnalysisChart3":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 	区域文字识别获取坐标
        case "regionalAnalysisChartPosition2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, openSplit);
            break;
        // 	区域文字识别点击
        case "regionalClickText2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, successCall);
            break;
        // 	区域文字识别点击 支持多条件匹配
        case "regionalClickText3":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, successCall);
            break;
        // 	区域匹配图片
        case "regionalMatchTemplate2":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingCount, transparentMask, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 	区域特征匹配
        case "regionalMatchingFeatures":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 	区域匹配特征
        case "regionalMatchFeaturesTemplate":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount, canvasMsg);
            break;
        // 	区域多点找色
        case "regionalFindMultipleColor2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 	区域多点找色点击
        case "regionalClickColor2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold, successCall);
            break;
        // 	区域找图或者特征匹配
        case "regionalFindImgOrFeatures":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 	区域匹配图片或者特征
        case "regionalMatchTemplateOrMatchFeatures":
            targetImg = images.read(pathName);
            result = utilsObj[functionName](img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
            break;
        // 	区域找圆
        case "regionalFindCircles2":
            result = utilsObj[functionName](img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold);
            break;
        default:
    }
    utilsObj.recycleNull(targetImg);
    // 回收图片
    utilsObj.recycleNull(img);
    // 清除临时参数
    commonStorage.remove("notNeedConvert")
    return result;
}

/**
 * 自定义消息气泡
 * @param {*} msg 
 */
utilsObj.toast = (msg) => {
    if (!toastCustom) {
        toastCustom = new Toast(context);
    }
    if (!view) {
        view = Toast.makeText(context, msg, Toast.LENGTH_SHORT).getView();
    }
    toastCustom.setView(view);
    toastCustom.setText(msg);
    toastCustom.setDuration(200);
    toastCustom.show();
}

/**
 * 获取内存
 * @returns 
 */
utilsObj.getMemoryInfo = () => {
    /*  let runtime = java.lang.Runtime.getRuntime();
     let maxMemory = runtime.maxMemory() / 1024 / 1024; // 能从操作系统那里挖到的最大的内存 单位字节Byte 536870912B === 512MB
     let totalMemory = runtime.totalMemory() / 1024 / 1024; // 已经从操作系统那里挖过来的内存大小, 慢慢挖, 用多少挖多少
     let freeMemory = runtime.freeMemory() / 1024 / 1024; // 挖过来而又没有用上的内存, 一般情况下都是很小
 
     /*   var sh = new Shell(true);
       let packName = commonStorage.get('curAppPackage')
       console.log(packName)
       sh.exec("dumpsys meminfo "+packName);
       sh.setCallback({
           onNewLine: function(line){
               //有新的一行输出时打印到控制台
               log(line);
           }
       })
       sh.exitAndWaitFor()
       sh.exit(); */
    /*  return "最大内存：" + Number(maxMemory).toFixed(2) + "MB,已用内存" + Number(totalMemory).toFixed(2) + "MB,占用" + (Number(totalMemory / maxMemory) * 100).toFixed(2) + "%"; */
    let actManager = context.getSystemService(context.ACTIVITY_SERVICE);
    let memInfo = new ActivityManager.MemoryInfo();
    actManager.getMemoryInfo(memInfo);
    let totalMemory = memInfo.totalMem;
    let availMemory = memInfo.availMem;
    let usedMemory = totalMemory - availMemory;
    let precentlong = (usedMemory / totalMemory) * 100;

    totalMemory = parseInt(totalMemory / 1024 / 1024);
    availMemory = parseInt(availMemory / 1024 / 1024);
    usedMemory = parseInt(usedMemory / 1024 / 1024);
    precentlong = parseInt(precentlong);
    return "【内存】\r\n总共: " + totalMemory + " MB\r\n" + "已用: " + usedMemory + " MB\r\n" + "可用: " + availMemory + " MB\r\n" + "百分比: " + precentlong + "%";
}

// 获取监控信息
utilsObj.getMonitorInfo = () => {
    let cpu核心 = utilsObj.getCpuCoreCount()
    let cpu占有率 = utilsObj.getCpuPercentage()
    let cpu温度 = utilsObj.getCpuTemperature()
    let gpu温度 = utilsObj.getGpuTemperature()
    let 内存情况 = utilsObj.getMemoryInfo()
    let messageInfo = "【CPU】\r\n"
        + "核心：" + cpu核心 + "核" + "\r\n"
        + "占有率：" + cpu占有率 + "\r\n"
        + "温度：" + cpu温度 + "\r\n"
        + "【GPU】\r\n"
        + "温度：" + gpu温度 + "\r\n"
        + 内存情况
    return messageInfo
}

/**
 * 清理内存
 */
utilsObj.clearMemory = () => {
    //let javaRuntime = java.lang.Runtime.getRuntime();
    //javaRuntime.gc();
    runtime.gc();
}

/**
 * 退出app
 * @param {} appName 
 */
utilsObj.exitApp = (appName, callback) => {
    // 根据应用名称获取包名
    let packageName = app.getPackageName(appName)
    // 打开应用设置
    app.openAppSetting(packageName);
    text(app.getAppName(packageName)).waitFor();
    let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*结束运行.*)/).findOne();
    if (is_sure.enabled()) {
        if (is_sure.clickable()) {
            is_sure.click()
        } else {
            is_sure.clickCenter()
        }
        textMatches(/(.*确.*|.*定.*)/).findOne().click();
        console.log(app.getAppName(packageName) + "应用已被关闭");
        sleep(1000);
        back();
        sleep(1000);
        if (callback) {
            callback()
        }
    } else {
        log(app.getAppName(packageName) + "应用不能被正常关闭或不在后台运行");
        back();
        sleep(1000);
        if (callback) {
            callback()
        }
    }
}

/**
 * 创建排序方法
 * @param {Array} array 原数组
 * @param {String} key 排序key
 * @param {Boolean} order 排序方法 true正序 false倒序
 * @returns 
 */
utilsObj.sortByKey = (array, key, order) => {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key]
        if (order) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        } else {
            return ((x < y) ? ((x > y) ? 1 : 0) : -1)
        }
    })
}

/**
 * 数字转汉字
 * @param {*} numberVal 
 * @returns 
 */
utilsObj.convertNumberToChart = (numberVal) => {
    if (Number(numberVal) === 1) {
        return "一"
    } else if (Number(numberVal) === 2) {
        return "二"
    } else if (Number(numberVal) === 3) {
        return "三"
    } else if (Number(numberVal) === 4) {
        return "四"
    } else if (Number(numberVal) === 5) {
        return "五"
    } else if (Number(numberVal) === 6) {
        return "六"
    }
}


/**
 * 汉字转数字
 * @param {*} chartVal 
 * @returns 
 */
utilsObj.convertChartToNumber = (chartVal) => {
    if (String(chartVal) === "一") {
        return 1
    } else if (String(chartVal) === "二") {
        return 2
    } else if (String(chartVal) === "三") {
        return 3
    } else if (String(chartVal) === "四") {
        return 4
    } else if (String(chartVal) === "五") {
        return 5
    } else if (String(chartVal) === "六") {
        return 6
    }
}

/**
 * 数组includes 包含
 * @param {*} arr 
 * @param {*} val 
 */
utilsObj.includesContains = (arr, val) => {
    let isIncludes = false
    for (let i = 0; i < arr.length; i++) {
        let key = arr[i]
        if (val.indexOf(key) !== -1) {
            isIncludes = true;
            break;
        }
    }
    return isIncludes;
}

/**
 * http请求
 * @param {*} url 请求地址
 * @param {*} requestMethod 请求方法
 * @param {*} requestBody 消息体
 * @param {*} callback 回调函数
 */
utilsObj.request = (url, requestMethod, requestBody, callback) => {
    // GET-键值对 POST-JSON
    let contentType = requestMethod === "GET" ? "application/x-www-form-urlencoded" : 'application/json'
    http.request(config.getHttpBaseUrl() + url, {
        headers: {
            "deviceUUID": deviceUUID
        },
        method: requestMethod,
        contentType: contentType,
        body: requestBody
    }, callback);
}


/**
 * 上传本地文件到服务器
 * @param {String} localPath 本地文件路径
 * @param {String} fileName 文件名称
 * @param {Function} callback 回调函数
 */
utilsObj.uploadFileToServer = (localPath, fileName, callback) => {
    http.postMultipart(config.getHttpBaseUrl() + "/attachmentInfo/uploadFileToAutoJs", {
        file: open(localPath),
        imageName: fileName
    }, null, (res, error) => {
        if (!res) {
            console.error("上传文件到服务器错误", error)
            return;
        }
        let data = res.body.json()

        if (res) {
            if (callback) {
                callback(config.getHttpBaseUrl() + "/" + data.data)
            }
        } else {
            console.error("上传文件到服务器错误", error)
            if (callback) {
                callback()
            }
        }
    });
}



/**
 * 远程裁图灰度化阈值化并上传到服务端
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} localImageName  要保存的本地图片名称
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @returns {String} remoteImageUrl 远程图片地址
 */
utilsObj.remoteClipGrayscaleAndThresholdToServer = (x1, y1, x2, y2, threshold, maxVal, localImageName, isOpenGray, isOpenThreshold) => {
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 调用本地裁剪以及灰度化阈值化处理图片方法  返回本地图片路径
    let localPathName = utilsObj.generateClipImgGrayThresholdToLocal(xy1["x"], xy1["y"], xy2["x"], xy2["y"], threshold, maxVal, localImageName, isOpenGray, isOpenThreshold)
    if (commonStorage.get("debugModel")) {
        console.log("生成本地路径" + localPathName)
    }
    // 调用远程上传文件方法
    utilsObj.uploadFileToServer(localPathName, deviceUUID + "/" + localImageName, (remoteImageURL) => {
        if (commonStorage.get("debugModel")) {
            console.log("远程图片地址：" + remoteImageURL)
        }
    })
}


/**
 * 远程裁图灰度化阈值化文字识别并上传到服务端
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 */
utilsObj.remoteClipGrayscaleAndThresholdAnalysisChartToServer = (x1, y1, x2, y2, threshold, maxVal, localImageName, isOpenGray, isOpenThreshold) => {
    // 初始化、
    utilsObj.initOcr(curOcrName);
    // 截图全屏
    let img = captureScreen();
    // 调用本地裁剪 已经灰度化阈值化处理图片方法 并进行文字识别canvas重绘  返回本地图片路径
    let localPathName = utilsObj.regionalAnalysisChartToCanvasImg(img, x1, y1, x2, y2, threshold, maxVal, localImageName, isOpenGray, isOpenThreshold);
    if (commonStorage.get("debugModel")) {
        console.log("生成本地路径" + localPathName)
    }
    utilsObj.recycleNull(img);
    // 调用远程上传文件方法
    utilsObj.uploadFileToServer(localPathName, deviceUUID + "/" + localImageName, (remoteImageURL) => {
        if (commonStorage.get("debugModel")) {
            console.log("远程图片地址：" + remoteImageURL)
        }
    })
    sleep(2000)
}


/**
 * 远程执行脚本
 * @param {脚本内容} scriptText 
 */
utilsObj.remoteExecScript = (scriptText) => {
    try {
        // 解码
        scriptText = decodeURIComponent(scriptText)
        let showRemtoeExecScriptContent = commonStorage.get("showRemtoeExecScriptContent") || false
        if (commonStorage.get("debugModel") && showRemtoeExecScriptContent) {
            console.log("远程脚本内容：" + scriptText)
        }
        eval(scriptText)
        if (commonStorage.get("debugModel") && showRemtoeExecScriptContent) {
            console.log("远程执行脚本完成")
        }
    } catch (error) {
        console.error("远程执行脚本错误：", error)
    }
}



/**
 * 远程上传日志到服务器
 * @param {*} logName 日志名称
 */
utilsObj.remoteUploadLogToServer = (logName) => {
    let localPathName = "/sdcard/autoJsToolsLog/" + logName
    // 调用远程上传文件方法
    utilsObj.uploadFileToServer(localPathName, deviceUUID + "/" + logName, (remoteImageURL) => {
        if (commonStorage.get("debugModel")) {
            console.log("远程日志地址：" + remoteImageURL)
        }
    })
}

/**
 * 远程重启脚本
 * @param {*} restartType 重启类型 script mainScript
 */
utilsObj.remoteRestartScript = (restartType) => {
    if (commonStorage.get("debugModel")) {
        console.log("执行远程重启脚本：", restartType)
    }
    events.broadcast.emit("restartScript", restartType);
}



/**
 * 远程处理操作
 * @param {String} message base64加密后的json字符串
 */
utilsObj.remoteHandler = (message) => {
    // 解密后字符串
    let decodeAftrJson = $base64.decode(message)
    // json字符串转换js对象
    let operateObj = null;
    try {
        // 尝试直接解析json
        operateObj = JSON.parse(decodeAftrJson)
    } catch (error) {
        // 如果失败 则尝试解码字符串后
        decodeAftrJson = decodeURIComponent(decodeAftrJson);
        // 再解析json
        operateObj = JSON.parse(decodeAftrJson)
    }
    // 调用方法名称
    let functionName = operateObj.functionName
    // 方法参数 例如：[1,2,3]
    let functionParam = operateObj.functionParam
    let showRemtoeExecScriptContent = commonStorage.get("showRemtoeExecScriptContent") || false
    if (commonStorage.get("debugModel") && showRemtoeExecScriptContent) {
        // 日志
        console.log("远程执行方法", functionName, functionParam)
    }
    threads.start(() => {
        if (['remoteClipGrayscaleAndThresholdToServer', 'remoteClipGrayscaleAndThresholdAnalysisChartToServer'].includes(functionName)) {
            // 唤醒设备
			device.wakeUpIfNeeded();
             // 申请 截图权限
            utilsObj.requestScreenCaptureCommonFun(()=>{
                // 调用方法
                utilsObj[functionName].apply(utilsObj, functionParam)
            })
        } else {
            // 调用方法
            utilsObj[functionName].apply(utilsObj, functionParam)
        }
    })
}

/**
 * 获取转换系数
 */
utilsObj.getConvertCoefficient = () => {
    // 设置了无需坐标转换
    if (commonStorage.get("notNeedConvert")) {
        return {
            x: 1,
            y: 1
        }
    }
    // 获取设备配置的分辨率
    let curScreenWith = device.width
    let curScreenHeight = device.height
    // x系数、
    let xCoefficient = curScreenHeight / utilsObj.getScreenHeight()
    // y系数
    let yCoefficient = curScreenWith / utilsObj.getScreenWidth()

    // 竖屏模式 切换转换系数
    if (utilsObj.getOrientation() === 1) {
        xCoefficient = curScreenWith / utilsObj.getScreenWidth()
        yCoefficient = curScreenHeight / utilsObj.getScreenHeight()
    }
    return {
        x: xCoefficient,
        y: yCoefficient
    }
}

/**
 * 获取缩放小图转换系数
 */
 utilsObj.getConvertSmartScalCoefficient = () => {
    // 设置了无需坐标转换
   if (commonStorage.get("notNeedConvert")) {
       return {
           x: 1,
           y: 1
       }
   }
   // 获取设备配置的分辨率
   let curScreenWith = device.width
   let curScreenHeight = device.height
   // x系数
   let xCoefficient = curScreenHeight / utilsObj.getScreenHeight()
   // y系数
   let yCoefficient = xCoefficient

   // 竖屏模式 切换转换系数
   if (utilsObj.getOrientation() === 1) {
       xCoefficient = curScreenWith / utilsObj.getScreenWidth()
       yCoefficient = xCoefficient;
   }
   return {
       x: xCoefficient,
       y: yCoefficient
   }
}



/**
 * 转换兼容分辨率坐标
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @returns 
 */
utilsObj.convertCompatible = (x1, y1, x2, y2) => {
    let convertResult = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
    }
    // x轴最大值  竖屏为宽度  横屏为高度
    let xMax = utilsObj.getOrientation() === 1 ? utilsObj.getScreenWidth() : utilsObj.getScreenHeight()
    // y轴最大值  竖屏为高度 横屏为宽度
    let yMax = utilsObj.getOrientation() === 1 ? utilsObj.getScreenHeight() : utilsObj.getScreenWidth()
    let x偏移系数 = commonStorage.get("x偏移系数") || 0
    let y偏移系数 = commonStorage.get("y偏移系数") || 0
    // 变化值
    let widthChangeVal = (xMax / 2) * (x偏移系数 / 100)
    let heightChangeVal = (yMax / 2) * (y偏移系数 / 100)
    if (!utilsObj.getIsStandard()) {
        // x轴变化值
        let xChange = widthChangeVal
        // y轴变化值
        let yChange = heightChangeVal
        // 坐标1的x轴 减少一个值 最小为0
        if (x1 < xChange) {
            convertResult.x1 = 0
        } else {
            convertResult.x1 = x1 - xChange
        }

        // 坐标1的y轴 减少一个值 最小为0
        if (y1 < yChange) {
            convertResult.y1 = 0
        } else {
            convertResult.y1 = y1 - yChange
        }

        // 坐标2的x轴 加上一个值 最大为x轴最大值
        if (xMax - x2 < xChange) {
            convertResult.x2 = xMax
        } else {
            convertResult.x2 = x2 + xChange
        }

        // 坐标2的y轴 加上一个值 最大为y轴最大值
        if (yMax - y2 < yChange) {
            convertResult.y2 = yMax
        } else {
            convertResult.y2 = y2 + yChange
        }
    }
    return convertResult;
}


/**
 * 缩放小图
 * @param {*} targetImg 
 * @returns 
 */
utilsObj.scaleSmallImg = (targetImg) => {
    // 非标准分辨率 压缩小图
    if (!utilsObj.getIsStandard()) {
        // 获取转换系数
        let coefficient = utilsObj.getConvertSmartScalCoefficient();
        // 缩放图片  非游戏界面 可以横屏竖屏转换  缩放比例时会 报错
        let smallTargetImg = images.scale(targetImg, coefficient.x, coefficient.y);
        // 回收图片
        return smallTargetImg;
    }
    // 返回复制的图片
    return images.copy(targetImg)

    /*  // 目录
         files.createWithDirs("/sdcard/autoJsAfterImg/")
         // 临时图片路径 
         let tempImgPath = "/sdcard/autoJsAfterImg/tempImg" + new Date().getTime() + ".png"
         // 保存临时图片
         images.save(smallTargetImg, tempImgPath, "png", 100);
         utilsObj.recycleNull(smallTargetImg);
         // 读取图片
         smallTargetImg = images.read(tempImgPath);
         files.remove(tempImgPath); */
}

/**
 * 转换坐标
 * @desc 用于转换不同分辨率下的x y值
 * @param {int} x 当前x坐标
 * @param {int} y 当前y坐标
 * @param {String} location 坐标位置
 * @returns {x:int,y:int} 转换后的坐标
 */
utilsObj.convertXY = (x, y, location) => {
     // x轴最大值  竖屏为宽度  横屏为高度
     let xMax = utilsObj.getOrientation() === 1 ? device.width : device.height
     // y轴最大值  竖屏为高度 横屏为宽度
     let yMax = utilsObj.getOrientation() === 1 ? device.height : device.width
    // 超界限处理
    let overHandler = (result)=>{
        if(Number(result.x) < 0){
            result.x = 0
        }
        if(Number(result.y) < 0){
            result.y = 0
        }
        if(Number(result.x) > Number(xMax)){
            result.x = Number(xMax)
        }
        if(Number(result.y) > Number(yMax)){
            result.y = Number(yMax)
        }
        return result;
    }

    let cofficient = utilsObj.getConvertCoefficient();
    let result = { x: Math.round(x * cofficient.x), y: Math.round(y * cofficient.y) }
    // 标准分辨率下 或者设置了无需转换标识的 直接返回
    if (utilsObj.getIsStandard() || commonStorage.get("notNeedConvert")) {
        return overHandler(result);
    }
    // 获取坐标偏移系数
    /*    let positionOffset = commonConstant.positionOffset[device.width + "_" + device.height]
       if (!positionOffset) {
           // 如果当前设备分辨率对应的偏移系数未设置 则取标准的
           positionOffset = commonConstant.positionOffset[config.screenWidth + "_" + config.screenHeight]
       }
    */
    let x偏移系数 = commonStorage.get("x偏移系数") || 0
    let y偏移系数 = commonStorage.get("y偏移系数") || 0
    // 变化值
    let widthChangeVal = (xMax / 2) * (x偏移系数 / 100)
    let heightChangeVal = (yMax / 2) * (y偏移系数 / 100)

    // 左上角的点
    if (location === "leftTop") {
        // x轴变化值
        let xChange = widthChangeVal
        // y轴变化值
        let yChange = heightChangeVal
        // 坐标1的x轴 减少一个值 最小为0
        if (result.x < xChange) {
            result.x = 0
        } else {
            result.x = result.x - xChange
        }

        // 坐标1的y轴 减少一个值 最小为0
        if (result.y < yChange) {
            result.y = 0
        } else {
            result.y = result.y - yChange
        }
    }

    // 右下角的点
    if (location === "rightBottom") {
        // x轴变化值
        let xChange = widthChangeVal
        // y轴变化值
        let yChange = heightChangeVal
        // 坐标2的x轴 加上一个值 最大为x轴最大值
        if (xMax - result.x < xChange) {
            result.x = xMax
        } else {
            result.x = result.x + xChange
        }

        // 坐标2的y轴 加上一个值 最大为y轴最大值
        if (yMax - result.y < yChange) {
            result.y = yMax
        } else {
            result.y = result.y + yChange
        }
    }
    return overHandler(result);
}

/* 
utilsObj.testYBjz = (isLocalImage, pathName, x1, y1, x2, y2, threadshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold) => {
    console.log("开始执行")
    // 截全屏
    let img = captureScreen();
    // 读取图片
    let targetImg = isLocalImage ? images.read(pathName) : images.load(pathName);
    // 特征匹配
    let result = utilsObj.regionalMatchingFeatures(img, targetImg, x1, y1, x2, y2, threadshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, "测试特征")
    toastLog(JSON.stringify(result));
    utilsObj.recycleNull(img);
    utilsObj.recycleNull(targetImg);
    console.log("结束执行")
}


utilsObj.test2 = (pathName, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount) => {
    console.log("开始执行")
    // 截全屏
    let img = captureScreen();
    // 读取图片
    let targetImg = utilsObj.includesContains(['http:', 'https:'], pathName) ? images.load(pathName) : images.read(pathName)
    let resultArr = utilsObj.regionalMatchFeaturesTemplate(img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount, "测试多图特征")
    toastLog(resultArr.length);
    utilsObj.recycleNull(img);
    utilsObj.recycleNull(targetImg);
    console.log("结束执行")
} */

/**
 * 图片进行特征匹配
 * @param {Image} bigImg 大图
 * @param {Image} smallImg 小图
 * @param {float} bigScale 大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @returns 返回匹配结果
 */
utilsObj.detectFeaturesScale = (bigImg, smallImg, bigScale, smallScale, featuresThreshold) => {
    let start = Date.now();
    // 大图特征
    let bigFeautres = images.detectAndComputeFeatures(bigImg, { scale: bigScale })
    // 小图特征
    let smallFeatures = images.detectAndComputeFeatures(smallImg, { scale: smallScale })
    // 特征匹配  , 
    // let drawMatches = "/sdcard/autoJsAfterImg/tempImg2_" + new Date().getTime() + ".png"
    let result = images.matchFeatures(bigFeautres, smallFeatures, { thredshold: featuresThreshold })
    let end = Date.now()
    // 回收特征
    utilsObj.recycleNull(smallFeatures)
    utilsObj.recycleNull(bigFeautres)
    // 控制台是否打印识图结果
    if (commonStorage.get("debugModel")) {
        console.log(`【特征匹配耗时:】 ${end - start}ms`);
        console.info("")
    }
    return result;
}

/**
 * 灰度化阈值化特征匹配
 * @param {Image} bigImg 大图
 * @param {Image} smallImg 小图
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制信息
 * @returns 返回中心坐标
 */
utilsObj.matchingFeatures = (bigImg, smallImg, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg) => {
    let position = {
        x: -1,
        y: -1,
        frame: null
    }
    // 校验图片尺寸
    let isOverSize = utilsObj.bigSmallSizeValid(bigImg, smallImg, "特征匹配")
    if (isOverSize) {
        return position;
    }

    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 大图 灰度化、阈值化 
    let bigImgAfter = utilsObj.grayscaleAndThreshold2(bigImg, threshold, maxVal, isOpenGray, isOpenThreshold);

    // 临时图片路径 
    let tempImgPath1 = "/sdcard/autoJsAfterImg/tempImg1_" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(bigImgAfter, tempImgPath1, "png", 100);
    utilsObj.recycleNull(bigImgAfter);

    // 小图 灰度化、阈值化 
    let smallImgAfter = utilsObj.grayscaleAndThreshold2(smallImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 临时图片路径 
    let tempImgPath2 = "/sdcard/autoJsAfterImg/tempImg2_" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(smallImgAfter, tempImgPath2, "png", 100);
    utilsObj.recycleNull(smallImgAfter);
    // 读取临时图片
    let tempImg1 = images.read(tempImgPath1)
    // 读取临时图片
    let tempImg2 = images.read(tempImgPath2)

    // 特征匹配
    let result = utilsObj.detectFeaturesScale(tempImg1, tempImg2, bigScale, smallScale, featuresThreshold);
    if (result) {
        position.x = result.centerX
        position.y = result.centerY
        position.frame = result
    }
    utilsObj.recycleNull(tempImg1);
    utilsObj.recycleNull(tempImg2);
    // 删除临时图片
    files.remove(tempImgPath1)
    // 删除临时图片
    files.remove(tempImgPath2)
    return position;
}


/**
 * 图片大小尺寸校验
 * @param {*} bigImg 
 * @param {*} smallImg 
 * @param {*} serviceType 业务类型
 */
utilsObj.bigSmallSizeValid = (bigImg, smallImg, serviceType) => {
    let isOverSize = false;
    // 图片超范围
    if (smallImg.width > bigImg.width || smallImg.height > bigImg.height) {
        // 控制台是否打印识图结果
        if (commonStorage.get("debugModel")) {
            console.info("【" + serviceType + "】" + "小图大小超过大图")
            console.info("")
        }
        isOverSize = true;
    }
    return isOverSize;
}


/**
 * 区域特征匹配
 * @param {Image} img 大图
 * @param {Image} targetImg 小图
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制信息
 * @returns 
 */
utilsObj.regionalMatchingFeatures = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")

    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 缩放小图
    let smallTargetImg = utilsObj.scaleSmallImg(targetImg);

    let result = {
        "x": -1,
        "y": -1,
        "frame": null,
        "convertAfterXy1": xy1,
        "convertAfterXy2": xy2
    }

    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "img", "【特征匹配目标区域】" + (canvasMsg || ""));

    // 调用灰度化阈值化特征匹配
    let findResult = utilsObj.matchingFeatures(clipImg, smallTargetImg, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    result = {
        "x": findResult.x !== -1 ? (xy1["x"] + findResult["x"]) : -1,
        "y": findResult.x !== -1 ? (xy1["y"] + findResult["y"]) : -1,
        "frame": findResult.x !== -1 ? (findResult["frame"]) : null,
        "convertAfterXy1": xy1,
        "convertAfterXy2": xy2
    }
    // 控制台是否打印识图结果
    if (commonStorage.get("debugModel")) {
        console.info("【特征匹配】" + (canvasMsg || "") + (Number(result.x) === -1 ? "【未找到】" : "【已找到】"))
        console.info("")
    }
    if (result.x !== -1) {
        // 绘制方框
        utilsObj.canvasRect((xy1["x"] + findResult["frame"].topLeft.x), (xy1["y"] + findResult["frame"].topLeft.y), (xy1["x"] + findResult["frame"].bottomRight.x), (xy1["y"] + findResult["frame"].bottomRight.y), "img", "【特征匹配已找到】" + (canvasMsg || ""));
    }
    utilsObj.recycleNull(smallTargetImg);
    // 绘制方框
    //utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "img", "【特征匹配结果】" + (canvasMsg || "") + (result.x === -1 ? "【未找到】" : "【已找到】"));
    // 返回基于大图的坐标
    return result;
}


/**
 * 区域特征匹配模板图片
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找目标图片,并返回基于大图的匹配结果,传入回调函数处理结果
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象 
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制信息
 * @return frameArr
 */
utilsObj.regionalMatchFeaturesTemplate = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount, canvasMsg) => {
    // 结果四边形数组
    let frameArr = []
    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 临时图片路径 
    let tempImgPath1 = "/sdcard/autoJsAfterImg/tempImg1_" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(img, tempImgPath1, "png", 100);
    // 遍历匹配数量
    for (let i = 0; i < matchingCount; i++) {
        // 初次匹配图片
        let bigImg = images.read(tempImgPath1);
        // 进行一次匹配
        let objResult = utilsObj.regionalMatchingFeatures(bigImg, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg)
        // 已有匹配结果
        if (objResult && objResult.x !== -1) {
            // 记录四边形对象
            frameArr.push(objResult);
            let frame = objResult.frame;
            // 转换后的xy1坐标
            let convertAfterXy1 = objResult.convertAfterXy1
            // 回收大图
            utilsObj.recycleNull(bigImg);
            let bigImg2 = images.read(tempImgPath1);
            // 创建canvas读取图片
            let canvas = new Canvas(bigImg2);
            let rectanglePaint = new Paint();
            rectanglePaint.setStrokeWidth(3);
            rectanglePaint.setColor(colors.parseColor("#00ff00"));
            rectanglePaint.setStyle(Paint.Style.FILL); //实心
            // 画矩形
            canvas.drawRect((convertAfterXy1.x + frame.topLeft.x), (convertAfterXy1.y + frame.topLeft.y), (convertAfterXy1.x + frame.bottomRight.x), (convertAfterXy1.y + frame.bottomRight.y), rectanglePaint);
            // 重新绘制大图
            let canvasImg = canvas.toImage();
            // 删除临时图片
            files.remove(tempImgPath1);
            // 保存临时图片
            images.save(canvasImg, tempImgPath1, "png", 100);
            // 回收绘图
            utilsObj.recycleNull(canvasImg);
            // 回收大图
            utilsObj.recycleNull(bigImg2);
        } else {
            // 回收大图
            utilsObj.recycleNull(bigImg);
            // 未匹配到特征跳出循环
            break;
        }
    }
    // 删除临时图片
    files.remove(tempImgPath1);
    return frameArr
}


/**
 * 区域特征匹配模板图片2
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找目标图片,并返回基于大图的匹配结果,传入回调函数处理结果
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象 
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制信息
 * @return matchingResult
 */
utilsObj.regionalMatchFeaturesTemplate2 = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount, canvasMsg) => {
    // 结果对象
    let matchingResult = {
        matches: []//匹配对象
    }
    // 封装排序方法 left top right bottom
    matchingResult.sortBy = function (sortType) {
        let matches = this.matches
        if (!matches) {
            return;
        }
        switch (sortType) {
            case "left":
                // 添加x为排序key
                matches.forEach(item => {
                    item.sortKey = item.point.x
                })
                // 以x轴坐标从小到大排序
                this.matches = utilsObj.sortByKey(matches, 'sortKey', true)
                break;
            case "right":
                // 添加x为排序key
                matches.forEach(item => {
                    item.sortKey = item.point.x
                })
                // 以x轴坐标从大到小排序
                this.matches = utilsObj.sortByKey(matches, 'sortKey', false)
                break;
            case "top":
                // 添加y为排序key
                matches.forEach(item => {
                    item.sortKey = item.point.y
                })
                // 以y轴坐标从小到大排序
                this.matches = utilsObj.sortByKey(matches, 'sortKey', true)
                break;
            case "bottom":
                // 添加y为排序key
                matches.forEach(item => {
                    item.sortKey = item.point.y
                })
                // 以y轴坐标从大到小排序
                this.matches = utilsObj.sortByKey(matches, 'sortKey', false)
                break;
            default:
        }
    }
    // 结果四边形数组
    let frameArr = utilsObj.regionalMatchFeaturesTemplate(img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount, canvasMsg);

    // 将四边形数组转换为matches数组
    if (frameArr) {
        frameArr.forEach(frame => {
            matchingResult.matches.push({
                "point": {
                    x: frame.x,
                    y: frame.y
                }
            })
        })
    }
    return matchingResult;
}

/**
 * 随机点击
 * @desc 随机点击方法 支持偏移随机数
 * @param {int} x x坐标值
 * @param {int} y y坐标值
 * @param {int} randomNum 随机数 0~当前随机数 
 * @param {boolean} needConvertXy 是否需要转换坐标
 */
utilsObj.randomClick = (x, y, randomNum, needConvertXy) => {
    // 转换坐标
    let xy = needConvertXy ? utilsObj.convertXY(x, y) : { x: x, y: y }
    // 转换小于0的随机数
    randomNum = randomNum < 0 ? 0 : randomNum
    // 随机数 大于0.5为+ 否则为-
    let plusNum = random()
    // 计算随机坐标
    let x1 = plusNum > 0.5 ? (Number(xy["x"]) + random(0, randomNum)) : Number(xy["x"]) + random(0, randomNum)
    let y1 = plusNum > 0.5 ? (Number(xy["y"]) + random(0, randomNum)) : Number(xy["y"]) + random(0, randomNum)
    if (commonStorage.get("debugModel")) {
        sleep(200)
        console.info("【随机点击了】" + x1 + "," + y1)
        console.info("")
    }
    // 点击随机坐标
    click(x1, y1)
}

/**
 * 灰度化、阈值化图片 
 * @desc 图片处理的基本方法
 * @param {Image} img 需要处理的图片对象
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @returns {Image} 处理后的图片对象 
 */
utilsObj.grayscaleAndThreshold = (img, threshold, maxVal) => {
    try {
        // 先灰度化
        let newImg = images.grayscale(img);
        // 再阈值化
        let newimg2 = images.threshold(newImg, threshold, maxVal, 'BINARY');
        // 回收图片
        utilsObj.recycleNull(newImg);
        return newimg2;
    } catch (error) {
        console.log(error)
    }
    // 返回截屏
    return captureScreen();
}

/**
 * 灰度化、阈值化图片2
 * @desc 图片处理的基本方法
 * @param {Image} img 需要处理的图片对象
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @returns {Image} 处理后的图片对象 
 */
utilsObj.grayscaleAndThreshold2 = (img, threshold, maxVal, isOpenGray, isOpenThreshold) => {
    // 均为开启 直接返回复制图
    if (!isOpenGray && !isOpenThreshold) {
        return images.copy(img);
    }
    // 开启灰度化 未开启阈值化
    if (isOpenGray && !isOpenThreshold) {
        // 灰度化
        let newImg = images.grayscale(img);
        return newImg;
    }
    // 未开启灰度化 开启阈值化
    if (!isOpenGray && isOpenThreshold) {
        // 再阈值化
        let newimg2 = images.threshold(img, threshold, maxVal, 'BINARY');
        return newimg2;
    }
    // 调用原方法
    return utilsObj.grayscaleAndThreshold(img, threshold, maxVal);
}



/**
 * 灰度化、阈值化找图
 * @desc 灰度化、阈值化后 从大图中找小图
 * @param {Image} bigImg 原始大图对象
 * @param {Image} smallImg 原始小图对象
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 找图相似度
 * @returns {Object} 返回找图结果 images.findImage的返回结果
 */
utilsObj.grayThresholdFindImg = (bigImg, smallImg, threshold, maxVal, imgThreshold) => {
    // 校验图片尺寸
    let isOverSize = utilsObj.bigSmallSizeValid(bigImg, smallImg, "找图")
    if (isOverSize) {
        return null;
    }

    // 大图 灰度化、阈值化 
    let bigImgAfter = utilsObj.grayscaleAndThreshold(bigImg, threshold, maxVal);
    // 小图 灰度化、阈值化 
    let smallImgAfter = utilsObj.grayscaleAndThreshold(smallImg, threshold, maxVal);
    // 设置默认找图相似度
    if (!imgThreshold) {
        imgThreshold = 0.9
    }
    // 调用官方的找图方法
    let findResult = images.findImage(bigImgAfter, smallImgAfter, { threshold: imgThreshold })
    // 回收图片
    utilsObj.recycleNull(bigImgAfter);
    utilsObj.recycleNull(smallImgAfter);
    // 返回结果
    return findResult
}



/**
 * 灰度化、阈值化找图2
 * @desc 灰度化、阈值化后 从大图中找小图
 * @param {Image} bigImg 原始大图对象
 * @param {Image} smallImg 原始小图对象
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 找图相似度
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @returns {Object} 返回找图结果 images.findImage的返回结果
 */
utilsObj.grayThresholdFindImg2 = (bigImg, smallImg, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold) => {
    // 校验图片尺寸
    let isOverSize = utilsObj.bigSmallSizeValid(bigImg, smallImg, "找图")
    if (isOverSize) {
        return null;
    }
    // 大图 灰度化、阈值化 
    let bigImgAfter = utilsObj.grayscaleAndThreshold2(bigImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 小图 灰度化、阈值化 
    let smallImgAfter = utilsObj.grayscaleAndThreshold2(smallImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 设置默认找图相似度
    if (!imgThreshold) {
        imgThreshold = 0.9
    }
    // 调用官方的找图方法
    let findResult = images.findImage(bigImgAfter, smallImgAfter, { threshold: imgThreshold })
    // 回收图片
    utilsObj.recycleNull(bigImgAfter);
    utilsObj.recycleNull(smallImgAfter);
    // 返回结果
    return findResult
}


/**
 * 灰度化、阈值化区域找图
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找目标图片,并返回基于大图的坐标
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 图片相似度
 * @param {String} canvasMsg 绘制消息
 * @returns {x:int,y:int} 找图坐标对象
 */
utilsObj.regionalFindImg = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 缩放小图
    let smallTargetImg = utilsObj.scaleSmallImg(targetImg);
    // 调用灰度化阈值化找图 在大图中找小图
    let findResult = utilsObj.grayThresholdFindImg(clipImg, smallTargetImg, threshold, maxVal, imgThreshold)
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    // 返回基于大图的坐标
    let result = {
        "x": findResult ? (xy1["x"] + findResult["x"]) : -1,
        "y": findResult ? (xy1["y"] + findResult["y"]) : -1
    }
    // 控制台是否打印识图结果
    if (commonStorage.get("debugModel")) {
        console.info("【区域找图】" + (canvasMsg || "") + (Number(result.x) === -1 ? "【未找到】" : "【已找到】"))
        console.info("")
    }
    utilsObj.recycleNull(smallTargetImg);
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "img", "【区域找图结果】" + (canvasMsg || "") + (Number(result.x) === -1 ? "【未找到】" : "【已找到】"));
    // 返回基于大图的坐标
    return result;
}


/**
 * 灰度化、阈值化区域找图2  支持不开启灰度化 阈值化
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找目标图片,并返回基于大图的坐标
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 图片相似度
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制消息
 * @returns {x:int,y:int} 找图坐标对象
 */
utilsObj.regionalFindImg2 = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")

    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 缩放小图
    let smallTargetImg = utilsObj.scaleSmallImg(targetImg);

    // 调用灰度化阈值化找图 在大图中找小图
    let findResult = utilsObj.grayThresholdFindImg2(clipImg, smallTargetImg, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold, canvasMsg)
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    // 回收图片
    //utilsObj.recycleNull(targetImg);
    let result = {
        "x": findResult ? (xy1["x"] + findResult["x"]) : -1,
        "y": findResult ? (xy1["y"] + findResult["y"]) : -1
    }
    // 控制台是否打印识图结果
    if (commonStorage.get("debugModel")) {
        console.info("【区域找图】" + (canvasMsg || "") + (Number(result.x) === -1 ? "【未找到】" : "【已找到】"))
        console.info("")
    }
    utilsObj.recycleNull(smallTargetImg);
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "img", "【区域找图结果】" + (canvasMsg || "") + (result.x === -1 ? "【未找到】" : "【已找到】"));
    // 返回基于大图的坐标
    return result;
}


/**
 * 灰度化、阈值化区域找图3  在2的基础上支持数组参数
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找目标图片,并返回基于大图的坐标
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象
 * @param {Array} paramArray 参数数组
 * @param {String} canvasMsg 绘制消息
 * @returns {x:int,y:int} 找图坐标对象
 */
utilsObj.regionalFindImg3 = (img, targetImg, paramArray, canvasMsg) => {
    let x1 = paramArray[0];
    let y1 = paramArray[1];
    let x2 = paramArray[2];
    let y2 = paramArray[3];
    let threshold = paramArray[4];
    let maxVal = paramArray[5];
    let imgThreshold = paramArray[6];
    let isOpenGray = paramArray[7];
    let isOpenThreshold = paramArray[8];
    // 返回基于大图的坐标
    return utilsObj.regionalFindImg2(img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold, canvasMsg);
}


/**
 * 绘制方框
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {*} type 消息类型 img chart color
 * @param {*} msg 消息内容
 * @returns 
 */
utilsObj.canvasRect = (x1, y1, x2, y2, type, msg) => {
    // 非调试模式
    if (!commonStorage.get("debugModel")) {
        return;
    }
    let debugSleep = commonStorage.get("debugSleep") || 0
    sleep(Number(debugSleep))
    // 默认绿色
    let rectColor = "#ff8000";
    if (type === "img") {
        // 黄色
        rectColor = "#ffac8c";
    } else if (type === "chart") {
        // 红色
        rectColor = "#eb4f18"
    } else if (type === "color") {
        // 蓝色
        rectColor = "#397fff";
    }
    if (x1 > - 1) {
        if (x1 > 2) {
            x1 = x1 - 2
        }
        if (y1 > 2) {
            y1 = y1 - 2
        }
        // 竖屏
        if (utilsObj.getOrientation() === 1 && device.width - 2 > x2) {
            x2 = x2 + 2
        }
        // 横屏
        if (utilsObj.getOrientation() === 1 && device.height - 2 > x2) {
            x2 = x2 + 2
        }
        // 竖屏
        if (utilsObj.getOrientation() === 1 && device.height - 2 > y2) {
            y2 = y2 + 2
        }
        // 横屏
        if (utilsObj.getOrientation() === 1 && device.width - 2 > y2) {
            y2 = y2 + 2
        }

        if (canvasFloat) {
            canvasFloat.close();
        }
        canvasFloat = floaty.rawWindow(
            `<relative>
                <button id="boardClose" alpha="0" h="*" w="*" layout_centerInParent="true" />
                <canvas id="board" w="*" h="*" layout_centerInParent="true"></canvas>
            </relative>`
        );
        // canvasFloat.setTouchable(false);
        canvasFloat.boardClose.on("click", () => {
            if (canvasFloat) {
                canvasFloat.close();
            }
        })
        canvasFloat.setSize(-1, -1);
        canvasFloat.board.on("draw", function (canvas) {
            let paint = new Paint();
            //设置画笔为填充，则绘制出来的图形都是实心的
            paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeWidth(4);
            //设置画笔颜色为红色
            paint.setColor(colors.parseColor(rectColor));

            let textPaint = new Paint();
            textPaint.setTextAlign(Paint.Align.CENTER);
            textPaint.setTextSize(30);
            textPaint.setStyle(Paint.Style.FILL);
            textPaint.setColor(colors.parseColor(rectColor));
            
            // 竖屏时
            if(utilsObj.getOrientation() === 1){
                let canvasOffset = Number(commonStorage.get("canvasOffset") || 0)
                //绘制一个方框 左上角的点 坐标偏移
                canvas.drawRect(Number(x1), Number(y1) - canvasOffset, Number(x2), Number(y2) - canvasOffset, paint);
                //绘文字
                canvas.drawText(msg, Number(x1), Number(y1) - canvasOffset, textPaint)
            } else {
                 //绘制一个方框
                canvas.drawRect(Number(x1), Number(y1), Number(x2), Number(y2), paint);
                //绘文字
                canvas.drawText(msg, Number(x1), Number(y1), textPaint)
            }
            
        })
        sleep(200 + Number(debugSleep))
        if (canvasFloat) {
            canvasFloat.close();
        }
        sleep(200)
    }
}


/**
 * 灰度化、阈值化 区域点击图片
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行区域找图 寻找与目标图片匹配的坐标位置 再点击坐标
  * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingImgPath 匹配图片路径
 * @param {String} imgThreshold 图片相似度
 * @param {Function} successCall 成功回调
 */
utilsObj.regionalClickImg = (img, x1, y1, x2, y2, threshold, maxVal, matchingImgPath, imgThreshold, successCall) => {

    // 读取临时图片
    let targetImg = images.read(matchingImgPath);
    // 灰度化、阈值化区域 识别图片
    let macthingXy = utilsObj.regionalFindImg(img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingImgPath)
    utilsObj.recycleNull(img);
    utilsObj.recycleNull(targetImg);
    if (macthingXy) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}


/**
 * 灰度化、阈值化 区域点击图片2
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行区域找图 寻找与目标图片匹配的坐标位置 再点击坐标
  * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingImgPath 匹配图片路径
 * @param {String} imgThreshold 图片相似度
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {Function} successCall 成功回调
 */
utilsObj.regionalClickImg2 = (img, x1, y1, x2, y2, threshold, maxVal, matchingImgPath, imgThreshold, isOpenGray, isOpenThreshold, successCall) => {

    // 读取临时图片
    let targetImg = utilsObj.includesContains(['http:', 'https:'], matchingImgPath) ? images.load(matchingImgPath) : images.read(matchingImgPath)
    // 灰度化、阈值化区域 识别图片
    let macthingXy = utilsObj.regionalFindImg2(img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold, matchingImgPath)
    utilsObj.recycleNull(img);
    utilsObj.recycleNull(targetImg);
    if (macthingXy && macthingXy.x !== -1) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}


/**
 * 区域特征匹配点击
 * @param {Image} img 大图
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingImgPath 匹配图片路径
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {*} successCall 成功回调
 */
utilsObj.regionalClickFeatures = (img, x1, y1, x2, y2, threshold, maxVal, matchingImgPath, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, successCall) => {
    // 读取临时图片
    let targetImg = utilsObj.includesContains(['http:', 'https:'], matchingImgPath) ? images.load(matchingImgPath) : images.read(matchingImgPath);
    // 进行一次匹配
    let macthingXy = utilsObj.regionalMatchingFeatures(img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold)
    utilsObj.recycleNull(img);
    utilsObj.recycleNull(targetImg);
    if (macthingXy && macthingXy.x !== -1) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}

/**
 * 区域特征匹配或找图点击
 * @param {Image} img 大图
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 图片相似度
 * @param {String} matchingImgPath 匹配图片路径
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {*} successCall 成功回调
 */
utilsObj.regionalClickImgOrFeatures = (img, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingImgPath, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, successCall) => {
    // 读取临时图片
    let targetImg = utilsObj.includesContains(['http:', 'https:'], matchingImgPath) ? images.load(matchingImgPath) : images.read(matchingImgPath);
    // 进行一次匹配
    let macthingXy = utilsObj.regionalFindImgOrFeatures(img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold)
    utilsObj.recycleNull(img);
    utilsObj.recycleNull(targetImg);
    if (macthingXy && macthingXy.x !== -1) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}

/**
 * 区域获取匹配图片
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找目标图片,并返回基于大图的匹配结果最多5个,传入回调函数处理结果
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象 
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 图片相似度
 * @param {int} matchingCount 匹配数量
 * @param {Boolean} transparentMask 是否开启透明模板找图
 * @return matcingResult
 * first()取第一个匹配结果
 * last()取最后一个匹配结果
 * leftmost()取最左匹配结果
 * topmost()取最上匹配结果
 * rightmost()取最右匹配结果
 * bottommost()取最下匹配结果
 * best()取最高匹配结果
 * worst()取最低匹配结果
 * sortBy(cmp)匹配结果位置排序 指定方向 top-left 从上到下 从左到右
 */
utilsObj.regionalMatchTemplate = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingCount, transparentMask) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 获取灰度化阈值化后的图片
    let grayThresholdImg = utilsObj.grayscaleAndThreshold(clipImg, threshold, maxVal)
    // 回收图片
    utilsObj.recycleNull(clipImg);


    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 临时图片路径 
    let tempImgPath = "/sdcard/autoJsAfterImg/tempImg" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(grayThresholdImg, tempImgPath, "png", 100);

    // 读取临时图片
    let tempImg = images.read(tempImgPath)

    // 缩放小图
    let smallTargetImg = utilsObj.scaleSmallImg(targetImg);


    // 校验图片尺寸
    let isOverSize = utilsObj.bigSmallSizeValid(tempImg, smallTargetImg, "模板匹配");
    if (isOverSize) {
        // 回收图片
        utilsObj.recycleNull(grayThresholdImg);
        utilsObj.recycleNull(tempImg);
        utilsObj.recycleNull(smallTargetImg);
        return null;
    }
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "img", "【模板匹配目标区域】" + (canvasMsg || ""));

    // 调用匹配图片方法
    let matchingResult = images.matchTemplate(tempImg, smallTargetImg, {
        threshold: imgThreshold,
        max: matchingCount,
        transparentMask: transparentMask
    })

    // 获取匹配数组
    let matches = matchingResult ? matchingResult.matches : []
    if (matches && matches.length) {
        matches.forEach((matche, index) => {
            let point = matche.point
            console.log("匹配坐标", point)
            // 绘制方框
            utilsObj.canvasRect((xy1["x"] + point.x), (xy1["y"] + point.y), (xy1["x"] + point.x + smallTargetImg.width), (xy1["y"] + point.y + smallTargetImg.height), "img", "【模板匹配目标" + (index + 1) + "】" + (canvasMsg || ""));
        })
    }

    // 回收图片
    utilsObj.recycleNull(grayThresholdImg);
    utilsObj.recycleNull(tempImg);
    files.remove(tempImgPath)
    return matchingResult
}

/**
 * 区域找图或者特征匹配
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 图片相似度
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {*} canvasMsg 
 */
utilsObj.regionalFindImgOrFeatures = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 标准分辨率下进行找图  否则进行特征匹配
    let isStandard = utilsObj.getIsStandard()
	// 标准分辨率下 或者 设置了无需转换标记 或者关闭了特征匹配
    if (isStandard || commonStorage.get("notNeedConvert") || commonStorage.get("closeFeatures")) {
        // 区域找图
        return utilsObj.regionalFindImg2(img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, isOpenGray, isOpenThreshold, canvasMsg)
    } else {
        // 区域特征匹配
        return utilsObj.regionalMatchingFeatures(img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg)
    }
}

/**
 * 区域获取匹配图片2
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找目标图片,并返回基于大图的匹配结果,传入回调函数处理结果
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象 
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 图片相似度
 * @param {int} matchingCount 匹配数量
 * @param {Boolean} transparentMask 是否开启透明模板找图
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘图消息
 * @return matcingResult
 * first()取第一个匹配结果
 * last()取最后一个匹配结果
 * leftmost()取最左匹配结果
 * topmost()取最上匹配结果
 * rightmost()取最右匹配结果
 * bottommost()取最下匹配结果
 * best()取最高匹配结果
 * worst()取最低匹配结果
 * sortBy(cmp)匹配结果位置排序 指定方向 top-left 从上到下 从左到右
 */
utilsObj.regionalMatchTemplate2 = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingCount, transparentMask, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 获取灰度化阈值化后的图片
    let grayThresholdImg = utilsObj.grayscaleAndThreshold2(clipImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 回收图片
    utilsObj.recycleNull(clipImg);


    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 临时图片路径 
    let tempImgPath = "/sdcard/autoJsAfterImg/tempImg" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(grayThresholdImg, tempImgPath, "png", 100);

    // 读取临时图片
    let tempImg = images.read(tempImgPath)

    // 缩放小图
    let smallTargetImg = utilsObj.scaleSmallImg(targetImg);


    // 校验图片尺寸
    let isOverSize = utilsObj.bigSmallSizeValid(tempImg, smallTargetImg, "模板匹配")
    if (isOverSize) {
        // 回收图片
        utilsObj.recycleNull(grayThresholdImg);
        utilsObj.recycleNull(tempImg);
        utilsObj.recycleNull(smallTargetImg);
        return null;
    }
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "img", "【模板匹配目标区域】" + (canvasMsg || ""));

    // 调用匹配图片方法
    let matchingResult = images.matchTemplate(tempImg, smallTargetImg, {
        threshold: imgThreshold,
        max: matchingCount,
        transparentMask: transparentMask
    })

    // 获取匹配数组
    let matches = matchingResult ? matchingResult.matches : []
    if (matches && matches.length) {
        matches.forEach((matche, index) => {
            let point = matche.point
            console.log("匹配坐标", point)
            // 绘制方框
            utilsObj.canvasRect((xy1["x"] + point.x), (xy1["y"] + point.y), (xy1["x"] + point.x + smallTargetImg.width), (xy1["y"] + point.y + smallTargetImg.height), "img", "【模板匹配目标" + (index + 1) + "】" + (canvasMsg || ""));
        })
    }
    // 回收图片
    utilsObj.recycleNull(smallTargetImg);
    utilsObj.recycleNull(grayThresholdImg);
    utilsObj.recycleNull(tempImg);
    files.remove(tempImgPath)
    return matchingResult
}


/**
 * 区域模板匹配或者特征匹配模板
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {Image} targetImg 目标图对象 
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {int} imgThreshold 图片相似度
 * @param {int} matchingCount 匹配数量
 * @param {Boolean} transparentMask 是否开启透明模板找图
 * @param {float} bigScale  大图缩放比例 【0.1-1】
 * @param {float} smallScale 小图缩放比例 【0.1-1】
 * @param {float} featuresThreshold 特征相似度 【0.1-1】
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制信息
 * @returns 
 */
utilsObj.regionalMatchTemplateOrMatchFeatures = (img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingCount, transparentMask, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 标准分辨率
    let isStandard = utilsObj.getIsStandard();
	// 标准分辨率下 或者 设置了无需转换标记
     if (isStandard || commonStorage.get("notNeedConvert") || commonStorage.get("closeFeatures")) {
        // 区域特征匹配
        return utilsObj.regionalMatchTemplate2(img, targetImg, x1, y1, x2, y2, threshold, maxVal, imgThreshold, matchingCount, transparentMask, isOpenGray, isOpenThreshold, canvasMsg);
    } else {
        // 区域特征匹配模板
        return utilsObj.regionalMatchFeaturesTemplate2(img, targetImg, x1, y1, x2, y2, threshold, maxVal, bigScale, smallScale, featuresThreshold, isOpenGray, isOpenThreshold, matchingCount, canvasMsg)
    }
}

/**
 * 区域灰度化阈值化找圆
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 */
utilsObj.regionalFindCircles = (img, x1, y1, x2, y2, threshold, maxVal) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold(clipImg, threshold, maxVal);
    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 临时图片路径 
    let tempImgPath = "/sdcard/autoJsAfterImg/tempImg" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(imgAfter, tempImgPath, "png", 100);
    // 读取图片
    let tempImage = images.read(tempImgPath)
    // 灰度化
    let grayImg = images.grayscale(tempImage)
    utilsObj.recycleNull(imgAfter);
    // 灰度化图片
    let resultArr = images.findCircles(grayImg)
    utilsObj.recycleNull(tempImage);
    utilsObj.recycleNull(clipImg);
    utilsObj.recycleNull(grayImg);
    // 删除临时图片
    files.remove(tempImgPath)

    let returnResultArr = []
    resultArr.forEach(item => {
        returnResultArr.push({
            x: Number(item.x) + Number(xy1["x"]),
            y: Number(item.y) + Number(xy1["y"]),
            radius: Number(item.radius).toFixed(2)
        })
    })
    // 返回找圆结果
    return returnResultArr;
}


/**
 * 区域灰度化阈值化找圆2
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 */
utilsObj.regionalFindCircles2 = (img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold2(clipImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 临时图片路径 
    let tempImgPath = "/sdcard/autoJsAfterImg/tempImg" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(imgAfter, tempImgPath, "png", 100);
    // 读取图片
    let tempImage = images.read(tempImgPath)
    // 灰度化
    let grayImg = images.grayscale(tempImage)
    utilsObj.recycleNull(imgAfter);
    // 灰度化图片
    let resultArr = images.findCircles(grayImg)
    utilsObj.recycleNull(tempImage);
    utilsObj.recycleNull(clipImg);
    utilsObj.recycleNull(grayImg);
    // 删除临时图片
    files.remove(tempImgPath)

    let returnResultArr = []
    resultArr.forEach(item => {
        returnResultArr.push({
            x: Number(item.x) + Number(xy1["x"]),
            y: Number(item.y) + Number(xy1["y"]),
            radius: Number(item.radius).toFixed(2)
        })
    })
    // 返回找圆结果
    return returnResultArr;
}



/**
 * 裁剪图片并灰度化阈值化图片
 * @desc 全屏截图并裁剪坐标区域的图片，再进行灰度化、阈值化处理
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @returns {Image} 返回处理后的图片对象
 */
utilsObj.generateClipImgGrayThreshold = (x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold) => {
    // 截全屏
    let img = captureScreen();
    // 裁剪区域部分
    let clipImg = images.clip(img, x1, y1, x2 - x1, y2 - y1);
    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold2(clipImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    // 回收全屏图片
    utilsObj.recycleNull(img);
    // 返回处理后的图片
    return imgAfter;
}


/**
 * 裁剪图片并灰度化阈值化图片再保存到本地
 * @desc 全屏截图并裁剪坐标区域的图片，再进行灰度化、阈值化处理
 * @param {int} x1 区域坐标x1
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} localImageName  要保存的本地图片名称
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @returns {String} 本地图片路径
 */
utilsObj.generateClipImgGrayThresholdToLocal = (x1, y1, x2, y2, threshold, maxVal, localImageName, isOpenGray, isOpenThreshold) => {
    // 裁剪图片并 灰度化阈值化 若不开启灰度化阈值化则仅返回裁剪图片
    let img = utilsObj.generateClipImgGrayThreshold(x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold)
    // 本地图片路径
    let localImagePath = "/sdcard/autoJsLocalImg/"
    // 创建本地目录
    files.createWithDirs(localImagePath)
    // 保存到本地
    images.save(img, localImagePath + localImageName, "png", 100);
    // 回收图片
    utilsObj.recycleNull(img);
    // 返回本地图片路径
    return localImagePath + localImageName
}


/**
 * 灰度化、阈值化多点找色
 * @desc 基于灰度化阈值化的多点找色
 * @param {Image} bigImg 大图对象
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {string} color 目标颜色值(第一个点的颜色值)
 * @param {Array} colorOther 其他颜色数组 例如：[[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]]
 * @param {int} colorThreshold 颜色相似度
 * @returns {Object} 返回找色结果 images.findMultiColors的返回结果
 */
utilsObj.grayThresholdFindMultipleColor = (bigImg, threshold, maxVal, color, colorOther, colorThreshold) => {
    // 大图 进行灰度化、阈值化处理 
    let bigImgAfter = utilsObj.grayscaleAndThreshold(bigImg, threshold, maxVal);
    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 临时图片路径 
    let tempImgPath = "/sdcard/autoJsAfterImg/tempImg" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(bigImgAfter, tempImgPath, "png", 10);
    // 调用官方多点找色方法
    let findResult = images.findMultiColors(bigImgAfter, color, colorOther, { threshold: colorThreshold });
    // 删除临时图片
    files.remove(tempImgPath)
    // 回收处理后的大图
    utilsObj.recycleNull(bigImgAfter);
    // 返回结果
    return findResult
}

/**
 * 灰度化、阈值化多点找色
 * @desc 基于灰度化阈值化的多点找色
 * @param {Image} bigImg 大图对象
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {string} color 目标颜色值(第一个点的颜色值)
 * @param {Array} colorOther 其他颜色数组 例如：[[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]]
 * @param {int} colorThreshold 颜色相似度
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @returns {Object} 返回找色结果 images.findMultiColors的返回结果
 */
utilsObj.grayThresholdFindMultipleColor2 = (bigImg, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold) => {
    // 大图 进行灰度化、阈值化处理 
    let bigImgAfter = utilsObj.grayscaleAndThreshold2(bigImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    files.createWithDirs("/sdcard/autoJsAfterImg/")
    // 临时图片路径 
    let tempImgPath = "/sdcard/autoJsAfterImg/tempImg" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(bigImgAfter, tempImgPath, "png", 100);
    // 调用官方多点找色方法
    let findResult = images.findMultiColors(bigImgAfter, color, colorOther, { threshold: colorThreshold });
    // 删除临时图片
    files.remove(tempImgPath)
    // 回收处理后的大图
    utilsObj.recycleNull(bigImgAfter);
    // 返回结果
    return findResult
}




/**
 * 灰度化、阈值化区域多点找色
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找匹配的多点颜色, 并返回基于大图的坐标
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} color 目标颜色值(第一个点的颜色值)
 * @param {Array} colorOther 其他颜色数组 例如：[[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]]
 * @param  {int} colorThreshold 颜色相似度
 * @param {String} canvasMsg 绘图消息
 * @returns {x:int,y:int} 找色坐标对象
 */
utilsObj.regionalFindMultipleColor = (img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 灰度化、阈值化多点找色
    let findResult = utilsObj.grayThresholdFindMultipleColor(clipImg, threshold, maxVal, color, colorOther, colorThreshold)
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    let result = {
        "x": findResult ? (xy1["x"] + findResult["x"]) : -1,
        "y": findResult ? (xy1["y"] + findResult["y"]) : -1
    }
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "img", "【区域找色结果】" + (canvasMsg || "") + (result.x === -1 ? "【未找到】" : "【已找到】"));
    // 返回基于大图的坐标
}


/**
 * 灰度化、阈值化区域多点找色2
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后,寻找匹配的多点颜色, 并返回基于大图的坐标
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} color 目标颜色值(第一个点的颜色值)
 * @param {Array} colorOther 其他颜色数组 例如：[[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]]
 * @param  {int} colorThreshold 颜色相似度
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘图消息
 * @returns {x:int,y:int} 找色坐标对象
 */
utilsObj.regionalFindMultipleColor2 = (img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 灰度化、阈值化多点找色
    let findResult = utilsObj.grayThresholdFindMultipleColor2(clipImg, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    let result = {
        "x": findResult ? (xy1["x"] + findResult["x"]) : -1,
        "y": findResult ? (xy1["y"] + findResult["y"]) : -1
    }
    if (result.x !== -1) {
        // 绘制方框
        utilsObj.canvasRect(result["x"], result["y"], result["x"] + 20, result["y"] + 10, "color", "【区域找色第一个点】" + (canvasMsg || "") + (result.x === -1 ? "【未找到】" : "【已找到】"));
    }
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "color", "【区域找色结果】" + (canvasMsg || "") + (result.x === -1 ? "【未找到】" : "【已找到】"));
    // 返回基于大图的坐标
    return result;
}

/**
 * 灰度化、阈值化 区域点击多点颜色
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行多点颜色 寻找与目标内容匹配的坐标位置 再点击坐标
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} color 目标颜色值(第一个点的颜色值)
 * @param {Array} colorOther 其他颜色数组 例如：[[35, 30, "#FFFFFF"], [-28, -2, "#000000"], [-23, 20, "#000000"]]
 * @param  {int} colorThreshold 颜色相似度
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {Function} successCall 成功回调
 */
utilsObj.regionalClickColor2 = (img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold, successCall) => {
    // 灰度化、阈值化区域识别文字获取坐标
    let macthingXy = utilsObj.regionalFindMultipleColor2(img, x1, y1, x2, y2, threshold, maxVal, color, colorOther, colorThreshold, isOpenGray, isOpenThreshold)
    if (macthingXy) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}


/**
 * 灰度化、阈值化区域识别文字
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} canvasMsg 绘制消息
 * @returns {Array} 文字识别内容
 */
utilsObj.regionalAnalysisChart = (img, x1, y1, x2, y2, threshold, maxVal, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")

    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【目标文字】" + canvasMsg);

    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold(clipImg, threshold, maxVal);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    // 获取文字识别结果
    let resultStr = utilsObj.ocrGetContentStr(imgAfter);
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【文字识别结果】" + resultStr);
    // 回收灰度化、阈值化后的图片
    utilsObj.recycleNull(imgAfter);
    return resultStr;
}

/**
 * 是否标准分辨率
 * @returns 
 */
utilsObj.getIsStandard = () => {
    let isStandard = true
    if (device.width !== utilsObj.getScreenWidth()) {
        isStandard = false;
    }
    if (device.height !== utilsObj.getScreenHeight()) {
        isStandard = false;
    }
    return isStandard;
}


/**
 * 灰度化、阈值化区域识别文字2
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制消息
 * @returns {Array} 文字识别内容
 */
utilsObj.regionalAnalysisChart2 = (img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")

    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【目标文字】" + canvasMsg);
    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold2(clipImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    // 获取文字识别结果
    let resultStr = utilsObj.ocrGetContentStr(imgAfter)
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【文字识别结果】" + resultStr);

    // 回收灰度化、阈值化后的图片
    utilsObj.recycleNull(imgAfter);
    return resultStr;
}


/**
 * 灰度化、阈值化区域识别文字3
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {String} canvasMsg 绘制消息
 * @returns {Array} 文字识别结果对象数组
 */
 utilsObj.regionalAnalysisChart3 = (img, x1, y1, x2, y2, threshold, maxVal, isOpenGray, isOpenThreshold, canvasMsg) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")

    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【目标文字】" + canvasMsg);
    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold2(clipImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    // 获取文字识别结果对象数组
    let objArr = utilsObj.ocrGetContentObjArr(imgAfter,xy1["x"], xy1["y"], xy2["x"], xy2["y"])
	if(objArr && objArr.length){
		objArr.forEach(item=>{
			item.x = Number(xy1["x"]) + Number(item.x)
			item.y = Number(xy1["y"]) + Number(item.y)
		})
	}
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【文字识别结果】" + (objArr||[]).map(item=> item.text).join(''));
    // 回收灰度化、阈值化后的图片
    utilsObj.recycleNull(imgAfter);
    return objArr;
}



/**
 * 区域识别文字(原图)
 * @desc 在大图的区域坐标范围内进行文字识别
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @returns {Array} 文字识别内容
 */
utilsObj.regionalAnalysisChartSourceImg = (img, x1, y1, x2, y2) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 临时图片路径 
    let tempImgPath = "/sdcard/tempImg" + new Date().getTime() + ".png"
    // 保存临时图片
    images.save(clipImg, tempImgPath, "png", 100);
    // 获取文字识别结果
    let resultStr = utilsObj.ocrGetContentStr(clipImg);
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【文字识别结果】" + resultStr);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);
    return resultStr;
}


/**
 * ocr获取文字识别内容字符串结果
 * @param {*} img 
 */
utilsObj.ocrGetContentStr = (img) => {
    try {
        // 当前使用浩然ocr且已经初始化
        if (curOcrName === "浩然" && hrOcr) {
            let start = Date.now();
            // 文字识别
            let results = hrOcr.detect(img.getBitmap(), 1);
            let end = Date.now()
            // 读取文字识别内容
            let contentArr = Object.values(results).map(item => item.text) || []
            // 控制台是否打印识图结果
            if (commonStorage.get("debugModel")) {
                console.info("【浩然OCR】：" + contentArr.join(''))
                console.log(`【识别耗时:】 ${end - start}ms`);
                console.info("")
            }
            // 返回文字识别内容结果
            return contentArr.join('')
            // 当前使用tomatoOcr且已经初始化
        } else if (curOcrName === "tomato" && tomatoOcr) {
            let start = Date.now();
            // 文字识别
            let results = tomatoOcr.ocrBitmap(img.getBitmap(), 2);
            // 读取文字识别内容
            let ocrArr = results ? JSON.parse(results) : []

            // 文字识别2
            let results2 = tomatoOcr.ocrBitmap(img.getBitmap(), 3);
            let end = Date.now()

            // 读取文字识别内容
            let ocrArr2 = results2 ? JSON.parse(results2) : []
            let contentArr = ocrArr.map(item => item.words)
            let contentArr2 = ocrArr2.map(item => item.words)

            contentArr = contentArr.concat(contentArr2)
            // 控制台是否打印识图结果
            if (commonStorage.get("debugModel")) {
                // 读取文字识别内容
                console.info("【TomatoOCR】：" + contentArr.join(''))
                console.log(`【识别耗时:】 ${end - start}ms`);
                console.info("")
            }
            // 返回文字识别内容结果
            return contentArr.join('')

        } else if (curOcrName === "谷歌" && googleOcr) {
            let start = Date.now();
            let resultMlk = googleOcr.detect(img);
            let end = Date.now()
            // 读取文字识别内容
            let contentMlkArr = resultMlk.map(item => item.text) || []
            // 控制台是否打印识图结果
            if (commonStorage.get("debugModel")) {
                // 读取文字识别内容
                console.info("【谷歌OCR】：" + contentMlkArr.join(''))
                console.log(`【识别耗时:】 ${end - start}ms`);
                console.info("")
            }
            return contentMlkArr.join('')
        }
    } catch (error) {
        console.error("文字识别错误", error)
    }
    return '';
}


/**
 * ocr获取文字识别内容对象数据结果
 * @param {*} img 
 */
 utilsObj.ocrGetContentObjArr = (img, x1, y1, x2, y2) => {
    let objArr = [];
    try {
        // 当前使用浩然ocr且已经初始化
        if (curOcrName === "浩然" && hrOcr) {
            let start = Date.now();
            // 文字识别
            let results = hrOcr.detect(img.getBitmap(), 1);
            let end = Date.now()
            // 控制台是否打印识别结果
            if (commonStorage.get("debugModel")) {
                console.info("【浩然OCR对象数组】")
                console.info(results)
                console.log(`【识别耗时:】 ${end - start}ms`);
                console.info("")
            }
            results.forEach(item=>{
                let frame = item.frame
                let obj = {
                    'text':item.text,
                    'x':(frame[0] + (frame[4] - frame[0]) / 2),
                    'y':(frame[1] + (frame[5] - frame[1]) / 2)
                }
                objArr.push(obj);
            })
            // 返回对象数组
            return objArr
            // 当前使用tomatoOcr且已经初始化
        } else if (curOcrName === "tomato" && tomatoOcr) {
            let start = Date.now();
            // 文字识别
            let results = tomatoOcr.ocrBitmap(img.getBitmap(), 2);
            // 读取文字识别内容
            let ocrArr = results ? JSON.parse(results) : []
            // 返回文字识别内容结果
            ocrArr.forEach(item=>{
                // 计算匹配结果
                let obj = {
                    'text':item.words,
                    'x': ((x2 - x1) / 2),
                    'y': ((y2 - y1) / 2)
                }
                objArr.push(obj);
            })
            // 文字识别2
            let results2 = tomatoOcr.ocrBitmap(img.getBitmap(), 3);
            let end = Date.now()

            // 读取文字识别内容
            let ocrArr2 = results2 ? JSON.parse(results2) : []

            // 控制台是否打印识图结果
            if (commonStorage.get("debugModel")) {
                // 读取文字识别内容
                console.info("【TomatoOCR对象数组】")
                console.info(ocrArr3)
                console.log(`【识别耗时:】 ${end - start}ms`);
                console.info("")
            }
            // 返回文字识别内容结果
            ocrArr2.forEach(item=>{
                // 计算匹配结果
                let location = item.location
                let obj = {
                    'text':item.words,
                    'x':(location[0][0] + (location[2][0] - location[0][0]) / 2),
                    'y':(location[0][1] + (location[2][1] - location[0][1]) / 2)
                }
                objArr.push(obj);
            })
            return objArr;
        } else if (curOcrName === "谷歌" && googleOcr) {
            let start = Date.now();
            let resultMlk = googleOcr.detect(img);
            let end = Date.now()
            // 控制台是否打印识图结果
            if (commonStorage.get("debugModel")) {
                // 读取文字识别内容
                console.info("【谷歌OCR对象数组】：")
                console.info(resultMlk)
                console.log(`【识别耗时:】 ${end - start}ms`);
                console.info("")
            }
             // 返回文字识别内容结果
             resultMlk.forEach(item=>{
                // 计算匹配结果
                let bounds = item.bounds
                let obj = {
                    'text':item.text,
                    'x': (bounds.left + (bounds.right - bounds.left) / 2),
                    'y': (bounds.top + (bounds.bottom - bounds.top) / 2)
                }
                objArr.push(obj);
            })
            return objArr;
        }
    } catch (error) {
        console.error("文字识别错误", error)
    }
    return '';
}



/**
 * ocr获取文字识别固定内容匹配坐标
 * @param {*} img 
 * @param {*} matchingContent 
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * @param {*} openSplit 开启分隔符分隔处理 &表示且 |表示或
 * @returns 
 */
utilsObj.ocrGetPositionByContent = (img, matchingContent, x1, y1, x2, y2, openSplit) => {
    if (commonStorage.get('debugModel')) {
        console.log("【OCR目标值】", matchingContent)
    }
    let position = {
        x: -1,
        y: -1,
        content: ""
    }


    // 当前使用浩然ocr且已经初始化
    if (curOcrName === "浩然" && hrOcr) {
        // 文字识别
        let results = hrOcr.detect(img.getBitmap(), 1);
        // 读取文字识别内容
        let ocrArr = Object.values(results)
        // 读取文字识别内容
        let contentArr = ocrArr.map(item => item.text)
        position.content = contentArr.join('')
        // 控制台是否打印识图结果
        if (commonStorage.get("debugModel")) {
            console.info("【浩然OCR】：" + position.content)
            console.info("")
        }
        // 匹配目标orc对象
        let targetOcr = openSplit ? utilsObj.splitConditionaMatching(ocrArr, 'text', matchingContent) : ocrArr.find(item => item.text.indexOf(matchingContent) !== -1);
        // 未匹配返回空
        if (!targetOcr) {
            return position;
        }
        // 获取坐标
        let frame = targetOcr.frame
        position.x = (frame[0] + (frame[4] - frame[0]) / 2);
        position.y = (frame[1] + (frame[5] - frame[1]) / 2);
        return position;
        // 当前使用tomatoOcr且已经初始化
    } else if (curOcrName === "tomato" && tomatoOcr) {
        // 文字识别
        let results = tomatoOcr.ocrBitmap(img.getBitmap(), 2);
        // 读取文字识别内容
        let ocrArr = JSON.parse(results) || []
        // 读取文字识别内容
        let contentArr = ocrArr.map(item => item.words)
        position.content = contentArr.join('')
        // 控制台是否打印识图结果
        if (commonStorage.get("debugModel")) {
            console.info("【TomatoOCR】：" + position.content)
            console.info("")
        }
        // 匹配目标orc对象
        let targetOcr = openSplit ? utilsObj.splitConditionaMatching(ocrArr, 'words', matchingContent) : ocrArr.find(item => item.words.indexOf(matchingContent) !== -1)
        // 未匹配上，再次进行全屏匹配
        if (!targetOcr) {
            // 第二次文字识别
            let results2 = tomatoOcr.ocrBitmap(img.getBitmap(), 3);

            // 读取文字识别内容
            let ocrArr2 = JSON.parse(results2) || []
            // 读取文字识别内容
            let contentArr = ocrArr2.map(item => item.words)
            position.content += contentArr.join('')
            // 控制台是否打印识图结果
            if (commonStorage.get("debugModel")) {
                console.info("【TomatoOCR】：" + contentArr.join(''))
                console.info("")
            }
            targetOcr = openSplit ? utilsObj.splitConditionaMatching(ocrArr2, 'words', matchingContent) : ocrArr2.find(item => item.words.indexOf(matchingContent) !== -1)
            // 未匹配返回空
            if (!targetOcr) {
                return position;
            }
            // 计算匹配结果
            let location = targetOcr.location
            position.x = (location[0][0] + (location[2][0] - location[0][0]) / 2);
            position.y = (location[0][1] + (location[2][1] - location[0][1]) / 2);
            return position;
        }
        position.x = ((x2 - x1) / 2);
        position.y = ((y2 - y1) / 2);
        return position;
    } else if (curOcrName === "谷歌" && googleOcr) {
        let resultMlk = googleOcr.detect(img);
        // 读取文字识别内容
        let contentMlkArr = resultMlk.map(item => item.text) || []
        position.content = contentMlkArr.join('');
        // 控制台是否打印识图结果
        if (commonStorage.get("debugModel")) {
            // 读取文字识别内容
            console.info("【谷歌OCR】：" + position.content)
            console.info("")
        }
        let targetOcr = openSplit ? utilsObj.splitConditionaMatching(resultMlk, 'text', matchingContent) : resultMlk.find(item => item.text.indexOf(matchingContent) !== -1)
        // 未匹配返回空
        if (!targetOcr) {
            return position;
        }
        let bounds = targetOcr.bounds
        position.x = (bounds.left + (bounds.right - bounds.left) / 2);
        position.y = (bounds.top + (bounds.bottom - bounds.top) / 2);
        return position;
    }
    return position;
}


/**
 * 分隔条件匹配方法
 * @param {*} sourceArr 匹配原始数据数组
 * @param {*} matchingKey  匹配原始数据key
 * @param {*} targetContent 目标内容
 */
utilsObj.splitConditionaMatching = (sourceArr, matchingKey, targetContent) => {
    //  1&2|3|4&5|6&7
    // [1,2],[3],[4,5],[6,7]

    // 外层条件数组
    let arr = [];
    // 根据|分隔成数组
    let arr1 = targetContent.split('|') || ['']
    for (let i = 0; i < arr1.length; i++) {
        // 再根据&分隔数组
        let arr2 = arr1[i].split('&');
        arr.push(arr2);
    }
    // 已匹配对象
    let matchingObj = null;
    // 遍历源数组
    for (let i = 0; i < sourceArr.length; i++) {
        // 获取当前对象
        let obj = sourceArr[i];
        // 获取需要匹配内容
        let matchingContent = obj[matchingKey]

        // 遍历外层条件
        for (let j = 0; j < arr.length; j++) {
            // 获取内层条件
            let tempArr = arr[j];
            // 符合条件数量
            let accordCount = 0;
            // 遍历内层条件
            for (let m = 0; m < tempArr.length; m++) {
                // 获取内层数据
                let value = tempArr[m];
                // 满足条件 记录数量
                if (matchingContent.indexOf(value) !== -1) {
                    accordCount += 1;
                }
            }
            // 如果全部满足条件
            if (accordCount === tempArr.length) {
                // 设置匹配对象
                matchingObj = obj;
                // 停止循环
                break;
            }
        }
        // 如果当前已找到匹配对象 停止循环
        if (matchingObj) {
            break;
        }
    }
    return matchingObj;
}



/**
 * 灰度化、阈值化区域识别文字获取坐标
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别 寻找与目标内容匹配的坐标位置
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingContent 匹配内容
 * @returns {x:int,y:int} 匹配文字的坐标
 */
utilsObj.regionalAnalysisChartPosition = (img, x1, y1, x2, y2, threshold, maxVal, matchingContent) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold(clipImg, threshold, maxVal);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);

    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【目标文字】" + matchingContent);
    // 根据内容获取匹配文字坐标
    let matchingPosition = utilsObj.ocrGetPositionByContent(imgAfter, matchingContent, xy1["x"], xy1["y"], xy2["x"], xy2["y"])
    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【文字识别结果】" + matchingPosition.content);

    // 回收灰度化、阈值化后的图片
    utilsObj.recycleNull(imgAfter);
    // 为找内容直接返回
    if (matchingPosition.x === -1) {
        return null
    }
    // 中心点x
    let centerX = xy1["x"] + matchingPosition.x
    // 中心点y
    let centerY = xy1["y"] + matchingPosition.y
    // 返回基于大图的坐标
    return {
        x: centerX, y: centerY
    }
}


/**
 * 灰度化、阈值化区域识别文字获取坐标2
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别 寻找与目标内容匹配的坐标位置
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingContent 匹配内容
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {boolean} openSplit 匹配内容是否支持&与|分隔
 * @returns {x:int,y:int} 匹配文字的坐标
 */
utilsObj.regionalAnalysisChartPosition2 = (img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, openSplit) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);
    // 灰度化、阈值化图片
    let imgAfter = utilsObj.grayscaleAndThreshold2(clipImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 回收裁剪图片
    utilsObj.recycleNull(clipImg);

    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【目标文字】" + matchingContent);

    // 根据内容获取匹配文字坐标
    let matchingPosition = utilsObj.ocrGetPositionByContent(imgAfter, matchingContent, xy1["x"], xy1["y"], xy2["x"], xy2["y"], openSplit)

    // 绘制方框
    utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【文字识别结果】" + matchingPosition.content);

    // 回收灰度化、阈值化后的图片
    utilsObj.recycleNull(imgAfter);
    // 为找内容直接返回
    if (matchingPosition.x === -1) {
        return null
    }
    // 中心点x
    let centerX = xy1["x"] + matchingPosition.x
    // 中心点y
    let centerY = xy1["y"] + matchingPosition.y
    // 返回基于大图的坐标
    return {
        x: centerX, y: centerY
    }
}




/**
 * ocr获取文字识别内容结果(canvas绘画专用)
 * @param {*} img 
 * @param {Function} callback 回调函数
 */
utilsObj.ocrGetResultToCanvas = (img, callback) => {
    // 读取
    let canvas = new Canvas(img);
    let rectanglePaint = new Paint();
    rectanglePaint.setStrokeWidth(3);
    rectanglePaint.setColor(colors.parseColor("#00ff00"));
    rectanglePaint.setStyle(Paint.Style.STROKE); //空心矩形框
    let textPaint = new Paint();
    textPaint.setTextAlign(Paint.Align.CENTER);
    textPaint.setTextSize(30);
    textPaint.setStyle(Paint.Style.FILL);
    textPaint.setColor(colors.parseColor("#f000ff"));
    let fontMetrics = textPaint.getFontMetrics();

    // 当前使用浩然ocr且已经初始化
    if (curOcrName === "浩然" && hrOcr) {
        let start = Date.now()
        // 文字识别
        let results = hrOcr.detect(img.getBitmap(), 1);
        let end = Date.now()
        // 读取文字识别内容
        let ocrArr = Object.values(results)
        // 控制台是否打印识图结果
        if (commonStorage.get("debugModel")) {
            // 读取文字识别内容
            let contentArr = ocrArr.map(item => item.text)
            console.info("【浩然OCR】" + contentArr.join(''))
            console.log(`【识别耗时】 ${end - start}ms`);
            console.info("")
        }
        if (callback) {
            callback(ocrArr.map(item => item.text).join(''))
        }
        let len = results.size();
        for (var i = 0; i < len; i++) {
            let data = results.get(i);
            let frame = data.frame;
            let rect = [frame.get(0), frame.get(1), frame.get(4), frame.get(5)];
            canvas.drawRect(rect[0], rect[1], rect[2], rect[3], rectanglePaint);
            canvas.drawText(
                data.text,
                rect[0] + parseInt((rect[2] - rect[0]) / 2),
                rect[3] + Math.abs(fontMetrics.top),
                textPaint
            );
        }
        // 当前使用tomatoOcr且已经初始化
    } else if (curOcrName === "tomato" && tomatoOcr) {
        let start = Date.now()
        // 文字识别
        let results = tomatoOcr.ocrBitmap(img.getBitmap(), 3);
        let end = Date.now()
        // 读取文字识别内容
        let ocrArr = JSON.parse(results) || []
        // 控制台是否打印识图结果
        if (commonStorage.get("debugModel")) {
            // 读取文字识别内容
            let contentArr = ocrArr.map(item => item.words)
            console.info("【TomatoOCR】" + contentArr.join(''))
            console.log(`【识别耗时】 ${end - start}ms`);
            console.info("")
        }
        if (callback) {
            callback(ocrArr.map(item => item.words).join(''))
        }
        ocrArr.forEach(item => {
            let location = item.location;
            let rect = [location[0][0], location[0][1], location[2][0], location[2][1]];
            canvas.drawRect(rect[0], rect[1], rect[2], rect[3], rectanglePaint);
            canvas.drawText(
                item.words,
                rect[0] + parseInt((rect[2] - rect[0]) / 2),
                rect[3] + Math.abs(fontMetrics.top),
                textPaint
            );
        })
    } else if (curOcrName === "谷歌" && googleOcr) {
        let start = Date.now()
        let results = googleOcr.detect(img);
        let end = Date.now()
        // 控制台是否打印识图结果
        if (commonStorage.get("debugModel")) {
            // 读取文字识别内容
            let contentArr = results.map(item => item.text)
            console.info("【谷歌OCR】" + contentArr.join(''))
            console.log(`【识别耗时】 ${end - start}ms`);
            console.info("")
        }
        let len = results.length;
        if (callback) {
            callback(results.map(item => item.text).join(''))
        }
        for (var i = 0; i < len; i++) {
            let data = results[i];
            let bounds = data.bounds;
            let rect = [bounds.left, bounds.top, bounds.right, bounds.bottom];
            canvas.drawRect(rect[0], rect[1], rect[2], rect[3], rectanglePaint);
            canvas.drawText(
                data.text,
                rect[0] + parseInt((rect[2] - rect[0]) / 2),
                rect[3] + Math.abs(fontMetrics.top),
                textPaint
            );
        }
    }
    let image = canvas.toImage();
    return image;
}

/**
 * 灰度化、阈值化 区域识别文字并使用canvas生成图片保存到本地
 * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} localImageName 本地图片路径
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {*} isOpenThreshold 是否开启阈值化
 */
utilsObj.regionalAnalysisChartToCanvasImg = (img, x1, y1, x2, y2, threshold, maxVal, localImageName, isOpenGray, isOpenThreshold) => {
    // 坐标转换
    let xy1 = utilsObj.convertXY(x1, y1, "leftTop")
    let xy2 = utilsObj.convertXY(x2, y2, "rightBottom")
    // 按照区域坐标裁剪大图
    let clipImg = images.clip(img, xy1["x"], xy1["y"], xy2["x"] - xy1["x"], xy2["y"] - xy1["y"]);

    // 灰度化、阈值化图片
    let handlerImg = utilsObj.grayscaleAndThreshold2(clipImg, threshold, maxVal, isOpenGray, isOpenThreshold);
    // 返回img
    let canvasImg = utilsObj.ocrGetResultToCanvas(handlerImg, (resultStr) => {
        // 绘制方框
        utilsObj.canvasRect(xy1["x"], xy1["y"], xy2["x"], xy2["y"], "chart", "【文字识别绘图】" + resultStr);
    });

    let newFilepath = "/sdcard/autoJsTools/analysisChart/" + localImageName;
    // 创建目录
    files.createWithDirs(newFilepath);
    // 保存canvas重绘图片
    images.save(canvasImg, newFilepath);
    // 回收图片
    utilsObj.recycleNull(canvasImg);
    // 回收图片
    utilsObj.recycleNull(handlerImg);
    // 回收图片
    utilsObj.recycleNull(clipImg);
    // 返回新图片路径
    return newFilepath;
}


/**
 * 灰度化、阈值化 区域点击文字
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别 寻找与目标内容匹配的坐标位置 再点击坐标
  * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingContent 匹配内容
 * @param {Function} successCall 成功回调
 */
utilsObj.regionalClickText = (img, x1, y1, x2, y2, threshold, maxVal, matchingContent, successCall) => {
    // 灰度化、阈值化区域识别文字获取坐标
    let macthingXy = utilsObj.regionalAnalysisChartPosition(img, x1, y1, x2, y2, threshold, maxVal, matchingContent)
    if (macthingXy) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}



/**
 * 灰度化、阈值化 区域点击文字
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别 寻找与目标内容匹配的坐标位置 再点击坐标
  * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingContent 匹配内容
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {Function} successCall 成功回调
 */
utilsObj.regionalClickText2 = (img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, successCall) => {
    // 灰度化、阈值化区域识别文字获取坐标
    let macthingXy = utilsObj.regionalAnalysisChartPosition2(img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold)
    if (macthingXy) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}


/**
 * 灰度化、阈值化 区域点击文字 支持多条件匹配使用|和&分隔匹配内容
 * @desc 在大图的区域坐标范围内,进行灰度化阈值化处理后 再进行文字识别 寻找与目标内容匹配的坐标位置 再点击坐标
  * @param {Image} img 大图对象(一般为截全屏的图片对象)
 * @param {int} x1 区域坐标x1 
 * @param {int} y1 区域坐标y1
 * @param {int} x2 区域坐标x2
 * @param {int} y2 区域坐标y2
 * @param {int} threshold 阈值化相似度
 * @param {int} maxVal 阈值化最大值
 * @param {String} matchingContent 匹配内容
 * @param {boolean} isOpenGray 是否开启灰度化
 * @param {boolean} isOpenThreshold 是否开启阈值化
 * @param {Function} successCall 成功回调
 */
utilsObj.regionalClickText3 = (img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, successCall) => {
    // 灰度化、阈值化区域识别文字获取坐标
    let macthingXy = utilsObj.regionalAnalysisChartPosition2(img, x1, y1, x2, y2, threshold, maxVal, matchingContent, isOpenGray, isOpenThreshold, true)
    if (macthingXy) {
        utilsObj.randomClick(macthingXy.x, macthingXy.y, 1, false);
        if (successCall) {
            successCall()
        }
    }
}



/**
 * 初始化单选框组
 * @param {*} UIID ui组件id
 * @param {*} dataList 数据列表 {id:1,name:''}
 * @param {*} defaultCheckId 默认选中id
 * @param {*} checkCallback 选中回调事件
 */
utilsObj.initRadioGroup = (UIID, dataList, defaultCheckId, checkCallback) => {
    if (!UIID || !dataList) {
        return
    }
    ui[UIID].removeAllViews();
    // 初始化单选框组数据
    dataList.forEach((item) => {
        let radioButton = new android.widget.RadioButton(context);
        let lp = new android.widget.RadioGroup.LayoutParams(android.widget.RadioGroup.LayoutParams.WRAP_CONTENT, android.widget.RadioGroup.LayoutParams.WRAP_CONTENT);
        // lp.setMargins(0,0,0,0);
        //radioButton.setPadding(0); // 设置文字距离按钮四周的距离
        radioButton.setId(item.id);//设置radiobutton的id
        radioButton.setText(item.name);
        //radioButton.setTextColor(android.R.drawable.textcolor_recharge_radiobutton);//字体颜色
        /*   if (item.id == defaultCheckId) {
              // 初始化默认选中
              radioButton.setChecked(true)
          } */
        ui[UIID].addView(radioButton, lp);
    })
    // 初始化checked事件
    utilsObj.radioGroupCheckedEvent(UIID, dataList, checkCallback);

    // 初始化默认选中
    ui[UIID].check(defaultCheckId)
    /* let needCheckButton = ui[UIID].findViewById(defaultCheckId);
    needCheckButton.setChecked(true); */
}

/**
 * 设置单选框change事件
 * @param {*} UIID ui的id
 * @param {*} dataList 数据列表
 * @param {*} callback 回调函数
 * @returns 
 */
utilsObj.radioGroupCheckedEvent = (UIID, dataList, callback) => {
    if (!UIID) {
        return
    }
    dataMap[UIID] = dataList
    ui[UIID].setOnCheckedChangeListener(new android.widget.RadioGroup.OnCheckedChangeListener({
        onCheckedChanged: function (parent, checkedId) {
            if (callback) {
                //let buttonId = parent.getCheckedRadioButtonId()
                //console.log(buttonId, checkedId)
                // 获取id匹配的数据项
                let data = dataList.find(item => item.id === checkedId)
                let textContent = data ? data.name : ""
                callback(textContent, parent, dataList, checkedId)
            }
        }
    }))
}



/**
 * 初始化下拉框
 * @param {*} UIID ui组件id
 * @param {*} dataList 数据列表
 * @param {*} defaultSelectIndex 默认选中的数据索引(优先下标 小于0时根据defaultSelectItem取值)
 * @param {*} defaultSelectItem 默认选中数据项
 * @param {*} changeCallback 下拉框change回调
 * @returns 
 */
utilsObj.initSelect = (UIID, dataList, defaultSelectIndex, defaultSelectItem, changeCallback) => {
    if (!UIID || !dataList) {
        return
    }
    // 初始化下拉框
    let adapter = new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_item, dataList);
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    ui[UIID].setAdapter(adapter);
    // 初始化change事件
    utilsObj.selectChangeEvent(UIID, dataList, changeCallback);
    // 初始化默认值
    let selectIndex = defaultSelectIndex && defaultSelectIndex > 0 ? defaultSelectIndex : (defaultSelectItem ? dataList.findIndex(item => item === defaultSelectItem) : -1)
    ui[UIID].setSelection(selectIndex)
}

/**
 * 下拉框change事件
 * @param {*} UIID Ui的id
 * @param {*} dataList 数据列表
 * @param {*} callback 回调函数
 * @returns 
 */
utilsObj.selectChangeEvent = (UIID, dataList, callback) => {
    if (!UIID) {
        return
    }
    dataMap[UIID] = dataList
    ui[UIID].setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener({
        onItemSelected: function (parent, view, position, id) {
            if (callback) {
                let textContent = parent.getItemAtPosition(position) || ui[UIID].getSelectedItem()
                callback(textContent, parent, view, position, id, UIID)
            }
        }
    }))
}


/**
 * 开关change事件
 * @param {*} UIID Ui的id
 * @param {*} callback 回调函数
 */
utilsObj.switchChangeEvent = (UIID, callback) => {
    ui[UIID].on("check", function (checked) {
        callback(checked)
    });
}


/**
 * 设置UI缓存数据
 * @param {*} settingkeyArr UI设置key数组
 * @param {*} storageObj 储存对象
 */
utilsObj.setUICacheData = (settingkeyArr, storageObj) => {
    settingkeyArr.forEach(item => {
        let key = item.key // key 
        let type = item.type // 类型
        let dataList = dataMap[key] || [] // 字典数据列表
        if (!ui[key]) {
            return;
        }
        let value = ''
        switch (type) {
            case "下拉框":
                // 获取选中的内容
                value = ui[key].getSelectedItem()
                break;
            case "复选框":
                value = ui[key].isChecked();
                break;
            case "单选框":
                // 获取选中的id
                let checkId = ui[key].getCheckedRadioButtonId()
                // 数据
                let data = dataList.find(item => item.id === checkId)
                // 赋值
                value = data ? data.name : ""
                break;
            case "开关":
                value = ui[key].isChecked()
                break;
            case "输入框":
                value = ui[key].getText()
                break;
        }
        storageObj.put(key, value)
    })
}

/**
 * 获取UI缓存数据
 * @param {*} settingkeyArr  UI设置key数组
 * @param {*} storageObj 储存对象
 */
utilsObj.getUICacheData = (settingkeyArr, storageObj) => {
    settingkeyArr.forEach(item => {
        let key = item.key // key
        let type = item.type // 类型
        let value = storageObj.get(key) || "" // 值
        let dataList = dataMap[key] || [] // 字典数据列表
        if (!ui[key]) {
            return;
        }
        switch (type) {
            case "下拉框":
                // 获取数据项对应的下标
                let selectIndex = dataList.findIndex(item => item === value)
                // 根据下标设置选中项
                ui[key].setSelection(selectIndex)
                break;
            case "复选框":
                ui[key].attr("checked", value || false)
                break;
            case "单选框":
                // 根据名称匹配数据
                let data = dataList.find(item => item.name === value)
                // 根据数据获取id
                let checkId = data ? data.id : -1
                // 初始化默认选中
                ui[key].check(checkId)
                break;
            case "开关":
                ui[key].setChecked(value || false)
                break;
            case "输入框":
                ui[key].attr("text", value)
                break;
        }

    })
}


// 获取 当前页面设置信息 数组
utilsObj.getCurPageStting = (select业务) => {
    let curPageSetting = {}
    // 获取原始页面匹配对象
    let pageSetting = commonConstant["pageSetting_" + select业务] || {}
    // 收集key
    let keys = Object.keys(pageSetting);
    keys.forEach(key => {
        // 读取配置 
        let obj = pageSetting[key]
        // 获取分辨率对应的值
        let pageSetingObj = obj[device.width + "_" + device.height]
        // 未适配当前设备 则读取标准的
        pageSetingObj = pageSetingObj || obj[config.screenWidth + "_" + config.screenHeight]
        // 重新写入配置
        curPageSetting[key] = pageSetingObj
    })
    // 返回配置项
    return curPageSetting;
}

// 获取 当前页面设置信息 key数组
utilsObj.getCurPageSettingKey = (select业务) => {
    // 获取原始页面匹配对象
    let pageSetting = commonConstant["pageSetting_" + select业务] || {}
    // 返回key
    return Object.keys(pageSetting);
}


/**
 * 获取调试页面设置
 */
utilsObj.getDebugPageSettingUICache = () => {
    let debugModel = commonStorage.get("debugModel")
    if (debugModel) {
        // 初始化
        ui["debugSleep"].attr("text", commonStorage.get("debugSleep") || "")
        let joinSettingKey = []
        let select业务 = commonStorage.get("select业务")
        // 参与匹配的全部key
        let joinMatchingPageKey = utilsObj.getCurPageSettingKey(select业务)
        joinMatchingPageKey.forEach(item => {
            joinSettingKey.push({ key: "debugPage_" + item, type: "复选框" })
        })
        // 读取调试页面缓存数据
        utilsObj.getUICacheData(joinSettingKey, commonStorage)
    }
}

/**
 * 设置调试页面设置
 */
utilsObj.setDebugPageSettingUICache = () => {
    let debugModel = commonStorage.get("debugModel")
    if (debugModel) {
        // 初始化
        let joinSettingKey = []
        let select业务 = commonStorage.get("select业务")
        // 参与匹配的key
        let joinMatchingPageKey = utilsObj.getCurPageSettingKey(select业务)
        joinMatchingPageKey.forEach(item => {
            joinSettingKey.push({ key: "debugPage_" + item, type: "复选框" })
        })
        // 设置调试页面缓存数据
        utilsObj.setUICacheData(joinSettingKey, commonStorage)
    }
}


/**
 * 获取参与匹配的页面
 */
utilsObj.getJoinMatchingPageKey = () => {
    let debugModel = commonStorage.get("debugModel")
    let select业务 = commonStorage.get("select业务")
    // 参与匹配的key
    let joinMatchingPageKey = utilsObj.getCurPageSettingKey(select业务)
    if (debugModel) {
        // 初始化
        let joinSettingKey = []
        joinSettingKey = joinMatchingPageKey.filter(item => {
            return (commonStorage.get("debugPage_" + item) || false);
        })
        console.log("当前调试页面：" + joinSettingKey)
        return joinSettingKey;
    } else {
        return joinMatchingPageKey;
    }
}


/**
 * 远程限制应用布局分析
 */
utilsObj.remoteLimitLayoutAnalysis = (analysisRange) => {
    // 启动应用
    let exits = launchApp("限制应用布局分析")
    // 本地没有应用
    if (!exits) {
        toastLog("请下载并安装《限制应用布局分析》App")
        // 打开下载
        app.openUrl("http://121.4.241.250:5212/s/6o5IW")
        return;
    }
    sleep(2000)
    let img = captureScreen();
    let orientation = utilsObj.getOrientation();
    let width = orientation === 1 ? device.width : device.height;
    let height = orientation === 1 ? device.height : device.width;
    // 读取临时图片
    let targetImg = images.read("./res/分析布局悬浮窗标志.png");
    // 灰度化、阈值化区域 识别图片
    let macthingXy = utilsObj.regionalFindImg2(img, targetImg, 0, 0, width, height, 190, 255, 0.7, false, false)
    if (macthingXy && macthingXy.x !== -1) {
        utilsObj.randomClick(macthingXy.x + 100, macthingXy.y + 70, 1, false);
    }
    utilsObj.recycleNull(img);
    utilsObj.recycleNull(targetImg);
}



/**
 * 获取根节点并写入本地文件
 */
utilsObj.getRootNodeWriteLocal = (nodeType, analysisRange) => {
    let localNodeFile = "/sdcard/autoJsTools/rootNode.json"
    files.ensureDir(localNodeFile)
    console.log(analysisRange)
    if (!analysisRange) {
        analysisRange = "active";
    }

    toastLog("正在分析布局,请稍候")
    if (nodeType === "tree") {
        // 获取根节点
        let rootNodeObj = utilsObj.getRootNodeByTree(true, analysisRange);
        //写入文件
        files.write(localNodeFile, JSON.stringify(rootNodeObj, '', '\t'));
    } else {
        let nodeObjArr = utilsObj.getRootNodeByArr();
        //写入文件
        files.write(localNodeFile, JSON.stringify(nodeObjArr, '', '\t'));
    }
}

/**
 * 远程上传根节点json到服务器
 */
utilsObj.remoteUploadRootNodeJsonToServer = () => {
    let localPathName = "/sdcard/autoJsTools/rootNode.json"
    // 调用远程上传文件方法
    utilsObj.uploadFileToServer(localPathName, deviceUUID + "/" + "rootNode.json", (remoteRootURL) => {
        if (commonStorage.get("debugModel")) {
            console.log("远程节点地址：" + remoteRootURL)
        }
    })
}


/**
 * 上传节点预览图片
 */
utilsObj.uploadNodePreviewImg = () => {
	// 唤醒设备
    device.wakeUpIfNeeded();
    // 申请 截图权限
    utilsObj.requestScreenCaptureCommonFun(()=>{
        let img = images.captureScreen()
        let tempImgPath = '/sdcard/screenImg/nodePreviewImg.jpg'
        files.createWithDirs("/sdcard/screenImg/")
        // 临时图片路径
        files.remove(tempImgPath)
        sleep(10)
        images.save(img, tempImgPath, "jpg", "100");
        utilsObj.uploadFileToServer(tempImgPath, deviceUUID + '/nodePreviewImg.jpg', (a) => {
        })
        img.recycle()
    })
}


utilsObj.startRequestScreenClickTreadWait = (waitTimes)=>{
    // 读取其他点击文字数据
    let otherClickText = commonStorage.get("otherClickText");

    let textRegExp = new RegExp(`(允许|立即开始|同意${otherClickText ? '|'+otherClickText : ''})`)

    // 停止截图点击线程
    if(utilsObj.requestScreenClickThreadWaitTimes){
        utilsObj.requestScreenClickThreadWaitTimes.interrupt();
    }

    // 开启点击线程
    utilsObj.requestScreenClickThreadWaitTimes = threads.start(function () {
        while (true) {
            let click1 = textMatches(textRegExp).findOne(100);
            if(click1){
                click1.click();
            }
            if(utilsObj.requestScreenClickThreadWaitTimes){
                // 停止点击线程
                utilsObj.requestScreenClickThreadWaitTimes.interrupt();
            }
        }
    });
    // 延迟关闭点击线程
    setTimeout(()=>{
        // 停止截图点击线程
        if(utilsObj.requestScreenClickThreadWaitTimes){
            utilsObj.requestScreenClickThreadWaitTimes.interrupt();
        }
    },waitTimes)
}


/**
 * 申请截图权限公共方法
 */
utilsObj.requestScreenCaptureCommonFun = (callback)=>{
    try {
        // 获取截图权限参数
        let screenCaptureOptions = images.getScreenCaptureOptions();
        // 不为空
        if(screenCaptureOptions){
            // 截图权限与当前屏幕方向相同 
            if(String(screenCaptureOptions.orientation) === String(utilsObj.getOrientation())){
                // 开启一个延时1秒关闭的点击线程 
                utilsObj.startRequestScreenClickTreadWait(1000);
                if(callback){
                    callback();
                }
                // 已有截图权限 直接返回
                return;
            }
            // 关闭当前截图权限 
            images.stopScreenCapture();
            sleep(100);
        }
        // 未开启无障碍服务
        if(!auto.service){
            console.error("未开启无障碍服务")
            // 直接返回
            return;
        }

        // 是否存在截图权限
        let exitsScreenCaputreOptions = false;

        // 读取其他点击文字数据
        let otherClickText = commonStorage.get("otherClickText");

        let textRegExp = new RegExp(`(允许|立即开始|同意${otherClickText ? '|'+otherClickText : ''})`)

        // 停止截图点击线程
        if(utilsObj.requestScreenClickThread){
            utilsObj.requestScreenClickThread.interrupt();
        }
        sleep(200);
        // 开启点击线程
        utilsObj.requestScreenClickThread = threads.start(function () {
            while (true) {
                let click1 = textMatches(textRegExp).findOne(100);
                if(click1){
                    click1.click();
                }
                let checkScreenCaptureOptions = images.getScreenCaptureOptions();
                if(checkScreenCaptureOptions){
                    // 设置标志
                    exitsScreenCaputreOptions = true;
                    if(utilsObj.requestScreenClickThread){
                        // 停止点击线程
                        utilsObj.requestScreenClickThread.interrupt();
                    }
                }
            }
        });
        // 申请截图权限
        images.requestScreenCapture({orientation:utilsObj.getOrientation()});

        let timeoutLimit = 0;
        // 没有截图权限时 循环等待
        while (!exitsScreenCaputreOptions) {
            sleep(100);
            timeoutLimit++;
            // 超过30秒 退出等待
            if(timeoutLimit> 10 * 30){
                break;
            }
        }
        if(timeoutLimit < 10 * 30){
            // 未超时 执行回调
            if(callback){
                sleep(1000);
                callback();
            }
        }
        // 超时不做处理
    } catch (error) {
        console.error("申请截图权限错误,自动重试", error)
        // 如果出现错误 则先停止截图权限
        images.stopScreenCapture();
        // 开启一个延时3秒关闭的点击线程 
        utilsObj.startRequestScreenClickTreadWait(3000);
        // 再重新申请截图权限
        images.requestScreenCapture({orientation:utilsObj.getOrientation()});
        // 执行回调
        if(callback){
            sleep(1000);
            callback();
        }
    }
}


/**
 * 获取根节点树形
 * @param {*} isRemoveSouceNode 是否删除原节点
 * @returns 
 */
utilsObj.getRootNodeByTree = (isRemoveSouceNode, analysisRange) => {
    if (analysisRange === 'active') {
        // 获取根节点
        let windowRoot = auto.rootInActiveWindow;
        if (!windowRoot) {
            toastLog("未获取到节点,当前应用可能被限制,请尝试使用《限制应用布局分析》APP本地分析")
            return { "msg": "未获取到节点,当前应用可能被限制,请尝试使用《限制应用布局分析》APP本地分析" }
        }
        // 转换根节点
        let rootNodeObj = utilsObj.convertNodeToObj(windowRoot);
        // 原始节点
        rootNodeObj.sourceNode = windowRoot
        // 递归获取子节点
        rootNodeObj = utilsObj.recursionNode(rootNodeObj);
        if (isRemoveSouceNode) {
            rootNodeObj = utilsObj.recursionClearSouceNode(rootNodeObj);
        }
        toastLog("布局分析完成,请上传")
        // 返回根节点
        return rootNodeObj;
    } else {
        auto.setWindowFilter(function (window) {
            //不管是如何窗口，都返回true，表示在该窗口中搜索
            return true;
        });
        // 获取全部窗口数组
        let windosRootArr = auto.windowRoots;
        let rootNodeObjArr = [];
        for (let i = 0; i < windosRootArr.length; i++) {
            let windowRoot = windosRootArr[i];
            if (!windowRoot) {
                continue;
            }
            // 转换根节点
            let rootNodeObj = utilsObj.convertNodeToObj(windowRoot);
            // 原始节点
            rootNodeObj.sourceNode = windowRoot
            // 递归获取子节点
            rootNodeObj = utilsObj.recursionNode(rootNodeObj);
            if (isRemoveSouceNode) {
                rootNodeObj = utilsObj.recursionClearSouceNode(rootNodeObj);
            }
            rootNodeObjArr.push(rootNodeObj);
        }
        toastLog("布局分析完成,请上传")
        // 返回根节点
        return rootNodeObjArr;
    }
}

/**
 * 获取根节点数组
 */
utilsObj.getRootNodeByArr = () => {
    // 获取根节点
    let windowRoot = auto.rootInActiveWindow;
    if (!windowRoot) {
        toastLog("未获取到节点,当前应用可能被限制")
        return { "msg": "未获取到节点,当前应用可能被限制" }
    }
    let nodeArr = findViewNodes(windowRoot)
    let objArr = []

    for (let i = 0; i < nodeArr.length; i++) {
        let obj = utilsObj.convertNodeToObj(nodeArr[i]);
        objArr.push(obj);
    }
    toastLog("布局分析完成,请上传")
    return objArr;
}



/**
 * 递归删除原节点
 * @param {*} childNodeObj 
 * @returns 
 */
utilsObj.recursionClearSouceNode = (childNodeObj) => {
    // 获取原始节点  
    delete childNodeObj.sourceNode

    // 获取子节点数组
    let children = childNodeObj.children ? childNodeObj.children : []
    for (let i = 0; i < children.length; i++) {
        children[i] = utilsObj.recursionClearSouceNode(children[i])
    }
    childNodeObj.children = children;
    return childNodeObj;
}

/**
 * 递归获取子节点
 * @param {} childNode 
 * @returns 
 
utilsObj.recursionNode = (childNodeObj) => {
    // 获取原始节点  
    let sourceNode = childNodeObj.sourceNode
    // 获取子节点数量
    let childCount = sourceNode.childCount();
    // 没有子节点直接返回
    if (childCount == null || childCount === 0) {
        return childNodeObj;
    }
    // 获取子节点数组
    let children = childNodeObj.children ? childNodeObj.children : []

    for (var i = 0; i < childCount; i++) {
        // 获取子节点
        let childNode1 = sourceNode.child(i)
        if (!childNode1) {
            continue;
        }
        // 转换子节点对象
        let childNodeObj1 = utilsObj.convertNodeToObj(childNode1)
        // 设置原始节点
        childNodeObj1.sourceNode = childNode1

        // 递归获取子节点
        childNodeObj1 = utilsObj.recursionNode(childNodeObj1);
        // 将子节点添加到数组中
        children.push(childNodeObj1);
    }
    // 重新赋值子节点数组
    childNodeObj.children = children;
    // 返回根节点
    return childNodeObj;
}
*/

// 使用堆栈模拟递归调用，实现尾递归
utilsObj.recursionNode = (childNodeObj) => {
  let stack = [childNodeObj]; // 初始化堆栈，将初始节点压入堆栈
  while (stack.length > 0) { // 当堆栈不为空时，循环处理节点
    let node = stack.pop(); // 从堆栈中弹出一个节点
    let sourceNode = node.sourceNode; // 获取节点对应的源节点
    let childCount = sourceNode.childCount(); // 获取源节点的子节点数量
    if (childCount == null || childCount === 0) { // 如果子节点数量为0，则跳过
      continue;
    }
    let children = node.children ? node.children : []; // 初始化子节点数组
    for (let i = 0; i < childCount; i++) { // 遍历源节点的子节点
      let childNode1 = sourceNode.child(i); // 获取子节点
      if (!childNode1) { // 如果子节点不存在，则跳过
        continue;
      }
      let childNodeObj1 = utilsObj.convertNodeToObj(childNode1); // 将子节点转换为对象
      childNodeObj1.sourceNode = childNode1; // 将子节点的源节点保存到对象中
      children.push(childNodeObj1); // 将子节点对象添加到子节点数组中
      stack.push(childNodeObj1); // 将子节点对象压入堆栈中，以便后续处理
    }
    node.children = children; // 将子节点数组保存到节点对象中
  }
  return childNodeObj; // 返回处理后的节点对象
}

// 
function findViewNodes(viewNode) {
    let viewNodes = [];
    let breadthViewNodes = [];
    // 节点加入队列    
    breadthViewNodes.push(viewNode);
    // 遍历队列中的节点    
    while (breadthViewNodes.length > 0) {
        let headViewNode = breadthViewNodes.shift();
        // 子节点入队列        
        let childCount = headViewNode.childCount();
        for (let i = 0; i < childCount; i++) {
            let childViewNode = headViewNode.child(i);
            breadthViewNodes.push(childViewNode);
        }
        // 父节点入库   
        viewNodes.push(headViewNode);
    }
    return viewNodes;
}

/**
 * 节点转换
 * @param {*} UINode 
 * @returns 
 */
utilsObj.convertNodeToObj = (UINode) => {
    let obj = {}
    obj.content = UINode.text() || UINode.desc() || "";
    let desc = UINode.desc();
    obj.isDesc = desc !== 'undefined' && desc !== '' && desc !== null
    obj.id = UINode.id();
    let bounds = UINode.bounds();
    let boundsInfo = {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
    }

    obj.depth = UINode.depth();
    obj.index = 0;
    obj.boundsInScreen = UINode.bounds();

    obj.sourceNodeId = UINode.sourceNodeId();
    obj.packageName = UINode.packageName();
    obj.className = UINode.className();
    obj.text = UINode.text();
    obj.desc = UINode.desc();
    obj.indexInParent = UINode.indexInParent();
    obj.boundsInParent = UINode.boundsInParent();

    obj.boundsInfo = boundsInfo;
    obj.mDepth = UINode.depth();
    obj.checkable = UINode.checkable();
    obj.checked = UINode.checked();
    obj.focusable = UINode.focusable();
    obj.focused = UINode.focused();
    obj.accessibilityFocused = UINode.accessibilityFocused()
    obj.selected = UINode.selected();
    obj.clickable = UINode.clickable();
    obj.drawingOrder = UINode.drawingOrder();
    obj.longClickable = UINode.longClickable();
    obj.enabled = UINode.enabled();
    obj.password = UINode.password();
    obj.scrollable = UINode.scrollable();
    obj.visible = UINode.visibleToUser();
    obj.visibleToUser = UINode.visibleToUser();
    obj.column = UINode.column();
    obj.columnCount = UINode.columnCount();
    obj.columnSpan = UINode.columnSpan();
    obj.depth = UINode.depth();
    obj.row = UINode.row();
    obj.rowCount = UINode.rowCount();
    obj.rowSpan = UINode.rowSpan();
    obj.nodeKey = new Date().getTime() + "_" + randomNum(10) + "_" + obj.className

    let label = "";
    if (obj.className) {
        label += obj.className
    }
    let arr = []
    if (obj.id) {
        arr.push("id=" + obj.id);
    }
    if (obj.scrollable) {
        arr.push("scrollable");
    }
    if (obj.text) {
        arr.push("text=" + obj.text);
    }
    if (obj.desc) {
        arr.push("desc=" + obj.desc);
    }
    if (obj.clickable) {
        arr.push("clickable");
    }
    if (obj.longClickable) {
        arr.push("longClickable");
    }
    if (obj.visible) {
        arr.push("visible");
    }
    if (arr && arr.length) {
        label += JSON.stringify(arr);
    }
    obj.label = label
    return obj;
}


function randomNum(n) {
    var res = "";
    for (var i = 0; i < n; i++) {
        res += Math.floor(Math.random() * 10);
    }
    return res;
}


module.exports = utilsObj
