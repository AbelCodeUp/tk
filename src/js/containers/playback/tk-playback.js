/**
 * 组合回放playback页面的所有模块
 * @module TkPlayback
 * @description   提供call页面的所有模块的组合功能
 * @author QiuShao
 * @date 2017/7/27
 */

'use strict';
import React from 'react';
import { hashHistory } from 'react-router'
import eventObjectDefine from 'eventObjectDefine' ;
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import CoreController from 'CoreController' ;
import HeaderVesselSmart from '../call/headerVessel/headerVessel' ;
import MainVesselSmart from '../call/mainVessel/mainVessel' ;
import PlaybackControlSmart from './playbackControl/playbackControl' ;
import "../../../css/tk-playback.css";
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

/*Call页面*/
class TkPlayback extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentWillMount(){ //在初始化渲染执行之前立刻调用
        const that = this ;
        TkGlobal.playback = true ; //是否回放
        TkGlobal.routeName = 'playback' ; //路由的名字
        TkGlobal.isGetNetworkStatus = false ; //是否获取网络状态
        $(document.body).addClass('playback');
        that._refreshHandler();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        if(!TkGlobal.isReload){
            let timestamp = new Date().getTime() ;
            let href = window.location.href ;
            window.sessionStorage.setItem(timestamp , TkUtils.encrypt( href ) );
            hashHistory.push('/replay?timestamp='+timestamp+'&reset=true' );
            CoreController.handler.initPlaybackInfo(); //执行initPlaybackInfo
        }
    };
    componentWillUnmount(){ //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    _refreshHandler(){
        if( TkUtils.getUrlParams('reset' , window.location.href ) && TkUtils.getUrlParams('timestamp' , window.location.href) &&  window.sessionStorage.getItem( TkUtils.getUrlParams('timestamp' , window.location.href) ) ){
            TkGlobal.isReload = true ;
            window.location.href =  TkUtils.decrypt(  window.sessionStorage.getItem( TkUtils.getUrlParams('timestamp' , window.location.href) ) ) ;
            window.location.reload(true);
        }
    };

    render(){
        const that = this ;
        return (
            <section  className="add-position-relative" id="room"  style={{width:'100%' , height:'100%'}} >
                <article  className="all-wrap clear-float disabled" id="all_wrap"  style={{disabled:true}} >
                    <HeaderVesselSmart />   {/*头部header*/}
                    <MainVesselSmart />   {/*主体内容*/}
                    <article className="playback-barrier-bed disabled"    style={{disabled:true}}  ></article>
                </article>
                <PlaybackControlSmart /> {/*回放控制器*/}
            </section>
        )
    }
};
export default  DragDropContext(HTML5Backend)(TkPlayback);