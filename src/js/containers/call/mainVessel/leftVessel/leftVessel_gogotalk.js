/**
 * 主体容器-左边所有组件的Smart模块
 * @module LeftVesselSmart
 * @description   承载左边的所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import TopVesselSmart_gogotalk from './topVessel/topVessel_gogotalk';
import BottomVesselSmart from './bottomVessel/bottomVessel';
import GiftAnimationSmart from './giftAnimation/giftAnimation';

class LeftVesselSmart_gogotalk extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bottomVesselSmartHeightRem:0
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'receiveStreamComplete' , that.handlerReceiveStreamComplete.bind(that) , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
    handlerOnResize(recvEvent){
        let {defalutFontSize} = recvEvent.message || {};
        this._TtpVesselSmartAutoHeight(defalutFontSize);
    };
    handlerReceiveStreamComplete(recvEvent){
        let {right} = recvEvent.message;
        if(!right){
            this._TtpVesselSmartAutoHeight();
        }
    };
    _TtpVesselSmartAutoHeight(defalutFontSize){
        setTimeout( () => {
            defalutFontSize = defalutFontSize || window.innerWidth / TkConstant.STANDARDSIZE ;
            let bottomVesselSmartHeight =  ReactDom.findDOMNode(this.refs.bottomVesselSmart).clientHeight / defalutFontSize ;
            this.setState({bottomVesselSmartHeightRem:bottomVesselSmartHeight});
        },0) ;
    };

    render(){
        let that = this ;
        return (
            <article id="main_content_tool_lc_video_container" className="add-fl clear-float tool-and-literally-and-othervideo-wrap add-position-relative">
            {/*工具、白板、其它视频区域*/}
                <TopVesselSmart_gogotalk  bottomVesselSmartHeightRem={this.state.bottomVesselSmartHeightRem}   />
                <BottomVesselSmart  ref="bottomVesselSmart" />
                <GiftAnimationSmart /> {/*礼物动画*/}

            </article>
        )
    };
};
export default  LeftVesselSmart_gogotalk;

