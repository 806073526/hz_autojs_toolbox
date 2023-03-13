let heartTimer = null // 心跳句柄
let reConnectTimer = null // 重连句柄
let webSocketConfig = {
  isHeartData: true,
  isReconnect: true,
  heartTime: 10000,
  reConnectTime: 20000
}
let isClose = true
let socketTask = null
let connectOK = false // 连接是否成功

// 导入配置类
let config = require("./config.js")
// 导入工具类
let utils = require("./utils.js")
utils.initOcr('谷歌')
let commonStorage = storages.create("zjh336.cn" + config.commonScriptKey);
let fixedMessageEnum = {
  ping: '0', // 发送心跳
  pong: '1', // 接收心跳回复
  exit: '2', // 接收退出指令
  update: '3', // 接收版本更新指令
  asking_exit: '4', // 询问退出
  confirm_exit: '5', // 确认退出
  cancel_login: '6', // 取消登陆
  connect_complete: '7'// 连接完成
}


function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

// 脚本退出时取消WebSocket
events.on('exit', () => {
  if (socketTask) {
    console.log("退出脚本,关闭websocket")
    socketTask.cancel();
  }
});

let websocketHandler = {}
events.broadcast.on("orientationchange", function () {
  console.log("屏幕方向变化")
  // 重新发送消息到服务端
  sendDeviceToServer()
});

// 发送消息到web端
events.broadcast.on("sendMsgToWeb", (message) => {
  // 发送消息
  socketTask.send(message)
})

// 发送消息到web端更新业务key
events.broadcast.on("sendMsgToWebUpdateServiceKey", (messageJson) => {
  // 传入json 如 {"deviceUUID":"","serviceKey":"","serviceValue":""}
  let base64String = $base64.encode(messageJson,'utf-8')
  // 发送消息
  socketTask.send('{"action":"updateServiceKey","message":"' + base64String + '"}')
})




// 发送消息到服务端
function sendDeviceToServer(){
  // 其他属性
  let otherProperty = {
    orientation: utils.getOrientation(),
    debugModel:commonStorage.get('debugModel'),
    debugSleep:commonStorage.get('debugSleep')
  }
  let otherPropertyJson = $base64.encode(JSON.stringify(otherProperty),'utf-8')
  // 设备对象
  let deviceObj = {
    deviceHeight: device.height,
    deviceWidth: device.width,
    password: commonStorage.get("访问密码") || "",
    otherPropertyJson:otherPropertyJson
  }
  let base64Device = $base64.encode(JSON.stringify(deviceObj),'utf-8')
  // 发送版本号
  socketTask.send('{"action":"sendDeviceInfo","message":"' + base64Device + '"}')
}

