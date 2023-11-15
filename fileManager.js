"ui";
ui.layout(
    <frame>
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="文件管理" />
            </appbar>
            <HorizontalScrollView id="breadcrumbView" w="*" h="auto" orientation="horizontal">
            </HorizontalScrollView>
            <list id="list" layout_weight="1">
                <card w="*" margin="2" foreground="?selectableItemBackground">
                    <horizontal bg="#FFFFFF">
                        <checkbox layout_gravity="center" gravity="center" marginLeft="5" padding="20" id="{{'fileCheckBox'+index}}"/>
                        <img layout_gravity="center" marginLeft="-40" padding="10" visibility="{{getDirVisibility(file)}}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEkklEQVR42u2bTWwVVRTHf+fMvJf3AX1tIaXyYTFghEAAEwU1RkjAlTHRjYksTNy6050bdhVXxujCjQtXho1gRE3cEDQsRIHykVo1CAQImNqP15aW1jf3Hhczj1dUPiQtPHvfP5nMnXvv3HnnzP+cc+fe86CFFlpoIWDI7Rrt6FsCvt5PZvWvly07mFU22fa+/W8VYMOne7h08BkufVFmrD8HxEguRqIcGsVIlJYRxbzDXIK5GpbU0nKS4JMaWnBs/WCA7u3fS9tq1/QKsCuHilz+6mWG+/YydPQh3JQ0Xu6d2TKLBQ0s2TbIyhfe5tHXP5VFq5JmVEAMYIM/RAx+t5sr3+xhbGAV5mRORh850Q2+l/aN4zbU96UsfbzplKAATA89wYX9vVR/mjvhAaymDB9bwZl3PuTSwVes+kvcdAyw8fMRZz/ZxeipLvAy948wYfTkckTfpdDl7crhz2T5jlrzmEAy2UW1/1ncpMzbUyxRRo6v5NfaXta8JjZy/ABSS272HfZ3N2N35WcA6XjK7l0BtYkKvra6MZpALoZcDuI4vZ4zh3uxh9HP34P+V4Fp8GnoNPPgfaYIj5mBpeX07DAju/aY91nE9ZiZ9b2U1uOzsYwbY0pklNZMI6WT5Lt/pHPXsFQ2Jg0FWA0sY2QcQXs7tC1OFSBzTgqB37uZHHxxHsa+NcYveqR8jcLaE+SXfWwTA/tk8XqXKSBjTz4Hy7qgXE4Fn9cfaLdh+HzAK77axtSJ7bjqBtx4hw0d/kiW7nAKBqJGR+d9Ev5Bznic8Of5pYx9+wbXz3bWw6BRKkB7BVQXpvCz/RtOmDr1GNfP7bbqSVVIjGLO0AUs+D/glGR4J9OXiwqThsws7Df/b+Ywc7WT8VN5xZyBM0KDnxGsJnp/vXFT0UCJCqpglk48QpNfBC2IPoCg3DwhQfKqmA/XBDSnisSGRuExQGOIiqIUlhj59vAIkF+iFFdo5gMkUCcYqQbrAxEFlTQMhqgBEUGikMMgAhJlYTBE+VVnM4BAGaCarssFOhUWFc1kD3MqnDLAQjWB1BME+zWYLr17xXygDDDDvGm2/x+gEtKNk8wHBEsCq5tAoAxwPjMBC/LtYw0nGKQGwAVuAuZduCaAGebINkZCZUDiso+hEAkAmQ9IwpwKYx6f+ID3BcywWsYAQmXAjFc0b0guwAWR2JDIK8U1CXHlj+AUEHcOUeipKfmV05Q29KGlcFggJUdp3THyy6dVyo84SusOUN5yFULYI4yM0vqfKfTsk9LDLs0VjjsGWLz1TQprf0PihRsWJOcprrtAx/O9RJVzkGWLS9tmZ6NH9uOnJpjq6mXy9CbcRJQtliwAKERtjkVb+ilv3kN5w9dSefLGP0FuDg4jh9qoVXcydqSbqTMCPs2dk0hBBRFJ8+kiRWRWnSii2TnS+t7bjTZEQKPsOuuX1Zu5bHm+ngrbSJVN02KtUe/rqbT1fmlKbLrB4zDns3l+1qZGeaOn8twg+WWHpP3p0ZtIcU8R9Nppuc39t2qTu3yu3aFst7hHAJNFm4Je5W6hhRZaaKGF/4C/AANWMLgvJPFXAAAAAElFTkSuQmCC" />
                        <text id="myText" w="35" h="35" textSize="25sp" margin="-35 10 5 10" layout_gravity="center" gravity="center" textColor="#FFFFFF" text="{{getFileExtension(file.name)}}" visibility="{{getFileVisibility(file)}}" />
                        <vertical padding="5" layout_weight="2">
                            <text w="*" textSize="20sp" textColor="#000000" maxLines="1" ellipsize="middle" text="{{file.name}}" />
                            <text w="*" textSize="16sp" textColor="#808080" maxLines="1" ellipsize="middle" text="{{getSize(file.length())}}" />
                        </vertical>
                        <img id="run" layout_gravity="center" padding="10" tint="gray" visibility="{{getJSFileVisibility(file)}}" foreground="?selectableItemBackground" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABB0lEQVR4Ae2aMVGDQRgFvzSUEYAC0IAKVIALUAEuMBEPOKCnpcljrn/Vn+JmZ3ZXwSuyc7n/RkREREREREQO8jX3gybzO69zIg9YXuaRPGD5N+9zRx6w/J4n8oDldT7nTB6w/Jln9IAlKa5pkuKaJimuaZLimi4nruly4pouJ67pcuKaLieu6XLimi4nruly4pouJ67pcuKaLieu6XLimi4nruly4pouJ65pkuKaJiWuDihe52PO/og3ZfSNnNHLPJCPEi9z8jDncXpLMP1LSQpmhRTMzu3B9GrRy92dwfQDBymYFVIwO7cH0w/dPjXYGUyf25CCWSEFs3MkmD67FBEREREREZF/XdzLUeae8rcAAAAASUVORK5CYII=" />
                    </horizontal>
                </card>
            </list>
        </vertical>
        <fab id="changeServerUrl" w="auto" h="auto" src="file://菜单配置.png" margin="16" layout_gravity="bottom|right" alpha="0.5"/>
    </frame>
);


