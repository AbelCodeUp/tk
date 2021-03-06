/**
 * 主体容器Smart模块
 * @module MainVesselSmart
 * @description   承载主体部分的所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import LeftVesselSmart from './leftVessel/leftVessel';
import RightVesselSmart from './rightVessel/rightVessel';

class MainVesselSmart extends React.Component{
    constructor(props){
        super(props);
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器

    };
    render(){
        let that = this ;
        return (
            <section className="main-content-wrap clear-float" id="main">
            {/*主体内容*/}
                <LeftVesselSmart />
                <RightVesselSmart />
            </section>
        )
    };
};
export default  MainVesselSmart;

