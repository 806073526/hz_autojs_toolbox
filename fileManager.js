"ui";
ui.layout(
    <vertical>
        <appbar>
            <toolbar id="toolbar" title="脚本管理" />
        </appbar>
        <list id="list" layout_weight="1">
            <card w="*" margin="2" foreground="?selectableItemBackground">
                <horizontal bg="#FFFFFF">
                    <img layout_gravity="center" padding="10" visibility="{{getDirVisibility(file)}}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEkklEQVR42u2bTWwVVRTHf+fMvJf3AX1tIaXyYTFghEAAEwU1RkjAlTHRjYksTNy6050bdhVXxujCjQtXho1gRE3cEDQsRIHykVo1CAQImNqP15aW1jf3Hhczj1dUPiQtPHvfP5nMnXvv3HnnzP+cc+fe86CFFlpoIWDI7Rrt6FsCvt5PZvWvly07mFU22fa+/W8VYMOne7h08BkufVFmrD8HxEguRqIcGsVIlJYRxbzDXIK5GpbU0nKS4JMaWnBs/WCA7u3fS9tq1/QKsCuHilz+6mWG+/YydPQh3JQ0Xu6d2TKLBQ0s2TbIyhfe5tHXP5VFq5JmVEAMYIM/RAx+t5sr3+xhbGAV5mRORh850Q2+l/aN4zbU96UsfbzplKAATA89wYX9vVR/mjvhAaymDB9bwZl3PuTSwVes+kvcdAyw8fMRZz/ZxeipLvAy948wYfTkckTfpdDl7crhz2T5jlrzmEAy2UW1/1ncpMzbUyxRRo6v5NfaXta8JjZy/ABSS272HfZ3N2N35WcA6XjK7l0BtYkKvra6MZpALoZcDuI4vZ4zh3uxh9HP34P+V4Fp8GnoNPPgfaYIj5mBpeX07DAju/aY91nE9ZiZ9b2U1uOzsYwbY0pklNZMI6WT5Lt/pHPXsFQ2Jg0FWA0sY2QcQXs7tC1OFSBzTgqB37uZHHxxHsa+NcYveqR8jcLaE+SXfWwTA/tk8XqXKSBjTz4Hy7qgXE4Fn9cfaLdh+HzAK77axtSJ7bjqBtx4hw0d/kiW7nAKBqJGR+d9Ev5Bznic8Of5pYx9+wbXz3bWw6BRKkB7BVQXpvCz/RtOmDr1GNfP7bbqSVVIjGLO0AUs+D/glGR4J9OXiwqThsws7Df/b+Ywc7WT8VN5xZyBM0KDnxGsJnp/vXFT0UCJCqpglk48QpNfBC2IPoCg3DwhQfKqmA/XBDSnisSGRuExQGOIiqIUlhj59vAIkF+iFFdo5gMkUCcYqQbrAxEFlTQMhqgBEUGikMMgAhJlYTBE+VVnM4BAGaCarssFOhUWFc1kD3MqnDLAQjWB1BME+zWYLr17xXygDDDDvGm2/x+gEtKNk8wHBEsCq5tAoAxwPjMBC/LtYw0nGKQGwAVuAuZduCaAGebINkZCZUDiso+hEAkAmQ9IwpwKYx6f+ID3BcywWsYAQmXAjFc0b0guwAWR2JDIK8U1CXHlj+AUEHcOUeipKfmV05Q29KGlcFggJUdp3THyy6dVyo84SusOUN5yFULYI4yM0vqfKfTsk9LDLs0VjjsGWLz1TQprf0PihRsWJOcprrtAx/O9RJVzkGWLS9tmZ6NH9uOnJpjq6mXy9CbcRJQtliwAKERtjkVb+ilv3kN5w9dSefLGP0FuDg4jh9qoVXcydqSbqTMCPs2dk0hBBRFJ8+kiRWRWnSii2TnS+t7bjTZEQKPsOuuX1Zu5bHm+ngrbSJVN02KtUe/rqbT1fmlKbLrB4zDns3l+1qZGeaOn8twg+WWHpP3p0ZtIcU8R9Nppuc39t2qTu3yu3aFst7hHAJNFm4Je5W6hhRZaaKGF/4C/AANWMLgvJPFXAAAAAElFTkSuQmCC" />
                    <text id="myText" w="35" h="35" textSize="25sp" margin="5 10 5 10" layout_gravity="center" gravity="center" textColor="#FFFFFF" text="{{getFileExtension(file.name)}}" visibility="{{getFileVisibility(file)}}" />
                    <vertical padding="5" layout_weight="2">
                        <text w="*" textSize="20sp" textColor="#000000" maxLines="1" ellipsize="middle" text="{{file.name}}" />
                        <text w="*" textSize="16sp" textColor="#808080" maxLines="1" ellipsize="middle" text="{{getSize(file.length())}}" />
                    </vertical>
                    <img id="run" layout_gravity="center" padding="10" tint="gray" visibility="{{getJSFileVisibility(file)}}" foreground="?selectableItemBackground" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAABB0lEQVR4Ae2aMVGDQRgFvzSUEYAC0IAKVIALUAEuMBEPOKCnpcljrn/Vn+JmZ3ZXwSuyc7n/RkREREREREQO8jX3gybzO69zIg9YXuaRPGD5N+9zRx6w/J4n8oDldT7nTB6w/Jln9IAlKa5pkuKaJimuaZLimi4nruly4pouJ67pcuKaLieu6XLimi4nruly4pouJ67pcuKaLieu6XLimi4nruly4pouJ65pkuKaJiWuDihe52PO/og3ZfSNnNHLPJCPEi9z8jDncXpLMP1LSQpmhRTMzu3B9GrRy92dwfQDBymYFVIwO7cH0w/dPjXYGUyf25CCWSEFs3MkmD67FBEREREREZF/XdzLUeae8rcAAAAASUVORK5CYII=" />
                </horizontal>
            </card>
        </list>
    </vertical>
);

