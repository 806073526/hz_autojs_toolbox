let config = {}
// 公共脚本key
config.commonScriptKey = "common";
// 业务脚本key
config.serviceScriptKey = "tools";
// appKey
config.appKey = "tools"

let commonStorage = storages.create("zjh336.cn" + config.commonScriptKey);

// http请求地址
config.httpBaseUrl = "http://127.0.0.1:9998"
// websocket请求地址
config.webSocketBaseUrl = "ws://127.0.0.1:9998/autoJsWs"


config.getHttpBaseUrl = ()=>{
    let remoteIp = commonStorage.get("服务端IP")
    return remoteIp ? "http://"+remoteIp+":9998" : config.httpBaseUrl
    let remotePort = commonStorage.get("服务端Port")||9998

    return remoteIp ? "http://"+remoteIp+":" + remotePort: config.httpBaseUrl
}


config.getWebSocketBaseUrl = ()=>{
    let remoteIp = commonStorage.get("服务端IP")
    return remoteIp ? "ws://"+remoteIp+":9998/autoJsWs" : config.webSocketBaseUrl
    let remotePort = commonStorage.get("服务端Port")||9998
    return remoteIp ? "ws://"+remoteIp+":"+remotePort+"/autoJsWs" : config.webSocketBaseUrl
}

// https://blog.csdn.net/wangsheng5454/article/details/117119402
// 安卓API版本  29 安卓10
config.SDK_API_VERSION = android.os.Build.VERSION.SDK_INT

module.exports = config