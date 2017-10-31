/**
 * 动态PPT Smart组件
 * @module NewpptSmart
 * @description   提供 动态PPT功能的Smart组件
 * @author QiuShao
 * @date 2017/7/27
 */
'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import CoreController from 'CoreController';
import ServiceRoom from 'ServiceRoom';
import ServiceTools from 'ServiceTools';
import ServiceSignalling from 'ServiceSignalling';
import NewPptAynamicPPT from './plugs/newPpt/js/newPpt-custom';
import { DragDropContextProvider,DropTarget  } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


/*const specTarget = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        console.error(1111111,item);
    },
    hover(props, monitor, component) {
        console.error(11111111,monitor.getItem());
    },
};*/

class NewpptSmart extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.fileid = undefined ; //切换文件或者打开文件之前的文件id
        this.pptvideoStream = undefined ;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        that._lcInit();
        eventObjectDefine.Window.addEventListener(TkConstant.EVENTTYPE.WindowEvent.onMessage ,that.handlerOnMessage.bind(that)  ,  that.listernerBackupid); //接收onMessage事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件：动态ppt处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that)  ,  that.listernerBackupid ) ;//room-delmsg事件：动态ppt处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_media , that.handlerStreamAdded_media.bind(that)  ,  that.listernerBackupid ) ;//streamAdded_media事件：动态ppt处理
        eventObjectDefine.CoreController.addEventListener("receive-msglist-ShowPage-lastDocument" ,that.handlerReceiveMsglistShowPageLastDocument.bind(that)  ,  that.listernerBackupid ); //接收ShowPage信令：动态PPT处理
        eventObjectDefine.CoreController.addEventListener("setNewPptFrameSrc" ,that.handlerSetNewPptFrameSrc.bind(that)  ,  that.listernerBackupid ); //setNewPptFrameSrc：设置动态PPT的路径
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_newpptPagingPage" ,that.handlerUpdateAppPermissions_newpptPagingPage.bind(that)  ,  that.listernerBackupid ); //updateAppPermissions_newpptPagingPage：更新白板翻页权限
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_publishDynamicPptMediaPermission_video" ,that.handlerUpdateAppPermissions_publishDynamicPptMediaPermission_video.bind(that)  ,  that.listernerBackupid ); //updateAppPermissions_publishDynamicPptMediaPermission_video：更新动态PPT视频发布权限
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that)  ,  that.listernerBackupid ); //initAppPermissions：初始化权限处理
        eventObjectDefine.CoreController.addEventListener("openDocuemntOrMediaFile" ,that.handlerOpenDocuemntOrMediaFile.bind(that)  ,  that.listernerBackupid ); //openDocuemntOrMediaFile：打开文档或者媒体文件
        eventObjectDefine.CoreController.addEventListener("newpptPrevStepClick" ,that.handlerNewpptPrevStepClick.bind(that)  ,  that.listernerBackupid ); //接收newpptPrevStepClick事件:上一帧操作
        eventObjectDefine.CoreController.addEventListener("newpptNextStepClick" ,that.handlerNewpptNextStepClick.bind(that) ,  that.listernerBackupid ); //接收newpptNextStepClick事件：下一帧操作
        eventObjectDefine.CoreController.addEventListener("newpptPrevSlideClick" ,that.handlerNewpptPrevSlideClick.bind(that) ,  that.listernerBackupid ); //接收newpptPrevSlideClick事件:上一页操作
        eventObjectDefine.CoreController.addEventListener("newpptNextSlideClick" ,that.handlerNewpptNextSlideClick.bind(that)  ,  that.listernerBackupid); //接收newpptNextSlideClick事件：下一页操作
        eventObjectDefine.CoreController.addEventListener("receive-msglist-ClassBegin" ,that.handlerReceiveMsglistClassBegin.bind(that)  ,  that.listernerBackupid); //接收receive-msglist-ClassBegin事件
        eventObjectDefine.CoreController.addEventListener("playDynamicPPTMediaStream" ,that.handlerPlayDynamicPPTMediaStream.bind(that)  ,  that.listernerBackupid); //接收playDynamicPPTMediaStream事件
        eventObjectDefine.CoreController.addEventListener("skipPage_dynamicPPT" ,that.handlerSkipPage_dynamicPPT.bind(that) , that.listernerBackupid); //skipPage_dynamicPPT：动态PPT跳转
        // eventObjectDefine.CoreController.addEventListener("layerIsShowOfDraging" ,that.layerIsShowOfDraging.bind(that) , that.listernerBackupid); //skipPage_dynamicPPT：动态PPT跳转


        /*发送动态PPT信令消息*/
        $(document).off("sendPPTMessageEvent");
        $(document).on("sendPPTMessageEvent" , function (event , data , isInitiative) {
            //发送PPT数据给其它人
            that._handlerSendPPTMessageEvent(data , isInitiative);
        });

        /*绑定动态PPT更新总页数给白板事件*/
        $(document).off("updateSlidesCountToLcElement");
        $(document).on("updateSlidesCountToLcElement" , function (event , data) {
            if(data){
                const callbackHandler = (fileInfo) => {
                    Object.assign(fileInfo , data);
                    eventObjectDefine.CoreController.dispatchEvent({type:'setFileDataToLcElement' , message:{filedata:fileInfo} }) ;
                };
                eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
            }
        });

        /*绑定动态PPT更新白板当前页画笔数据事件*/
        $(document).off("slideChangeToLcData");
        $(document).on("slideChangeToLcData" , function (event , data) {
            if(data){
                eventObjectDefine.CoreController.dispatchEvent({type:'saveLcStackToStorage' , message:{} }) ;
                const callbackHandler = (fileInfo) => {
                    Object.assign(fileInfo , data);
                    eventObjectDefine.CoreController.dispatchEvent({type:'setFileDataToLcElement' , message:{filedata:fileInfo} }) ;
                    eventObjectDefine.CoreController.dispatchEvent({type:'recoverCurrpageLcData'}); //画当前文档当前页数据到白板上
                };
                eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
            }
        });

        /*绑定动态PPT更新白板尺寸事件*/
        $(document).off("updateLcScaleWhenAynicPPTInit");
        $(document).on("updateLcScaleWhenAynicPPTInit" , function (event , data) {
            if(data && data.Width && data.Height){
                that._updateLcScaleWhenAynicPPTInitHandler( data.Width / data.Height );
            }
        });

        /*更新白板的缩放比例*/
        $(document).off("updateLcScale");
        $(document).on("updateLcScale" , function(event , data){
            eventObjectDefine.CoreController.dispatchEvent({type:'resizeHandler' , message:{eleWHPercent:data}});
        });

        /*更新白板的缩放比例*/
        $(document).off("newppt_changeFileElementProperty");
        $(document).on("newppt_changeFileElementProperty" , function(event , data){
            const callbackHandler = (fileInfo) => {
                Object.assign(fileInfo , data); //将动态ppt数据的数据浅拷贝到文件信息中
                eventObjectDefine.CoreController.dispatchEvent({type:'setFileDataToLcElement' , message:{filedata:fileInfo} }) ;
                eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'newppt' , data: fileInfo }});
            };
            eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
        });

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        $(document).off("sendPPTMessageEvent");
        $(document).off("slideChangeToLcData");
        $(document).off("updateSlidesCountToLcElement");
        $(document).off("updateLcScaleWhenAynicPPTInit");
        $(document).off("updateLcScale");
        $(document).off("newppt_changeFileElementProperty");
    };
    /*layerIsShowOfDraging(handledata){//根据是否正在拖拽显示课件上的浮层
        this.setState({isDraging:handledata.message.isDraging});
    };*/

    handlerOnMessage(recvEventData){
        const that = this ;
        let {event} = recvEventData.message ;
        that.handlerIframeMessage(event); //iframe框架消息处理函数
    };
    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：动态ppt处理
        let that = this ;
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "ShowPage":
                let open =  that._saveFileidReturnOpen(pubmsgData.data);
                that._handlerReceiveShowPageSignalling({message:{data:pubmsgData.data , open:open , source:'room-pubmsg'} });
                break;
            case "NewPptTriggerActionClick": //动态PPT动作
               if(that.ServiceNewPptAynamicPPT.isOpenPptFile === true){
                    that.ServiceNewPptAynamicPPT.postMessage(pubmsgData.data);
                }
                break;
            case "ClassBegin":
                that.handlerClassBeginCloseDynamicPptVideo();
                that._handlerClassBeginStartOrEnd();
                break;
        }
    };
    handlerRoomDelmsg(delmsgDataEvent){//room-delmsg事件：动态ppt处理
        let that = this ;
        let delmsgData = delmsgDataEvent.message ;
        switch(delmsgData.name) {
            case "ClassBegin":
                that._handlerClassBeginStartOrEnd();
                break;
        }
    };
    handlerStreamAdded_media(recvEventData){
        const that = this ;
        let {stream} = recvEventData ;
        let attributes =  stream.getAttributes() ;
        if(attributes && attributes.type === 'media' ){
            let data = {
                action:"closeDynamicPptAutoVideo"
            };
            that.ServiceNewPptAynamicPPT.postMessage(data);
        }
    };
    handlerIframeMessage(event){ //iframe框架消息处理函数
        let that = this ;
        // 通过origin属性判断消息来源地址
        if( event.data ){
            let data = undefined;
            let recvData = undefined ;
            try{
                recvData =  JSON.parse(event.data) ;
                data = recvData.data ;
            }catch (e){
                L.Logger.warning(  "iframe message data can't be converted to JSON , iframe data:" , event.data ) ;
                return ;
            }
            if(recvData.source === "tk_dynamicPPT") {
                L.Logger.info("[dynamicPpt]receive remote iframe data form "+ event.origin +":",  event );
                let INITEVENT = "initEvent";
                let SLIDECHANGEEVENT = "slideChangeEvent";
                let STEPCHANGEEVENT = "stepChangeEvent";
                let AUTOPLAYVIDEOINNEWPPT = "autoPlayVideoInNewPpt" ;
                let CLICKNEWPPTTRIGGEREVENT = "clickNewpptTriggerEvent" ;
                switch (data.action) {
                    case INITEVENT :
                        that.ServiceNewPptAynamicPPT.remoteData.view = data.view;
                        that.ServiceNewPptAynamicPPT.remoteData.slidesCount = data.slidesCount;
                        that.ServiceNewPptAynamicPPT.remoteData.slide = data.slide ;
                        that.ServiceNewPptAynamicPPT.remoteData.step = data.step ;
                        that.ServiceNewPptAynamicPPT.remoteData.stepTotal = data.stepTotal ;
                        that.ServiceNewPptAynamicPPT.recvInitEventHandler(data.slide ,data.step , data.externalData);
                        break;
                    case SLIDECHANGEEVENT :
                        that.ServiceNewPptAynamicPPT.remoteData.slide = data.slide;
                        that.ServiceNewPptAynamicPPT.remoteData.step = data.step;
                        that.ServiceNewPptAynamicPPT.remoteData.stepTotal = data.stepTotal ;
                        that.ServiceNewPptAynamicPPT.recvSlideChangeEventHandler(data.slide , data.externalData );
                        break;
                    case STEPCHANGEEVENT:
                        that.ServiceNewPptAynamicPPT.remoteData.slide = data.slide;
                        that.ServiceNewPptAynamicPPT.remoteData.step = data.step;
                        that.ServiceNewPptAynamicPPT.remoteData.stepTotal = data.stepTotal ;
                        that.ServiceNewPptAynamicPPT.recvStepChangeEventHandler(data.step , data.externalData);
                        break;
                    case AUTOPLAYVIDEOINNEWPPT:
                        let {isvideo , url , fileid , pptslide } = data ;
                        if(isvideo && !TkGlobal.playback){
                            let videoUrl = that.ServiceNewPptAynamicPPT.rPathAddress + url ;
                            let pptVideoJson = {
                                url:videoUrl ,
                                fileid:fileid?Number(fileid):fileid ,
                                isvideo:isvideo ,
                                pptslide:pptslide?Number(pptslide):pptslide  ,
                            };
                            that._newpptAutoPlayVideoInNewPpt(pptVideoJson);
                        }
                        break;
                    case CLICKNEWPPTTRIGGEREVENT:
                        if(that.props.fileTypeMark === 'dynamicPPT' &&  CoreController.handler.getAppPermissions('sendSignallingFromDynamicPptTriggerActionClick')  &&  that.ServiceNewPptAynamicPPT.isInitiative(data.externalData) ){
                            ServiceSignalling.sendSignallingFromDynamicPptTriggerActionClick(data);
                        }
                        break ;
                };
            }
        }
    };
    handlerSetNewPptFrameSrc(recvEventData){
        const that = this ;
        that.ServiceNewPptAynamicPPT.setNewPptFrameSrc(recvEventData.message.src || "");
    };
    handlerReceiveMsglistShowPageLastDocument(showpageData){
        const that = this ;
        let open =  that._saveFileidReturnOpen(showpageData.message.data);
        showpageData.message.open = open ;
        that._handlerReceiveShowPageSignalling(showpageData);
    };
    handlerUpdateAppPermissions_newpptPagingPage(){
        const that = this ;
        if(that.props.fileTypeMark === 'dynamicPPT'){
            const callbackHandler = (fileInfo) => {
                eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'newppt' , data: fileInfo }});
            };
            eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
        }
    };
    handlerInitAppPermissions(){
        const that = this ;
        that.handlerUpdateAppPermissions_newpptPagingPage();
        that.handlerUpdateAppPermissions_publishDynamicPptMediaPermission_video();
    };
    handlerUpdateAppPermissions_publishDynamicPptMediaPermission_video(){ //动态PPT视频播放权限更改后通知iframe
        const that = this ;
        let data = {
            action:"changePublishDynamicPptMediaPermission_video" ,
            publishDynamicPptMediaPermission_video:CoreController.handler.getAppPermissions('publishDynamicPptMediaPermission_video')
        };
        that.ServiceNewPptAynamicPPT.postMessage(data);
    };
    handlerOpenDocuemntOrMediaFile(recvEventData){
        const that = this ;
        let fileDataInfo = recvEventData.message ;
        let open =  that._saveFileidReturnOpen(fileDataInfo);
        if( fileDataInfo.isDynamicPPT ){ //如果是动态PPT
            that._handlerReceiveShowPageSignalling( { message:{ data:fileDataInfo  , open:open ,  source:'newpptFileClickEvent' } } ) ;
            /*fileDataInfo格式:
                 const fileDataInfo = {
                     isGeneralFile:file.isGeneralFile,
                     isMedia:file.isMediaFile,
                     isDynamicPPT:file.isDynamicPPT,
                     action: file.isDynamicPPT?"show":"",
                     mediaType:file.isMediaFile?file.filetype:null,
                     filedata: {
                         fileid: file.fileid,
                         currpage: file.currentPage,
                         pagenum: file.pagenum,
                         filetype: file.filetype,
                         filename: file.filename,
                         swfpath: file.swfpath,
                         pptslide: file.pptslide,
                         pptstep: file.pptstep,
                         steptotal:file.steptotal
                     }
                 }
             * */
        }
    };
    handlerNewpptPrevStepClick(){
        const that = this ;
        that.ServiceNewPptAynamicPPT.recvCount = 0 ;
        that.ServiceNewPptAynamicPPT.gotoPreviousStep();
    };
    handlerNewpptNextStepClick(){
        const that = this ;
        that.ServiceNewPptAynamicPPT.recvCount = 0 ;
        that.ServiceNewPptAynamicPPT.gotoNextStep();
    };
    handlerNewpptPrevSlideClick(){
        const that = this ;
        let autoStart = true ;
        that.ServiceNewPptAynamicPPT.recvCount = 0 ;
        that.ServiceNewPptAynamicPPT.gotoPreviousSlide(autoStart);
    };
    handlerNewpptNextSlideClick(){
        const that = this ;
        let autoStart = true ;
        that.ServiceNewPptAynamicPPT.recvCount = 0 ;
        that.ServiceNewPptAynamicPPT.gotoNextSlide(autoStart);
    };
    handlerReceiveMsglistClassBegin(){
      const that = this ;
      that._handlerClassBeginStartOrEnd();
    };
    handlerPlayDynamicPPTMediaStream(recvEventData){
        const that = this ;
        let {show , stream} = recvEventData.message ;
        if(show){
            that.handlerUpdateAppPermissions_newpptPagingPage();
        }else{
            that.handlerUpdateAppPermissions_newpptPagingPage();
        }
    };
    handlerSkipPage_dynamicPPT(recvEventData){
        const that = this ;
        if(that.props.fileTypeMark === 'dynamicPPT' ){
            let { currpage } = recvEventData.message ;
            that._skipDynamicPPTPaging(currpage);
        }
    };

    _openAynamicPPTHandler(filedata){ //打开动态PPT
        let that = this ;
        let fileTypeMark = 'dynamicPPT' ;
        that.props.changeFileTypeMark(fileTypeMark); //改变fileTypeMark的值
        eventObjectDefine.CoreController.dispatchEvent({type:'saveLcStackToStorage' , message:{} }) ;
        eventObjectDefine.CoreController.dispatchEvent({type:'setFileDataToLcElement' , message:{filedata:filedata} }) ;
        eventObjectDefine.CoreController.dispatchEvent({type:'recoverCurrpageLcData'});//画当前文档当前页数据到白板上
        eventObjectDefine.CoreController.dispatchEvent({type:'resetLcDefault'});
        eventObjectDefine.CoreController.dispatchEvent({type:'setH5FileFrameSrc'  ,  message:{src:''}}) ;
        let {fileid , swfpath , pptslide ,pptstep } = filedata;
        let newpptVersions = TkConstant.newpptVersions;
        let remoteNewpptUpdateTime = TkConstant.remoteNewpptUpdateTime ;
        let options = {
            // rPathAddress:   "https://192.168.1.182:8443" + swfpath+"/"  ,
            rPathAddress: that.ServiceNewPptAynamicPPT.serviceUrl +":"+that.ServiceNewPptAynamicPPT.servicePort + swfpath+"/"  ,
            PresAddress:"newppt.html?remoteHost="+window.location.host+"&remoteProtocol="+window.location.protocol +"&versions="+newpptVersions+"&fileid="+fileid+"&playback="+TkGlobal.playback
                +"&classbegin="+TkGlobal.classBegin+"&publishDynamicPptMediaPermission_video="+ CoreController.handler.getAppPermissions('publishDynamicPptMediaPermission_video')
                +"&remoteNewpptUpdateTime="+remoteNewpptUpdateTime+"&role="+(TkConstant.joinRoomInfo ? TkConstant.joinRoomInfo.roomrole : undefined )+"&ts="+new Date().getTime(),
            slideIndex:pptslide ,
            stepIndex:pptstep ,
            fileid:fileid
        };
        eventObjectDefine.CoreController.dispatchEvent({type:'closeLoading'});
        that._updateLcScaleWhenAynicPPTInitHandler(16/9);
        that.ServiceNewPptAynamicPPT.setRPathAndPres(options);
        eventObjectDefine.CoreController.dispatchEvent({type:'checkSelectMouseState' , message:{fileTypeMark:fileTypeMark} });
    };
    _aynamicPPTJumpToAnim(slide , step) { //跳转到PPT的某一页的某一个帧
        const that = this ;
        that.ServiceNewPptAynamicPPT.jumpToAnim(slide , step );
    };
    _updateLcScaleWhenAynicPPTInitHandler(lcLitellyScalc) {
        eventObjectDefine.CoreController.dispatchEvent({type:'updateLcScaleWhenAynicPPTInitHandler' , message:{lcLitellyScalc:lcLitellyScalc}});
    };
    _handlerReceiveShowPageSignalling(showpageData){//接收ShowPage信令：动态PPT处理
        let that =  this ;
        let {data , open} = showpageData.message;
        let newpptDocumentData = data ;
        if(!newpptDocumentData.isMedia) {
            if(newpptDocumentData.isDynamicPPT){
                let isRemote = true ;
                that._reveiveNewpptDataHandler( newpptDocumentData.filedata, open , isRemote ) ;
            }
        }
    };
    _reveiveNewpptDataHandler(  filedata , openPPT , isRemote ){ //接收动态PPT远程数据进行处理
        let that = this ;
        if(isRemote){
            that.ServiceNewPptAynamicPPT.recvCount ++ ;
        };
        if(openPPT){
            that._openAynamicPPTHandler(filedata);
            return ;
        }
        that._aynamicPPTJumpToAnim(filedata.pptslide , filedata.pptstep);
    };
    /*动态ppt数据发送*/
    _handlerSendPPTMessageEvent(data , isInitiative){
        const that = this ;
        const callbackHandler = (fileInfo) => {
            let filedata = fileInfo;
            let newpptData = that._replaceSendPPTMessageData(filedata , data);
            eventObjectDefine.CoreController.dispatchEvent({
                type:'documentPageChange' ,
                message:newpptData
            });
            if(isInitiative){
                that._sendSignallingFromDynamicPptShowPage(newpptData);
            }
        };
        eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
    };
    _lcInit(){ //动态PPT初始化
        const that = this ;
        that.ServiceNewPptAynamicPPT  =   that.ServiceNewPptAynamicPPT || new NewPptAynamicPPT() ;
        that.ServiceNewPptAynamicPPT.serviceUrl = TkConstant.SERVICEINFO.protocolAndHostname ;
        that.ServiceNewPptAynamicPPT.servicePort = TkConstant.SERVICEINFO.port ;
        that.ServiceNewPptAynamicPPT.clearAll();
        that.ServiceNewPptAynamicPPT.newDopPresentation();
    };
    _replaceSendPPTMessageData(oldFiledata , replaceData){
        if(replaceData){
            oldFiledata.pagenum = replaceData.pagenum!=undefined ?  replaceData.pagenum:oldFiledata.pagenum;
            oldFiledata.pptslide = replaceData.pptslide!=undefined ?  replaceData.pptslide:oldFiledata.pptslide;
            oldFiledata.pptstep = replaceData.pptstep!=undefined ?  replaceData.pptstep:oldFiledata.pptstep;
            oldFiledata.steptotal = replaceData.steptotal!=undefined ?  replaceData.steptotal:oldFiledata.steptotal;
            oldFiledata.currpage = replaceData.currpage!=undefined ?  replaceData.currpage:oldFiledata.currpage;
        }
        let newpptData = {
            isGeneralFile:false ,
            isMedia:false ,
            isDynamicPPT:true ,
            isH5Document:false ,
            action:replaceData.action || '',
            mediaType:'' ,
            filedata:oldFiledata
        };
        return newpptData ;
    };
    /*发送动态PPT的ShowPage相关数据（action:show/slide/step）
     * @method sendSignallingFromDynamicPptShowPage*/
    _sendSignallingFromDynamicPptShowPage(newpptData){
        const that = this ;
        if( !CoreController.handler.getAppPermissions('sendSignallingFromDynamicPptShowPage') ){return ;} ;
        let isDelMsg = false ;
        let assignId = 'DocumentFilePage_ShowPage';
        ServiceSignalling.sendSignallingFromShowPage(isDelMsg , assignId , newpptData);
    };
    _newpptAutoPlayVideoInNewPpt(pptVideoJson){ /*动态PPT视频的处理函数*/
        const that = this ;
        /*let roleChairmanList = ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleChairman) ;
        if( !TkConstant.hasRole.roleChairman &&  !TkUtils.isEmpty(roleChairmanList) ){ //如果当前房间角色有老师，并且我的角色不是老师，则return
            return ;
        }*/
        let mediaAttributes = { filename:"" , fileid:pptVideoJson.fileid , type:'media' } ;
        if(!TkGlobal.classBegin){
            mediaAttributes.toID = ServiceRoom.getTkRoom().getMySelf().id ;
        };
        that.pptvideoStream = TK.Stream({video: pptVideoJson.isvideo, audio: true, url:pptVideoJson.url, extensionId:ServiceRoom.getTkRoom().getMySelf().id + ":media", attributes:mediaAttributes });
        ServiceTools.unpublishAllMediaStream(function (code , stream) {
            switch (code){
                case -1:
                case 1:
                    if( !CoreController.handler.getAppPermissions('publishMediaStream') ||  !CoreController.handler.getAppPermissions('publishDynamicPptMediaPermission_video') ){return false;}
                    TkGlobal.playPptVideoing = true ;
                    that.handlerPlayDynamicPPTMediaStream(  { type: 'playDynamicPPTMediaStream' , message:{ show:true , stream: that.pptvideoStream} } ); //手动封装playDynamicPPTMediaStream的数据,给本组件而不给其它组件
                    ServiceSignalling.publishMediaStream(that.pptvideoStream);
                    break;
                case 0:
                    break;
            }
        });
    };
    _saveFileidReturnOpen(fileFormatInfo){ //保存文件id，返回是否打开文件
        const that = this ;
        let open = undefined ;
        if(!fileFormatInfo.isMedia){ //不是媒体文件才有这个操作
            let  fileid = fileFormatInfo.filedata.fileid ;
            open = (that.fileid != fileid);
            that.fileid = fileid ;
        }
        return open ;
    };

    _handlerClassBeginStartOrEnd(){ //处理上下课信令
        const that = this ;
        let data = {
            action:"changeClassBegin" ,
            classbegin:TkGlobal.classBegin
        };
        that.ServiceNewPptAynamicPPT.postMessage(data);
    };
    handlerClassBeginCloseDynamicPptVideo(){
        const that = this ;
        let data = {
            action:"closeDynamicPptAutoVideo"
        };
        that.ServiceNewPptAynamicPPT.postMessage(data);
    };
    _skipDynamicPPTPaging(currpage){ //动态PPT跳转
        const that = this ;
        let autoStart = true ;
        that.ServiceNewPptAynamicPPT.recvCount = 0 ;
        let step = 0 ;
        let slide = currpage ;
        let initiative = true ; //主动跳转
        that.ServiceNewPptAynamicPPT.jumpToAnim( slide , step , initiative );
    };

    render(){
        let that = this ;
        const {fileTypeMark , ...other} = that.props ;
        if(!that.ServiceNewPptAynamicPPT){
            that.ServiceNewPptAynamicPPT  =  new NewPptAynamicPPT() ;
        }
        that.ServiceNewPptAynamicPPT.isOpenPptFile = (fileTypeMark === 'dynamicPPT') ;
        eventObjectDefine.CoreController.dispatchEvent({type:''})
        return (

            <div  style={{display:fileTypeMark !== 'dynamicPPT' ? "none": "block"}}  className="aynamic-ppt-conwrap add-position-absolute-top0-left0" id="aynamic_ppt_newppt"   {...TkUtils.filterContainDataAttribute(other)} >  {/*动态PPT插件-is*/}
                <div className="ppt-vessel" id="ppt_vessel_newppt">
                    <div className="ppt-zoom-container" id="ppt_zoom_container_newppt" >
                        <div id="contentHolderNewppt"  className="aynamic-ppt-container"  >
                            <iframe allowFullScreen="true"  id="newppt_frame" src="" name="myframe" ></iframe>
                            <div id="preloader_newppt" className="ppt-loading-container add-position-absolute-top0-left0" >
                            </div>
                            <div id="ppt_not_click_newppt" className="ppt-not-click-newppt add-position-absolute-top0-left0" ></div>
                        </div>
                    </div>
                </div>
            </div>


        )
    };
}
export default NewpptSmart;

/*
export default DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(NewpptSmart);
*/


