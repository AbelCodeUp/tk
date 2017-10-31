/**
 * 用户列表的Smart组件
 * @module UserListSmart
 * @description   用户列表的Smart组件,处理用户列表的业务
 * @author QiuShao
 * @date 2017/08/11
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import CoreController from 'CoreController';
import UserListDumb from '../../../../../../../../components/userList/userList';

class UserListSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userlistData: this._productionDefaultUserlistData()
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that) , that.listernerBackupid ); //room-connected事件-接收到房间连接成功后执行添加用户到用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantJoin , that.handlerRoomParticipantJoin.bind(that) , that.listernerBackupid ); //room-participant_join事件-收到有参与者加入房间后执行添加用户到用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave , that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid); //room-participant_leave事件-收到有参与者离开房间后执行删除用户在用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid); //room-userproperty-changed事件-收到参与者属性改变后执行更新用户在用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDisconnected , that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //room-disconnected事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video , that.handlerStreamRemoved.bind(that) , that.listernerBackupid); //streamRemoved事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video , that.handlerStreamSubscribed.bind(that) , that.listernerBackupid); //streamSubscribed事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that) , that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( 'receive-msglist-ClassBegin' , that.handlerReceiveMsglistClassBegin.bind(that) , that.listernerBackupid); //receive-msglist-ClassBegin 事件
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };

    /*处理room-connected事件*/
    handlerRoomConnected(roomConnectedEventData){
        const  that = this ;
        let users = ServiceRoom.getTkRoom().getUsers() ;
        for(let key in  users ){
            let user = users[key];
            let isConflict = CoreController.handler.checkRoleConflict(user , false) ;
            if(!isConflict){
                that.addUserToList(user);
            }
        }
    };

    /*处理room-participant_join事件*/
    handlerRoomParticipantJoin(roomParticipantJoinEventData){
        const that = this ;
        const user = roomParticipantJoinEventData.user ;
        let isConflict = CoreController.handler.checkRoleConflict(user , false) ;
        if(!isConflict){
            that.addUserToList(user);
        }
    };

    /*处理room-participant_leave事件*/
    handlerRoomParticipantLeave(roomParticipantLeaveEventData){
        const that = this ;
        const user = roomParticipantLeaveEventData.user ;
        that.removeUserToList(user);
    }


    /*处理room-userproperty-changed事件*/
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user = roomUserpropertyChangedEventData.user ;
        for( let key of Object.keys(changePropertyJson) ){
            if( key !== 'giftnumber' ){
                that.updateUserToList(user) ;
            }
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this;
        that.recoverDefaultUserToList();
    };

    /*处理room-disconnected事件*/
    handlerRoomDisconnected(roomDisconnectedEventData){
        const that = this;
        that.recoverDefaultUserToList();
    };

    /*处理用户列表中用户点击item的事件-用户上下台功能*/
    handlerUserListItemOnClick(userid){
        const that = this ;
        let user =  ServiceRoom.getTkRoom().getUsers()[userid] ;
        let assistantFlag = TkConstant.joinRoomInfo.assistantOpenMyseftAV;
        if( (!ServiceRoom.getTkRoom().isBeyondMaxVideo()  || user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) || assistantFlag && user.role === TkConstant.role.roleTeachingAssistant){ //没有超出最大发布路数   //xgd 17-09-20
            ServiceSignalling.userPlatformUpOrDown( userid ) ;
            this._updateTemporaryDisabled(userid ,true );
        }else{
            const children = <span className="beyond-max-video" > {TkGlobal.language.languageData.publish.beyondMaxVideo.text} </span> ;
            that.updateUserToList( user , children );
            that._updateTemporaryDisabled(userid ,true );
            setTimeout( () => {
                that.updateUserToList( user , undefined );
                that._updateTemporaryDisabled(userid ,false );
            } , 3000) ;
        }
    } ;

    handlerStreamRemoved(recvEventData){
        let stream = recvEventData.stream ;
        this._updateTemporaryDisabled(stream.extensionId , false);
    };
    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name) {
            case "StreamFailure"://wj改8-10
                this._updateTemporaryDisabled(pubmsgData.data.studentId , false);
                break;
            case 'ClassBegin':
                that.updateAllUserToList();
                break;
        }
    };
    handlerStreamSubscribed(streamSubscribedEventData){
        let stream = streamSubscribedEventData.stream ;
        this._updateTemporaryDisabled(stream.extensionId , false);
    };

    handlerReceiveMsglistClassBegin(recvEventData){
        const that = this ;
        that.updateAllUserToList();
    };

    /*在用户列表中添加或者更新用户*/
    addUserToList(user){
        const that = this ;
        if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
            if( !that.state.userlistData.userListItemJson.has(user.id) ){
                let userItemDescInfo = that._productionUserItemDescInfo(user);
                userItemDescInfo.temporaryDisabled = false ;
                that.state.userlistData.titleJson.number += 1;
                that.state.userlistData.userListItemJson.set(user.id , userItemDescInfo );
                that.setState({userlistData:that.state.userlistData});
            }
        }
    };

    /*在用户列表中删除用户*/
    removeUserToList(user){
        const that = this ;
        if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
            if(that.state.userlistData.userListItemJson.has(user.id) ){
                that.state.userlistData.userListItemJson.delete(user.id) ;
                that.state.userlistData.titleJson.number -= 1;
                that.setState({userlistData:that.state.userlistData});
            }
        }
    };

    /*更新所有的用户属性状态*/
    updateAllUserToList(){
        const that = this ;
        let users = ServiceRoom.getTkRoom().getUsers();
        for(let user of Object.values(users) ){
            that.updateUserToList(user);
        }
    };

    /*在用户列表中更新用户*/
    updateUserToList(user , children){
        const that = this ;
        if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
            let userItemDescInfo = that._productionUserItemDescInfo(user , children);
            if(that.state.userlistData.userListItemJson.has(user.id) ){
                Object.assign(that.state.userlistData.userListItemJson.get(user.id) , userItemDescInfo ) ;
                that.setState({userlistData:that.state.userlistData});
            }
        }
    };

    /*恢复用户列表的默认数据*/
    recoverDefaultUserToList(){
        const that = this ;
        const defaultUserlistData = that._productionDefaultUserlistData();
        that.setState({userlistData:defaultUserlistData});
    };

    /*更新临时disabled*/
    _updateTemporaryDisabled(userid , temporaryDisabled){
        const that = this ;
        if(that.state.userlistData.userListItemJson.has(userid) ){
            Object.assign(that.state.userlistData.userListItemJson.get(userid) , {temporaryDisabled:temporaryDisabled} ) ;
            that.setState({userlistData:that.state.userlistData});
        }
    };

    /*根据user生产用户描述信息*/
    _productionUserItemDescInfo(user , children ){
        const that = this ;
        let disabled = !CoreController.handler.getAppPermissions('userlisPlatform') ||  user.id == ServiceRoom.getTkRoom().getMySelf().id && user.role === TkConstant.role.roleTeachingAssistant && !TkConstant.joinRoomInfo.assistantOpenMyseftAV ||  (!user.hasvideo && !user.hasaudio &&  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ) || (user.disableaudio && user.disablevideo &&  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE)  || !(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) ; //没有音视频设备或者音视频设备禁用或者角色不是老师（助教）则不能上台;  //2017-09-18 xgd
        const userItemDescInfo =  {
            id:user.id,
            disabled:disabled ,
            active:  user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE  ,
            onClick:!disabled?that.handlerUserListItemOnClick.bind(that , user.id ):undefined ,
            textContext:user.nickname ,
            children:children || undefined ,
            order:user.role === TkConstant.role.roleStudent ? 0 : ( user.role === TkConstant.role.roleTeachingAssistant?1:2 ), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-助教 ， 2-暂时未定）
            afterIconArray:[
                {
                    show:true ,
                    'className':'v-user-update-icon '+ ( user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? 'on' : 'off') ,
                    title: user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.up.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.down.title
                } ,
                {
                    show:user.hasaudio ,
                    'className':'audio-icon ' +' '+ ( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH  ) ?  'on' : 'off' ) + ' ' +( user.disableaudio ? 'disableaudio' : '') ,
                    title: user.disableaudio ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.disabled.title : (
                        user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH   ?
                            TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.off.title
                        ) ,
                } ,
                {
                    show:user.hasvideo ,
                    'className':'video-icon ' + ( ( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'on' : 'off' )+ ' ' +( user.disablevideo ? 'disablevideo' : '') ,
                    title: user.disablevideo ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.disabled.title : (
                        user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH   ?
                            TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.off.title
                    ) ,
                } ,
                {
                    show:true ,
                    'className':'pencil-icon '+ (user.candraw? 'on' : 'off') ,
                    title:user.candraw ?  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.on.title :  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.off.title
                } ,{
                    show:true ,
                    'className':'hand-icon '+ (user.raisehand? 'on' : 'off') ,
                    title:user.raisehand?TkGlobal.language.languageData.header.system.Raise.yesText : TkGlobal.language.languageData.header.system.Raise.noText
                } ,
            ]
        } ;
        if( !CoreController.handler.getAppPermissions('showUserlistIcon') || (!user.hasvideo && !user.hasaudio) ||   user.role === TkConstant.role.roleTeachingAssistant && !TkConstant.joinRoomInfo.assistantOpenMyseftAV ){ //没有音视频设备则不显示用户列表的状态图标   //2017-09-18 xgd
            userItemDescInfo.afterIconArray.length = 0 ;
        }
        return userItemDescInfo ;
    };

    /*生产默认的用户列表数据*/
    _productionDefaultUserlistData(){
        const userlistData = {
            titleJson:{
                title:TkGlobal.language.languageData.toolContainer.toolIcon.userList.title ,
                number:0
            } ,
            userListItemJson:new Map(),
        };
        return userlistData ;
    };

    render(){
        const that = this ;
        const {show} = this.props ;
        return (
            <UserListDumb show={show} {... that.state.userlistData}    />
        )
    };

};
export default  UserListSmart;

