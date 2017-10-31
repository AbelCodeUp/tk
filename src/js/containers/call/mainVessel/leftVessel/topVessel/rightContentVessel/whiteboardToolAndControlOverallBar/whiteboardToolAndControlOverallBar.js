/**
 * 右侧内容-白板标注工具以及全员操作的Smart组件
 * @module WhiteboardToolAndControlOverallBarSmart
 * @description   承载右侧内容-白板标注工具以及全员操作的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */
'use strict';
import React from 'react';
import ControlOverallBarSmart from './controlOverallBar';
import WhiteboardToolBarSmart from './whiteboardToolBar';
import { DragSource } from 'react-dnd';

const specSource = {
    beginDrag(props, monitor, component) {
        const { id, translateX, translateY } = props;
        return { id, translateX, translateY };
    },
};

function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}


class WhiteboardToolAndControlOverallBarSmart extends React.Component{
    constructor(props){
        super(props);

    };

    render(){
        let that = this ;
        const {connectDragSource,isDragging,translateX,translateY} = that.props;
        if (isDragging) {
            //layerIsShowOfDraging = false;
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'block';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'block';
            }
        }else {
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'none';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'none';
            }
        }

        return connectDragSource(
            <div  id="lc_tool_container" className="lc-tool-container clear-float tk-tool-right" style={{cursor:"move",transform: 'translate(' + translateX + 'rem,' + translateY + 'rem)'}} >{/*白板工具栏以及全体操作功能栏*/}
                <ControlOverallBarSmart />
                <WhiteboardToolBarSmart />
            </div>
        )
    };
};
export default  DragSource('talkDrag', specSource, collect)(WhiteboardToolAndControlOverallBarSmart);

