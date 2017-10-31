/**
 * 登录页面模块
 * @module TkLogin
 * @description   提供 登录界面所有组件
 * @author QiuShao
 * @date 2017/7/21
 */

'use strict';
import React from 'react';
import { hashHistory } from 'react-router'
import CoreController from 'CoreController';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import JoinDetectionDeviceSmart from '../detectionDevice/joinDetectionDevice';
import JoinHint from './joinHint/join-hint';


/*Login页面*/
class TkLogin extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentWillMount(){ //在初始化渲染执行之前立刻调用
        const that = this ;
        TkGlobal.playback = false ; //是否回放
        TkGlobal.routeName = 'login' ; //路由的名字
        TkGlobal.isGetNetworkStatus = true ; //是否获取网络状态
        $(document.body).removeClass('playback');
        that._refreshHandler();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        if(!TkGlobal.isReload){
            let timestamp = new Date().getTime() ;
            let href = window.location.href ;
            window.sessionStorage.setItem(timestamp , TkUtils.encrypt( href ) );
            hashHistory.push('/login?timestamp='+timestamp+'&reset=true' );
            eventObjectDefine.CoreController.dispatchEvent( { type: "loadDetectionDevice"  , message:{check:true, start:true} }  );
        }
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };
    handlerOkCallback(){ //设备检测：点击确定或者不需要检测时执行的函数
        CoreController.handler.checkRoom(); //执行checkrooom
    };
    _refreshHandler(){
        if (TkGlobal.isRenovate) {
            TkGlobal.isReload = true ;
            window.location.reload(true);
        }else if( TkUtils.getUrlParams('reset' , window.location.href ) && TkUtils.getUrlParams('timestamp' , window.location.href) &&  window.sessionStorage.getItem( TkUtils.getUrlParams('timestamp' , window.location.href) ) ){
            TkGlobal.isReload = true ;
            TkGlobal.isRenovate = true ;
            window.location.href =  TkUtils.decrypt(  window.sessionStorage.getItem( TkUtils.getUrlParams('timestamp' , window.location.href) ) ) ;
            window.location.reload(true);
        }
        TkGlobal.isRenovate = false;
    };
    render(){
        let that = this ;
        return (
            <div className="login-container" >
                <JoinHint />
                <JoinDetectionDeviceSmart isEneter={true} clearFinsh={true} handlerOkCallback={that.handlerOkCallback.bind(that)}  backgroundColor='#121A2C' okText={TkGlobal.language.languageData.login.language.detection.button.join.text} titleText={TkGlobal.language.languageData.login.language.detection.deviceTestHeader.device.text} />
            </div>
        )
    }
};
export default TkLogin;

