"ui";
ui.layout(
    `<vertical>
        <vertical h="*" w="*">
            <webview id="webView" layout_below="title" w="*" h="*" />
        </vertical>
    </vertical>`
);

function callJavaScript(webViewWidget, script, callback) {
    try {
        console.assert(webViewWidget != null, "webView控件为空");
        //console.log(script.toString())
        webViewWidget.evaluateJavascript("javascript:" + script, new JavaAdapter(android.webkit.ValueCallback, {
            onReceiveValue: (val) => {
                if (callback) {
                    callback(val);
                }
            }
        }));
    } catch (e) {
        console.error("执行JavaScript失败");
        console.trace(e);
    }
}

function AutoX() {
    let getAutoXFrame = () => {
        let bridgeFrame = document.getElementById("AutoXFrame");
        if (!bridgeFrame) {
            bridgeFrame = document.createElement('iframe');
            bridgeFrame.id = "AutoXFrame";
            bridgeFrame.style = "display: none";
            document.body.append(bridgeFrame);
        }
        return bridgeFrame;
    };
    const h5Callbackers = {};
    let h5CallbackIndex = 1;
    let setCallback = (callback) => {
        let callId = h5CallbackIndex++;
        h5Callbackers[callId] = {
            "callback": callback
        };
        return callId;
    };
    let getCallback = (callId) => {
        let callback = h5Callbackers[callId];
        if (callback) {
            delete h5Callbackers[callId];
        }
        return callback;
    };

    function invoke(cmd, params, callback) {
        let callId = null;
        try {
            let paramsStr = JSON.stringify(params);
            let AutoXFrame = getAutoXFrame();
            callId = setCallback(callback);
            AutoXFrame.src = "jsbridge://" + cmd + "/" + callId + "/" + encodeURIComponent(paramsStr);
        } catch (e) {
            if (callId) {
                getCallback(callId);
            }
            console.trace(e);
        }
    };
    let callback = (data) => {
        let callId = data.callId;
        let params = data.params;
        let callbackFun = getCallback(callId);
        if (callbackFun && callbackFun.callback) {
            return callbackFun.callback(params);
        }
    };

    const aceEditor = {};
    aceEditor.init = () => {
        let editor = ace.edit('editor');
        editor.isTextChanged = false;
    }

    aceEditor.setValue = (value) => {
        let editor = ace.edit('editor');
        editor.setValue(value);
        editor.selection.clearSelection();
        editor.session.getUndoManager().reset();
    };

    aceEditor.getValue = () => {
        let editor = ace.edit('editor');
        return editor.getValue();
    };

    aceEditor.listenTextChanged = () => {
        let editor = ace.edit('editor');

        editor.on('change', function () {
            //console.log("Text changed!");
            editor.isTextChanged = true;
        });
    };

    aceEditor.isTextChanged = () => {
        let editor = ace.edit('editor');
        return editor.isTextChanged;
    };

    return {
        invoke: invoke,
        callback: callback,
        aceEditor: aceEditor
    };
};

function bridgeHandler_handle(cmd, params) {
    //console.log('bridgeHandler处理 cmd=%s, params=%s', cmd, JSON.stringify(params));
    let fun = this[cmd];
    if (!fun) {
        throw new Error("cmd= " + cmd + " 没有定义实现");
    }
    let ret = fun(params)
    return ret;
}

function loadFile(params) {
    let aceEditorStorage = storages.create("aceEditor");
    path = aceEditorStorage.get("filePath");

    let content = files.read(path);
    return content;
}

function getFilePath(params) {
    let aceEditorStorage = storages.create("aceEditor");
    path = aceEditorStorage.get("filePath");

    return path;
}

