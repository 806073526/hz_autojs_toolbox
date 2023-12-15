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
        let decodeAfterJson = $base64.decode(params)
        // json字符串转换js对象
        let operateObj = JSON.parse(decodeAfterJson)

        deviceParam.imgQuality = operateObj.imgQuality || 100
        deviceParam.imgScale = operateObj.imgScale || 1

        deviceParam.isOpenGray = operateObj.isOpenGray ? 1 : 0
        deviceParam.isOpenThreshold = operateObj.isOpenThreshold ? 1 : 0
        deviceParam.imgThreshold = operateObj.imgThreshold || 60
        deviceParam.appSpace = operateObj.appSpace || 500
    }

    if(deviceThread){
        console.log("关闭预览线程")
        deviceThread.interrupt()
    }
    
    deviceThread = threads.start(() => {
        // 申请 截图权限
        utils.requestScreenCaptureCommonFun();
        // 创建预览目录
        files.createWithDirs("/sdcard/screenImg/")
        sleep(500)
        let lastImageBase = "";
        toastLog("开始预览")
        while (true) {
            try {
                // 获取截图权限参数
                let screenCaptureOptions = images.getScreenCaptureOptions();
                // 不为空
                if(screenCaptureOptions){
                    // 截图权限与当前屏幕方向不同 
                    if(String(screenCaptureOptions.orientation) !== String(utils.getOrientation())){
                        // 关闭当前截图权限 
                        images.stopScreenCapture();
                        // 重新申请截图权限
                        utils.requestScreenCaptureCommonFun();
                    }
                }

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

                let curImageBase = images.toBase64(afterImg, "JPG", deviceParam.imgQuality);
                sleep(10)
                if(curImageBase !== lastImageBase){
                    http.request(commonStorage.get("服务端IP") + ':' + (commonStorage.get("服务端Port") || 9998)  +'/attachmentInfo/updateFileMap', {
                        headers: {
                            "deviceUUID": commonStorage.get('deviceUUID')
                        },
                        method: 'POST',
                        contentType: 'application/json',
                        body: JSON.stringify({ 'dirPathKey': commonStorage.get('deviceUUID') + '_' + tempImgPath, 'fileJson': curImageBase })
                    }, (e) => { 
                        lastImageBase = curImageBase;
                    });
                }
                /* sleep(10)
                images.save(afterImg, tempImgPath, "jpg", deviceParam.imgQuality);
                utils.uploadFileToServer(tempImgPath, deviceUUID + '/tempImg.jpg', (a) => {
                }) */
                afterImg.recycle()
                img.recycle()
                sleep(deviceParam.appSpace) 
            } catch (error) {
                console.error("预览错误",error)
                try {
                    console.log("重开权限")
                    utils.requestScreenCaptureCommonFun();
                } catch (error1) {
                    console.error("重开截图权限错误",error1)
                }
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
//保持脚本运行
setInterval(() => { }, 1000);