let runScriptArr = [];


let config = require('./common/config.js')
// 公共储存对象
var commonStorage = storages.create("zjh336.cn" + config.commonScriptKey);

let fileManageStorage = storages.create("fileManageStorage");
let defaultPath = fileManageStorage.get("defaultPath") || "/sdcard/appSync/";
if (!defaultPath.endsWith("/")) {
    defaultPath += "/";
}
// 当前文件路径缓存
var curPathCache = defaultPath;
files.createWithDirs(defaultPath);

// 当前文件数组缓存
var curFileCacheArr = [];
var StartDirFile = new java.io.File(defaultPath);
var CurrentDirFile = new java.io.File(StartDirFile);
updateFileData(CurrentDirFile);



// 刷新页面
events.broadcast.on("refreshPage", function() {
    updateFileData(curPathCache);
});


function showBreadcrumbView(curFilePath) {
    // 分割
    let arr = String(curFilePath).split("/");
    // 去除空格项
    let newArr = arr.filter((item) => {
        return String(item) !== ""
    });
    // 拼接视图
    let childView = `<horizontal id="breadCrumb" w="auto" h="auto">`;
    childView += `</horizontal>`;
    ui["breadcrumbView"].removeAllViews();
    ui.inflate(childView, ui["breadcrumbView"], true)


    var textView1 = new android.widget.TextView(context);
    textView1.setText("/");
    textView1.setTextSize(18);

    var layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
    layoutParams.height = 75;
    textView1.setLayoutParams(layoutParams);


    ui["breadCrumb"].addView(textView1);
    for (let i = 0; i < newArr.length; i++) {
        var textView = new android.widget.TextView(context);
        textView.setText(newArr[i]);
        let curArr = newArr.slice(0, i + 1);
        textView.setLayoutParams(layoutParams);
        textView.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function(view) {
                let path = "/" + curArr.join("/");
                updateFileData(path);
            }
        }));
        textView.setTextSize(18);
        ui["breadCrumb"].addView(textView);

        var textView2 = new android.widget.TextView(context);
        textView2.setText("/");
        textView2.setTextSize(18);
        textView2.setLayoutParams(layoutParams);
        ui["breadCrumb"].addView(textView2);
    }

}



