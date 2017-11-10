/**
 * 左侧部分-顶部所有组件的Smart模块
 * @module TopVesselSmart
 * @description   承载左侧部分-顶部所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import LeftToolBarVesselSmart from './leftToolBarVessel/leftToolBarVessel';
import RightContentVesselSmart from './rightContentVessel/rightContentVessel';

class TopVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state={
            dataA:2
        }
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
    };
    componentDidUpdate(){
        eventObjectDefine.CoreController.dispatchEvent({type:"resizeHandler"});
        eventObjectDefine.CoreController.dispatchEvent({type:"resizeMediaVideoHandler"});
    }
    _chageData() {
        this.setState({
            dataA : 1
        })
    }
    render(){
        let that = this ;
        let {bottomVesselSmartHeightRem} = that.props;
        return (
            <section className="add-fl clear-float tool-and-literally-wrap add-position-relative" id="main_tool_literally"  style={{height:'calc(100% - '+bottomVesselSmartHeightRem+'rem)'}} >
                {/*工具 !TkGlobal.playback、白板区域*/}
                { !TkGlobal.playback ? <LeftToolBarVesselSmart data={this.state.dataA} /> : undefined }
                <RightContentVesselSmart onDataChange={this._chageData.bind(this)} />
            </section>
        )
    };
};
export default  TopVesselSmart;

