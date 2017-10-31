/**
 * TK权限控制类
 * @class TkAppPermissions
 * @description   提供 TK系统所需的权限控制
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import eventObjectDefine from 'eventObjectDefine';

class TkAppPermissions{
    constructor(){
        this.permissionsJson = this.productionDefaultAppAppPermissions();
    };

    productionDefaultAppAppPermissions(){
        let defaultAppPermissions =  {
            canDraw:false , //画笔权限
            classBtnIsDisableOfRemind:false,//根据提示上课按钮能否点击
            loadClassbeginRemind:false,//加载上课提示权限
            whiteboardPagingPage:false , //白板翻页权限
            newpptPagingPage:false , //动态ppt翻页权限
            h5DocumentPagingPage:false , //h5课件翻页权限
            h5DocumentActionClick:false,//h5课件点击动作的权限
            dynamicPptActionClick:false,//动态PPT点击动作的权限
            pubMsg:true , //pubMsg 信令权限
            delMsg:true , //delMsg 信令权限
            setProperty:true , //setProperty 信令权限
            setParticipantPropertyToAll:true , //setParticipantPropertyToAll 设置参与者属性发送给所有人权限
            sendSignallingDataToParticipant:true , //sendSignallingDataToParticipant 发送信令pubmsg和delmsg的权限
            sendTextMessage:true , //发送聊天消息的权限
            sendSignallingFromClassBegin:false , //上下课信令权限
            sendSignallingFromUpdateTime:false , //发送更新时间信令权限
            sendSignallingFromSharpsChange:false , //发送白板数据相关的信令权限
            sendSignallingFromWBPageCount:false , //发送白板加页相关的信令权限
            sendSignallingFromShowPage:false , //发送ShowPage相关的信令权限
            sendSignallingFromDynamicPptShowPage:false , //发送动态PPT的ShowPage相关数据权限
            sendSignallingFromH5ShowPage:false , //发送H5文档的ShowPage相关数据权限
            sendSignallingFromGeneralShowPage:false , //发送普通文档的ShowPage相关数据权限
            sendSignallingFromDynamicPptTriggerActionClick:false , //发送动态PPT触发器NewPptTriggerActionClick相关的信令权限
            sendSignallingFromH5DocumentAction:false,//发送h5文档相关动作的信令权限
            sendSignallingFromDocumentChange:false , //发送文档上传或者删除相关的信令权限
            sendSignallingFromStreamFailure:false , //数据流失败后发送信令权限
            sendSignallingFromVideoDraghandle:false,//拖拽的信令权限
            userPlatformUpOrDown:false , //上下讲台信令的发送权限
            userAudioOpenOrClose:false , //打开关闭音频权限
            userVideoOpenOrClose:false , //打开关闭视频权限
            changeUserCandraw:false , //改变用户的画笔权限
            sendGift:false , //发送礼物权限
            roomStart:false , //上课发送的web接口roomstart权限
            roomOver:false , //下课发送的web接口roomove权限
            giveAllUserSendGift:false , //给所有用户发送礼物权限
            giveAloneUserSendGift:false , //给单独用户发送礼物权限
            allUserMute:false , //全体静音权限
            startClassBegin:false , //上课权限
            endClassBegin: false, //下课权限
            forcedEndClassBegin: false, //强制下课权限
            raisehand: false, //举手权限
            raisehandDisable:false , //举手不可点击权限
            loadUserlist:false , //加载用户列表的权限
            loadCoursewarelist:true , //加载文档文件列表的权限
            loadMedialist:true , //加载媒体文件列表的权限
            loadSystemSettings:true,//加载系统设置的权限
            loadNoviceHelp:true,//加载新手帮助的权限
            showUserlistIcon:false , //显示用户列表的状态图标权限
            laser:false , //激光笔权限
            autoPublishAV:false , //自动发布音视频权限
            userlisPlatform:false , //用户列表点击上下台的权限
            openFileIsClick:true,//是否能点击打开文档和媒体文件的权限
            publishMediaStream:false , //发布媒体文件流的权限
            unpublishMediaStream:false , //取消发布媒体文件流的权限
            publishDynamicPptMediaPermission_video:false , //发布动态PPT视频的权限
            autoClassBegin:false , //自动上课权限
            hiddenClassBeginAutoClassBegin:false , //隐藏上下课按钮自动上课权限
            dblclickDeviceVideoFullScreenRight:false , //双击右侧设备流全屏
            dblclickDeviceVideoFullScreenBottom:false , //双击底部设备流全屏
            studentVframeBtnIsHide:true,//学生关闭音视频的按钮是否隐藏
            teacherVframeBtnIsShow:false,//老师视频框的按钮是否能显示的权限
            endClassbeginRevertToStartupLayout:false , //下课后恢复界面的默认界面的权限
            endClassbeginShowLocalStream:false , //下课后显示本地视频权限
            delmsgTo__AllAll:false , //清除所有信令的权限
        }; //权限存储json
        return defaultAppPermissions;
    }

    /*重置默认的权限*/
    resetDefaultAppPermissions(isSendReset = true){
        const that = this ;
        that.permissionsJson = that.productionDefaultAppAppPermissions();
        if(isSendReset){
            eventObjectDefine.CoreController.dispatchEvent({
                // type:'resetDefaultAppPermissions',
                type:'initAppPermissions',
                message:{
                    data:that.permissionsJson ,
                }
            });
        }
    };

    /*重置权限*/
    resetAppPermissions( appPermissions ,  isSendReset = true){
        const that = this ;
        if(appPermissions && typeof appPermissions === 'object'){
            Object.assign(that.permissionsJson , appPermissions) ;
            if(isSendReset){
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'resetAppPermissions',
                    message:{
                        data:that.permissionsJson ,
                    }
                });
            }
        }
    };

    /*设置（更新）权限
    *@method updateAppPermissions
    *@params [appPermissionsKey:string , appPermissionsValue:any ] */
    setAppPermissions(appPermissionsKey ,appPermissionsValue ){
        let that = this ;
        if(that.permissionsJson[appPermissionsKey] !== appPermissionsValue){
            L.Logger.info('setAppPermissions key and value:' , appPermissionsKey , appPermissionsValue  , 'old appPermissions:' , that.permissionsJson[appPermissionsKey] );
            that.permissionsJson[appPermissionsKey] = appPermissionsValue ;
            let updateAppPermissionsEventData = {
                type:'updateAppPermissions_'+appPermissionsKey ,
                message:{
                    key:appPermissionsKey ,
                    value:appPermissionsValue
                }
            };
            eventObjectDefine.CoreController.dispatchEvent(updateAppPermissionsEventData);
        }
    };
    /*设置（更新）权限
     *@method updateAppPermissions
     *@params [appPermissionsKey:string] */
    getAppPermissions(appPermissionsKey){
        let that = this ;
        return that.permissionsJson[appPermissionsKey] ;
    };
    /*初始化权限
     *@method initAppPermissions
     *@params [initAppPermissionsJson:json] */
    initAppPermissions(initAppPermissionsJson){
        L.Logger.info('initAppPermissions data:' , initAppPermissionsJson );
        let that = this ;
        for(let appPermissionsKey in initAppPermissionsJson){
            that.permissionsJson[appPermissionsKey] = initAppPermissionsJson[appPermissionsKey] ;
        }
        eventObjectDefine.CoreController.dispatchEvent({
            type:'initAppPermissions',
            message:{
                data:that.permissionsJson ,
            }
        });
    };

};
const TkAppPermissionsInstance = new TkAppPermissions() ;
export  default TkAppPermissionsInstance ;
