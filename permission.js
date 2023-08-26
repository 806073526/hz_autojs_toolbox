importClass("android.content.pm.PackageManager");
importClass("android.provider.Settings");
let myPackageName = context.getPackageName();
let obj = {}
let utils = require('./common/utils.js')
obj.init = function() {
    refreshState();
    //可以在回到界面时，刷新开关状态
    ui.emitter.on("resume", function() {
        refreshState();
    });
    ui.autoService.on("check", function(checked) {
        setAutoService(checked);
    });
    ui.floatyPermission.on("check", function(checked, view) {
        //这里演示下使用startActivityForResult
        if (checked) {
            //当开启开关时，这里建议设计成检查权限并在回调中判断权限，打开自己设计的悬浮窗
            if (floaty.checkPermission()) {
                toast("打开悬浮窗");
            } else {
                //没有权限时去打开悬浮窗5
                let mIntent = app.intent({
                    action: "android.settings.action.MANAGE_OVERLAY_PERMISSION",
                    data: "package:" + myPackageName,
                });
                //这里把数字1作为标记
                activity.startActivityForResult(mIntent, 1);
            }
        } else {
            //当关闭开关时，这里建议设计成关闭自己设计的悬浮窗，而不是悬浮窗权限
            if (view.isPressed()) {
                //这个判断是为了防止ui.floatyPermission.setChecked(false)引起的多余的监听
                toastLog("悬浮窗已关闭");
            }
        }
    });
    activity.getEventEmitter().on("activity_result", (requestCode, resultCode, data) => {
        if (requestCode == 1) {
            //requestCode为1说明是跳转到开启悬浮窗权限的activity结束的回调
            if (floaty.checkPermission()) {
                //这里执行有悬浮权限之后的代码
                console.log("有权限");
            } else {
                //这里可以关闭Ui界面的开关
                console.log("无权限");
                //注意这里设置开关状态同样会触发ui.floatyPermission的check监听
                ui.floatyPermission.setChecked(false);
            }
        }
    });
    ui.foregroundService.on("check", function(checked) {
        //这个很简单，没啥讲的
        $settings.setEnabled("foreground_service", checked);
    });
    /* ui.stableMode.on("check", function (checked) {
        //这个设置后需要重启下无障碍
        $settings.setEnabled("stable_mode", checked);
        toast("需重新打开无障碍");
        ui.autoService.setChecked(false);
    }); */
    /*  ui.screenCapturePermission.on("check", function (checked) {
         //截图权限的申请是阻塞的，需要新启动线程
         threads.start(function () {
             try {
                 if (checked) {
                     images.requestScreenCapture({orientation:utils.getOrientation()});
                 } else {
                     $images.stopScreenCapture();
                 }
             } catch (error) {

             }
         });
     }); */
    /*   ui.usageStatsPermission.on("check", function (checked) {
          if (checked) {
              if (!checkSystemService("usage_stats")) {
                  app.startActivity({
                      action: "android.settings.USAGE_ACCESS_SETTINGS",
                  });
              }
          } else {
              toastLog("需手动关闭");
              ui.usageStatsPermission.setChecked(true);
          }
      }); */
    ui.backgroundOpenPermission.on("check", function(checked) {
        if (checked) {
            toastLog("手动设置成功即可,开关仅用于跳转设置页面");
            app.openAppSetting(myPackageName);
            ui.backgroundOpenPermission.checked = false;
        }
    });


    ui.battery.on("check", function(checked) {
        if (checked) {
            toastLog("手动设置成功即可,开关仅用于跳转设置页面");
            app.openAppSetting(myPackageName);
            ui.battery.checked = false;
        }
    });


    function refreshState() {
        ui.autoService.checked = auto.service != null;
        ui.floatyPermission.checked = floaty.checkPermission();
        ui.foregroundService.checked = $settings.isEnabled("foreground_service");
        // ui.stableMode.checked = $settings.isEnabled("stable_mode");
        // ui.screenCapturePermission.checked = !!$images.getScreenCaptureOptions();
        // ui.usageStatsPermission.checked = checkSystemService("usage_stats");
        // ui.backgroundOpenPermission.checked = checkMiuiPermission(10021);
        // ui.ignoreBatteryOptimizations = $power_manager.isIgnoringBatteryOptimizations();
    }

    function setAutoService(checked) {
        if (checked) {
            if (checkPermission("android.permission.WRITE_SECURE_SETTINGS")) {
                openAccessibility();
            } else {
                if ($shell.checkAccess("adb")) {
                    shell("pm grant " + myPackageName + " android.permission.WRITE_SECURE_SETTINGS", {
                        adb: true,
                    });
                    toastLog("adb授权成功");
                    openAccessibility();
                } else {
                    if ($shell.checkAccess("root")) {
                        shell("pm grant " + myPackageName + " android.permission.WRITE_SECURE_SETTINGS", {
                            root: true,
                        });
                        toastLog("root授权成功");
                        openAccessibility();
                    } else {
                        console.info("\n也可使用WRITE_SECURE_SETTINGS权限开启无障碍服务\n授权代码已复制，使用adb激活");
                        setClip("adb shell pm grant " + myPackageName + " android.permission.WRITE_SECURE_SETTINGS");
                        app.startActivity({
                            action: "android.settings.ACCESSIBILITY_SETTINGS",
                        });
                    }
                }
            }
        } else if (auto.service != null) {
            auto.service.disableSelf();
        }
    }

    function openAccessibility() {
        let mServices = ":" + myPackageName + "/com.stardust.autojs.core.accessibility.AccessibilityService";
        let enabledServices = Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES)
        enabledServices = enabledServices ? enabledServices.replace(new RegExp(mServices, "g"), "") : "";
        Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, "");
        Settings.Secure.putString(context.getContentResolver(), Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES, enabledServices + mServices);
    }

    function checkPermission(permission) {
        pm = context.getPackageManager();
        return PackageManager.PERMISSION_GRANTED == pm.checkPermission(permission, context.getPackageName().toString());
    }

    function checkSystemService(service) {
        importClass(android.app.AppOpsManager);
        appOps = context.getSystemService(context.APP_OPS_SERVICE);
        mode = appOps.checkOpNoThrow("android:get_" + service, android.os.Process.myUid(), context.getPackageName());
        return (granted = mode == AppOpsManager.MODE_ALLOWED);
    }

    function checkMiuiPermission(flag) {
        //flag为10021是后台弹出界面,为10016是NFC权限
        importClass(android.app.AppOpsManager);
        let appOps = context.getSystemService(context.APP_OPS_SERVICE);
        try {
            let myClass = util.java.array("java.lang.Class", 3);
            myClass[0] = java.lang.Integer.TYPE;
            myClass[1] = java.lang.Integer.TYPE;
            myClass[2] = java.lang.Class.forName("java.lang.String");
            let method = appOps.getClass().getMethod("checkOpNoThrow", myClass);
            let op = new java.lang.Integer(flag);
            result = method.invoke(appOps, op, new java.lang.Integer(android.os.Process.myUid()), context.getPackageName());
            return result == AppOpsManager.MODE_ALLOWED;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
module.exports = obj