// 初始化
websocketHandler.initWebSocket = () => {
  let deviceUUID = commonStorage.get('deviceUUID')
  if (!deviceUUID) {
    // 安卓10及以上 取androidId   10以下 取IMEI
    deviceUUID = config.SDK_API_VERSION > 28 ? device.getAndroidId() : device.getIMEI()
    commonStorage.put("deviceUUID", deviceUUID)
  }
  if (socketTask) {
    socketTask.close(1000, null)
  }
  // 创建websocket链接
  socketTask = $web.newWebSocket(config.getWebSocketBaseUrl() + "/" + deviceUUID +"/"+device.height +"/"+device.width)
  // 监听socket是否打开成功
  socketTask.on("open", (res, ws) => {
    let webSocketLog = commonStorage.get('webSocketLog')
    if (webSocketLog) {
      console.log("websocket连接成功！")
    }
    isClose = false
    connectOK = true
    if (webSocketConfig.isHeartData) {
      websocketHandler.clearHeart()
      websocketHandler.startHeart()
    }
    if (reConnectTimer) {
      clearInterval(reConnectTimer)
    }
    reConnectTimer = null
    // 发送消息到服务端
    sendDeviceToServer()
  })
  // 监听到错误异常 
  socketTask.on("failure", (err, res, ws) => {
    let webSocketLog = commonStorage.get('webSocketLog')
    if (webSocketLog) {
      console.log("websocket连接异常！", err)
    }
    // websocket连接异常
    connectOK = false
    if (webSocketConfig.isHeartData && heartTimer != null) {
      websocketHandler.clearHeart()
    }
    if (reConnectTimer == null && webSocketConfig.isReconnect) {
      // 执行重连操作
      websocketHandler.reConnectSocket()
    }
  })
  // 监听socket关闭
  socketTask.on("closing", (code, reason, ws) => {
    //console.log("websocket正在关闭！")
  })
  socketTask.on("closed", (code, reason, ws) => {
    // console.log("websocket已关闭！")
    connectOK = false
    if (webSocketConfig.isHeartData && heartTimer != null) {
      websocketHandler.clearHeart()
    }
    // 判断是否为异常关闭
    if (reConnectTimer == null && !isClose && webSocketConfig.isReconnect) {
      // 执行重连操作
      websocketHandler.reConnectSocket()
    }
  });
  // 接收到消息
  socketTask.on('text', (text, ws) => {
    if (isNumberStr(text)) {
      // 是数字
      // 固定格式消息处理
      websocketHandler.fixedMessageHandler(text)
      // 业务处理
    } else if (text) {
      // 写具体的业务操作
      websocketHandler.objectMessageHandler(text)
    } else {
      console.log('非法数据，无法解析')
    }
  });
}
// 关闭连接
websocketHandler.close = () => {
  if (socketTask) {
    socketTask.cancel()
    socketTask.close(1000, null)
    socketTask = null
  }
}
// 心跳
websocketHandler.startHeart = () => {
  heartTimer = setInterval(() => {
    let webSocketLog = commonStorage.get('webSocketLog')
    if (webSocketLog) {
      console.log("websocket发送心跳！")
    }
    // 发送心跳
    socketTask.send(fixedMessageEnum['ping'].toString())


   // 每次心跳 更新消息到服务端
   sendDeviceToServer()
  }, webSocketConfig.heartTime)
}
// 清除心跳
websocketHandler.clearHeart = () => {
  if (heartTimer) {
    clearInterval(heartTimer)
  }
  heartTimer = null
}
// 重连
websocketHandler.reConnectSocket = () => {
  reConnectTimer = setInterval(() => {
    let webSocketLog = commonStorage.get('webSocketLog')
    if (webSocketLog) {
      console.log("websocket重连！")
    }
    if (!connectOK) {
      websocketHandler.initWebSocket()
    } else {
      if (reConnectTimer) {
        clearInterval(reConnectTimer)
      }
    }
  }, webSocketConfig.reConnectTime)
}
// 发送消息
websocketHandler.sendMessage = (message) => {
  let webSocketLog = commonStorage.get('webSocketLog')
  if (webSocketLog) {
    console.log("websocket发送消息:" + message)
  }
  socketTask.send(message)
}
// 消息处理
websocketHandler.objectMessageHandler = (text) => {
  if (!isJSON(text)) {
    return
  }
  let messageData = JSON.parse(text)
  // 强制退出
  if (messageData.action === "forcedExit") {
    toastLog("收到退出指令")
    if (socketTask) {
      socketTask.cancel();
      socketTask.close(1000, null);
    }
    exit()
    //  远程处理操作
  } else if (messageData.action === "remoteHandler") {
    // 调用具体操作逻辑
    utils.remoteHandler(messageData.message)
    // 预览设备
  } else if(messageData.action === "startPreviewDevice"){
      events.broadcast.emit("startPreviewDevice", messageData.message);
   // 停止预览设备   
  } else if(messageData.action === "stopPreviewDevice"){
      events.broadcast.emit("stopPreviewDevice", messageData.message);
  }
}
// 全局固定格式消息处理
websocketHandler.fixedMessageHandler = (message) => {
  switch (message) {
    case fixedMessageEnum['pong']:
      let webSocketLog = commonStorage.get('webSocketLog')
      if (webSocketLog) {
        console.log("websocket心跳回复")
      }
      break
    case fixedMessageEnum['exit']:
      break
    case fixedMessageEnum['update']:
      break
    case fixedMessageEnum['asking_exit']:
      // 接受到重复登陆指令，服务器询问是否踢人
      // 确认
      break
    case fixedMessageEnum['connect_complete']:
  }
}
module.exports = websocketHandler