ui.changeServerUrl.on("click", () => {
    let apiOptions = ["新建文件", "新建文件夹", "刪除文件", "设置默认路径", "退出文件管理"]
    dialogs.select("请选择操作", apiOptions).then(i => {
        if (i >= 0) {
            if (i === 0) {
                newFile();
                return;
            } else if (i === 1) {
                newDirectory();
                return;
            } else if (i === 2) {
                deleteFile();
                return;
            } else if (i === 3) {
                setDefaultPath();
                return;
            } else if (i === 4) {
                exit();
                return;
            }
        }
    });
})


function newFile() {
    dialogs.rawInput("请输入文件名称", "").then(value => {
        let fun = () => {
            if (!value) {
                toast("文件名称不能为空");
                return;
            }
            if (!curPathCache.endsWith("/")) {
                curPathCache += "/";
            }
            toastLog(curPathCache + value);
            files.createWithDirs(curPathCache + value);
            updateFileData(curPathCache);
        }
        fun();
    });
}


function newDirectory() {
    dialogs.rawInput("请输入文件夹名称", "").then(value => {
        let fun = () => {
            if (!value) {
                toast("文件夹名称不能为空");
                return;
            }
            if (!curPathCache.endsWith("/")) {
                curPathCache += "/";
            }
            files.createWithDirs(curPathCache + value + "/");
            updateFileData(curPathCache);
        }
        fun();
    });
}


function clearAllChecked() {
    for (let i = 0; i < curFileCacheArr.length; i++) {
        let fileCheckBox = ui["fileCheckBox" + i];
        if (fileCheckBox) {
            fileCheckBox.attr("checked", false)
        }
    }
}


function deleteFile() {
    let selectFileArr = [];
    for (let i = 0; i < curFileCacheArr.length; i++) {
        let fileCheckBox = ui["fileCheckBox" + i];
        if (fileCheckBox && fileCheckBox.isChecked()) {
            selectFileArr.push(curFileCacheArr[i]);
        }
    }
    if (selectFileArr.length === 0) {
        toast("请先勾选要删除的文件！");
        return;
    }
    let deleteFilePathArr = selectFileArr.map(item => String(JSON.parse(item.file).path));
    dialogs.confirm("确定要删除这" + selectFileArr.length + "个文件吗？").then(value => {
        if (value) {
            for (let index in deleteFilePathArr) {
                let filePath = String(deleteFilePathArr[index]);
                if (filePath.indexOf("/sdcard/Android") !== -1) {
                    toast(filePath + "可能包含重要文件,不允许删除")
                    continue;
                }
                files.removeDir(filePath)
            }
            toast("删除完成");
            updateFileData(curPathCache);
        }

    });

}

function setDefaultPath() {
    defaultPath = fileManageStorage.get("defaultPath") || "/sdcard/appSync/";
    toast("当前默认文件路径为：" + defaultPath)
    dialogs.rawInput("请输入默认文件路径重新设置", curPathCache).then(value => {
        let fun = () => {
            if (!value) {
                toast("默认文件路径不能为空");
                return;
            }
            fileManageStorage.put("defaultPath", value)
            updateFileData(value);
        }
        fun();
    });
}


ui.list.on("item_click", function(item, i, itemView, listView) {
    var file = item.file;
    if (file.isDirectory()) {
        CurrentDirFile = file;
        updateFileData(CurrentDirFile);
    } else if (file.isFile()) {
        const scriptFileExtensions = [".js", ".json", ".html", ".htm", ".xml", ".md", ".css", ".txt", ".sh", ".vue", "mjs"];
        const lastDotIndex = file.name.lastIndexOf(".");
        const fileExtension = file.name.slice(lastDotIndex);
        if (scriptFileExtensions.includes(fileExtension)) {
            let aceEditorStorage = storages.create("aceEditor");
            aceEditorStorage.put("filePath", file.toString());
            engines.execScriptFile("./ace-builds-1.16.0/loadAceEditor.js");
        } else {
            app.viewFile(file.toString());
        }
    };
});