function execJSCallback(val) {
    let result = JSON.parse(val);
    if (result) {
        switch (result.callback) {
            case "saveFile":
            {
                files.write(result.filePath, result.content);
                toastLog("保存 " + result.filePath + " 成功");
                break;
            }
            case "isTextChanged":
            {
                console.log("文件是否修改: " + result.isTextChanged);
                if (!result.isTextChanged) {
                    ui.finish();
                    break;
                }

                dialogs.build({
                    title: "保存文件？",
                    content: "是否在退出前保存文件？",
                    positive: "保存",
                    negative: "放弃",
                    neutral: "取消",
                    canceledOnTouchOutside: false,
                    autoDismiss: true,
                }).on("positive", (action, dialog) => {
                    try {
                        callJavaScript(ui.webView, AutoX.toString() + ";var auto0 = AutoX();auto0.invoke('getFilePath','',(data) => {let result = {};result.callback = 'saveFile';result.filePath = data;result.content = auto0.aceEditor.getValue();return result;});", null);
                    } catch (e) {
                        console.trace(e)
                    }
                    ui.finish();
                }).on("negative", (action, dialog) => {
                    ui.finish();
                }).show();
                break;
            }
            default:
            {
                console.log(result.callback + " is not defined!");
                break;
            }
        }
    }
}

function webViewExpand_init(webViewWidget) {
    webViewWidget.webViewClient = new JavaAdapter(android.webkit.WebViewClient, {
        onPageFinished: (webView, curUrl) => {
            try {
                // 注入 AutoX
                callJavaScript(webView, AutoX.toString() + ";var auto0 = AutoX();auto0.invoke('loadFile','',(data) => {auto0.aceEditor.init();auto0.aceEditor.setValue(data);auto0.aceEditor.listenTextChanged();});", null);
            } catch (e) {
                console.trace(e)
            }
        },
        shouldOverrideUrlLoading: (webView, request) => {
            let url = '';
            try {
                url = (request.a && request.a.a) || (request.url);
                if (url instanceof android.net.Uri) {
                    url = url.toString();
                }
                if (url.indexOf("jsbridge://") == 0) {
                    let uris = url.split("/");
                    let cmd = uris[2];
                    let callId = uris[3];
                    let params = java.net.URLDecoder.decode(uris[4], "UTF-8");
                    //console.log('AutoX处理JavaScript调用请求: callId=%s, cmd=%s, params=%s', callId, cmd, params);
                    let result = null;
                    try {
                        result = bridgeHandler_handle(cmd, JSON.parse(params));
                    } catch (e) {
                        console.trace(e);
                        result = {
                            message: e.message
                        };
                    }
                    result = result || {};
                    callJavaScript(webView, "auto0.callback({'callId':" + callId + ", 'params': " + JSON.stringify(result) + "});", execJSCallback);
                } else if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("file://") || url.startsWith("ws://") || url.startsWith("wss://")) {
                    webView.loadUrl(url);
                } else {
                }
                return true;
            } catch (e) {
                if (e.javaException instanceof android.content.ActivityNotFoundException) {
                    webView.loadUrl(url);
                } else {
                    toastLog('无法打开URL: ' + url);
                }
                console.trace(e);
            }
        },
        onReceivedError: (webView, webResourceRequest, webResourceError) => {
            let url = webResourceRequest.getUrl();
            let errorCode = webResourceError.getErrorCode();
            let description = webResourceError.getDescription();
            console.trace(errorCode + " " + description + " " + url);
        }
    });
    webViewWidget.webChromeClient = new JavaAdapter(android.webkit.WebChromeClient, {
        onConsoleMessage: (msg) => {
            console.log("[%s:%s]: %s", msg.sourceId(), msg.lineNumber(), msg.message());
        }
    });
}

ui.emitter.on("back_pressed", (e) => {
    callJavaScript(ui.webView, AutoX.toString() + ";var auto0 = AutoX();auto0.invoke('','',(data) => {let result = {};result.callback = 'isTextChanged';result.isTextChanged = auto0.aceEditor.isTextChanged();return result;});", null);
    e.consumed = true;
});

webViewExpand_init(ui.webView);
let filePath = files.path("./ace-builds-1.16.0/editor.html");
ui.webView.getSettings().setJavaScriptEnabled(true);
ui.webView.loadUrl("file://" + filePath);