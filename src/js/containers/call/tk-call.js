/**
 * 组合call页面的所有模块
 * @module TkCall
 * @description   提供call页面的所有模块的组合功能
 * @author QiuShao
 * @date 2017/7/27
 */

'use strict';
import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext,DragDropContextProvider  } from 'react-dnd';
import eventObjectDefine from 'eventObjectDefine' ;
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import ServiceRoom from 'ServiceRoom' ;
import HeaderVesselSmart from './headerVessel/headerVessel' ;
import MainVesselSmart from './mainVessel/mainVessel' ;

// 载入gogotalk组件
import MainVesselSmart_gogotalk from './mainVessel/mainVessel_gogotalk' ;
import TkConstant from 'TkConstant' ;
// 载入gogotalk组件

import JoinDetectionDeviceSmart from '../detectionDevice/joinDetectionDevice';
import ReconnectingSmart from './reconnecting/reconnecting';
import SupernatantDynamicPptVideoSmart from './supernatantDynamicPptVideo/supernatantDynamicPptVideo';
import Help from '../help/subpage/help';

/*Call页面*/
class TkCall extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            reconnecting:false
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentWillMount(){ //在初始化渲染执行之前立刻调用
        const that = this ;
        TkGlobal.playback = false ; //是否回放
        TkGlobal.routeName = 'call' ; //路由的名字
        TkGlobal.isGetNetworkStatus = true ; //是否获取网络状态
        $(document.body).removeClass('playback');
        that._refreshHandler();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerOkCallback(selectDeviceInfo){ /*切换设备之后的处理*/
        let audioouputElementIdArr = document.getElementById("room").querySelectorAll("video , audio") ;
        ServiceRoom.getTkRoom().changeLocalDeviceToLocalstream(selectDeviceInfo , function (stream) {
            eventObjectDefine.CoreController.dispatchEvent({ type:"migrationOfDevices" , message:{stream:stream} }) ;
        },audioouputElementIdArr);
    };

    /*点击call整体页面的事件处理*/
    callAllWrapOnClick(event){
        if( !(event.target.id === 'tool_list_left' ||  $(event.target).parents("#tool_list_left").length>0 ) && !( event.target.id === 'tool_extend_container' ||  $(event.target).parents("#tool_extend_container").length>0  ) ){
            eventObjectDefine.CoreController.dispatchEvent({type:'resetAllLeftToolButtonOpenStateToFalse'});
        }
    };

    _refreshHandler(){
        //如果没有经过login则视为刷新
        if (TkGlobal.isRenovate !== false ) {
            TkGlobal.isRenovate = true;
            let time = TkUtils.getUrlParams('timestamp' , window.location.href );
            let hrefSessionStorage  = window.sessionStorage.getItem(time);
            if (hrefSessionStorage) {
                window.location.href =  TkUtils.decrypt( hrefSessionStorage );
            }
        }
    };

    //处理gogotalk自定义组件 springfeng
    switchGogotalk(){ 
        // alert(TkConstant.joinRoomInfo.roomtype);
        if(TkGlobal.format == "igogotalk" && TkConstant.joinRoomInfo.roomtype != TkConstant.ROOMTYPE.oneToOne ){
          return  <MainVesselSmart_gogotalk />; 
        }else{
            return  <MainVesselSmart />;
        }
    }
    //处理gogotalk自定义组件 springfeng
    
    render(){
        const that = this ;
        const MainCom=that.switchGogotalk();
        // alert(MainCom)
        //let pptIframe = document.getElementById("newppt_frame").contentWindow;
        return (
            <section className="add-position-relative" id="room"  style={{width:'100%' , height:'100%'}}>
                <article  className="all-wrap clear-float" id="all_wrap" onClick={that.callAllWrapOnClick.bind(that) } >
                    <HeaderVesselSmart />   {/*头部header*/}
                    <Help/>{/*xueln 帮助组建*/}
                    {MainCom}
                    <ReconnectingSmart /> {/*重新连接*/}
                    <SupernatantDynamicPptVideoSmart /> {/*动态PPT正在播放浮层*/}
                    <JoinDetectionDeviceSmart isEneter={false} saveLocalStorage={false} clearFinsh={true} handlerOkCallback={that.handlerOkCallback.bind(that)}  backgroundColor='rgba(0,0,0,0.5)' okText={TkGlobal.language.languageData.login.language.detection.button.ok.text} titleText={TkGlobal.language.languageData.login.language.detection.deviceTestHeader.deviceSwitch.text} />{/*设备切换*/}
                </article>
            </section>
        )
    }
};
export default   DragDropContext(HTML5Backend)(TkCall);