ui.list.on("item_bind", (itemView, itemHolder) => {
    itemView.run.on("click", () => {
        let item = itemHolder.item;
        file = item.file;
        if (isScriptFile(file)) {
            execScriptFile(file);
        }
    });
});

ui.list.on("item_data_bind", function(itemView, itemHolder) {
    let item = itemHolder.item;
    let paint = new Paint();
    paint.setAntiAlias(true);
    paint.setStyle(Paint.Style.FILL);

    ui.run(function() {
        let color = colors.parseColor(isScriptFile(item.file) ? "#99CC99" : "#888888")
        paint.setColor(color);
        let width = 35;
        let height = 35;
        let radius = Math.min(width, height) / 2;
        let bitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
        let canvas = new android.graphics.Canvas(bitmap);
        canvas.drawCircle(width / 2, height / 2, radius, paint);
        var drawable = new android.graphics.drawable.BitmapDrawable(context.getResources(), bitmap);
        itemView.myText.setBackground(drawable);
    });
});

ui.emitter.on("back_pressed", e => {
    e.consumed = toBack();
});

function updateFileData(path) {
    curPathCache = String(path);
    var file = new java.io.File(path);
    var fileList = file.listFiles();
    var dirList = fileList.filter(function(file) {
        return file.isDirectory();
    }).sort();
    var fileList = fileList.filter(function(file) {
        return file.isFile();
    }).sort();
    var UpDate = dirList.concat(fileList).map((file, index) => {
        return {
            file: file,
            index: index
        };
    });
    curFileCacheArr = JSON.parse(JSON.stringify(UpDate));
    ui.list.setDataSource([]);
    setTimeout(() => {
        ui.list.setDataSource(UpDate);
        // 更新面包屑
        showBreadcrumbView(path);
    }, 10)

    setTimeout(() => {
        // 清除全部选中
        clearAllChecked();
    }, 100)

};

function toBack() {
    if (!String(CurrentDirFile).equals("/sdcard")) {
        CurrentDirFile = CurrentDirFile.getParentFile();
        updateFileData(CurrentDirFile);
        return true;
    } else {
        return false;
    };
};

function isScriptFile(file) {
    return file.isFile() && (file.name.endsWith(".js") || file.name.endsWith(".mjs"))
}




function execScriptFile(scriptFile) {
    let scriptFileStr = scriptFile.toString();
    let offset = scriptFileStr.lastIndexOf("/");
    let scriptFileDir = scriptFileStr.slice(0, offset + 1);
    toastLog("运行" + scriptFileStr + "成功")
    
    let 脚本悬浮控制条 = commonStorage.get("脚本悬浮控制条") || false;
    if(脚本悬浮控制条){
        engines.startFloatingController(scriptFileStr, {
            path: [scriptFileDir]
        }, {
            runImmediately: true
        })    
    } else {
        engines.execScriptFile(scriptFileStr, {
            path: [scriptFileDir]
        }, {
            runImmediately: true
        })
    }
    
}

function getFileExtension(fileName) {
    offset = fileName.lastIndexOf(".");
    if (-1 === offset) {
        // 文件无后缀
        return "?";
    }

    offset++; //skip .
    return fileName.slice(offset, offset + 1).toUpperCase();
}

function getSize(size) {
    let sizeText = "";

    if (Math.round(size / 1073741824) >= 1) {
        sizeText = Math.floor(size / 1073741824 * 100) / 100 + "GB";
    } else if (Math.round(size / 1048576) >= 1) {
        sizeText = Math.floor(size / 1048576 * 100) / 100 + "MB";
    } else if (Math.round(size / 1024) >= 1) {
        sizeText = Math.floor(size / 1024 * 100) / 100 + "KB";
    } else {
        sizeText = size + "B";
    }

    return sizeText;
};

function getDirVisibility(file) {
    return files.isDir(file) ? "visible" : "gone";
}

function getFileVisibility(file) {
    return files.isFile(file) ? "visible" : "gone";
}

function getJSFileVisibility(file) {
    return isScriptFile(file) ? "visible" : "gone";
}