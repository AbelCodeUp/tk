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
import TkGlobal from 'TkGlobal' ;
import TkConstant from "../../../tk_class/TkConstant";
import eventObjectDefine from 'eventObjectDefine';
import  './css/cssHVideoContainer.css';
import HVideoComponent from "./HVideoComponent";
import CoreController from 'CoreController' ;
import RoleHandler from 'RoleHandler';


class HVideoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            streams:[],
            otherVideoStyle:{},
        };
        this.isTriggerOnResize = false;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.teacherExist = false;
        this.assistantStream = [];
        this.oenToOneMaxVideoNum = 5;
        this.oenToManyMaxVideoNum = 6;
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video, that.handlerStreamSubscribed.bind(that), that.listernerBackupid); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video, that.handlerStreamRemoved.bind(that) , that.listernerBackupid); //stream-remove事件：取消订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video, that.handlerStreamAdded.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        //xueqiang change ,when teacher click everybody on,當超過7個人的時候，總是有是有人失敗，則需要將失敗的學生視頻的窗口刪除
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_video,that.handlerStreamPublishFail.bind(that) , that.listernerBackupid); //PublishFail：流发布失败事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件：拖拽动作处理
        eventObjectDefine.CoreController.addEventListener('changeOtherVideoStyle' , that.changeOtherVideoStyle.bind(that)  , that.listernerBackupid); //更新底部视频的位置
        eventObjectDefine.CoreController.addEventListener('handleVideoDragListData' , that.handleVideoDragListData.bind(that)  , that.listernerBackupid); //更新底部视频的位置
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };
    componentDidUpdate() {//每次render结束后会触发
        if (this.isTriggerOnResize == true) {
            this.isTriggerOnResize = false;
            let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
            eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
        }
    };

    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：拖拽动作处理
        let that = this ;
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "videoDraghandle":
                let data = {message:{data:pubmsgData.data.otherVideoStyle}};
                that.changeOtherVideoStyle(data);
                break;
			case "ClassBegin":{
                //上课要删除本地流
                let streams = this.state.streams;
                for(let i=0;i<streams.length;i++) {
                    let st = streams[i];
                    if (st.local) {
                        streams.splice(i, 1);
                    }
                }
                that.updateStreams(streams);
                break;
            }
        }
    };
    handleVideoDragListData(handleData) {
        if (handleData.message.data) {
            let otherVideoStyle = handleData.message.data[0].data.otherVideoStyle;
            Object.assign(this.state.otherVideoStyle,otherVideoStyle);
            this.setState({otherVideoStyle:this.state.otherVideoStyle});

        }
    };
    changeOtherVideoStyle(handleData) {//自己本地改变拖拽的video样式
        this.isTriggerOnResize = true;
        this.setState({
            otherVideoStyle:handleData.message.data,
        });
        // let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        // eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
    };
    getRoomType(){
        let roomType = ServiceRoom.getTkRoom().getRoomType();
        return roomType;
    }

    //判断用户是否是老师
    isTeacher(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if(!user){L.Logger.warning('[hv->isTeacher]user is not exist  , user id:'+userID+'!');return undefined ;} ;
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    //判断用户是否是助教和巡视员
    isAssistantAndPatrol(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];

        if (user.role === TkConstant.role.roleTeachingAssistant || user.role === TkConstant.role.rolePatrol) {
            return true;
        }
        return false;
    }

    updateStreams(streams)
    {
        if(streams !== undefined) {
            this.setState({
                streams: streams
            });
        }
    }

    findStream(stream){
        /*for(let st in  this.state.streams) {
            if(stream.getID()===st.getID())
                return true;
        }*/
        let streams = this.state.streams;
        for(let i=0;i<streams.length;i++) {
            let st = streams[i];
            if (stream.getID() === st.getID()) {
                return true;
            }
        }
        return false;
    }
    addStream(stream) {
        let streams = this.state.streams;
        if (!this.findStream(stream)) {
            streams.push(stream);
        }
        //将自己放到第一个
        for (let i = 0; i < streams.length; i++) {
            let stream = streams[i];
            if(stream.extensionId==ServiceRoom.getTkRoom().getMySelf().id){
                streams.splice(i,1);
                streams.splice(0, 0, stream);
            }
        }
        return  streams;
    }

    removeStream(stream){

        let streams = this.state.streams;
        let rsid = stream.getID();
        let islocal = stream.Local;
        for(let i=0;i<streams.length;i++) {
            let st = streams[i];
            let streamid = st.getID();
            //如果下台的是我自己会导致我的streamid变成了local,这个需要查原因
            if (stream.getID() === st.getID() || stream.extensionId == st.extensionId) {
                //L.Logger.debug('stream-removed stream 123 id=', streamid);
                streams.splice(i, 1);
                break;
            }
        }
        return streams;
    }


   handlerRoomConnected(roomEvent)
    {
        let that = this;
        let streams = this.state.streams;

        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();

        if(TkGlobal.classBegin)
            return;

        //L.Logger.debug('stream-Added  RoomType=', this.getRoomType());
        if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne) {
            //L.Logger.debug('stream-Added  RoomType 1 =', this.getRoomType());
            const userid = ServiceRoom.getLocalStream().extensionId;

            if(TkConstant.joinRoomInfo.autoClassBegin && !TkConstant.joinRoomInfo.autoStartAV )
                return;




            let assistantFlag =  (this.getUser(userid).role === TkConstant.role.roleTeachingAssistant) && TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            let studentFlag = this.isTeacher(userid) === false && CoreController.handler.getAppPermissions('localStream')?true:false; //学生且本地流存在
            //if(!this.isTeacher(userid) && !this.isAssistantAndPatrol(userid))
            if(studentFlag || assistantFlag)
            {
                let localStream = ServiceRoom.getLocalStream();
                let localid = localStream.getID();
                let streams = this.addStream(ServiceRoom.getLocalStream());
                this.updateStreams(streams);
            }
        } else if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne){

            let assistantFlag = TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            const userid = ServiceRoom.getLocalStream().extensionId;

            if(assistantFlag && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant)
            {

                let localStream = ServiceRoom.getLocalStream();
                let localid = localStream.getID();
                let streams = this.addStream(ServiceRoom.getLocalStream());
                this.updateStreams(streams);
            }
        }
    }

    handlerStreamAdded(addEvent){
        let that = this;
        if(TkGlobal.playback){ //回放就跳过stream-add
            return ;
        }

        let streams = this.state.streams;

        if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne) {
            //L.Logger.debug('stream-Added  RoomType 1 =', this.getRoomType());

            const userid = ServiceRoom.getLocalStream().extensionId;
            let stream = addEvent.stream ;
            let id = stream.getID();


            if(stream.extensionId === ServiceRoom.getLocalStream().extensionId ){
                if(that.isTeacher(userid)  === false ) {

                    let localStream = ServiceRoom.getLocalStream();
                    let localid = localStream.getID();
                    let streams = this.addStream(ServiceRoom.getLocalStream());
                    this.updateStreams(streams);
                }
            }
        } else if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne){
            let assistantFlag = TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            const userid = ServiceRoom.getLocalStream().extensionId;

            if(addEvent.stream.extensionId === ServiceRoom.getLocalStream().extensionId ) {
                if (assistantFlag && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant) {

                    let localStream = ServiceRoom.getLocalStream();
                    let localid = localStream.getID();
                    let streams = this.addStream(ServiceRoom.getLocalStream());
                    this.updateStreams(streams);
                }
            }
        }
    }


    handlerStreamSubscribed(streamEvent){
        let that = this;

        if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne) {
            if (streamEvent) {

                let stream = streamEvent.stream;
                const userid = stream.extensionId;

                if( this.isTeacher(userid)  === false  ) {
                    if(that.state.streams.length<this.oenToManyMaxVideoNum) {
                        let streams = this.addStream(stream);
                        this.updateStreams(streams);
                    } else {
                        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.video.max.text);
                    }
                }
            }
        } else if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne){
            let assistantFlag = TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            if (streamEvent) {
                const userid = streamEvent.stream.extensionId;

                if (assistantFlag && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant) {
                    if(that.state.streams.length<this.oenToOneMaxVideoNum) {
                        let streams = this.addStream(streamEvent.stream);
                        this.updateStreams(streams);
                    } else {
                        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.video.max.text);
                    }
                }
            }
        }
    };

    handlerStreamPublishFail(streamEvent){
        //L.Logger.debug('handlerStreamPublishFail=', 'delete video window');
        this.handlerStreamRemoved(streamEvent);
    };


    handlerStreamRemoved(streamEvent){

        let that = this;

        let stream = streamEvent.stream;

        //if (stream !== null && stream.elementID !== undefined) {
        if (stream !== null ) {
                let rid = stream.getID();
                const userid = stream.extensionId;
                let user =  ServiceRoom.getTkRoom().getUsers()[userid] ;

                //视频停止播放
                stream.hide();
                let streams = that.removeStream(stream);
                that.updateStreams(streams);
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        let streams=that.state.streams;
        streams.splice(0,streams.length);//清空数组
        that.setState({
            streams:streams
        });
    };
    handlerRoomDisconnected(recvEventData){
        this._clearAllStreamArray();
    }

    receiveStreamComplete(){
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:false} });
    };

    _loadHVideoComponentArray( streams ){
        const that = this ;
        let hVideoComponentArray = [] ;
        //let giftnumber = this.state.giftnumber;
        let giftnumber = 0;

        for(let stream of streams){
            //L.Logger.debug('_loadHVideoComponentArray stream =', stream);
            if(stream===undefined) {

                continue;
            }

            if(ServiceRoom.getTkRoom().getUser(stream.extensionId)===undefined) {
                //L.Logger.debug('_loadHVideoComponentArray invalid user =', stream.extensionId);
            }
            else{
                if(that.getUser(stream.extensionId)!=undefined) {
                    giftnumber = that.getUser(stream.extensionId).giftnumber;
                }
            }

            let extensionId = stream.extensionId;
            if (!this.state.otherVideoStyle[extensionId]) {//设置初始值
                this.state.otherVideoStyle[extensionId] = {
                    top:0,
                    left:0,
                    isDrag:false,
                };
            }
            hVideoComponentArray.push(
                <HVideoComponent id={extensionId} key={stream.getID()} stream={stream} classCss={"hvideo"}  giftnumber={giftnumber}   receiveStreamCompleteCallback={that.receiveStreamComplete.bind(that)} {...this.state.otherVideoStyle[extensionId]}></HVideoComponent>
            );
        }
        return{
            hVideoComponentArray:hVideoComponentArray
        }
    };

    getUser(userid){
        return ServiceRoom.getTkRoom().getUser(userid);
    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                that._clearAllStreamArray();
                break;
            }
        }
    }

    /*清空数据流数组*/
    _clearAllStreamArray(){
        const that = this ;
        let streams=that.state.streams;
        streams.splice(0,streams.length);//清空数组
        that.setState({
            streams:streams
        });
    };

    render(){

        let {hVideoComponentArray} = this._loadHVideoComponentArray(this.state.streams);
        return (
            <section ref="mySection"  className="hvideo_container" id="hvideo_container" >
            	<ol id="other_video">
                {hVideoComponentArray}
                </ol>
            </section>
        )
    };
};

/*BaseVideSmart.defaultProps = {
    streams:[]
};*/

export default  HVideoContainer;

