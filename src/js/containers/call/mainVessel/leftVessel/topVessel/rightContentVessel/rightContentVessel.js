/**
 * 顶部部分-右侧内容Smart模块
 * @module RightContentVesselSmart
 * @description   承载顶部部分-右侧内容的承载容器
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import { DropTarget } from 'react-dnd';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import WhiteboardAndNewpptSmart from '../../../../../whiteboardAndNewppt/whiteboardAndNewppt' ;
import PagingToolBarSmart from './pagingToolBar/pagingToolBar' ;
import TimeRemindSmart from './timeRemind/timeRemind' ;
import WhiteboardToolAndControlOverallBarSmart from './whiteboardToolAndControlOverallBar/whiteboardToolAndControlOverallBar' ;
import Video from '../../../../../video';
import ServiceSignalling from 'ServiceSignalling';
import ServiceRoom from 'ServiceRoom' ;

const specTarget = {
    drop(props, monitor, component) {
        const delta = monitor.getDifferenceFromInitialOffset();//拖拽的偏移量
        let dragFinishEleCoordinate = monitor.getSourceClientOffset();//拖拽后鼠标相对body的位置
        const item = monitor.getItem();
        const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        if (item.id == 'page_wrap' || item.id == 'lc_tool_container' ) {
            let translateX = delta.x/defalutFontSize + item.translateX;
            let translateY = delta.y/defalutFontSize + item.translateY;
            component._changePagingToolStyle(item.id,translateX,translateY);
        }else {
            let { id, left, top, isDrag} = item;
            let dragEle = document.getElementById(id);//拖拽的元素
            let content = document.getElementById('content');//白板拖拽区域
            let dragEleW = dragEle.clientWidth;
            let dragEleH = dragEle.clientHeight;
            let contentW = content.clientWidth;
            let contentH = content.clientHeight;
            let dragEleLeft = (dragFinishEleCoordinate.x - 0.5*defalutFontSize)/(contentW - dragEleW);
            let dragEleTop = (dragFinishEleCoordinate.y - 0.49*defalutFontSize)/(contentH - dragEleH);
            component._changeVideoDragStyle(id, dragEleLeft, dragEleTop,true);
        }

    },
    canDrop(props, monitor) {
        const item = monitor.getItem();
        let dragFinishEleCoordinate = monitor.getSourceClientOffset();//拖拽后鼠标相对body的位置
        let dragEle = document.getElementById(item.id);//拖拽的元素
        let content = document.getElementById('content');//白板拖拽区域

        const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        let dragEleW = dragEle.clientWidth;
        let dragEleH = dragEle.clientHeight;
        let contentW = content.clientWidth;
        let contentH = content.clientHeight;
        let toolContainerW = 0.5*defalutFontSize;
        let headerH = 0.49*defalutFontSize;
        if (dragFinishEleCoordinate.x < toolContainerW || dragFinishEleCoordinate.x > toolContainerW+contentW-dragEleW || dragFinishEleCoordinate.y < headerH || dragFinishEleCoordinate.y > headerH + contentH - dragEleH) {
            return false;
        }else {
            return true;
        }
    },
};
// @DragDropContext(HTML5Backend)
class RightContentVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadTimeRemindSmart:false ,
            page_wrap:{
                translateX:0,
                translateY:0,
            },
            lc_tool_container:{
                translateX:0,
                translateY:0,
            },
            otherVideoStyle:{},
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener('dblclickChangeOtherVideoStyle' , that.dblclickChangeOtherVideoStyle.bind(that)  , that.listernerBackupid); //更新底部视频的位置
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件：拖拽动作处理
        eventObjectDefine.CoreController.addEventListener('handleVideoDragListData' , that.handleVideoDragListData.bind(that)  , that.listernerBackupid); //更新底部视频的位置

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(  that.listernerBackupid );
    };
    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：拖拽动作处理
        let that = this ;

        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "videoDraghandle":
                this.state.otherVideoStyle = pubmsgData.data.otherVideoStyle;
                this.setState({
                    otherVideoStyle:this.state.otherVideoStyle,
                });
                for (let i in this.state.otherVideoStyle) {
                    let isDrag = this.state.otherVideoStyle[i].isDrag;
                    eventObjectDefine.CoreController.dispatchEvent({type:'changeVideoBtnHide', message:{data:{isDrag:isDrag,extensionId:i}},});
                }
                break;
        }
    };

    handleVideoDragListData(handleData) {//room-listmsg事件：拖拽动作处理
        if (handleData.message.data) {
            let otherVideoStyle = handleData.message.data[0].data.otherVideoStyle;
            Object.assign(this.state.otherVideoStyle,otherVideoStyle);
            this.setState({otherVideoStyle:this.state.otherVideoStyle});

            for (let i in this.state.otherVideoStyle) {
                let isDrag = this.state.otherVideoStyle[i].isDrag;
                eventObjectDefine.CoreController.dispatchEvent({type:'changeVideoBtnHide', message:{data:{isDrag:isDrag,extensionId:i}},});
            }
        }
    };
    handlerRoomConnected() {
        this.setState({ loadTimeRemindSmart:CoreController.handler.getAppPermissions('loadClassbeginRemind') });
    };
    dblclickChangeOtherVideoStyle(handleData){//视频双击处理
        let {id,left,top,isDrag} = handleData.message;
        this._changeVideoDragStyle(id,left,top,isDrag);
    };

    _changeVideoDragStyle(id,left,top,isDrag){
        this.state.otherVideoStyle[id] = {
            top:top,
            left:left,
            isDrag:isDrag,
        };
        this.setState({
            otherVideoStyle:this.state.otherVideoStyle,
        });

        eventObjectDefine.CoreController.dispatchEvent({//自己本地改变拖拽的video位置
            type:'changeOtherVideoStyle',
            message:{data: this.state.otherVideoStyle,},
        });
        //let extensionId = ServiceRoom.getTkRoom().remoteStreams[streamId].extensionId;
        //拖拽后改变视频上的按钮
        eventObjectDefine.CoreController.dispatchEvent({type:'changeVideoBtnHide', message:{data:{isDrag:isDrag,extensionId:id}},});
        //通知其他人改变拖拽的video位置
        if (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) {
            let data = {otherVideoStyle:this.state.otherVideoStyle,};
            ServiceSignalling.sendSignallingFromVideoDraghandle(data);
        }
    };
    _changePagingToolStyle(id,translateX,translateY) {//工具条的拖拽
        this.setState({[id]:{
            translateX:translateX,
            translateY:translateY,
        }});
    };


    render(){
        let that = this ;
        const {connectDropTarget} = that.props;
        let {loadTimeRemindSmart} = that.state ;
        return connectDropTarget(
            <article  id="content" className="lc-container add-position-relative add-fl">
            {/*白板以及动态PPT等区域*/}
                <div   id="lc-full-vessel" className="add-position-relative lc-full-vessel" >
                    <WhiteboardAndNewpptSmart /> {/*白板以及动态PPT组件*/}
                    { (!TkGlobal.playback && loadTimeRemindSmart ) ? <TimeRemindSmart roomConnected={loadTimeRemindSmart} /> : undefined  } {/*提示信息*/}
                     <Video />   {/*视频悬浮窗口*/}
                     <PagingToolBarSmart id="page_wrap" {...that.state.page_wrap} /> {/*白板以及动态ppt下面工具条*/}
                    { !TkGlobal.playback ? <WhiteboardToolAndControlOverallBarSmart id="lc_tool_container" {...that.state.lc_tool_container}/> : undefined }{/*白板工具栏以及全体操作功能栏*/}
                </div>
            </article>
        )
    };
};
RightContentVesselSmart.defaultProps = {
    systemHideTime:0 ,
};
export default  DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(RightContentVesselSmart);

