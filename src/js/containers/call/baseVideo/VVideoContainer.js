/**
 * 视频显示部分-底部和右侧所有视频组件的Smart模块
 * @module BaseVideoSmart
 * @description   承载左侧部分-底部所有组件
 * @author xiagd
 * @date 2017/08/11
 */

'use strict';
import React from 'react';
import ServiceRoom from 'ServiceRoom' ;
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import CoreController from 'CoreController';
import TkConstant from "../../../tk_class/TkConstant";
import eventObjectDefine from 'eventObjectDefine';
import  './css/cssVVideoContainer.css';
import VVideoComponent from "./VVideoComponent";
import VVideoComponentGoGoTalk from './VVideoComponent_gogotalk';

class VVideoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            streams:[],
            renderStreams:[],
            teacherId:-2,
            teacherCss:"video-chairman-wrap",
            studentCss:"video-hearer-wrap"
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.teacherExist = false;
        this.studentExist = false;
        this.assistantStream = [];
    };



	
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state

        let that = this;

        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video, that.handlerStreamSubscribed.bind(that) , that.listernerBackupid ); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video, that.handlerStreamRemoved.bind(that)  , that.listernerBackupid ); //stream-remove事件：取消订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video, that.handlerStreamAdded.bind(that)  , that.listernerBackupid ); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantEvicted,that.handlerRoomParticipantEvicted.bind(that) , that.listernerBackupid); //Disconnected事件：参与者被踢事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( 'endClassbeginShowLocalStream', that.handlerEndClassbeginShowLocalStream.bind(that), that.listernerBackupid);

    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };
    handlerEndClassbeginShowLocalStream(){
        const that = this ;
        setTimeout(  () => {
            if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout') && CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //是否拥有下课重置界面权限,并且是老师
                if( that.state.streams.length === 0){
                    that._addLocalStreamToVideoContainer();
                }
            }
        }, 250);
    };

    receiveStreamComplete(){
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:true} });
    };
	  
    getRoomType(){
        let roomType = ServiceRoom.getTkRoom().getRoomType();
        return roomType;
    };

    createNULLStream(streamID){
        let stream={};
        stream.id = streamID;
        //L.Logger.debug('createNULLStream id=',streamID);
        stream.getID=function () {
            return stream.id;
        }
        stream.extensionId==undefined;
        return stream;
    };

    findStream(stream){
        let streams = this.state.streams;
        for(let i=0;i<streams.length;i++) {
            let st = streams[i];
            if (stream.getID() === st.getID())  {
                return true;
            }
        }
        return false;
    };

    addStream(stream){

        let that = this;
        if(!this.findStream(stream))
            that.state.streams.push(stream);

    }

    removeStream(stream){
        let streams=this.state.streams;
        for(let i=0;i<streams.length;i++) {
            let st = streams[i];
            if (stream.getID() === st.getID()) {
                streams.splice(i, 1);
                break;
            }
        }
        return  streams;
    }


    isTeacher(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if(!user){L.Logger.warning('[vv->isTeacher]user is not exist  , user id:'+userID+'!');return undefined ;} ;
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    isAssistantAndPatrol(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if (user.role === TkConstant.role.roleTeachingAssistant || user.role === TkConstant.role.rolePatrol) {
            return true;
        }
        return false;
    }

    createAndReplace(){

        let that = this;
        let renderStreams=that.state.renderStreams;
        renderStreams.splice(0,renderStreams.length);//清空数组
        let streams = [];

        if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne)
        {

            //L.Logger.debug("createAndReplace that.state.streams.length =",that.state.streams.length);
            if (that.state.streams.length == 0) {
                let stream = that.createNULLStream(0);
                streams.push(stream);
                stream = that.createNULLStream(-1);
                streams.push(stream);
            }
            else if (that.state.streams.length == 1) {
                let stream = that.state.streams[0];
                //L.Logger.debug('createAndReplace stream=',stream);
                const userid = stream.extensionId;
                if (that.isTeacher(userid) === true ) {
                    streams.push(stream);
                    stream = that.createNULLStream(0);
                    streams.push(stream);
                }
                else if(that.isTeacher(userid) === false ) {
                    streams.push(stream);
                    stream = that.createNULLStream(0);
                    streams.splice(0, 0, stream);
                }
            }
            else if (that.state.streams.length == 2) {

                let stream = that.state.streams[0];
                const userid = stream.extensionId;
                if (that.isTeacher(userid) === true ) {
                    streams.push(that.state.streams[0]);
                    streams.push(that.state.streams[1]);
                }
                else if (that.isTeacher(userid) === false ) {
                    streams.push(that.state.streams[1]);
                    streams.push(that.state.streams[0]);
                }
            } else if (that.state.streams.length > 2) {  //从一对多 转换 为一对一 或异常超过两路视频

                for(let i=0;i<that.state.streams.length; i++) {
                    let stream = that.state.streams[i];
                    const userid = stream.extensionId;
                    if (that.isTeacher(userid) === true) {
                        if(streams.length>1)
                            streams[0] = that.state.streams[i];
                        else
                            streams.push(that.state.streams[i]);
                    }
                    else if (that.isTeacher(userid) === false) {
                        if(streams.length==2)
                            streams[1] = that.state.streams[i];
                        else
                            streams.push(that.state.streams[i]);
                    }
                }
            }

            let stream = streams[0];

            if (stream.extensionId != undefined && that.isTeacher(stream.extensionId) === true ){
                that.setState({
                    teacherId: stream.extensionId
                });
            }
            else if(stream.extensionId == undefined && that.isTeacher(stream.extensionId) === false ){
                that.setState({
                    teacherId: stream.getID()
                });
            }
            else if (stream.extensionId == undefined ){
                that.setState({
                    teacherId: stream.getID()
                });
            }
        }
        else
        {

            if (that.state.streams.length == 0) {
                let stream = that.createNULLStream(0);
                streams.push(stream);
            }
            else if (that.state.streams.length == 1 ) {
                let stream = that.state.streams[0];
                const userid = stream.extensionId;
                if (that.isTeacher(userid) === true ) {
                    streams.push(stream);
                }
            }  else if (that.state.streams.length > 1) {  //从一对一 转换 为一对多 或异常超过一路视频

                for(let i=0;i<that.state.streams.length; i++) {
                    let stream = that.state.streams[i];
                    const userid = stream.extensionId;
                    if (that.isTeacher(userid) === true) {
                        if(streams.length==1)
                            streams[0] = that.state.streams[i];
                        else
                            streams.push(that.state.streams[i]);
                    }
                }
            }

            let stream = streams[0];
            if (stream.extensionId != undefined && (that.isTeacher(stream.extensionId) === true )){
                that.setState({
                    teacherId: stream.extensionId
                });
            }
            else if (stream.extensionId != undefined && that.isTeacher(stream.extensionId) === false ){
                that.setState({
                    teacherId: stream.getID()
                });
            }
            else if (stream.extensionId == undefined ){
                that.setState({
                    teacherId: stream.getID()
                });
            }
        }

        that.setState({
            renderStreams: streams
        });
    }


    handlerRoomConnected(roomEvent)
    {
        let that= this;
        this.createAndReplace();
        const userid = ServiceRoom.getLocalStream().extensionId;
        let assistantFlag = (this.getUser(userid).role===TkConstant.role.roleTeachingAssistant  && TkConstant.joinRoomInfo.assistantOpenMyseftAV)?true:false;


        //if(!this.isAssistantAndPatrol(userid)) {
        if(TkGlobal.classBegin)
            return;

        if((this.getRoomType()==TkConstant.ROOMTYPE.oneToOne && that.getUser(userid).role !==TkConstant.role.roleTeachingAssistant )|| (this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && this.isTeacher(userid) === true )) {
            if(CoreController.handler.getAppPermissions('localStream') ){

                if(TkConstant.joinRoomInfo.autoClassBegin && !TkConstant.joinRoomInfo.autoStartAV )
                    return;

                this.addStream(ServiceRoom.getLocalStream());
                this.createAndReplace();
            }
        }
    }

    handlerStreamAdded(roomEvent){
        let that = this;
        const userid = ServiceRoom.getLocalStream().extensionId;
        let assistantFlag = (this.getUser(userid).role===TkConstant.role.roleTeachingAssistant  && TkConstant.joinRoomInfo.assistantOpenMyseftAV)?true:false;

        if((this.getRoomType()==TkConstant.ROOMTYPE.oneToOne && that.getUser(userid).role !==TkConstant.role.roleTeachingAssistant ) || (this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && this.isTeacher(userid)  === true ) ) {
            if(this.teacherExist && assistantFlag)
                return;

            let stream = roomEvent.stream ;
            if(stream.extensionId === ServiceRoom.getLocalStream().extensionId ){
                this.addStream(ServiceRoom.getLocalStream());
                this.createAndReplace();
            };
        }
    }


    handlerStreamSubscribed(streamEvent){
        let that = this;
        //room-pubmsg事件：
        if(streamEvent) {
            let stream = streamEvent.stream;

            let userid = stream.extensionId;
            let assistantFlag = (this.getUser(userid).role===TkConstant.role.roleTeachingAssistant  && TkConstant.joinRoomInfo.assistantOpenMyseftAV)?true:false;

            if((this.getRoomType()==TkConstant.ROOMTYPE.oneToOne && that.getUser(userid).role !==TkConstant.role.roleTeachingAssistant )  || (this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && this.isTeacher(userid) === true ) ) {

                this.addStream(stream);
                this.createAndReplace();
            }
        }
    };

    handlerStreamRemoved(streamEvent){
        let stream = streamEvent.stream;
        let that = this;
        if (stream !== null && stream.elementID !== undefined) {
            const userid = stream.extensionId;
            let user =  this.getUser(userid);

            //视频停止播放
            stream.hide();
            let streams = this.removeStream(stream);
            //流移除时添加id为0的空流，显示缺省样式
            this.createAndReplace();
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        let streams=that.state.streams;
        streams.length = 0 ;//清空数组
        that.setState({
            streams:streams
        });
        this.createAndReplace();
    };
    handlerRoomDisconnected(recvEventData){
        this._clearAllStreamArray();
    };

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                that._clearAllStreamArray();
                setTimeout(  () => {
                    if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout') && CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //是否拥有下课重置界面权限,并且是老师
                        if( that.state.streams.length === 0){
                            that._addLocalStreamToVideoContainer();
                        }
                    }
                }, 250);
                break;
            }

        }
    }
    handlerOnDoubleClick(stream , event){ //双击视频全屏
        if(! CoreController.handler.getAppPermissions('dblclickDeviceVideoFullScreenRight')){return ; } ;
        let targetVideo = document.getElementById('stream'+stream.getID() );
        if(targetVideo){
            if( TkUtils.tool.isFullScreenStatus(targetVideo) ) {
                TkUtils.tool.exitFullscreen(targetVideo);
            }else{
                TkUtils.tool.launchFullscreen(targetVideo);
            }
        }

    };

    handlerRoomPubmsg(recvEventData){
    	if(TkGlobal.isBroadcast){//是直播的话不需要移除标签
    		return
    	}
        const that = this ;
        let pubmsgData = recvEventData.message
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                //上课要删除本地流
                let streams=this.state.streams;
                for(let i=0;i<streams.length;i++) {
                    let st = streams[i];
                    if (st.local) {
                        streams.splice(i, 1);
                        break;
                    }
                }
                this.createAndReplace();
                break;
            }
        }
    };

    _loadVVideoComponentArray( streams ){
        const that = this ;
        const teacherId = that.state.teacherId;
        const teacherCss = this.state.teacherCss;
        const studentCss = this.state.studentCss;
        let vVideoComponentArray = [] ;
        let showGift = true;
        //let giftnumber = this.state.giftnumber;
        let giftnumber = 0;
        let firstAssistant = false;

        for(let stream of streams){
            if(stream===undefined) {
                continue;
            }

            const userid = stream.extensionId!=undefined?stream.extensionId:stream.getID();
            if(stream.extensionId===undefined) {
                showGift = false;
            }
            else {
                if(that.getUser(stream.extensionId)!=undefined) {
                    giftnumber = that.getUser(stream.extensionId).giftnumber;

                }
            }
            let _video = TkGlobal.format == "igogotalk" && TkConstant.joinRoomInfo.roomtype == TkConstant.ROOMTYPE.oneToOne 
                ?
                <VVideoComponentGoGoTalk  handlerOnDoubleClick={that.handlerOnDoubleClick.bind(that , stream)}  key={stream.getID()} stream={stream}  classCss={userid==teacherId?teacherCss:studentCss} showGift={showGift} giftnumber={giftnumber}  receiveStreamCompleteCallback={that.receiveStreamComplete.bind(that)}  ></VVideoComponentGoGoTalk>

                : <VVideoComponent  handlerOnDoubleClick={that.handlerOnDoubleClick.bind(that , stream)}  key={stream.getID()} stream={stream}  classCss={userid==teacherId?teacherCss:studentCss} showGift={showGift} giftnumber={giftnumber}  receiveStreamCompleteCallback={that.receiveStreamComplete.bind(that)}  ></VVideoComponent>
                
            vVideoComponentArray.push(
                _video
            );
        }
        return{
            vVideoComponentArray:vVideoComponentArray
        }
    };

    getUser(userid){
        return ServiceRoom.getTkRoom().getUser(userid);
    }
    /*添加本地数据流到容器中*/
    _addLocalStreamToVideoContainer(){
        if(CoreController.handler.getAppPermissions('localStream') ){
            this.addStream(ServiceRoom.getLocalStream());
            this.createAndReplace();
        }
    };

    /*清空数据流数组*/
    _clearAllStreamArray( callback ){
        const that = this ;
        let streams=that.state.streams;
        streams.length = 0 ;//清空数组
        that.setState({
            streams:streams
        });
        this.createAndReplace();
    };
    render(){
        let that = this;

        let {vVideoComponentArray} = this._loadVVideoComponentArray(this.state.renderStreams);
        return (
            <div id={that.props.id || 'participants'} className="clear-float video-participants-vessel">
                {
                    /*this.state.renderStreams.map(function (stream){
                     //L.Logger.info('get stream  right=',stream);
                     //const userid = stream.extensionId!=undefined?stream.extensionId:stream.getID();
                     return <VVideoComponent key={stream.getID()} stream={stream}  classCss={(stream.extensionId!=undefined?stream.extensionId:stream.getID())==teacherId?teacherCss:studentCss}   receiveStreamCompleteCallback={that.receiveStreamComplete.bind(that)}  ></VVideoComponent>;
                     })*/
                    vVideoComponentArray
                }
            </div>
        )
    };
};

/*BaseVideSmart.defaultProps = {
 streams:[]
 };*/

/*VVideoContainer.propTypes = {
 studentSetJson:PropTypes.object.isRequired ,
 videoHoverJson:PropTypes.object.isRequired
 };*/

export default  VVideoContainer;