files.createWithDirs("/sdcard/appSync");
var StartDirFile = new java.io.File("/sdcard/appSync");

var CurrentDirFile = new java.io.File(StartDirFile);
updateFileData(CurrentDirFile);

ui.list.on("item_click", function (item, i, itemView, listView) {
    var file = item.file;
    if (file.isDirectory()) {
        CurrentDirFile = file;
        updateFileData(CurrentDirFile);
    } else if (file.isFile()) {
        const scriptFileExtensions = [".js", ".json", ".html", ".htm", ".xml", ".md", ".css", ".txt", ".sh", ".vue" ];
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

ui.list.on("item_data_bind", function (itemView, itemHolder) {
    let item = itemHolder.item;
    let paint = new Paint();
    paint.setAntiAlias(true);
    paint.setStyle(Paint.Style.FILL);

    ui.run(function () {
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
    var file = new java.io.File(path);
    var fileList = file.listFiles();
    var dirList = fileList.filter(function (file) {
        return file.isDirectory();
    }).sort();
    var fileList = fileList.filter(function (file) {
        return file.isFile();
    }).sort();
    var UpDate = dirList.concat(fileList).map(function (file) {
        return { file: file };
    });

    ui.list.setDataSource(UpDate);
};

function toBack() {
    if (!CurrentDirFile.equals(StartDirFile)) {
        CurrentDirFile = CurrentDirFile.getParentFile();
        updateFileData(CurrentDirFile);
        return true;
    } else {
        return false;
    };
};

function isScriptFile(file) {
    return file.isFile() && file.name.endsWith(".js")
}

function execScriptFile(scriptFile) {
    scriptFileStr = scriptFile.toString();
    offset = scriptFileStr.lastIndexOf("/");
    scriptFileDir = scriptFileStr.slice(0, offset + 1);

    engines.execScriptFile(scriptFile, { path: [scriptFileDir] })
	toastLog("运行"+scriptFile+"成功")
}

function getFileExtension(fileName) {
    offset = fileName.lastIndexOf(".");
    if (-1 === offset) {
        // 文件无后缀
        return "?";
    }

    offset++;   //skip .
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