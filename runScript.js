let deviceParam = {
    imgQuality: 100,
    imgScale: 1,
    isOpenGray: 0,
    isOpenThreshold: 0,
    imgThreshold: 60,
    appSpace:500
}
let utils = require('./common/utils.js')
let config = require("./common/config.js")
let commonStorage = storages.create("zjh336.cn" + config.commonScriptKey);
if(["HUAWEI"].includes(device.brand)){
    commonStorage.put("otherClickText","允许");
}
let deviceUUID = utils.getDeviceUUID()
// 引入websocket
let websocketHandler = require('./common/websocketHandler.js')
// 初始化websocket
websocketHandler.initWebSocket()

var deviceThread = null
var clickThread = null
// 预览设备
events.broadcast.on("startPreviewDevice", (params) => {
	// 唤醒设备
	device.wakeUpIfNeeded();
    if (params) {
        // 解密后字符串
        let decodeAftrJson = $base64.decode(params)
        // json字符串转换js对象
        let operateObj = JSON.parse(decodeAftrJson)

        deviceParam.imgQuality = operateObj.imgQuality || 100
        deviceParam.imgScale = operateObj.imgScale || 1

        deviceParam.isOpenGray = operateObj.isOpenGray ? 1 : 0
        deviceParam.isOpenThreshold = operateObj.isOpenThreshold ? 1 : 0
        deviceParam.imgThreshold = operateObj.imgThreshold || 60
        deviceParam.appSpace = operateObj.appSpace || 500
    }
    if(clickThread){
        console.log("关闭自动点击线程")
        clickThread.interrupt()
    }

    if(deviceThread){
        console.log("关闭预览线程")
        deviceThread.interrupt()
    }
    console.log("开启自动点击线程")
    
    clickThread = threads.start(function () {
        while (true) {
            let click1 = text("立即开始").findOne(100);
            if(click1){
                click1.click()
            }
            let otherClickText = commonStorage.get("otherClickText")
            if(otherClickText){
              let click2 = text(otherClickText).findOne(100);
               if(click2){
                 click2.click()
             }
            }
        }
    });
    deviceThread = threads.start(() => {
        try {
            console.log("重开权限")
            images.stopScreenCapture()
            images.requestScreenCapture({orientation:utils.getOrientation()})
        } catch (error) {
            console.error("重开截图权限错误",error)
        }
        files.createWithDirs("/sdcard/screenImg/")
        sleep(500)
        toastLog("开始预览")
        while (true) {
            try {
                let img = images.captureScreen()
                let afterImg = images.scale(img, deviceParam.imgScale, deviceParam.imgScale)
                 if (deviceParam.isOpenGray === 1) {
                    let afterImg1 = images.grayscale(afterImg)
                    afterImg.recycle()
                    afterImg = afterImg1
                }
                if (deviceParam.isOpenThreshold === 1) {
                    let afterImg2 = images.threshold(afterImg, deviceParam.imgThreshold, 255, 'BINARY');
                    afterImg.recycle()
                    afterImg = afterImg2
                } 
                let tempImgPath = '/sdcard/screenImg/tempImg.jpg'
                // 临时图片路径
                files.remove(tempImgPath)
                sleep(10)
                images.save(afterImg, tempImgPath, "jpg", deviceParam.imgQuality);
                utils.uploadFileToServer(tempImgPath, deviceUUID + '/tempImg.jpg', (a) => {
                })
                afterImg.recycle()
                img.recycle()
                sleep(deviceParam.appSpace) 
            } catch (error) {
                console.error("预览错误",error)
            }

        }
    })
});
// 停止预览设备
events.broadcast.on("stopPreviewDevice", function () {
	// 唤醒设备
	device.wakeUpIfNeeded();
    if(deviceThread){
        toastLog("停止预览")
        deviceThread.interrupt()
    }
});
// 点击立即开始
threads.start(function () {
    while (true) {
        let click1 = text("立即开始").findOne(100);
        if(click1){
            click1.click()
        }
        let otherClickText = commonStorage.get("otherClickText")
        if(otherClickText){
           let click2 = text(otherClickText).findOne(100);
           if(click2){
             click2.click()
           }
        }
    }
});
sleep(1000)
try {
    images.stopScreenCapture()
    images.requestScreenCapture({orientation:utils.getOrientation()})
} catch (error) {
        console.error("主程序请求截图错误", error)
}
//保持脚本运行
setInterval(() => { }, 1000);