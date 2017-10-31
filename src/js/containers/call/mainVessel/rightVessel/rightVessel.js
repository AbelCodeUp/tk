/**
 * 主体容器-右边所有组件的Smart模块
 * @module RightVesselSmart
 * @description   承载右边的所有组件
 * @author QiuShao
 * @date 2017/08/08
 */

'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import VVideoContainer from "../../baseVideo/VVideoContainer";
import Video from "../../baseVideo/index";
import ChatBox from '../../../chatroom'
import ServiceRoom from 'ServiceRoom' ;


class RightVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoContainerHeightRem:0,
            pullUrl:undefined
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.userRole = undefined;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'receiveStreamComplete' , that.handlerReceiveStreamComplete.bind(that) , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };


    handlerRoomConnected(roomEvent){
        let that = this;

        let userid = ServiceRoom.getTkRoom().getMySelf().id;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        //that.userRole = user.role;
        that.setState({
            userRole:user.role
        });
        if(user.role ===  TkConstant.role.roleAudit) {
            let room = ServiceRoom.getTkRoom();
            let roomProperties = ServiceRoom.getTkRoom().getRoomProperties();
            let pullProtocol = roomProperties.pullConfigure.HLS;
            let pullUrl = pullProtocol[0].originPullUrl;
            this.setState({
                pullUrl: pullUrl
            });
        }
    }

    handlerOnResize(recvEvent){
        let {defalutFontSize} = recvEvent.message || {};
        this._chatAutoHeight(defalutFontSize);
    };
    handlerReceiveStreamComplete(recvEvent){
        let {right} = recvEvent.message;
        if(right){
            this._chatAutoHeight();
        }
    };
    _chatAutoHeight(defalutFontSize){
        let that = this;
        defalutFontSize = defalutFontSize || window.innerWidth / TkConstant.STANDARDSIZE ;
        let videoContainerHeight = undefined;            //xgd 2017-09-20
        if(that.state.userRole  === TkConstant.role.roleAudit){
            if(this.refs.rightVideoContainerElement !== undefined && ReactDom.findDOMNode(this.refs.rightVideoContainerElement).clientHeight !== undefined)
                videoContainerHeight =  ReactDom.findDOMNode(this.refs.rightVideoContainerElement).clientHeight / defalutFontSize ;
        }
        else{
            if(this.refs.rightVVideoContainerElement !== undefined && ReactDom.findDOMNode(this.refs.rightVVideoContainerElement).clientHeight !== undefined)
                videoContainerHeight =  ReactDom.findDOMNode(this.refs.rightVVideoContainerElement).clientHeight / defalutFontSize ;
        }
        if(videoContainerHeight){
            videoContainerHeight += 0.1 ;
        }
        this.setState({videoContainerHeightRem:videoContainerHeight});
    };

    _loadVideoComponent(){              //xgd 2017-09-20
        let that = this;
        let videoComponent = undefined ;
        if(that.state.userRole === TkConstant.role.roleAudit){
            videoComponent = <Video ref="rightVideoContainerElement" id={'auditparticipants'}  pullUrl={that.state.pullUrl} />;
        } else {
            videoComponent =  <VVideoContainer ref="rightVVideoContainerElement" id={'participants'}  />;
        }
        return {
            videoComponent:videoComponent
        }
    }

    render(){
        let that = this ;
        let {videoComponent} = this._loadVideoComponent();

        return (
            <article id="video_chat_container" className="video-container add-position-relative add-fr" >{/*视频区域*/}
                {videoComponent}
                <ChatBox id={'chatbox'} videoContainerHeightRem={this.state.videoContainerHeightRem} />{/* xueln 聊天室组件*/}

            </article>
        )
    };
};
export default  RightVesselSmart;

