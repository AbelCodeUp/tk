/**
 * 顶部部分-左侧工具栏Smart模块
 * @module LeftToolBarVesselSmart
 * @description   承载顶部部分-左侧工具的承载容器
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';

import ToolButtonVesselSmart from './toolButtonVessel/toolButtonVessel';
import ToolExtendListVesselSmart from './toolExtendListVessel/toolExtendListVessel';
import ToolExtendListVesselSmartGoGoTalk from './toolExtendListVessel/toolExtendListVessel_gogotalk';

import "./css/cssLeftToolBarVessel.css";
//gogotalk 
import TkConstant from 'TkConstant';

import ControlOverallBarSmart from '../rightContentVessel/whiteboardToolAndControlOverallBar/controlOverallBar';
import WhiteboardToolBarSmart from '../rightContentVessel/whiteboardToolAndControlOverallBar/whiteboardToolBar';
import WhiteboardToolBarGogotalk from '../rightContentVessel/whiteboardToolAndControlOverallBar/whiteboardToolBar_gogotalk';

class LeftToolBarVesselSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isZindex : props.data
        }
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
    };
    _infouse() {
        
        this.setState({
            isZindex : 3
        })
    }
    _inblur() {
        window.setTimeout(() => {
            this.setState({
                isZindex : 1
            })
        },200);
    }

    render() {
        let that = this;
        let _DomStyle = TkGlobal.format == "igogotalk" && TkConstant.joinRoomInfo.roomtype == TkConstant.ROOMTYPE.oneToOne 
        ? { zIndex:this.state.isZindex }:{};
        // alert(TkConstant.joinRoomInfo.roomtype == TkConstant.ROOMTYPE.oneToOne)
        let _ToolDom = TkGlobal.format == "igogotalk" && TkConstant.joinRoomInfo.roomtype == TkConstant.ROOMTYPE.oneToOne
            ?
            <div style={{height:'100%'}}>
                <div className="gogotalk_leftbar_box">
                    <div className="gogotalk_left_top_banner"></div>
                    <ControlOverallBarSmart />  {/*gogotalk*/}
                    <WhiteboardToolBarGogotalk incallback={this._infouse.bind(this)} outcallback={this._inblur.bind(this)}/>  {/*gogotalk*/}
                </div>
                <ToolExtendListVesselSmartGoGoTalk incallback={this._infouse.bind(this)} outcallback={this._inblur.bind(this)} />
            </div>
            :
            <div><ToolButtonVesselSmart /><ToolExtendListVesselSmart /></div>; //判断gogotalk与一对一加载一套样式
        return (
            <article id="tool_container" style={ _DomStyle } className="tool-container add-position-relative add-fl" >{/*工具区域*/}
                {
                    _ToolDom
                }
                {/* 工具按钮的所有组件 */}
                {/*工具按钮对应的List列表Smart模块*/}
                {/* gogotalk 新增11111 */}

            </article>
        )
    };
};
export default LeftToolBarVesselSmart;

