/**
 * 普通文件列表的Smart组件
 * @module FileListSmart
 * @description   普通文件列表的Smart组件,处理普通文件列表的业务
 * @author Xiagd
 * @date 2017/08/17
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import CoreController from 'CoreController';
import FileListDumb from '../../../../../../../../components/fileList/fileList';
import FileSelect  from './fileSelect';
import FileProgressBar from './fileProgressBar';
import ServiceTooltip from 'ServiceTooltip' ;
import ServiceTools from 'ServiceTools' ;
import TkUtils from 'TkUtils';
import TkAppPermissions from 'TkAppPermissions';



class FileListSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filelistData: this._createDefaultFilelistData(),
            commonAccept:TkConstant.FILETYPE.documentFileListAccpet,
            mediaAccept:TkConstant.FILETYPE.mediaFileListAccpet,
            h5DocumentAccept:TkConstant.FILETYPE.h5DocumentFileListAccpet,
            filePercent:0,
            isUpdateH5Document:false,
        }
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.uploadFileArray = [];              //正在上传的文档
        this.currDocumentFileid = -1;          //当前打开文档文件ID，不能重复打开当前文档
        this.cachePageNum = 1;                  //当前打开文档的缓存总数
        this.filePreLoadStep = 2;               //普通文档预加载步长
        this.currPlayFileid = undefined;       //上传文件时是否有媒体文件在播放
        this.uploadFilePath = "";               //断点续传时的临时文件路径
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        that.initFileToList();
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomFiles , that.handlerRoomFiles.bind(that), that.listernerBackupid); //roomFiles事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( "openDefaultDoucmentFile" , that.handlerDefaultDocument.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ShowPage-lastDocument" , that.handlerShowpage.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( "documentPageChange" , that.handlerDocmentPageChange.bind(that), that.listernerBackupid); //roomPubmsg事件

        eventObjectDefine.CoreController.addEventListener( "receive-msglist-WBPageCount" , that.handlerMsglistWBPageCount.bind(that), that.listernerBackupid); //roomPubmsg事件
        //{type:'receive-msglist-ShowPage-lastDocument' , message:{data:lastDoucmentFileData  , source:'room-msglist' }
        //eventObjectDefine.CoreController.addEventListener({type:'openDefaultDoucmentFile' , message:{fileid:fileid} }); //打开缺省文档
        //eventObjectDefine.CoreController.addEventListener({type:'currDoucmentFileChange' , message:{fileid:fileid} }); //当前文档翻页侦听事件

        eventObjectDefine.CoreController.addEventListener( "playMediaUnpublishSucceed" , that.playMediaUnpublishSucceed.bind(that), that.listernerBackupid); //媒体取消发布事件成功
        eventObjectDefine.CoreController.addEventListener( "playMediaPublishSucceed" , that.playMediaPublishSucceed.bind(that), that.listernerBackupid); //媒体发布事件成功
        eventObjectDefine.CoreController.addEventListener( "playMediaUnpublishFail" , that.playMediaUnpublishFail.bind(that), that.listernerBackupid); //媒体取消发布事件失败
        eventObjectDefine.CoreController.addEventListener( "playMediaPublishFail" , that.playMediaPublishFail.bind(that), that.listernerBackupid); //媒体发布事件失败

        eventObjectDefine.CoreController.addEventListener( "changeDocumentFileListAccpetArr" , that.changeDocumentFileListAccpetArr.bind(that), that.listernerBackupid); //roomPubmsg事件

        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantEvicted,that.handlerRoomParticipantEvicted.bind(that) , that.listernerBackupid); //Disconnected事件：参与者被踢事件
        //eventObjectDefine.CoreController.addEventListener("uploadH5DocumentFile" , this.handlerUploadH5DocumentFile.bind(this),that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener("uploadH5DocumentFileComplete" , this.handlerUploadH5DocumentFileComplete.bind(this),that.listernerBackupid);
    };

    componentWillMount(){
        let that = this;
        eventObjectDefine.CoreController.addEventListener("uploadH5DocumentFile" , this.handlerUploadH5DocumentFile.bind(this),that.listernerBackupid);
    }

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    /*生产默认的普通文件列表数据*/
    _createDefaultFilelistData(){
        const filelistData = {
            titleJson:{
                title:this.props.isMediaUI?TkGlobal.language.languageData.toolContainer.toolIcon.mediaDocumentList.title:TkGlobal.language.languageData.toolContainer.toolIcon.documentList.title ,
                number:0
            } ,
            //fileListItemJson:new Map(),
            fileListItemJson:new Array(),
            uploadButtonJson:{
                show:TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant,
                buttonText: this.props.isMediaUI?TkGlobal.language.languageData.toolContainer.toolIcon.mediaDocumentList.button.addCourse.text:TkGlobal.language.languageData.toolContainer.toolIcon.documentList.button.addCourse.text,
                buttonH5Text: TkGlobal.language.languageData.toolContainer.toolIcon.H5DocumentList.button.addCourse.text,
                uploadFile:this.uploadFile.bind(this)
            }
        };
        return filelistData ;
    };
    //创建白板文档信息
    _createWhiteBoard(fileid,filename,pagenum,swfpath,isDynamicPPT){
        let filetype = 'whiteboard';
        let newDocumentInfo = {
            active:0,
            isGeneralFile:true,
            isDynamicPPT:false,
            isMediaFile:false,
            isH5Document:false,
            fileid:fileid,
            currentPage:1 ,
            pagenum:1 ,
            filetype: filetype,
            filename: filename,
            swfpath: swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        };
        return newDocumentInfo;
    }

    //创建临时文档信息
    _createTempFile(fileid,filename,pagenum,swfpath,isDynamicPPT,isH5Document,isMediaFile){
        //let filetype = filename.split('.');
        let filetype = filename.substring(filename.lastIndexOf(".") + 1);
        let newDocumentInfo = {
            active:0,
            isGeneralFile:!isH5Document && !isDynamicPPT && !isMediaFile?true:false,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            isH5Document:isH5Document,
            fileid:fileid,
            currentPage:1 ,
            pagenum:pagenum ,
            filetype: filetype,
            filename: filename,
            swfpath: swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        }
        return newDocumentInfo;
    }

    //创建普通文档信息
    _createFile(file){

        /*
            active:"0"
            companyid:"10032"
            downloadpath:"/upload/20170804_180639_wywpgbmr.txt"
            dynamicppt:"0"
            fileid:"20892"
            filename:"test.txt"
            filepath:""
            fileserverid:"0"
            filetype:"txt"
            isconvert:"1"
            newfilename:"20170804_180639_wywpgbmr.txt"
            pagenum:"1"
            pdfpath:"/upload/20170804_180639_wywpgbmr.pdf"
            size:"16"
            status:"1"
            swfpath:"/upload/20170804_180639_wywpgbmr.jpg"
            type:"1"
            uploadtime:"2017-08-04 18:06:43"
            uploaduserid:"100620"
            uploadusername:"admin"
         */

        if(file.dynamicppt=="")
            file.dynamicppt="0";
        //let filetype = file.filename.split(".");

        //1:上传文件和获取文件返回一个文件属性fileprop
        //0:表示普通文档　１－２动态ppt(1: 第一版动态ppt 2: 新版动态ppt ）  3:h5文档

        let filetype = file.filename.substring(file.filename.lastIndexOf(".") + 1).toLowerCase();
        let isDynamicPPT = false;
        let isMediaFile = this.state.mediaAccept.indexOf(filetype)==-1?false:true;
        let isH5Document = false;
        let isGeneralFile = false;

        let fileprop = file.fileprop;
        if(fileprop==1 || fileprop==2)
            isDynamicPPT = true;
        else if(fileprop==3)
            isH5Document = true;
        else if(!isMediaFile && fileprop==0)
            isGeneralFile=true;


        let newDocumentInfo = {
            active:0,
            isGeneralFile:isGeneralFile,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            isH5Document:isH5Document,
            fileid:file.fileid,
            currentPage:1 ,
            pagenum:parseInt(file.pagenum),
            filetype: filetype,
            filename: file.filename,
            swfpath: (isDynamicPPT||isH5Document)?file.downloadpath:file.swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        }

        return newDocumentInfo;
    }

    _createfileFromNetworkMsg(netWorkMsg){
        /*let data = {
            isDel:false ,
            isMedia:false ,
            isDynamicPPT:false ,
            filedata:{
                fileid:fileid,
                currpage:currpage ,
                pagenum:pagenum ,
                filetype:filetype  ,
                filename: filename ,
                swfpath: swfpath ,
                pptslide:pptslide ,
                pptstep:pptstep ,
                steptotal:pptstep ,
            }
        };*/
        let isDynamicPPT = netWorkMsg.isDynamicPPT;
        let isMediaFile = netWorkMsg.isMedia;
        let isH5Document = netWorkMsg.isH5Document;
        //let isMediaFile = this.state.mediaAccept.indexOf(netWorkMsg.filedata.filetype)==-1?false:true;
        let newDocumentInfo = {
            active:0,
            isGeneralFile:!isH5Document && !isDynamicPPT && !isMediaFile?true:false,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            isH5Document:isH5Document,
            fileid:netWorkMsg.filedata.fileid,
            currentPage:1 ,
            pagenum:netWorkMsg.filedata.pagenum ,
            filetype: netWorkMsg.filedata.filetype,
            filename: netWorkMsg.filedata.filename,
            swfpath: netWorkMsg.filedata.swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        }

        return newDocumentInfo;

    }


    //创建上传文档信息
    /*_createUploadFile(fileid,filename,dynamicppt,pagenum,swfpath){
        let filetype = filename.split(".");
        let isDynamicPPT = dynamicppt=="0"?true:false;
        let isMediaFile = this.state.mediaAccept.indexOf(1])==-1?false:true;
        let newDocumentInfo = {
            isGeneralFile:!isDynamicPPT && !isMediaFile?true:false,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            fileid:fileid,
            currpage:1 ,
            pagenum:pagenum ,
            filetype: filetype[1],
            filename: filename,
            swfpath: swfpath ,
            pptslide:0 ,
            pptstep:0 ,
            steptotal:0 ,
        }
    }*/

    _createNetworkMsg(fileDataInfo,isdel){
        fileDataInfo.isDel = isdel ;
       return fileDataInfo;
    }

    /*根据file生产用户描述信息*/
    _createFileItemDescInfo(file){
        const that = this ;
        //本地数据结构
        //console.error(111111112222,file);
        const fileDataInfo = {
            isDel:false,
            isGeneralFile:file.isGeneralFile,
            isMedia:file.isMediaFile,
            isDynamicPPT:file.isDynamicPPT,
            isH5Document:file.isH5Document,
            action: "show",
            mediaType:file.isMediaFile?file.filetype:"",
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

        //L.Logger.debug('TkGlobal.classBegin  =', TkGlobal.classBegin);
        let disabler = false;

         //file.isMediaFile?(TkGlobal.classBegin?(bShowIcon?(file.active==1?true:false):true):true):(file.active==1?true:false);

        let bShowIcon = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        const fileItemDescInfo =  {
            id:file.fileid,
            disabled: file.isMediaFile?(bShowIcon?(file.active==1?true:false):true):(file.active==1?true:false),
            active:  file.active,
            onClick: file.fileid==0?that.handlerOpenDocuemnt.bind(that, fileDataInfo):'',
            textContext:file.filename,
            children:undefined ,
            order:1,
            show:true,
            //TkConstant.role.roleTeachingAssistant;
            //TkConstant.role.roleChairman
            //order:user.role === TkConstant.role.roleStudent ? 0 : ( user.role === TkConstant.role.roleTeachingAssistant?1:2 ), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-助教 ， 2-暂时未定）
            //ServiceRoom.getTkRoom().getMySelf().role
            afterIconArray:[
                {
                    disabled:false,
                    before:true,
                    after:false,
                    show:true ,
                    'className':"disabled tk-icon-before tk-icon-" + TkUtils.getFiletyeByFilesuffix(file.filetype),
                    onClick: '',
                } ,
                {
                    disabled:false,
                    before:false,
                    after:true,
                    show:true ,
                    'className':file.isMediaFile?('file-list-play-icon '):('file-list-eye-icon '  + (file.active==0?'off':'on' )),
                    onClick: that.handlerOpenDocuemnt.bind(that, fileDataInfo),
                } ,
                {
                    disabled:false,
                    before:false,
                    after:true,
                    show:bShowIcon ,
                    'className':'file-list-delete-icon ' ,
                    onClick: that.handlerDeleteDocuemnt.bind(that, fileDataInfo),
                } ,
            ],
            fileDataInfo:fileDataInfo,
        } ;

        return fileItemDescInfo ;
    };

    //初始化文件列表
    initFileToList(){
        const that = this ;
        if(that.props.isMediaUI)
            return;
        let filename = TkGlobal.language.languageData.toolContainer.toolIcon.whiteBoard.title;

        let whiteboard = that._createWhiteBoard(0,filename,1,"",false);
        let fileItemDescInfo = that._createFileItemDescInfo(whiteboard);
        that.addFileToList(fileItemDescInfo);

        //fileItemDescInfo.temporaryDisabled = false ;
        /*if(whiteboard.fileid!=0) {
            that.state.filelistData.titleJson.number += 1;
        }*/
        //that.state.filelistData.fileListItemJson.push(fileItemDescInfo );
        //that.setState({filelistData:that.state.filelistData});
    }

    /*处理room-files事件,获取房间所有普通文件*/
    handlerRoomFiles(roomFilesEventData) {
        const  that = this ;
        //L.Logger.debug('handleRoomFiles roomFilesEventData=', roomFilesEventData);
        let files = roomFilesEventData.message ;
        for(let key in  files ){
            if(this.props.isMediaUI)
            {
                let file = files[key];
                let index = that.state.mediaAccept.indexOf(file.filetype);
                if(index!=-1)
                {
                    let newDocument = that._createFile(files[key]);
                    let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
                    that.addFileToList(fileItemDescInfo);
                }
            }
            else{
                let file = files[key];
                let index = that.state.mediaAccept.indexOf(file.filetype);
                if(index==-1)
                {
                    let newDocument = that._createFile(files[key]);
                    let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
                    that.addFileToList(fileItemDescInfo);
                }
            }
        }
    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let delmsgData = recvEventData.message ;

        switch(delmsgData.name) {
            case "ClassBegin":
                if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                    if(!this.props.isMediaUI){
                        that.initDocumentDefaultState();
                        that.handlerDefaultDocument( {type:'openDefaultDoucmentFile' , message:{fileid:0} } );
                    }
                }
                break;
        }
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        //L.Logger.info("handlerRoomPubmsg="+pubmsgData);

        //L.Logger.debug('handlerRoomPubmsg 123==', pubmsgData);
        switch(pubmsgData.name)
        {

            case "DocumentChange": {

                //if(this.props.isMediaUI)
                //    return;

                //信令产生回调函数，判断返回值是否成功，然后才能删除
                if (pubmsgData.data.isDel) {
                    let room = ServiceRoom.getTkRoom();
                    //动态ppt 暂时老师和助教都发布信令；完善后谁删除，谁发布信令
                    this.removeFileToList(pubmsgData.data.filedata.fileid,pubmsgData.fromID,pubmsgData.data.isDynamicPPT);

                }
                else {

                    let createfileFromNetworkMsg = that._createfileFromNetworkMsg(pubmsgData.data);
                    let fileItemDescInfo = that._createFileItemDescInfo(createfileFromNetworkMsg);
                    that.addFileToList(fileItemDescInfo);

                    if(TkGlobal.classBegin && !fileItemDescInfo.fileDataInfo.isMedia)
                        that.handlerOpenDocuemnt(fileItemDescInfo.fileDataInfo);
                }
                //发送打开文档命令，如果删除的文档下面有数据，则打开下面的文档，如果没有该文档向上一个，如果是白板则打开白板


                break;
            }
            case "WBPageCount":{
                if(this.props.isMediaUI)
                    return;

                let fileid = pubmsgData.data.fileid;
                let pagenum = pubmsgData.data.totalPage;
                this.handleWBAddPage(fileid,pagenum);
                break;
            }
            case "ClassBegin":{
                //上课要发送信令
                if(this.props.isMediaUI){
                    ServiceTools.unpublishAllMediaStream(function(code,stream){
                        let fileid = undefined;
                        if(stream!==null && stream!==undefined)
                            fileid = stream.getAttributes().fileid;
                        let nFlag = 3;
                        //取消发布成功，所有媒体文件都可以操作
                        that.changeMediaFileAttr(false  ,nFlag ,  fileid );
                    }); //取消发布所有媒体流
                    //上课，所有媒体文件都可以操作
                    //L.Logger.debug('pubmsg classBegin  =', TkGlobal.classBegin);
                    //that.changeMediaFileAttr(false);
                } else{
                    let isDelMsg = false;
                    let id = "DocumentFilePage_ShowPage";
                    //打开一个文档，学生端接收ShowPage 命令
                    let fileListData = that.state.filelistData;
                    let fileListItem = fileListData.fileListItemJson;
                    let openData ={};

                    for(var i=0; i< fileListItem.length; i++){
                        if(fileListItem[i].active=="1"){
                            openData = fileListItem[i];
                            break;
                        }
                    }
                    if(TkConstant.hasRole.roleChairman)
                        ServiceSignalling.sendSignallingFromShowPage(isDelMsg, id, openData.fileDataInfo);
                }

                break;
            }
            case "ShowPage": {
                let that= this;

                if(this.props.isMediaUI && pubmsgData.data.isMedia ) {
                    //that.showPageOpenMedia(pubmsgData.data);
                }else {
                    that.showPageOpenDocuemnt(pubmsgData.data);
                }
                break;
            }
               /* let pagingData = {
                    isMedia:false ,
                    isDynamicPPT:false ,
                    isGeneralFile:true ,
                    action:'' ,
                    mediaType:'' ,
                    filedata:lcData
                };
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'documentPageChange' ,
                    message:pagingData
                });
                if(send){
                    let isDelMsg = false , id = 'DocumentFilePage_ShowPage';
                    ServiceSignalling.sendSignallingFromShowPage( isDelMsg , id , pagingData);
                };*/
        }
    };

    handlerMsglistWBPageCount(recvEventData){
        const that = this ;
        let message =  recvEventData.message ;
        let fileid = message.data.fileid;
        let pagenum = message.data.totalPage;
        this.handleWBAddPage(fileid,pagenum);
    }

    handleWBAddPage(fileid,pagenum){
        let that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        for(let i=0;i<fileListItem.length;i++){
            if(fileid ==fileListItem[i].fileDataInfo.filedata.fileid)
            {
                 //L.Logger.info("add wb page pagenum="+pagenum);
                 fileListItem[i].fileDataInfo.filedata.pagenum=pagenum;
            }
        }
        that.setState({filelistData:fileListData});
    }

    //打开默认文档
    handlerDefaultDocument(event) {
        let that = this;

        let fileid = event.message.fileid;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;

        let index = 0;

        if(!event.message.isMedia) {

            that.currDocumentFileid = fileid;

            for (let i = 0; i < fileListItem.length; i++) {
                if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                    fileListItem[i].active = "1";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon ' : 'file-list-eye-icon on';
                    index = i;
                }
                else {
                    fileListItem[i].active = "0";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon ' : 'file-list-eye-icon off';
                    fileListItem[i].fileDataInfo.action = (fileListItem[i].fileDataInfo.isDynamicPPT || fileListItem[i].fileDataInfo.isH5Document)?"show":"";
                }
            }
            that.setState({filelistData: fileListData});

            if (fileListItem.length > 0 && index >= 0) {
                let nextOpenData = fileListItem[index];

                if(event.message.isGeneralFile) {  //普通文档预加载
                    that.cachePageNum = nextOpenData.fileDataInfo.filedata.currpage;
                    that.cachePageNum = that.openFilePreLoad(that.cachePageNum, that.filePreLoadStep, nextOpenData.fileDataInfo);
                }

                //发送信令并播放
                eventObjectDefine.CoreController.dispatchEvent({
                    type: 'openDocuemntOrMediaFile',
                    message: nextOpenData.fileDataInfo
                });
                //得到白板回来的信息后才能发信令
                let isDelMsg = false;
                let id = "DocumentFilePage_ShowPage";
                if (nextOpenData.fileDataInfo.isMedia)
                    id = nextOpenData.fileDataInfo.filedata.filetype == "mp3" ? "Audio_MediaFilePage_ShowPage" : "Video_MediaFilePage_ShowPage";
                ServiceSignalling.sendSignallingFromShowPage(isDelMsg, id, nextOpenData.fileDataInfo);
            }
        }

    }

    handlerShowpage(event){
        //message:{data:lastDoucmentFileData  , source:'room-msglist'
        //L.Logger.debug('handlerShowpage event=', event);

        const that = this ;

        if(!event.message.isMedia) {

            let fileid = event.message.data.filedata.fileid;
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            for (let i = 0; i < fileListItem.length; i++) {
                if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                    fileListItem[i].fileDataInfo.filedata.currpage = event.message.data.filedata.currpage;
                }
            }
            that.setState({filelistData: fileListData});
        }

        let  filedata = event.message.data;
        //打开文件，需要发送信令吗？
        this.handlerOpenDocuemnt(filedata);
    }

    handlerDocmentPageChange(event){
        let that= this;
        let  filedescinfo = event.message;
        let fileid = event.message.filedata.fileid;

        let index = 0;
        //let fileItemDescInfo = that._createFileItemDescInfo(filedescinfo);
        //that.updateFileToList(fileItemDescInfo,fileid);
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        for(let i=0;i<fileListItem.length;i++){
            if(fileid ==fileListItem[i].fileDataInfo.filedata.fileid){
                fileListItem[i].fileDataInfo.filedata.pptslide=filedescinfo.filedata.pptslide;
                fileListItem[i].fileDataInfo.filedata.currpage=filedescinfo.filedata.currpage;
                fileListItem[i].fileDataInfo.filedata.swfpath=filedescinfo.filedata.swfpath;
                fileListItem[i].fileDataInfo.filedata.steptotal=filedescinfo.filedata.steptotal;
                fileListItem[i].fileDataInfo.filedata.pptslide=filedescinfo.filedata.pptslide;
                fileListItem[i].fileDataInfo.filedata.pptstep=filedescinfo.filedata.pptstep;
                if(!fileListItem[i].fileDataInfo.isMedia){
                    //L.Logger.info("pagenum="+filedescinfo.filedata.pagenum);
                    fileListItem[i].fileDataInfo.filedata.pagenum=filedescinfo.filedata.pagenum;
                }
            }
        }
        that.setState({filelistData:fileListData});

    }

    initDocumentDefaultState(){
        let that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        if(!this.props.isMediaUI) {
            for (let i = 0; i < fileListItem.length; i++) {
                if (i === 0) {
                    fileListItem[i].active = "1";
                    fileListItem[i].fileDataInfo.filedata.currpage = 1;
                    fileListItem[i].fileDataInfo.filedata.pagenum = 1;
                    fileListItem[i].fileDataInfo.filedata.pptslide = 1;
                    fileListItem[i].fileDataInfo.filedata.pptstep = 0;
                } else {
                    fileListItem[i].active = "0";
                    fileListItem[i].fileDataInfo.filedata.currpage = 1;
                    fileListItem[i].fileDataInfo.filedata.pptslide = 1;
                    fileListItem[i].fileDataInfo.filedata.pptstep = 0;
                }
            }
            that.setState({filelistData: fileListData});
        }
    }

    currMediaFileSetActive(){
        let that = this;
        let fileid = that.currPlayFileid;
        if(fileid !== undefined){
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            for(let i=0;i<fileListItem.length;i++){
                if(fileid ==fileListItem[i].fileDataInfo.filedata.fileid){
                    fileListItem[i].active = "1";
                }
            }
            that.setState({filelistData:fileListData});
        }
    }

    handlerUploadH5DocumentFile(){
        let that = this;
        that.setState({
            isUpdateH5Document:true
        });

    }

    handlerUploadH5DocumentFileComplete(){
        let that = this;
        that.setState({
            isUpdateH5Document:false
        });

    }



    //打开文件选择对话框
    uploadFile(){
        let that = this;

        //L.Logger.debug("this.props.isMediaUI  = ",this.props.isMediaUI)
        if(this.props.isMediaUI){
            eventObjectDefine.CoreController.dispatchEvent({type:'uploadMediaFile'}) ;
        }
        else{
            eventObjectDefine.CoreController.dispatchEvent({type:'uploadFile'}) ;
        }
    }

    //上传文件
    uploadFormOld(formData,filename,filetype){
        const that = this ;
        let tmpFileid = new Date().getTime();
        //改变状态，上传时，不允许进行其他操作。
        let nFlag = 0;

        that.setState({
            isUpdateH5Document:false
        });

        that.changeMediaFileAttr(true,nFlag,undefined);
        that.uploadFileArray.push(filename);

        let isH5Document = false;
            if(filename.indexOf(".zip")>0 )
                isH5Document = true;
        let isMedia = this.props.isMediaUI;

        let uploadFileAjaxInfo = {
            uploadFileAjaxXhr:undefined
        };
        let newDocument  = that._createTempFile(tmpFileid,filename,1,"",false,isH5Document,isMedia);
        let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
        let {progressBarDisabled =true , cancelFileUpload  , cancelBtnShow = true } = that.props ;
        let percent = 0 ;
        let currProgressText = percent+'%';
        fileItemDescInfo.children =  <FileProgressBar currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={that.cancelFileUpload.bind(that  , tmpFileid , uploadFileAjaxInfo.uploadFileAjaxXhr)}  cancelBtnShow={true}  /> ;

        uploadFileAjaxInfo.uploadFileAjaxXhr = ServiceRoom.getTkRoom().uploadFile(formData,function(code,response){
            that.uploadCallback(code,response,tmpFileid,filetype,fileItemDescInfo);
        },function(event,percent){
            that.progressCallback(event,percent,tmpFileid,filetype,fileItemDescInfo , uploadFileAjaxInfo);
        });
        that.addFileToList(fileItemDescInfo);
    }

    resumeUploadFileData(filecount,formData,resultfile,setsize,i,resumefileInfo){
        let that= this;

        //新建一个FormData对象
        //let formData = new FormData(); //
        //追加文件数据
        let blobfile = undefined;
        if((resultfile.size-i*setsize)>setsize){
            blobfile= resultfile.slice(i*setsize,(i+1)*setsize);
            //formData.get("lastone");
            //formData.set('lastone', false);
            //formData.get("lastone");
        }else{
            //formData.get("lastone");
            blobfile= resultfile.slice(i*setsize,resultfile.size);
            //formData.set('lastone', filecount);
            formData.append('lastone', Math.ceil(filecount));
            //formData.get("lastone");
        }

        formData.append('file', blobfile);
        //return false;
        formData.append('blobname', i);
        formData.append('filename', resultfile.name); //
        if(i!==0)
            formData.append('filepath', resumefileInfo.filepath);
        formData.append('blobflag', resumefileInfo.blobflag); //

        return formData;
    }

    resumeUploadFile(resumefileInfo,formData,resultfile,tmpFileid,fileItemDescInfo,filetype){

        let that = this;
        let percent = 0;
        let filecount =  resumefileInfo.filecount;
        let setsize = resumefileInfo.setsize;
        let i = resumefileInfo.i ;

        let uploadFileAjaxInfo = {
            uploadFileAjaxXhr:undefined
        };

        that.resumeUploadFileData(filecount, formData,resultfile,setsize, i,resumefileInfo);
        //L.Logger.debug("uploadForm formData = ", formData);

        if (Math.floor(filecount) <= i) {
            percent = 100;
            resumefileInfo.lastone = i;
        } else {
            let p = parseInt(i) * 100 / Math.ceil(filecount);
            percent = parseInt(p);
        }
        let currProgressText = percent + "%";

        fileItemDescInfo.children = <FileProgressBar currProgressWidth={percent} currProgressText={currProgressText}
                                                     progressBarDisabled={true}
                                                     cancelFileUpload={that.cancelFileUpload.bind(that, tmpFileid, uploadFileAjaxInfo.uploadFileAjaxXhr)}
                                                     cancelBtnShow={true}/>;
        uploadFileAjaxInfo.uploadFileAjaxXhr = ServiceRoom.getTkRoom().uploadFile(formData, function (code, response) {
            that.uploadCallback(code, response, tmpFileid, filetype, fileItemDescInfo,resultfile,resumefileInfo,formData);
        }, function (event, tmppercent) {
            //Log.error("percent = " + (percent===100?tmppercent/Math.ceil(filecount):percent+tmppercent/Math.ceil(filecount)));
            that.progressCallback(event, percent===100?percent:percent+ parseInt(tmppercent/Math.ceil(filecount)), tmpFileid, filetype, fileItemDescInfo, uploadFileAjaxInfo);
        });
    }

    setSessionStorage(c_name,value){
        window.sessionStorage.setItem(c_name,value);
    }

    getSessionStorage(c_name){
        return window.sessionStorage.getItem(c_name);
    }

    //上传文件
    uploadForm(fileList,formData,filename,filetype){
        const that = this ;

        let tmpFileid = new Date().getTime();
        //改变状态，上传时，不允许进行其他操作。
        let nFlag = 0;

        that.changeMediaFileAttr(true,nFlag,undefined);
        that.uploadFileArray.push(filename);

        let isH5Document = false;
        if(filename.indexOf(".zip")>0 )
            isH5Document = true;
        let isMedia = this.props.isMediaUI;

        let uploadFileAjaxInfo = {
            uploadFileAjaxXhr:undefined
        };

        let bFlag = false;
        let percent = 0 ;
        let currProgressText = percent+'%';
        let newDocument  = that._createTempFile(tmpFileid,filename,1,"",false,isH5Document,isMedia);
        let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
        let {progressBarDisabled =true , cancelFileUpload  , cancelBtnShow = true } = that.props ;


        let resultfile = fileList.files[0];
        //切片计算
        let filesize= resultfile.size;
        let setsize=1024*1024;
        let filecount = filesize/setsize;
        //console.log(filecount)
        //定义进度条


        let values = that.getSessionStorage(resultfile.name);

        let i = 0;
        let filepath = "";
        if(values!=null) {
            i = values.split(";")[0].split(":")[1];
            i = (i != null && i != "") ? parseInt(i) : 0
            filepath = values.split(";")[1].split(":")[1];
        }

        let resumefileInfo = {};
        resumefileInfo.filecount = filecount;
        resumefileInfo.setsize = setsize;
        resumefileInfo.i = i;
        resumefileInfo.filepath = filepath;
        resumefileInfo.lastone = i;
        resumefileInfo.blobflag = 1;

        if(resumefileInfo.i>Math.floor(filecount)){

            resumefileInfo.i = 0;
            resumefileInfo.lastone = 0;
            this.uploadFilePath = ""
            that.resumeUploadFile(resumefileInfo, formData, resultfile, tmpFileid, fileItemDescInfo, filetype);
        } else {
            that.resumeUploadFile(resumefileInfo, formData, resultfile, tmpFileid, fileItemDescInfo, filetype);
        }

        that.addFileToList(fileItemDescInfo);
    }

    uploadCallback(code,response,tmpFileid,filetype,fileItemDescInfo,resultfile,resumefileInfo,formData){
        let that = this;
        if(code>=0)
        {
            let values = "i:" + (resumefileInfo.i+1) + ";filepath:";

            if(response!==undefined && response.result === 1)
                this.uploadFilePath = response.filepath;

            values = values + this.uploadFilePath;

            /*if(resumefileInfo.i===0)
                values = values + "";
            else
                values = values + this.uploadFilePath;*/
            that.setSessionStorage(resultfile.name,values);

            if(resumefileInfo.lastone >= Math.floor(resumefileInfo.filecount)){

                fileItemDescInfo.children = undefined ;
                that.setState({filelistData:that.state.filelistData});
                //此处要返回真实的数据
                let newDocument = that._createFile(response);
                let fileItemDescData = that._createFileItemDescInfo(newDocument);
                that.updateFileToList(fileItemDescData,tmpFileid);


                that.uploadFileArray.splice(0,1);
                //改变状态，上传完成时恢复操作。
                if(that.uploadFileArray.length==0) {
                    let nFlag = 0;
                    that.changeMediaFileAttr(false, nFlag, undefined);
                    that.currMediaFileSetActive();
                }

                let networkmsg = this._createNetworkMsg(fileItemDescData.fileDataInfo,false);
                let toID = "__allExceptSender";

                ServiceSignalling.sendSignallingFromDocumentChange(networkmsg , toID);

                //如果是MP3，MP4 直接返回
                if(this.props.isMediaUI || fileItemDescData.fileDataInfo.isMedia)
                    return;

                that.handlerOpenDocuemnt(fileItemDescData.fileDataInfo);
            } else {

                fileItemDescInfo.children = undefined;
                resumefileInfo.i = resumefileInfo.i + 1;
                resumefileInfo.lastone +=1;
                that.resumeUploadFile(resumefileInfo,formData,resultfile,tmpFileid,fileItemDescInfo,filetype);
            }

        }
        else
        {

            that.uploadFileArray.splice(0,1);
            if(that.uploadFileArray.length===0) {
                let nFlag = 0;
                that.changeMediaFileAttr(false, nFlag, undefined);
                that.currMediaFileSetActive();
            }
            let percent = 100 ;
            let currProgressText = '' ;
            let faukureText = TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileUpload.failure.text ;
            fileItemDescInfo.children = <FileProgressBar failureColor={"#f03a0e"} faukureText={faukureText} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={undefined}  cancelBtnShow={false}  />  ;
            that.setState({filelistData:that.state.filelistData});
            setTimeout(function () {
                fileItemDescInfo.children = undefined ;
                that.setState({filelistData:that.state.filelistData});
                let room = ServiceRoom.getTkRoom();
                that.removeFileToList(tmpFileid,room.getMySelf().id,fileItemDescInfo.fileDataInfo.isDynamicPPT);
            }, 1000);
        }
    }

    uploadCallbackOld(code,response,tmpFileid,filetype,fileItemDescInfo){
        let that = this;

        if(code==0)
        {
            fileItemDescInfo.children = undefined ;
            that.setState({filelistData:that.state.filelistData});

            let newDocument = that._createFile(response);
            let fileItemDescData = that._createFileItemDescInfo(newDocument);
            that.updateFileToList(fileItemDescData,tmpFileid);


            that.uploadFileArray.splice(0,1);
            //改变状态，上传完成时恢复操作。
            if(that.uploadFileArray.length==0) {
                let nFlag = 0;
                that.changeMediaFileAttr(false, nFlag, undefined);
                that.currMediaFileSetActive();
            }

            let networkmsg = this._createNetworkMsg(fileItemDescData.fileDataInfo,false);
            let toID = "__allExceptSender";

            ServiceSignalling.sendSignallingFromDocumentChange(networkmsg , toID);

            //如果是MP3，MP4 直接返回
            if(this.props.isMediaUI || fileItemDescData.fileDataInfo.isMedia)
                return;

            that.handlerOpenDocuemnt(fileItemDescData.fileDataInfo);

        }
        else
        {

            that.uploadFileArray.splice(0,1);
            if(that.uploadFileArray.length===0) {
                let nFlag = 0;
                that.changeMediaFileAttr(false, nFlag, undefined);
                that.currMediaFileSetActive();
            }
            let percent = 100 ;
            let currProgressText = '' ;
            let faukureText = TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileUpload.failure.text ;
            fileItemDescInfo.children = <FileProgressBar failureColor={"#f03a0e"} faukureText={faukureText} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={undefined}  cancelBtnShow={false}  />  ;
            that.setState({filelistData:that.state.filelistData});
            setTimeout(function () {
                fileItemDescInfo.children = undefined ;
                that.setState({filelistData:that.state.filelistData});
                let room = ServiceRoom.getTkRoom();
                that.removeFileToList(tmpFileid,room.getMySelf().id,fileItemDescInfo.fileDataInfo.isDynamicPPT);
            }, 1000);
        }
    }

    progressCallback(event,percent,tmpFileid,filetype,fileItemDescInfo , uploadFileAjaxInfo){
        const that = this ;
        if(percent >= 100){
            let currProgressText = percent + "%";
            if(!that.props.isMediaUI && filetype!=='mp3'&& filetype !=='mp4' ){
                currProgressText = TkGlobal.language.languageData.toolContainer.toolIcon.FileConversion.text ;
            } else{
                //$tmpLi.find(".progress-bar-box").remove();
            }
            fileItemDescInfo.children =  <FileProgressBar currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={undefined}  cancelBtnShow={false}  /> ;
        }else{
            let currProgressText = percent + "%";
            fileItemDescInfo.children =  <FileProgressBar currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={that.cancelFileUpload.bind(that  , tmpFileid , uploadFileAjaxInfo.uploadFileAjaxXhr)}  cancelBtnShow={true}  /> ;
        }
        that.setState({filelistData:that.state.filelistData});
    };

    cancelFileUpload(tmpFileid,uploadFileAjaxXhr,){
        uploadFileAjaxXhr.abort();
        //L.Logger.info("上传的文件已经取消");
        let that = this;
        let room = ServiceRoom.getTkRoom();
        that.removeFileToList(tmpFileid,room.getMySelf().id,false);

        if(that.uploadFileArray.length===0) {
            let nFlag = 0;
            that.changeMediaFileAttr(false, nFlag, undefined);
            that.currMediaFileSetActive();
        }
    }

    //接收翻页命令打开一个文件
    showPageOpenDocuemnt(fileDataInfo){
        let that = this;
        if(!fileDataInfo.isMedia) {
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            for (var i = 0; i < fileListItem.length; i++) {
                if (fileListItem[i].fileDataInfo.filedata.fileid == fileDataInfo.filedata.fileid) {

                    fileListItem[i].active = "1";
                    fileListItem[i].fileDataInfo.filedata.currpage = fileDataInfo.filedata.currpage;
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon on' : 'file-list-eye-icon on';
                }
                else {
                    fileListItem[i].active = "0";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon off' : 'file-list-eye-icon off';
                    fileListItem[i].fileDataInfo.action = (fileListItem[i].fileDataInfo.isDynamicPPT || fileListItem[i].fileDataInfo.isH5Document) ? "show" : "";
                }
            }
            that.setState({filelistData: fileListData});

            if(fileDataInfo.isGeneralFile){
                //发送预下载事件
                that.cachePageNum = fileDataInfo.filedata.currpage; //缓存开始页为打开文档的当前页
                that.cachePageNum = that.openFilePreLoad(that.cachePageNum,that.filePreLoadStep,fileDataInfo);
            }
        }
    }

    //接收翻页命令打开一个文件
    showPageOpenMedia(fileDataInfo){
        let that = this;
        let swfpath = fileDataInfo.filedata.swfpath;
        let index = swfpath.lastIndexOf(".") ;
        let imgType = swfpath.substring(index);
        let fileUrl = swfpath.replace(imgType,"-1"+imgType) ;

        let serviceUrl = TkConstant.SERVICEINFO.address;
        //let urls = serviceUrl.split(":");
        //serviceUrl =  'http:' +  urls[1] ;

        //处理当前活动文档
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let currDocumentState = -1;

        //if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
        for(var i=0; i< fileListItem.length; i++){
            if(fileListItem[i].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                fileListItem[i].active="1";
                fileListItem[i].disabled=true;
                fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
            }
            else{
                fileListItem[i].active="0";
                fileListItem[i].disabled=false;
                fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
            }
        }

        that.setState({filelistData:fileListData});

        /*let playFileData = {};
        playFileData.filePlayUrl = serviceUrl + fileUrl;
        playFileData.filename=fileDataInfo.filedata.filename;
        playFileData.fileid=fileDataInfo.filedata.fileid;

        if (fileDataInfo.mediaType == 'mp4') {
            playFileData.video=true;
        } else if(fileDataInfo.mediaType == 'mp3'){
            playFileData.video=false;
        }

        eventObjectDefine.CoreController.dispatchEvent({
            type: 'playMediaFile',
            message: playFileData
        });*/


    }

    //打开一个普通文档, 需要权限
    handlerOpenDocuemnt(fileDataInfo){
        let that = this;
        if(!fileDataInfo.isMedia){

            if(fileDataInfo.filedata.fileid===that.currDocumentFileid)
                return;
            that.currDocumentFileid = fileDataInfo.filedata.fileid;

            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;

            //if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
            for(let i=0; i< fileListItem.length; i++){
                if(fileListItem[i].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                    fileListItem[i].active="1";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                }
                else{
                    fileListItem[i].active="0";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                    fileListItem[i].fileDataInfo.action = (fileListItem[i].fileDataInfo.isDynamicPPT || fileListItem[i].fileDataInfo.isH5Document)?"show":"";
                }
            }

            that.setState({filelistData:fileListData});
            eventObjectDefine.CoreController.dispatchEvent({
                type: 'openDocuemntOrMediaFile',
                message: fileDataInfo
            });

            if(fileDataInfo.isGeneralFile){
                //发送预下载事件
                that.cachePageNum = fileDataInfo.filedata.currpage; //缓存开始页为打开文档的当前页
                that.cachePageNum = that.openFilePreLoad(that.cachePageNum,that.filePreLoadStep,fileDataInfo);
            }

            //得到白板回来的信息后才能发信令
            if(TkGlobal.classBegin){
                let isDelMsg = false;
                let id = "DocumentFilePage_ShowPage";
                if (fileDataInfo.isMedia)
                    id = fileDataInfo.filedata.filetype == "mp3" ? "Audio_MediaFilePage_ShowPage" : "Video_MediaFilePage_ShowPage";
                ServiceSignalling.sendSignallingFromShowPage(isDelMsg, id, fileDataInfo);
            }

        }
        else{   //mp3,mp4 多媒体类型
            /*
            playFileData ={
                filePlayUrl:"",
                filename:filename,
                fileid:fileid,
                type:'media',
                video:true; //mp4 为true MP3 为false
            }
            */
            //处理当前活动文档
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            let currDocumentState = -1;

            for(var i=0; i< fileListItem.length; i++){
                if(fileListItem[i].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                    fileListItem[i].active="1";
                    fileListItem[i].disabled=true;
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                }
                else{
                    fileListItem[i].active="0";
                    fileListItem[i].disabled=true;
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                }
            }
            that.setState({filelistData:fileListData});


            let swfpath = fileDataInfo.filedata.swfpath;
            let index = swfpath.lastIndexOf(".") ;
            let imgType = swfpath.substring(index);
            let fileUrl = swfpath.replace(imgType,"-1"+imgType) ;

            let serviceUrl = TkConstant.SERVICEINFO.address;
            //let urls = serviceUrl.split(":");
            //serviceUrl =  'http:' +  urls[1] ;


            let playFileData = {};
            playFileData.filePlayUrl = serviceUrl + fileUrl;
            playFileData.filename=fileDataInfo.filedata.filename;
            playFileData.fileid=fileDataInfo.filedata.fileid;
            playFileData.userid = ServiceRoom.getTkRoom().getMySelf().id;

            if (fileDataInfo.mediaType == 'mp4') {
                playFileData.video=true;
            } else if(fileDataInfo.mediaType == 'mp3'){
                playFileData.video=false;
            }

            ServiceTools.unpublishAllMediaStream(function(code,stream){
                that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
            });
        }
    }

    openFilePreLoad(pageCacheNum,preLoadStep,fileDataInfo){
        /*currPage,cachePageNum,pageNum,pageStep*/
        let that = this;
        //let currPage = preLoadData.currPage;
        let cachePageNum = pageCacheNum;
        let pageNum = fileDataInfo.filedata.pagenum;
        let pageStep = preLoadStep;
        let openFilePreLoad = {};
        let bFlag = false;
        if(cachePageNum + pageStep <= pageNum){
            openFilePreLoad.step = pageStep;
            openFilePreLoad.cachePageNum = cachePageNum;
            cachePageNum += pageStep;
            bFlag = true;
        } else if(cachePageNum < pageNum ){  //缓存页数加步长大于文档总页数，缓存总页数小于文档总页数
            openFilePreLoad.step = pageNum - cachePageNum;
            openFilePreLoad.cachePageNum = cachePageNum;
            cachePageNum = pageNum;
            bFlag = true;
        }

        if(bFlag) {
            openFilePreLoad.data= fileDataInfo;
            //dispatch 分发一个预下载事件
            eventObjectDefine.CoreController.dispatchEvent({
                type: 'openFilePreLoad',
                message: openFilePreLoad
            });
        }

        return cachePageNum;
    }

    //删除一个普通文档
    handlerDeleteDocuemnt(fileDataInfo){
        let that = this;
        let toID = "__all" ;

        //调用删除文件web接口，向php发送删除信息
        ServiceRoom.getTkRoom().deleteFile(fileDataInfo.filedata.fileid, function (code ,response_json ) {
            if(code === 0  && response_json){
                //向信令发送删除文档消息
                let networkMsg = that._createNetworkMsg(fileDataInfo,true);
                ServiceSignalling.sendSignallingFromDocumentChange(networkMsg , toID);
            }else{
                //显示错误信息
                //xgd todo...
                ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.call.fun.deleteCourseFile.fileDelete.failure.text);
            }
        });
    }

    /*在普通文件列表中增加文件 ,只有老师和助教才能操作文件*/
    addFileToList(fileItemDescInfo){

        const that = this ;
        let bFind = false;

        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;

        if((this.props.isMediaUI && fileItemDescInfo.fileDataInfo.isMedia) || (!this.props.isMediaUI && !fileItemDescInfo.fileDataInfo.isMedia)) {

            //if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
            for (let i = 0; i < fileListItem.length; i++) {
                if (fileItemDescInfo.fileDataInfo.filedata.fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                    //fileListItem[i].active = "1";
                    //fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                    bFind = true;
                } else {
                    //fileListItem[i].active = "0";
                    //fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                }

            }

            if (!bFind) {

                that.state.filelistData.titleJson.number += 1;
                fileListItem.push(fileItemDescInfo);
                fileListItem.sort(that.fileSortCompare);
                that.setState({filelistData: fileListData});
            }
        }
    };

    //文件排序，按文件ID进行排序
    fileSortCompare(obj1, obj2) {

        let val1 = obj1.fileDataInfo.filedata.fileid;
        let val2 = obj2.fileDataInfo.filedata.fileid;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }

    /*在普通文件列表中删除文件 ,只有老师和助教才能操作文件*/
    removeFileToList(fileid,fromID,isDynamicPPT) {

        const that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let nextOpenData = {};

        let room = ServiceRoom.getTkRoom();

        let index = 0;
        let indexMedia = -1;
        let length = fileListItem.length;
        let bFound = false;
        for (let i = 0; i < length; i++) {
            if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {

                if (fileListItem[i].active == 1){
                    index = i;
                    indexMedia = i;
                }

                fileListItem.splice(i, 1);
                bFound = true;
                break;
            }
        }

        if (!bFound)
            return;
        //备注 动态PPT  现在 老师和助教都可以发布信令

        that.state.filelistData.titleJson.number -= 1;
        that.setState({filelistData: fileListData});

        //未上课,老师和助教都可以，上课后只有操作该事件的人，才可以
        if(!TkGlobal.classBegin ){
            if (!that.props.isMediaUI && fileListItem.length > 0 && index > 0) {
                nextOpenData = fileListItem[index];

                if (nextOpenData === undefined)
                    nextOpenData = fileListItem[index - 1];
                //发送信令并播放
                that.handlerOpenDocuemnt(nextOpenData.fileDataInfo);
            } else if (that.props.isMediaUI && fileListItem.length > 0 && indexMedia >= 0) {
                ServiceTools.unpublishAllMediaStream(function (code, stream) {
                    //that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
                });
            }

        }else  { //只有操作该事件的人，才能发信令, 现在还是老师和助教都可以操作

            let extensionId = ServiceRoom.getTkRoom().getMySelf().id ;
            if (!that.props.isMediaUI && fileListItem.length > 0 && index > 0) {
                nextOpenData = fileListItem[index];

                if (nextOpenData === undefined)
                    nextOpenData = fileListItem[index - 1];
                //发送信令并播放

                if(fromID === extensionId || isDynamicPPT)
                    that.handlerOpenDocuemnt(nextOpenData.fileDataInfo);
            } else if (that.props.isMediaUI && fileListItem.length > 0 && indexMedia >= 0) {
                if(fromID === extensionId) {
                    ServiceTools.unpublishAllMediaStream(function (code, stream) {
                        //that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
                    });
                }
            }

        }

    };


    /*在普通文件列表中更新文件 ,只有老师和助教才能操作文件*/
    updateFileToList(fileinfodesc,tmpFileid){
        const that = this ;
        let bFind = false;

        if((this.props.isMediaUI && fileinfodesc.fileDataInfo.isMedia) || (!this.props.isMediaUI && !fileinfodesc.fileDataInfo.isMedia))
        {
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;

            for (let i = 0; i < fileListItem.length; i++) {
                if (tmpFileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                    //先删除
                    fileListItem.splice(i, 1);
                    //再添加
                    fileListItem.splice(i, 0, fileinfodesc);
                    break;
                }
            }
            that.setState({filelistData: fileListData});
        }
    };

    changeDocumentFileListAccpetArr(event){
        let that = this;
        that.setState({
            commonAccept:TkConstant.FILETYPE.documentFileListAccpet,
            mediaAccept:TkConstant.FILETYPE.mediaFileListAccpet,
        });

    }

    playMediaUnpublishSucceed(event){
        let that= this;
        let playMediaUnpublishData = event.message;
        let stream = playMediaUnpublishData.stream;
        //if(stream.getAttributes().filename==="")  //动态PPT视频
        //    return;

        let fileid = stream.getAttributes().fileid;
        let nFlag = 3;

        this.currPlayFileid = undefined;
        //取消发布成功，所有媒体文件都可以操作
        that.changeMediaFileAttr(false  ,nFlag ,  fileid );
    }

    playMediaPublishSucceed(event){

        let that= this;
        let playMediaPublishData = event.message;
        let stream = playMediaPublishData.stream;
        if(stream.getAttributes().filename==="" || !that.props.isMediaUI)  //动态PPT视频,普通文件
            return;


        let fileid = stream.getAttributes().fileid;

        //判断播放的时候该文件是否还存在,存在播放，不存在取消发布
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let bFlag = false;
        for (let i = 0; i < fileListItem.length; i++) {
            if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                bFlag = true;
                break;
            }
        }

        let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
        if(!bFlag && (stream.extensionId === extensionId)){

            ServiceTools.unpublishAllMediaStream(function(code,stream){
                //that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
            });
        }

        let nFlag = 1;
        this.currPlayFileid = fileid;
        //发布成功，除当前媒体文件不可操作，都可以操作
        that.changeMediaFileAttr(false  , nFlag ,  fileid );
    }

    playMediaPublishFail(event){
        let that= this;
        let playMediaPublishData = event.message;
        let stream = playMediaPublishData.stream;
        if(stream.getAttributes().filename==="") {  //动态PPT视频
            //显示提示信息
            ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.file.pptFile.text);
            return;
        }
        let fileid = stream.getAttributes().fileid;
        let nFlag = 2;
        //发布失败，所有媒体文件都可以操作
        that.changeMediaFileAttr(false   , nFlag ,  fileid );
        //显示提示信息
        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.file.mediaFile.text);
    }

    playMediaUnpublishFail(event){
        let that= this;
        let playMediaUnpublishData = event.message;
        let stream = playMediaUnpublishData.stream;
        if(stream.getAttributes().filename==="")  //动态PPT视频
            return;
        let fileid = stream.getAttributes().fileid;
        let nFlag = 4;
        //取消发布失败，除当前媒体文件不可操作，都可以操作
        that.changeMediaFileAttr(false , nFlag ,  fileid );
    }

    changeMediaFileAttr(disabled  , nFlag ,  fileid ) {
        //nFlag 0:正在发布 ,  1.发布成功， 2.发布失败， 3.取消发布成功，4.取消发布失败,不改变状态

        let that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;

        if(!this.props.isMediaUI) //不是媒体文件
            return;


        for (let i = 0; i < fileListItem.length; i++) {
            fileListItem[i].disabled = disabled;

            if(  fileListItem[i].fileDataInfo.filedata.fileid == fileid && (nFlag === 1 || nFlag === 4) ){      //pid 端传入fileid 为数值型
                fileListItem[i].afterIconArray[1].disabled = true ;
                if(nFlag === 1)
                    fileListItem[i].active = "1";
            }else{

                fileListItem[i].afterIconArray[1].disabled = disabled ;
                fileListItem[i].afterIconArray[2].disabled = disabled ;
                fileListItem[i].active = "0";

            }
            fileListItem[i].afterIconArray[1].className =this.props.isMediaUI ? 'file-list-play-icon off' : 'file-list-eye-icon off';
        }
        this.setState({filelistData: fileListData});
    };


    closeMediaVideoCallback(code,stream,playFileData,fileDataInfo){
        const that = this ;
        //code   -1:没有流可以取消发布 , 0：取消发布失败 ， 1：取消发布成功 , -2:没有unpublishMediaStream权限
        if( code == -1 ||  code == 1 ) {
            let nFlag = 0 ;

            that.changeMediaFileAttr(true , nFlag , undefined );
            //dispatch 分发一个文件连接事件
            eventObjectDefine.CoreController.dispatchEvent({
                type: 'playMediaFile',
                message: playFileData
            });

            /*if(!TkGlobal.classBegin)
                return;
            //发送信令
            let isDelMsg = false;
            let id = playFileData.video?"Video_MediaFilePage_ShowPage":"Audio_MediaFilePage_ShowPage";
            ServiceSignalling.sendSignallingFromShowPage(isDelMsg, id, fileDataInfo);*/
        }
    };

    render(){
        const that = this ;
        const {show, mediaFileType} = this.props ;

        let filelistData = that.state.filelistData;

        let accept = this.props.isMediaUI?that.state.mediaAccept:that.state.commonAccept;
        if(mediaFileType!=undefined){
            accept = mediaFileType
        }

        if(!this.props.isMediaUI && that.state.isUpdateH5Document){
            accept = that.state.h5DocumentAccept;
        }

        return (
            <div>
                <FileListDumb isMediaUI = {this.props.isMediaUI} idType={this.props.idType} show={show} {... filelistData}    />
                <FileSelect isMediaUI = {this.props.isMediaUI} selecteFileCompleted={that.uploadForm.bind(that) } accept={accept}/>
            </div>

        )
    };

};
export default  FileListSmart;

