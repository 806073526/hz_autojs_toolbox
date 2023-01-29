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

config.defaultHttpBaseUrl = "http://127.0.0.1:9998";
config.defaultWebSocketBaseUrl = "ws://127.0.0.1:9998/autoJsWs";


config.getHttpBaseUrl = ()=>{
    var remoteIp = commonStorage.get("服务端地址");

    if(!remoteIp) {
        return config.httpBaseUrl;
    }

    // 判断是否是http://或者https://开头
    if(remoteIp.startsWith("http://") || remoteIp.startsWith("https://")) {
        // 以http://或者https://开头，认为是完整域名
        return remoteIp;
    }

    // 认为是IP或端口组合，判断是否包含端口
    if(remoteIp.includes(":")) {
        // 包含端口，默认http
        return "http://" + remoteIp;
    }

    return "http://" + remoteIp + ":9998";
}


config.getWebSocketBaseUrl = ()=>{
    var remoteUrl = config.getHttpBaseUrl();

    let idx = remoteUrl.indexOf(":");
    let url = remoteUrl.substring(idx);

    return "ws"+url+"/autoJsWs";
}

// https://blog.csdn.net/wangsheng5454/article/details/117119402
// 安卓API版本  29 安卓10
config.SDK_API_VERSION = android.os.Build.VERSION.SDK_INT

module.exports = config