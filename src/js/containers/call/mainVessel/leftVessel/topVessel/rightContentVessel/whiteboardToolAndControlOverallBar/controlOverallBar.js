/**
 * 右侧内容-全员操作功能 Smart组件
 * @module ControlOverallBarSmart
 * @description   承载右侧内容-全员操作的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;
import ServiceTooltip from 'ServiceTooltip' ;
import WebAjaxInterface from 'WebAjaxInterface' ;
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';

class ControlOverallBarSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:{
                allGift:false ,
                allMute:false ,
            },
            allMuteDisabled:true ,
            onClick:{
                allGift:this.sendGiftGiveAllUserClick.bind(this) ,
                allMute:this.allUserMuteClick.bind(this)
            }
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged ,that.handlerroomUserpropertyChanged.bind(that) , that.listernerBackupid ); //roomUserpropertyChanged事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video ,that.handlerStreamRemoved.bind(that) , that.listernerBackupid ); //streamRemoved事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video ,that.handlerStreamAdded.bind(that) , that.listernerBackupid ); //streamAdded 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamFailed_video ,that.handlerStreamFailed.bind(that) , that.listernerBackupid ); //streamFailed 事件
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that) , that.listernerBackupid ); //initAppPermissions：白板可画权限更新
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerroomUserpropertyChanged(roomUserpropertyChangedEventData){
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user  = roomUserpropertyChangedEventData.user ;
        for( let key of Object.keys(changePropertyJson) ){
            if( key === 'publishstate' ){
                that._checkRoomIsAllParticipantMute();
            }
        }
    };
    handlerStreamRemoved(recvEventData){
        const that = this ;
        that._checkRoomIsAllParticipantMute();
    };
    handlerStreamAdded(recvEventData){
        const that = this ;
        that._checkRoomIsAllParticipantMute();
    };
    handlerStreamFailed(recvEventData){
        const that = this ;
        that._checkRoomIsAllParticipantMute();
    };
    handlerInitAppPermissions(){
        this.state.show.allGift = CoreController.handler.getAppPermissions('giveAllUserSendGift') && ServiceRoom.getTkRoom().getRoomType() !== TkConstant.ROOMTYPE.oneToOne ;
        this.state.show.allMute = CoreController.handler.getAppPermissions('allUserMute') && ServiceRoom.getTkRoom().getRoomType() !== TkConstant.ROOMTYPE.oneToOne;
        this.setState({show:this.state.show});
    };

    /*全体静音*/
    allUserMuteClick(){
        if( CoreController.handler.getAppPermissions('allUserMute') ){
            let users = ServiceRoom.getTkRoom().getUsers();
            for(let user of Object.values(users) ){
                if(user.role !== TkConstant.role.roleChairman && user.role !== TkConstant.role.roleTeachingAssistant && user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){
                    if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ){
                        ServiceSignalling.setParticipantPropertyToAll(user.id , {publishstate:TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL} );
                    }else if( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH){
                        ServiceSignalling.setParticipantPropertyToAll(user.id , {publishstate:TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY} );
                    }
                }
            }
        }
    };

    /*全体发送礼物*/
    sendGiftGiveAllUserClick(){
        let message = {
            textBefore:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.allGift.one ,
            textMiddle:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.allGift.two  ,
            textAfter:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.allGift.three  ,
        };
        let allGiftMessage = `<span class="add-fl" >${message.textBefore}</span><span class="gift-username add-nowrap add-fl"  style="color:#4468d0;" >&nbsp;${message.textMiddle}&nbsp;</span><span class="add-fl">${message.textAfter}</span>`;
        ServiceTooltip.showConfirm(allGiftMessage , function (answer) {
            if(answer){
                if( CoreController.handler.getAppPermissions('giveAllUserSendGift') ){
                    let userIdJson = {};
                    let users = ServiceRoom.getTkRoom().getUsers();
                    for (let user of Object.values(users)) {
                        if(user.role === TkConstant.role.roleStudent){ //如果是学生，则发送礼物
                            let userId = user.id;
                            let userNickname = user.nickname ;
                            userIdJson[userId] = userNickname ;
                        }
                    }
                    WebAjaxInterface.sendGift(userIdJson);
                }
            }
        });
    };

    _checkRoomIsAllParticipantMute(){
        const that = this ;
        let users = ServiceRoom.getTkRoom().getUsers() ;
        let muteUserSize = 0 ;
        for(let user of Object.values(users) ){
            if(user && user.role !== TkConstant.role.roleChairman ){
                if (user.publishstate == TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate == TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) {//状态为1和3的时候
                    muteUserSize++ ;
                    break;
                }
            }
        }
        let allMute = (muteUserSize === 0 )  ;
        if( that.state.allMuteDisabled !== allMute ){
            that.setState({allMuteDisabled: allMute });
        }
        return allMute ;
    };

    render(){
        let that = this ;
        let {show , allMuteDisabled , onClick} = that.state ;
        let {allGift , allMute} = show ;
        return ( /* gogotalk */
            <ol className="all-participant-function add-fl clear-float  h-tool"  > {/*全员操作功能组件*/}
                <li  className="tl-all-participant-gift" style={{display:!allGift?'none':''}}  >
                    <button className="header-tool "  title={TkGlobal.language.languageData.header.tool.allGift.title.yes}  onClick={onClick.allGift}  >
                        <span className="tool-img-wrap on "></span>
                    </button>
                </li>
                <li   className="tl-all-participant-mute"  style={{display:!allMute?'none':''}}  >
                    <button id="all_mute_btn" className={"header-tool " + (allMuteDisabled?'disabled':'')}  title={TkGlobal.language.languageData.header.tool.allMute.title.no}  disabled={allMuteDisabled}  onClick={!allMuteDisabled?onClick.allMute:undefined }  >
                        <span className="tool-img-wrap on"></span>
                    </button>
                </li>
            </ol>
        )
    };
};
export default  ControlOverallBarSmart;

