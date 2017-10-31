/**
 * 白板组件
 * @module WhiteboardSmart
 * @description   提供 白板的组件
 * @author QiuShao
 * @date 2017/7/27
 */
'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import CoreController from 'CoreController';
import ServiceSignalling from 'ServiceSignalling';
import CustomLiterally from './plugs/literally/js/literally-custom';
import './plugs/literally/css/literallycanvas.css';

class WhiteboardSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:true ,
            selectMouse:true  //选中的标注工具默认是鼠标
        };
        this.fileid = undefined ; //切换文件或者打开文件之前的文件id
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.cacheMaxPageNum = 1;        //当前打开文档的缓存的最大页数，缺省为1
        this.cacheMinPageNum = 1;        //当前打开文档的缓存的最小页数，缺省为1
        this.filePreLoadCurrPage = 1;        //当前打开文档的缓存的当前页，缺省为1
        this.filePreLoadStep = 2;     //普通文档预加载步长，缺省为2
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        that._lcInit();
        eventObjectDefine.Window.addEventListener(TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that)   , that.listernerBackupid); //window.resize事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that), that.listernerBackupid ) ;//room-pubmsg事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that) , that.listernerBackupid) ;//room-delmsg事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected , that.handlerRoomDisconnected.bind(that) , that.listernerBackupid) ;//roomDisconnected事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener("save-lc-waiting-process-data" ,that.handlerSavelcWaitingProcessData.bind(that) , that.listernerBackupid); //保存白板待处理数据事件
        eventObjectDefine.CoreController.addEventListener("receive-msglist-ShowPage-lastDocument" ,that.handlerReceiveMsglistShowPageLastDocument.bind(that), that.listernerBackupid ); //接收ShowPage信令：白板处理
        eventObjectDefine.CoreController.addEventListener("saveLcStackToStorage" ,that.handlerSaveLcStackToStorage.bind(that), that.listernerBackupid ); //接收saveLcStackToStorage事件执行saveLcStackToStorage
        eventObjectDefine.CoreController.addEventListener("resizeHandler" ,that.handlerResizeHandler.bind(that) , that.listernerBackupid); //接收resizeHandler事件执行resizeHandler
        eventObjectDefine.CoreController.addEventListener("setFileDataToLcElement" ,that.handlerSetFileDataToLcElement.bind(that), that.listernerBackupid ); //接收setFileDataToLcElement事件执行setFileDataToLcElement
        eventObjectDefine.CoreController.addEventListener("getFileDataFromLcElement" ,that.handlerGetFileDataFromLcElement.bind(that), that.listernerBackupid ); //接收getFileDataFromLcElement事件执行getFileDataFromLcElement
        eventObjectDefine.CoreController.addEventListener("resetLcDefault" ,that.handlerResetLcDefault.bind(that) , that.listernerBackupid); //接收resetLcDefault事件执行resetLcDefault
        eventObjectDefine.CoreController.addEventListener("closeLoading" ,that.handlerCloseLoading.bind(that) , that.listernerBackupid); //接收closeLoading事件执行closeLoading
        eventObjectDefine.CoreController.addEventListener("updateLcScaleWhenAynicPPTInitHandler" ,that.handlerUpdateLcScaleWhenAynicPPTInitHandler.bind(that), that.listernerBackupid ); //接收updateLcScaleWhenAynicPPTInitHandler事件：根据动态PPT传过来的白板比例进行白板缩放
        eventObjectDefine.CoreController.addEventListener("recoverCurrpageLcData" ,that.handlerRecoverCurrpageLcData.bind(that) , that.listernerBackupid); //接收recoverCurrpageLcData事件执行recoverCurrpageLcData
        eventObjectDefine.CoreController.addEventListener("toolsInitBind" ,that.handlerToolsInitBind.bind(that), that.listernerBackupid ); //接收toolsInitBind事件执行toolsInitBind
        eventObjectDefine.CoreController.addEventListener("whiteboardPrevPage" ,that.handlerWhiteboardPrevPage.bind(that), that.listernerBackupid ); //接收whiteboardPrevPage事件上一页操作
        eventObjectDefine.CoreController.addEventListener("whiteboardNextPage" ,that.handlerWhiteboardNextPage.bind(that) , that.listernerBackupid); //接收whiteboardNextPage事件下一页操作
        eventObjectDefine.CoreController.addEventListener("whiteboardAddPage" ,that.handlerWhiteboardAddPage.bind(that) , that.listernerBackupid); //接收whiteboardAddPage事件加页操作
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_whiteboardPagingPage" ,that.handlerUpdateAppPermissions_whiteboardPagingPage.bind(that), that.listernerBackupid ); //updateAppPermissions_whiteboardPagingPage:更新白板翻页权限
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that) , that.listernerBackupid); //initAppPermissions：初始化权限处理
        eventObjectDefine.CoreController.addEventListener("openDocuemntOrMediaFile" ,that.handlerOpenDocuemntOrMediaFile.bind(that), that.listernerBackupid ); //openDocuemntOrMediaFile：打开文档或者媒体文件
        eventObjectDefine.CoreController.addEventListener("updateWhiteboardToolStatus" ,that.handlerUpdateWhiteboardToolStatus.bind(that) , that.listernerBackupid); //updateWhiteboardToolStatus：更新白板toolStatus
        eventObjectDefine.CoreController.addEventListener("executeUploadTextFont" ,that.handlerExecuteUploadTextFont.bind(that) , that.listernerBackupid); //executeUploadTextFont：执行白板uploadTextFont方法
        eventObjectDefine.CoreController.addEventListener("updateSelectMouse" ,that.handlerUpdateSelectMouse.bind(that), that.listernerBackupid ); //updateSelectMouse：选择的标注工具是否是鼠标
        eventObjectDefine.CoreController.addEventListener("checkSelectMouseState" ,that.handlerCheckSelectMouseState.bind(that), that.listernerBackupid ); //checkSelectMouseState：检测选中的标注工具是否是鼠标
        eventObjectDefine.CoreController.addEventListener("changeStrokeSize" ,that.handlerChangeStrokeSize.bind(that) , that.listernerBackupid); //changeStrokeSize：改变白板画笔等大小
        eventObjectDefine.CoreController.addEventListener("changeStrokeColor" ,that.handlerChangeStrokeColor.bind(that), that.listernerBackupid ); //changeStrokeColor：改变白板的画笔颜色
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_canDraw" ,that.handlerUpdateAppPermissions_canDraw.bind(that) , that.listernerBackupid); //updateAppPermissions_canDraw：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_h5DocumentActionClick" ,that.handlerUpdateAppPermissions_h5DocumentActionClick.bind(that) , that.listernerBackupid);   //updateAppPermissions_h5DocumentActionClick：H5文档可点击权限更新
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_dynamicPptActionClick" ,that.handlerUpdateAppPermissions_dynamicPptActionClick.bind(that) , that.listernerBackupid);   //updateAppPermissions_dynamicPptActionClick：动态PPT可点击权限更新
        eventObjectDefine.CoreController.addEventListener("lcTextEditing" ,that.handlerLcTextEditing.bind(that) , that.listernerBackupid); //lcTextEditing：白板是否处于text的editing
        eventObjectDefine.CoreController.addEventListener("skipPage_general" ,that.handlerSkipPage_general.bind(that) , that.listernerBackupid); //skipPage_general：普通文档跳转
        eventObjectDefine.CoreController.addEventListener("preloadWhiteboardImg" ,that.handlerPreloadWhiteboardImg.bind(that) , that.listernerBackupid); //preloadWhiteboardImg：预加载白板图片

        /*发送白板数据的信令消息*/
        $(document).off("sendDataToLiterallyEvent");
        $(document).on("sendDataToLiterallyEvent" , function (event ,idPrefix , data , signallingName , assignId , do_not_save) {
            //发送PPT数据给其它人
            that._handlerSendDataToLiterallyEvent(idPrefix , data , signallingName , assignId , do_not_save);
        });

        /*删除白板数据的信令消息*/
        $(document).off("deleteLiterallyDataEvent");
        $(document).on("deleteLiterallyDataEvent" , function (event ,idPrefix , data , signallingName , assignId ) {
            //发送PPT数据给其它人
            that._handlerDeleteLiterallyDataEvent(idPrefix , data , signallingName , assignId );
        });

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        $(document).off("sendDataToLiterallyEvent");
        $(document).off("deleteLiterallyDataEvent");
    };
    componentDidUpdate(){ //在组件完成更新后立即调用,在初始化时不会被调用
        this.handlerCheckSelectMouseState();
    }

    handlerOnResize(){ //window.resize事件：白板处理
        const that = this;
        that.ServiceLiterally.resizeHandler(that.ServiceLiterally);
    };
    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：白板处理
        let that = this ;
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "SharpsChange":
               that.ServiceLiterally.handlerPubmsg_SharpsChange(pubmsgData);
                break;
            case "ShowPage":
                let open =  that._saveFileidReturnOpen(pubmsgData.data);
                let tmpData = { message:{data:pubmsgData.data   , open:open  , source:'room-pubmsg'}};
                that._handlerReceiveShowPageSignalling(tmpData);
                break;
            default:
                break;
        }
    };
    handlerRoomDelmsg(delmsgDataEvent){//room-delmsg事件：白板处理
        const that = this ;
        let delmsgData = delmsgDataEvent.message ;
        switch(delmsgData.name) {
            case "SharpsChange": //删除白板数据
                that.ServiceLiterally.handlerDelmsg_SharpsChange(delmsgData);
                break;
            case "ClassBegin":
                if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                    that.ServiceLiterally.clearAll(false);
                }
                break;
        }
    };
    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        that.ServiceLiterally.clearAll(false);
    };
    handlerRoomDisconnected(recvEventData){
        const that = this ;
        that.ServiceLiterally.clearAll(false);
    };
    handlerSavelcWaitingProcessData(waitingProcessEventData){//保存白板待处理数据事件处理函数
        const that = this ;
        let {sharpsChangeArray} = waitingProcessEventData.message;
        that.ServiceLiterally.handlerMsglist_SharpsChange(sharpsChangeArray);
    };
    handlerReceiveMsglistShowPageLastDocument(showpageData){
        const that = this ;
        let open =  that._saveFileidReturnOpen(showpageData.message.data);
        showpageData.message.open = open ;
        that._handlerReceiveShowPageSignalling(showpageData);
    };
    handlerSaveLcStackToStorage(recvEventData){
        const that = this ;
        that.ServiceLiterally.saveLcStackToStorage({
            saveRedoStack: TkConstant.hasRole.roleChairman  ,
        });
    } ;
    handlerResizeHandler(recvEventData){
        const that = this ;
        if(recvEventData&& recvEventData.message&&recvEventData.message.eleWHPercent!=undefined){
            that.ServiceLiterally.eleWHPercent = recvEventData.message.eleWHPercent ;
        }
        that.ServiceLiterally.resizeHandler(that.ServiceLiterally);
    };
    handlerSetFileDataToLcElement(recvEventData){
        const that = this ;
        that.ServiceLiterally.setFileDataToLcElement(recvEventData.message.filedata);
    };
    handlerGetFileDataFromLcElement(recvEventData){
        const that = this ;
        let {callback} = recvEventData.message ;
        if(callback && typeof callback === 'function'){
            let fileInfo = that.ServiceLiterally.getFileDataFromLcElement();
            callback( fileInfo );
        }
    };
    handlerResetLcDefault(recvEventData){
        const that = this ;
        that.ServiceLiterally.resetLcDefault();
    };
    handlerCloseLoading(recvEventData){
        const that = this ;
        that.ServiceLiterally.closeLoading();
    };
    handlerUpdateLcScaleWhenAynicPPTInitHandler(recvEventData){
        const that = this ;
        that.ServiceLiterally.lcLitellyScalc = recvEventData.message.lcLitellyScalc;
        that.ServiceLiterally.lc.watermarkImage = null ;
        that.ServiceLiterally.setBackgroundWatermarkImage("");
    };
    handlerRecoverCurrpageLcData(recvEventData){
        const that = this ;
        that._recoverCurrpageLcData();
    };
    handlerToolsInitBind(recvEventData){
        const that = this ;
        that.ServiceLiterally.toolsInitBind();
    };
    handlerWhiteboardPrevPage(){
        const that = this ;
        that._whiteboardPaging(false , true);
    };
    handlerWhiteboardNextPage(){
        const that = this ;
        that._whiteboardPaging(true , true);
    };
    handlerWhiteboardAddPage(){
        const that = this ;
        that.handlerSaveLcStackToStorage();
        let lcData = that.ServiceLiterally.getFileDataFromLcElement();
        lcData.pagenum += 1 ;
        let addPageData = {
            totalPage: lcData.pagenum ,
            fileid:lcData.fileid
        };
        that.ServiceLiterally.setFileDataToLcElement(lcData);
        ServiceSignalling.sendSignallingFromWBPageCount(addPageData);
        that._whiteboardPaging(true , true);
    };
    handlerUpdateAppPermissions_whiteboardPagingPage(){
        const that = this ;
        if(that.props.fileTypeMark === 'general' ){
            eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'whiteboard' , data: that.ServiceLiterally.getFileDataFromLcElement() }});
        }
    };
    handlerInitAppPermissions(){
        const that = this ;
        that.handlerUpdateAppPermissions_canDraw();
        that.handlerUpdateAppPermissions_laser();
        that.handlerUpdateAppPermissions_whiteboardPagingPage();
        that.handlerCheckSelectMouseState();
    };
    handlerOpenDocuemntOrMediaFile(recvEventData){
        const that = this ;
        let fileDataInfo  = recvEventData.message ;
        let open =  that._saveFileidReturnOpen(fileDataInfo);
        if( fileDataInfo.isGeneralFile ){ //如果是普通文档
            that._handlerReceiveShowPageSignalling( { message:{ data:fileDataInfo  , open:open  ,  source:'commonFileClickEvent' } } ) ;
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
    handlerUpdateWhiteboardToolStatus(recvEventData){
        const that = this ;
        for(let [key , value] of Object.entries(recvEventData.message.toolStatus) ) {
            that.ServiceLiterally.lc.toolStatus[key] = value ;
        }
    };
    handlerExecuteUploadTextFont(recvEventData){
        const that = this ;
        that.ServiceLiterally.uploadTextFont();
    };
    handlerUpdateSelectMouse(recvEventData){
        let selectMouse = recvEventData.message.selectMouse ;
        if(this.state.selectMouse !== selectMouse){
            let {fileTypeMark} = this.props ;
            let hideLc = false ;
            switch (fileTypeMark){
                case 'dynamicPPT':
                    hideLc = CoreController.handler.getAppPermissions('dynamicPptActionClick') &&  selectMouse ;//是动态PPT并且拥有动态PPT点击权限并且选中的是鼠标，则隐藏
                    break;
                case 'h5document':
                    hideLc = CoreController.handler.getAppPermissions('h5DocumentActionClick') &&  selectMouse ;//是H5文档并且拥有H5文档点击权限并且选中的是鼠标，则隐藏
                    break;
                default:
                    hideLc = false ;
                    break;
            }
            this.setState({selectMouse:selectMouse , show:!hideLc });
        }
    };
    handlerCheckSelectMouseState(recvEventData){
        let fileTypeMark = undefined;
        if(recvEventData && recvEventData.message && recvEventData.message.fileTypeMark){
            fileTypeMark = recvEventData.message.fileTypeMark ;
        }
        let {selectMouse , show} = this.state ;
        fileTypeMark = fileTypeMark || this.props.fileTypeMark;
        let hideLc = false ;
        switch (fileTypeMark){
            case 'dynamicPPT':
                hideLc = CoreController.handler.getAppPermissions('dynamicPptActionClick') &&  selectMouse ;//是动态PPT并且拥有动态PPT点击权限并且选中的是鼠标，则隐藏
                break;
            case 'h5document':
                hideLc = CoreController.handler.getAppPermissions('h5DocumentActionClick') &&  selectMouse ;//是H5文档并且拥有H5文档点击权限并且选中的是鼠标，则隐藏
                break;
            default:
                hideLc = false ;
                break;
        }
        if(show !== (!hideLc) ){
            this.setState({show:!hideLc});
        }
    } ;
    handlerChangeStrokeSize(recvEventData){
        const that = this ;
        let { pencil , text , eraser , shape } = recvEventData.message.strokeJson ;
        that.ServiceLiterally.lc.toolStatus.pencilWidth = pencil ;
        that.ServiceLiterally.lc.toolStatus.eraserWidth = eraser ;
        that.ServiceLiterally.lc.toolStatus.fontSize = text ;
        that.ServiceLiterally.lc.toolStatus.shapeWidth = shape ;
        for(let [key , value] of Object.entries(recvEventData.message.selectedTool) ){
            if(!value){continue ;} ;
            switch (key){
                case 'pencil':
                    that.ServiceLiterally.uploadPencilWidth();
                    break;
                case 'text':
                    that.ServiceLiterally.uploadTextFont();
                    break;
                case 'eraser':
                    that.ServiceLiterally.uploadEraserWidth();
                    break;
                case 'shape':
                    that.ServiceLiterally.uploadShapeWidth();
                    break;
            }
        }
    };
    handlerChangeStrokeColor(recvEventData){
        const that = this ;
        that.ServiceLiterally.uploadColor( 'primary',"#"+recvEventData.message.selectColor ); //设置画笔颜色
    };
    handlerUpdateAppPermissions_canDraw(){
        const that = this ;
        that.ServiceLiterally.setIsDrawAble( CoreController.handler.getAppPermissions('canDraw') ); //设置白板核心不可画
    };
    handlerUpdateAppPermissions_h5DocumentActionClick(){
        this.handlerCheckSelectMouseState();
    };
    handlerUpdateAppPermissions_dynamicPptActionClick(){
        this.handlerCheckSelectMouseState();
    };
    handlerUpdateAppPermissions_laser(){
        const that = this ;
        that.ServiceLiterally.rolePermission["laser"] = CoreController.handler.getAppPermissions('laser') ; //设置激光笔权限
    };
    handlerLcTextEditing(recvEventData){
        const that = this ;
        let callback = recvEventData.message.callback ;
        if(callback && typeof callback === 'function'){
            callback( that.ServiceLiterally.isTextEditing() );
        }
    };
    handlerSkipPage_general(recvEventData){
        const that = this ;
        if(that.props.fileTypeMark === 'general' ){
            let { currpage } = recvEventData.message ;
            that._skipWhiteboardPaging(currpage);
        }
    };
    handlerPreloadWhiteboardImg(recvEventData){
        const that = this ;
        let {url} = recvEventData.message ;
        that.ServiceLiterally.preloadWhiteboardImg(url);
    };
    _lcInit(){ //白板初始化
        let that = this ;
        that.ServiceLiterally = that.ServiceLiterally || new CustomLiterally() ;
        that.ServiceLiterally.imgServiceUrl =  TkConstant.SERVICEINFO.protocolAndHostname  ;
        that.ServiceLiterally.imgServicePort = TkConstant.SERVICEINFO.port ;
        let $bigLc = $("#big_literally_vessel") ;
        that.ServiceLiterally.lcInit( $bigLc ) ;
        that.ServiceLiterally.clearRedoAndUndiStack();
        that.handlerToolsInitBind();
        that.ServiceLiterally.setFileDataToLcElement(that.ServiceLiterally.defaultFileData());
    };
    _handlerReceiveShowPageSignalling(showpageData){
        let that = this ;
        let doucmentFileData = showpageData.message.data;
        let open = showpageData.message.open;
        if(!doucmentFileData.isMedia) {
            if (doucmentFileData.isGeneralFile ) { //普通文档
                that.handlerSaveLcStackToStorage();
                that.ServiceLiterally.setFileDataToLcElement(doucmentFileData.filedata);
                let isSetPlayUrl = true ;
                that._recviceCommonDocumentShowPage(isSetPlayUrl, open);
            }
        }
    };
    _recviceCommonDocumentShowPage( isSetPlayUrl , open ){ //普通文档的显示处理
        const that=  this ;
        let fileTypeMark = 'general' ;
        that.props.changeFileTypeMark(fileTypeMark); //改变fileTypeMark的值
        isSetPlayUrl = (isSetPlayUrl!=null && isSetPlayUrl!=undefined ) ?isSetPlayUrl:true ;
        eventObjectDefine.CoreController.dispatchEvent({type:'setNewPptFrameSrc'  ,  message:{src:''}}) ;
        eventObjectDefine.CoreController.dispatchEvent({type:'setH5FileFrameSrc'  ,  message:{src:''}}) ;
        that.ServiceLiterally.resetLcDefault(); //重置默认放大比例
        let {fileid , swfpath , currpage , pagenum} = that.ServiceLiterally.getFileDataFromLcElement();
        if( fileid === 0){
            that.ServiceLiterally.lcLitellyScalc = 16 / 9 ;
            if(isSetPlayUrl) {
                that.ServiceLiterally.setBackgroundWatermarkImage("");
            }
        }else{
            let index = swfpath.lastIndexOf(".") ;
            let imgType = swfpath.substring(index);
            let fileUrl = swfpath.replace(imgType,"-"+currpage+imgType) ;
            if(isSetPlayUrl) {
                let serviceUrl = that.ServiceLiterally.imgServiceUrl + ":" +   that.ServiceLiterally.imgServicePort ;
                that.ServiceLiterally.setBackgroundWatermarkImage(serviceUrl + fileUrl);

                //open == true 为打开一个普通文档。open === undefined为前后翻页
                let startInt = 1;
                let endInt = 1;
                if(open) {
                    that.cacheMaxPageNum = currpage;
                    that.filePreLoadCurrPage = currpage;
                    that.cacheMinPageNum = currpage;
                    if (that.cacheMaxPageNum + that.filePreLoadStep <= pagenum) {
                        that.cacheMaxPageNum += that.filePreLoadStep;
                    } else if (that.cacheMaxPageNum < pagenum) {
                        that.cacheMaxPageNum += (pagenum - that.cacheMaxPageNum);
                    }

                    if (that.cacheMinPageNum - that.filePreLoadStep >= 1) {
                        that.cacheMinPageNum -= that.filePreLoadStep;
                    } else {
                        that.cacheMinPageNum = 1;
                    }
                    endInt = that.cacheMaxPageNum;
                    startInt = that.cacheMinPageNum;
                } else {

                    if(that.filePreLoadCurrPage  < currpage ){
                        startInt = that.cacheMaxPageNum + 1;
                        if(currpage > that.cacheMaxPageNum ){
                            that.cacheMaxPageNum = currpage;
                        }
                        if (that.cacheMaxPageNum + that.filePreLoadStep <= pagenum) {
                            that.cacheMaxPageNum += that.filePreLoadStep;
                        } else if (that.cacheMaxPageNum < pagenum) {
                            that.cacheMaxPageNum += (pagenum - that.cacheMaxPageNum);
                        }
                        endInt = that.cacheMaxPageNum;
                    } else if (that.filePreLoadCurrPage  > currpage){
                        endInt = that.cacheMinPageNum - 1;
                        if(currpage < that.cacheMinPageNum ){
                            that.cacheMinPageNum = currpage;
                        }
                        if (that.cacheMinPageNum - that.filePreLoadStep >= 1) {
                            that.cacheMinPageNum -= that.filePreLoadStep;
                        } else {
                            that.cacheMinPageNum = 1;
                        }
                        startInt = that.cacheMinPageNum;
                    }
                    that.filePreLoadCurrPage = currpage;
                }

                for(let i=startInt ;i<=endInt ; i++){  //todo qiugs 普通文档预加载代码
                    if(i !== currpage){
                        let index = swfpath.lastIndexOf(".") ;
                        let imgType = swfpath.substring(index);
                        let fileUrl = swfpath.replace(imgType,"-"+ i + imgType) ;
                        let serviceUrl = that.ServiceLiterally.imgServiceUrl + ":" +   that.ServiceLiterally.imgServicePort ;
                        that.handlerPreloadWhiteboardImg({type:'preloadWhiteboardImg' , message:{url:serviceUrl + fileUrl}});
                    }
                }
            }
        }
        //加载当前页的白板数据
        that._recoverCurrpageLcData();
        eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'whiteboard' , data: that.ServiceLiterally.getFileDataFromLcElement() }});
        that.handlerCheckSelectMouseState({type:'checkSelectMouseState' , message:{fileTypeMark:fileTypeMark}});
    };
    _recoverCurrpageLcData(fileId ,currPageNum ){ //画当前文档当前页数据到白板上
        let that = this ;
        let paramsJson = {fileId:fileId , currPageNum:currPageNum , loadRedoStack:TkConstant.hasRole.roleChairman , callback:function () {} };
        that.ServiceLiterally.recoverCurrpageLcData(paramsJson);
    };
    /*白板翻页*/
    _whiteboardPaging(next , send = true , isSetPlayUrl=true) {
        const that = this ;
        let lcData = that.ServiceLiterally.getFileDataFromLcElement();
        if (next === true) {
            if(lcData.currpage >= lcData.pagenum ){
                return ;
            }
            lcData.currpage++ ;
        } else if (next == false) {
            if(lcData.currpage <= 1 ){
                return ;
            }
            lcData.currpage-- ;
        }
        that.handlerSaveLcStackToStorage();
        that.ServiceLiterally.setFileDataToLcElement(lcData);
        that._recviceCommonDocumentShowPage(isSetPlayUrl);

        let pagingData = {
            isMedia:false ,
            isDynamicPPT:false ,
            isGeneralFile:true ,
            isH5Document:false ,
            action:"" ,
            mediaType:"" ,
            filedata:lcData
        };
        eventObjectDefine.CoreController.dispatchEvent({
            type:'documentPageChange' ,
            message:pagingData
        });
        if(send){
            let isDelMsg = false , id = 'DocumentFilePage_ShowPage';
            ServiceSignalling.sendSignallingFromShowPage( isDelMsg , id , pagingData);
        };
    };
    _skipWhiteboardPaging(currpage , send = true , isSetPlayUrl=true){ //普通文档跳转
        const that = this ;
        let lcData = that.ServiceLiterally.getFileDataFromLcElement();
        lcData.currpage = currpage ;
        that.handlerSaveLcStackToStorage();
        that.ServiceLiterally.setFileDataToLcElement(lcData);
        that._recviceCommonDocumentShowPage(isSetPlayUrl);
        let pagingData = {
            isMedia:false ,
            isDynamicPPT:false ,
            isGeneralFile:true ,
            isH5Document:false ,
            action:"" ,
            mediaType:"" ,
            filedata:lcData
        };
        eventObjectDefine.CoreController.dispatchEvent({
            type:'documentPageChange' ,
            message:pagingData
        });
        if(send){
            let isDelMsg = false , id = 'DocumentFilePage_ShowPage';
            ServiceSignalling.sendSignallingFromShowPage( isDelMsg , id , pagingData);
        };
    };
    _handlerSendDataToLiterallyEvent(idPrefix , data , signallingName , assignId , do_not_save){
        const that = this ;
        let { currpage , fileid } = that.ServiceLiterally.getFileDataFromLcElement();
        let currPageNum = currpage , currFileId = fileid ,isDelMsg = false ;
        ServiceSignalling.sendSignallingFromSharpsChange(currPageNum , currFileId ,isDelMsg , idPrefix , data , signallingName , assignId , do_not_save);
    };
    _handlerDeleteLiterallyDataEvent(idPrefix , data , signallingName , assignId  ){
        const that = this ;
        let { currpage , fileid } = that.ServiceLiterally.getFileDataFromLcElement();
        let currPageNum = currpage , currFileId = fileid ,isDelMsg = true , do_not_save=true ;
        ServiceSignalling.sendSignallingFromSharpsChange(currPageNum , currFileId ,isDelMsg , idPrefix , data , signallingName , assignId , do_not_save);
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
    render(){
        let that = this ;
        const {fileTypeMark , ...other} = that.props ;
        const {show} = that.state ;
        if(!that.ServiceLiterally){
            that.ServiceLiterally = new CustomLiterally() ;
        }
        that.ServiceLiterally.isOpenLcFile = (fileTypeMark === 'general') ;
        that.ServiceLiterally.checkCanvasSize();
        return (
            <div  id="scroll_literally_container"  style={{display:!show?'none':'block'}} className={"overflow-hidden  scroll-literally-container "+ ('tk-filetype-'+fileTypeMark) }    {...TkUtils.filterContainDataAttribute(other)}   >
                {/*白板区域*/}
                <div id="big_literally_vessel"  ></div>
            </div>
        )
    };
};

export default WhiteboardSmart ;


