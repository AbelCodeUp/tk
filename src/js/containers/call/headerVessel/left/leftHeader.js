/**
 * 头部容器-左侧头部Smart模块
 * @module LeftHeaderSmart
 * @description   承载头部的左侧所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import ClockTimeSmart from '../right/clockTime';
import AudioPlayerSmart from './audioPlayer';
import NetworkStatusSmart from './networkStatus/networkStatus';

class LeftHeaderSmart extends React.Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
    };

    render() {
        let that = this;
        return (
            <article className="h-left-wrap clear-float add-fl add-position-relative" id="header_left">
                <span className="add-block add-fl h-logo-wrap add-display-none"></span>
                { !TkGlobal.playback ?  <NetworkStatusSmart />: undefined }
                { !TkGlobal.playback ? <AudioPlayerSmart /> : undefined }
                { !TkGlobal.playback ? <ClockTimeSmart /> : undefined }
            </article>
        )
    };
};
export default  LeftHeaderSmart;

