"ui";
importClass(com.google.android.material.bottomsheet.BottomSheetDialog);
importClass(com.google.android.material.bottomsheet.BottomSheetBehavior);
//$ui.useAndroidResources();
ui.layout(
    `<frame>
        <vertical>
            <appbar bg="#1a1c1a" >
                <HorizontalScrollView id="breadcrumbView" w="*"  h="25" padding="8 2 5 2" orientation="horizontal">
                    <text id="fileName" text="文件名称" textSize="14" textColor="#FFFFFF" gravity="left|center" />
                </HorizontalScrollView>
                <grid  spanCount="9" id="bar">
                    <vertical h="40" w="40" gravity="center|bottom">
                        <img tint="#FFFFFF" h="18" w="18"  src="@drawable/{{this.src}}" />
                        <text textSize="12" textColor="#FFFFFF" gravity="center|bottom" text="{{this.title}}"/>
                    </vertical>
                </grid>
            </appbar>
            <webview layout_weight="1" id="webView" layout_below="title" h="*" w="*" />
            
            <horizontal w="*">
                <grid padding="8 0 5 8" layout_gravity="bottom"  bg="#1a1c1a" id="actionLeftBar" h="80" spanCount="4">
                    <vertical>
                        <text margin="2 5 2 10" layout_weight="1" gravity="center" textColor="#c1c9bf" text="{{this.title}}"/>
                    </vertical>
                </grid>
                <grid layout_weight="1" padding="5 0 0 8"  layout_gravity="bottom"  bg="#1a1c1a" id="actionBar" h="80" spanCount="6">
                    <vertical>
                        <text id="symbol" padding="5 5 5 10" layout_weight="1" gravity="center" textColor="#c1c9bf" text="{{this.hint}}"/>
                    </vertical>
                </grid>
            </horizontal>
        </vertical>
    </frame>`
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
    }
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
    }

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
    }
    let callback = (data) => {
        let callId = data.callId;
        let params = data.params;
        let callbackFun = getCallback(callId);
        if (callbackFun && callbackFun.callback) {
            return callbackFun.callback(params);
        }
    }

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
    }

    aceEditor.getValue = () => {
        let editor = ace.edit('editor');
        return editor.getValue();
    }

    aceEditor.listenTextChanged = () => {
        let editor = ace.edit('editor');

        editor.on('change', function() {
            //console.log("Text changed!");
            editor.isTextChanged = true;
        });
    }

    aceEditor.isTextChanged = () => {
        let editor = ace.edit('editor');
        return editor.isTextChanged;
    }

    return {
        invoke: invoke,
        callback: callback,
        aceEditor: aceEditor
    }
}

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
    if (!content) {
        return " ";
    }
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
                    //toastLog("保存 " + result.filePath + " 成功");
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
                        events.broadcast.emit("refreshPage", '');
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
                } else {}
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


let aceEditorStorage = storages.create("aceEditor");
let fileName = aceEditorStorage.get("filePath");
ui.fileName.setText(fileName);

