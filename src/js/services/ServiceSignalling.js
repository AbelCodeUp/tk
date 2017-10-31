/**
 * 信令服务
 * @module ServiceSignalling
 * @description  提供 信令相关的功能服务
 * @author QiuShao
 * @date 2017/08/12
 */
import SignallingInterface from 'SignallingInterface' ;
import ServiceRoom from 'ServiceRoom' ;
import TkUtils from 'TkUtils' ;
import TkConstant from 'TkConstant' ;
import CoreController from 'CoreController' ;

class ServiceSignalling extends SignallingInterface {
    constructor() {
        super();
    }

    /*发送上下课信令
     * method sendSignallingFromClassBegin
     * params [isDelMsg:boolean(true-上课,false-下课) ,  toID:string ,do_not_save:boolean ] */
    sendSignallingFromClassBegin(isDelMsg  , do_not_save){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromClassBegin') ){return ;} ;
        const that = this ;
        let id , data = {} , signallingName = "ClassBegin" , toID = "__all"  , expiresabs = undefined;
        if(TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.endtime){
            //expiresabs =  Number(TkConstant.joinRoomInfo.endtime) + 5*60;//服务器自动下课时间
        }
        id = signallingName  ;
        data.recordchat = true ; //录制聊天消息
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data , do_not_save  , expiresabs);
    };

    /*发送更新时间信令
     * method sendSignallingFromUpdateTime */
    sendSignallingFromUpdateTime(toParticipantID){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromUpdateTime') ){return ;} ;
        const that = this ;
        let isDelMsg = false  , id = "UpdateTime" , toID= toParticipantID || "__all" , data = {} , signallingName = "UpdateTime"   , do_not_save = true ;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save);
    };

    /*发送白板数据相关的信令SharpsChange
     *@method  sendSignallingFromSharpsChange */
    sendSignallingFromSharpsChange(currPageNum , currFileId ,isDelMsg , idPrefix , data , signallingName , assignId , do_not_save){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromSharpsChange') ){return ;} ;
        const that = this ;
        let toID="__allExceptSender" ;
        if(isDelMsg){
            do_not_save = true ;
        }
        let id = assignId || idPrefix + "###_"+signallingName+"_"+currFileId+"_"+currPageNum;
        data = JSON.stringify(data);
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save) ;
    }

    /*发送白板加页相关的信令WBPageCount
    * @method sendSignallingFromWBPageCount */
    sendSignallingFromWBPageCount(data){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromWBPageCount') ){return ;} ;
        const that = this ;
        let signallingName = "WBPageCount" ;
        let id = "WBPageCount";
        let dot_not_save = undefined ;
        let isDelMsg = false ;
        let toID="__allExceptSender" ;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*发送ShowPage相关的信令
    *@method sendSignallingFromShowPage */
    sendSignallingFromShowPage(isDelMsg , id , data , toID = '__allExceptSender'){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromShowPage') ){return ;} ;
        if(data && typeof data === 'string'){
            data = JSON.parse(data);
        }
        if(data.isDynamicPPT && !CoreController.handler.getAppPermissions('sendSignallingFromDynamicPptShowPage') ){return ;}
        if(data.isH5Document && !CoreController.handler.getAppPermissions('sendSignallingFromH5ShowPage') ){return ;}
        if(data.isGeneralFile && !CoreController.handler.getAppPermissions('sendSignallingFromGeneralShowPage') ){return ;}
        const that = this ;
        let signallingName = "ShowPage" ;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data ) ;
    };

    /*发送动态PPT触发器NewPptTriggerActionClick相关的信令
    * @method */
    sendSignallingFromDynamicPptTriggerActionClick(data){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromDynamicPptTriggerActionClick') ){return ;} ;
        const that = this ;
        let  signallingName = "NewPptTriggerActionClick" , id = "NewPptTriggerActionClick" , toID="__allExceptSender"  , isDelMsg = false , dot_not_save = true;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };
    /*h5文档的动作相关信令*/
    sendSignallingFromH5DocumentAction(data) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromH5DocumentAction') ){return ;} ;
        const that = this;
        let signallingName = "H5DocumentAction" , id = "H5DocumentAction" , toID="__allExceptSender"  , isDelMsg = false , dot_not_save = true;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };
    /*拖拽的动作相关信令*/
    sendSignallingFromVideoDraghandle(data) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromVideoDraghandle') ){return ;} ;
        const that = this;
        let signallingName = "videoDraghandle" , id = "videoDraghandle" , toID="__allExceptSender"  , isDelMsg = false , dot_not_save = false;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*与父框架通信的相关信令*/
    sendSignallingToParentIframe(sendDataWrap) {
        const that = this;
        let {id , signallingName , toID = '__all' , data , source , save = true ,  delmsg = false } = sendDataWrap ;
        id = id || signallingName ;
        signallingName = "outIframe_" + signallingName;
        that.sendSignallingDataToParticipant(delmsg , signallingName ,id , toID ,  sendDataWrap , !save) ;
    }

    /*发送文档上传或者删除相关的信令DocumentChange
     *@method  sendSignallingFromDocumentChange */
    sendSignallingFromDocumentChange(data , toID){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromDocumentChange') ){return ;} ;
        const that = this ;
        let signallingName = "DocumentChange";
        let id = signallingName;
        let do_not_save = true;
        let isDelMsg = false;
        toID = toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save );
    }

    /*数据流失败后发送信令StreamFailure
    * @method sendSignallingFromStreamFailure*/
    sendSignallingFromStreamFailure(failStreamUserid){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromStreamFailure') ){return ;} ;
        const that = this ;
        if(!failStreamUserid){ L.Logger.error( 'sendSignallingFromStreamFailure stream extensionId is not exist!' ) } ;
        if( failStreamUserid === ServiceRoom.getTkRoom().getMySelf().id ){
            let signallingName = "StreamFailure" ;
            let id = signallingName , toID=null  , do_not_save = true , isDelMsg = false , data = {studentId:failStreamUserid};
            for(let userid of Object.keys( ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleChairman) ) ){
                 toID = userid ;
                that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save );
            }
            for(let userid of Object.keys( ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleTeachingAssistant) ) ){
                toID = userid ;
                that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save );
            }
        }
    };

    /*用户功能-上下讲台信令的发送
    * @method userPlatformUpOrDown*/
    userPlatformUpOrDown(userid){
        if( !CoreController.handler.getAppPermissions('userPlatformUpOrDown') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        if(!user){ L.Logger.error("not user , id:"+userid); }
        let publishstate = user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? ( user.hasvideo ? (user.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH : TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ): ( user.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE   )  ) : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ;
        that.changeUserPublish(user.id , publishstate) ;
        let userPropertyData = {} ;
        if( publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE &&  user.candraw ){ //如果下台并且当前可画,则设置不可画
            userPropertyData.candraw= false ;
        }
        if(user.raisehand){ //如果举手则置为不举手
            userPropertyData.raisehand = false ;
        }
        if(!TkUtils.isEmpty(userPropertyData)){
            that.setParticipantPropertyToAll( user.id , userPropertyData);
        }
    };

    /*用户功能-打开关闭音频
    * @method userAudioOpenOrClose*/
    userAudioOpenOrClose(userid){
        if( !CoreController.handler.getAppPermissions('userAudioOpenOrClose') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        if(!user){ L.Logger.error("not user , id:"+userid); } ;
        let data = {} ;
        let isSet = false ;
        if(user.raisehand){
            data.raisehand = false;
        }
        if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ){  //之前状态为1 ==>变为4
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ){  //之前状态为2 ==>变为3
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ){  //之前状态为3 ==>变为2
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL ){  //之前状态为4 ==>变为1
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){  //之前状态为0 ==>变为1
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ;
            isSet = true ;
        }
        if(isSet){
            that.setParticipantPropertyToAll(userid, data);
        }
    };

    /*用户功能-打开关闭视频
     *@method userVideoOpenOrClose*/
    userVideoOpenOrClose(userid){
        if( !CoreController.handler.getAppPermissions('userVideoOpenOrClose') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        let isSet = false ;
        let data = {} ;
        if(user.raisehand){
            data.raisehand = false;
        }
        if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ){  //之前状态为1 ==>变为3
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ){  //之前状态为2 ==>变为4
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ){  //之前状态为3 ==>变为1
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL ){  //之前状态为4 ==>变为2
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){  //之前状态为0 ==>变为2
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY;
            isSet = true ;
        }
        if(isSet){
            that.setParticipantPropertyToAll(userid, data);
        }
    };
    
    /*改变用户的画笔权限
     *@method changeUserCandraw*/
    changeUserCandraw(userid){
        if( !CoreController.handler.getAppPermissions('changeUserCandraw') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        if(!user){ L.Logger.error("not user , id:"+userid); return ; }
        that.setParticipantPropertyToAll( user.id , {candraw:!user.candraw});
    } ;

    /*发布媒体文件流*/
    publishMediaStream(stream, options, callback){
        if( !CoreController.handler.getAppPermissions('publishMediaStream') ){return  false;} ;
        if(!stream){ L.Logger.error("publishMediaStream stream is not exist!"); return false; }
        L.Logger.info('publishMediaStream stream info:' , {url:stream.url , extensionId:stream.extensionId , attributes:stream.getAttributes() } );
        ServiceRoom.getTkRoom().publishMedia(stream, options, callback );
    };

    /*发布媒体文件流*/
    unpublishMediaStream(stream , callback){
        if( !CoreController.handler.getAppPermissions('unpublishMediaStream') ){return false;} ;
        if(!stream){ L.Logger.error("unpublishMediaStream stream is not exist!"); return false; }
        L.Logger.info('unpublishMediaStream stream info:' , {url:stream.url , extensionId:stream.extensionId ,  attributes:stream.getAttributes()} );
        ServiceRoom.getTkRoom().unpublishMedia(stream ,callback );
    };


    /*改变用户的发布状态*/
    changeUserPublish(id , publishstate){
        let user = ServiceRoom.getTkRoom().getUsers()[id] ;
        if(!user){L.Logger.error( 'user is not exist  , user id is '+id+'!' ); return ; } ;
        if( !(user.role === TkConstant.role.roleChairman || user.role === TkConstant.role.roleStudent || (user.role === TkConstant.role.roleTeachingAssistant)&& TkConstant.joinRoomInfo.assistantOpenMyseftAV) ){        //17-09-15 xgd 修改
            return ;
        }
        ServiceRoom.getTkRoom().changeUserPublish(id , publishstate);
    }

}
const  ServiceSignallingInstance = new ServiceSignalling();
export default ServiceSignallingInstance;

/*
备注：
    toID=> __all , __allExceptSender , userid , __none
* */