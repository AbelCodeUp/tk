/**
 * 提示框服务
 * @module ServiceTooltip
 * @description  提供 提示框的相关服务
 * @author QiuShao
 * @date 2017/08/07
 */
import TkGlobal from "TkGlobal" ;
import '../../css/LxNotificationService.css';

'use strict';
const LxNotificationService =  {
    alert:function (title,message,ok,callback , type ) {
        let alertWin = '<section id="alert-error-confrim" class="alert-error-confrim "'+(type==='error'?' error-message':'prompt-message')+'  ><div id="alert-box" class="alert-box"><div class="alert-title"><p class="title-text">'+ title
            + '</p><button class="title-close" id="title-close"></button></div><div class="alert-contant">'+ message
            + '</div><div class="alert-isOk"><button id="alert-confrim">' + ok + '</button></div></div></section>';
        $("#alert-error-confrim").remove();
        $("body").append(alertWin);
        setTimeout(function () {
            $("#alert-box").addClass("center");
        },0);
        //取消
        $("#alert-confrim,#title-close").click(function () {
            $("#alert-box").removeClass("center");
            setTimeout(function () {
                $("#alert-error-confrim").remove("#alert-error-confrim");
            },0);
            callback(true);
        });
    },
    confirm:function (title,message,isOk,callback) {
        let alertWin = '<section id="alert-error-confrim" class="alert-error-confrim"><div id="alert-box" class="alert-box"><div class="alert-title"><p class="title-text">'+ title
            + '</p></div><div class="alert-contant">'+ message
            + '</div><div class="alert-isOk"><button id="alert-confrim" class="alert-confrim" >' + isOk.ok
            + '</button><button id="alert-cancel"  class="alert-cancel"  >' + isOk.cancel + '</button></div></div></section>';
        $("#alert-error-confrim").remove();
        $("body").append(alertWin);
        setTimeout(function () {
            $("#alert-box").addClass("center");
        },0);
        //同意
        $("#alert-confrim").click(function () {
            $("#alert-box").removeClass("center");
            setTimeout(function () {
                $("#alert-error-confrim").remove("#alert-error-confrim");
            },0);
            callback(true);
        });
        //不同意
        $("#alert-cancel").click(function () {
            $("#alert-box").removeClass("center");
            setTimeout(function () {
                $("#alert-error-confrim").remove("#alert-error-confrim");
            },0);
            callback(false);
        });
    }
};
const Tooltip = {
    showAlert:function(msg, callback) {
        LxNotificationService.alert( msg.title, msg.message, msg.ok, function(answer) {
            if(callback && typeof callback === "function") {
                callback(answer);
            }
        });
    },
    showConfirm:function(msg, callback) {
        LxNotificationService.confirm(msg.title, msg.message, {
                cancel: msg.button.cancel,
                ok: msg.button.ok
            },
            function(answer) {
                if(callback && typeof callback === "function") {
                    callback(answer);
                }
            }
        );
    }
};
const ServiceTooltip = {
    /*显示错误提示框*/
    showError:function(errorMessage, callback, title, ok) {
        let e = {
            message: errorMessage,
            title: title ? title : TkGlobal.language.languageData.alertWin.title.showError.text,
            ok: ok ? ok : TkGlobal.language.languageData.alertWin.ok.showError.text
        } ;
        Tooltip.showAlert(e , callback);
    } ,

    /*显示正常提示框*/
    showPrompt:function(tipMessage, callback, title, ok) {
        let msg = {
            message: tipMessage,
            title: title ? title : TkGlobal.language.languageData.alertWin.title.showPrompt.text,
            ok: ok ? ok : TkGlobal.language.languageData.alertWin.ok.showPrompt.text
        };
        Tooltip.showAlert(msg , callback);
    } ,

    /*显示确认对话框*/
    showConfirm:function(confirmMessage, confirmCallback, title, ok , cancel) {
        let msg = {
            title: title ? title :TkGlobal.language.languageData.alertWin.title.showConfirm.text,
            button: {
                cancel:cancel ? cancel : TkGlobal.language.languageData.alertWin.ok.showConfirm.cancel,
                ok: ok ? ok : TkGlobal.language.languageData.alertWin.ok.showConfirm.ok
            },
            message: confirmMessage
        };
        Tooltip.showConfirm(msg, confirmCallback);
    }
};
export default  ServiceTooltip ;