menus = [{
        title: '文档',
        src: 'ic_library_books_black_48dp'
    },
    {
        title: '主题',
        src: 'ic_brightness_medium_black_48dp'
    }, {
        title: '命令',
        src: 'ic_widgets_black_48dp'
    },
    {
        title: '语法',
        src: 'ic_font_download_black_48dp'
    },
    {
        title: '日志',
        src: 'ic_assignment_black_48dp'
    },
    {
        title: '运行',
        src: 'ic_play_arrow_black_48dp'
    },
    {
        title: '撤销',
        src: 'ic_undo_black_48dp',

    },
    {
        title: '重做',
        src: 'ic_redo_black_48dp',
        onclick: 'editor.redo()'
    },
    {
        title: '保存',
        src: 'ic_save_black_48dp'
    }
]
ui.bar.setDataSource(menus)
ui.bar.on("item_click", function(item, i, itemView, listView) {
    switch (item.title) {
        case '命令':
            // a=`${AutoX.toString()};
            // var auto0 = AutoX();
            // auto0.invoke('getFilePath','',(data) => {
            //     let result = {};
            //     result.callback = 'saveFile';
            //     result.filePath = data;
            //     result.content = auto0.aceEditor.getValue();
            //     return result;});`

            // callJavaScript(ui.webView, a, null);
            callJavaScript(ui.webView, 'editor.prompt({ $type: "commands" });', null);
            break;
        case '语法':
            callJavaScript(ui.webView, 'editor.prompt({ $type: "modes" });', null);
            break;
		case '文档':
			app.openUrl("https://www.wuyunai.com/docs/");		
			break;
        case '主题':
            aceEditorStorage = storages.create("aceEditor");
            var arr = []
            let lis = files.listDir('./ace-builds-1.16.0/css/theme/')
            for (let i = 0; i < lis.length; i++) {
                arr.push(files.getNameWithoutExtension(lis[i]))
            }
            arr.sort((a, b) => {
                return a.localeCompare(b);
            });
            var dialog = dialogs.build({
                title: "编辑器主题",
                titleColor: "#1a1c1a",
                items: arr,
                itemsSelectMode: "singleChoice",
                itemsSelectedIndex: aceEditorStorage.get("themeIndex") || 37,
                itemsColor: "#1a1c1a",
                type: "app",
                wrapInScrollView: true,
                positive: "确定"
            }).on("single_choice", (index, item) => {

                aceEditorStorage.put("themeItem", 'ace/theme/' + item);
                aceEditorStorage.put("themeIndex", index);
                toast("您选择的是" + item);
                callJavaScript(ui.webView, `editor.setTheme('ace/theme/${item}');`, null);
            });
            let dialogWindow = dialog.getWindow();
            let gradientDrawable = new android.graphics.drawable.GradientDrawable();
            gradientDrawable.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
            gradientDrawable.setColor(colors.parseColor("#FFFFFF"));
            gradientDrawable.setCornerRadius(80);
            dialogWindow.setBackgroundDrawable(gradientDrawable);
            dialog.show();
            break;
        case '日志':
            showSheetDialog();
            break;
        case '运行':
            let aceEditorStorage = storages.create("aceEditor");
            let file = aceEditorStorage.get("filePath")
            if (files.isFile(file)) {
                try {
                    callJavaScript(ui.webView, AutoX.toString() + ";var auto0 = AutoX();auto0.invoke('getFilePath','',(data) => {let result = {};result.callback = 'saveFile';result.filePath = data;result.content = auto0.aceEditor.getValue();return result;});", null);
                } catch (e) {
                    console.trace(e)
                }
                events.broadcast.emit("refreshPage", '');
                //engines.execScriptFile(file);
                execScriptFile(file)
                if (!files.read(file).includes('"ui";')) {
                    showSheetDialog();
                }
            }
            break;
        case '撤销':
            callJavaScript(ui.webView, 'editor.undo()', null);
            break;
        case '重做':
            callJavaScript(ui.webView, 'editor.redo()', null);
            break;
        case '保存':
            try {
                callJavaScript(ui.webView, AutoX.toString() + ";var auto0 = AutoX();auto0.invoke('getFilePath','',(data) => {let result = {};result.callback = 'saveFile';result.filePath = data;result.content = auto0.aceEditor.getValue();return result;});", null);
            } catch (e) {
                console.trace(e)
            }
            events.broadcast.emit("refreshPage", '');
            toastLog("保存成功！");
            break;
        default:
            // code
    }

});
let actionLeftBar = [{
    title: '格式化',
    onclick: ''
}, {
    title: '↑',
    onclick: 'editor.navigateUp(1);'
}, {
    title: 'TAB',
    onclick: 'editor.indent();'
}, {
    title: '退格',
    onclick: 'editor.remove("left");'
}, {
    title: '←',
    onclick: 'editor.navigateLeft(1)'
}, {
    title: '↓',
    onclick: 'editor.navigateDown(1);'
}, {
    title: '→',
    onclick: 'editor.navigateRight(1);'
}, {
    title: '删除',
    onclick: 'editor.remove("right");'
}];
ui.actionLeftBar.setDataSource(actionLeftBar);
ui.actionLeftBar.on("item_click", function(item, i, itemView, listView) {
    if (item.title === '文档') {
        app.openUrl("https://www.wuyunai.com/docs/");
    } else if (item.title === '格式化') {
        let script = `
        var beautify = ace.require("ace/ext/beautify");
          var session = editor.getSession();
          var selection = editor.getSelection();
            
          if (selection.isEmpty()) {
            // 格式化整个文档
            beautify.beautify(session);
          } else {
           // 格式化选中的文本
            var range = selection.getRange();
            beautify.beautify(session, range);
          }
        `
        callJavaScript(ui.webView, script, null);
    }
    let script = `${item.onclick}`
    callJavaScript(ui.webView, script, null);
});

ui.actionLeftBar.on("item_long_click", function(e, item, i, itemView, listView) {
    if (item.title == "TAB") {
        let script = `var selection = editor.getSelection();
            if (!selection.isEmpty() && "${item.insertText}" == "/") {
                editor.toggleCommentLines();
            } else {
                editor.insert(${JSON.stringify(item.insertText)});
            }`
        callJavaScript(ui.webView, `togglecomment(${JSON.stringify(item.insertText)});`, null);
    }
    e.consumed = true;
});


let symbols = JSON.parse(files.read("symbols.json"));
ui.actionBar.setDataSource(symbols);
ui.actionBar.on("item_click", function(item, i, itemView, listView) {
    //hint

    let script = `var selection = editor.getSelection();
    if (!selection.isEmpty() && "${item.insertText}" == "/") {
        editor.toggleCommentLines();
    } else {
        editor.insert(${JSON.stringify(item.insertText)});
    }`
    callJavaScript(ui.webView, `togglecomment(${JSON.stringify(item.insertText)});`, null);
});




function showSheetDialog() {
    let view = ui.inflate(
        <card bg="#1a1c1a" shadowSize="100" cardCornerRadius="10dp" cardElevation="10dp" id="_card">
            <vertical h="500">
                <horizontal  gravity="right" marginRight="10" w="*">
                    <img id="run"  tint="#c1c9bf" margin="8 16" gravity="center" src="file://res/drawable/play.png" />
                    <img id="delete" tint="#c1c9bf" margin="8 16" gravity="center" src="file://res/drawable/delete.png" />
                    <img id="close"  tint="#c1c9bf" margin="8 16" gravity="center" src="file://res/drawable/minimize.png" />
                    <img id="open"  tint="#c1c9bf" margin="8 16" gravity="center" src="file://res/drawable/enlarge.png" />
                </horizontal>
                <globalconsole w="*" h="*"  id="globalconsole"  />
            </vertical>
            
        </card>

    );
    // shape.widthRipple(activity).setColor("#1a1c1a").setRippleColor("#808080").into(view.run);
    // shape.widthRipple(activity).setColor("#1a1c1a").setRippleColor("#808080").into(view.delete);
    // shape.widthRipple(activity).setColor("#1a1c1a").setRippleColor("#808080").into(view.close);
    // shape.widthRipple(activity).setColor("#1a1c1a").setRippleColor("#808080").into(view.open);

    //view.icons.setDataSource(['', '', '', '']);
    view.globalconsole.setColor("D", "#FFFFFF");
    // view.globalconsole.setColor("D", "#7f7f80");

    let mBottomSheetDialog = new BottomSheetDialog(activity);
    mBottomSheetDialog.setContentView(view);
    let mDialogBehavior = BottomSheetBehavior.from(view.getParent());
    mDialogBehavior.setPeekHeight(getWindowHeight());
    mDialogBehavior.setDraggable(false); //禁止滑动
    mDialogBehavior.setBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback({
        onStartChenged: function(view, i) {
            if (i == BottomSheetBehavior.STATE_HIDDEN) {
                mBottomSheetDialog.dismiss();
                mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
            }
        },
        onSlide: function(view, slideOffset) {
            // 禁止滑动，可以根据需要进行其他处理
            mDialogBehavior.setState(BottomSheetBehavior.STATE_EXPANDED);
        }
    }));

    //显示Dialog
    mBottomSheetDialog.show();
    var window = mBottomSheetDialog.getWindow();
    window.setDimAmount(0.5);

    view.parent.setBackground(null);

    view.run.on("click", function() {
        let aceEditorStorage = storages.create("aceEditor");
        let file = aceEditorStorage.get("filePath");
        if (files.isFile(file)) {
            execScriptFile(file)
        }
    });
    view.delete.on("click", function() {
        view.globalconsole.clear();
    });
    view.close.on("click", function() {
        mBottomSheetDialog.dismiss();
        mDialogBehavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
    });
    view.open.on("click", function() {
        app.startActivity("console");
    });

    function getWindowHeight() {
        let res = context.getResources();
        let displayMetrics = res.getDisplayMetrics();
        return displayMetrics.heightPixels;
    }
}

function execScriptFile(scriptFile) {
    let scriptFileStr = scriptFile.toString();
    let offset = scriptFileStr.lastIndexOf("/");
    let scriptFileDir = scriptFileStr.slice(0, offset + 1);
    engines.execScriptFile(scriptFileStr, {
        path: [scriptFileDir]
    });
}