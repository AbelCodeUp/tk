/**
 * 白板以及动态 Smart模块
 * @module WhiteboardAndNewpptSmart
 * @description   整合白板以及动态PPT
 * @author QiuShao
 * @date 2017/7/27
 */
'use strict';
import React from 'react';
import WhiteboardSmart from './whiteboard' ;
import NewpptSmart from './newppt' ;
import eventObjectDefine from 'eventObjectDefine';
import H5Document from './H5Document';
// import { DropTarget } from 'react-dnd';

class WhiteboardAndNewpptSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fileTypeMark:'general' , //general 、 dynamicPPT 、 h5document
        }
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
    };
    changeFileTypeMark(fileTypeMark){
        if(this.state.fileTypeMark !== fileTypeMark){
            eventObjectDefine.CoreController.dispatchEvent({ type:'changeFileTypeMark' , message:{fileTypeMark:fileTypeMark} } );
            this.setState({fileTypeMark:fileTypeMark});
        }
    }
    render(){
        let that = this ;
        return (
            <div id="white_board_outer_layout" className="white-board-outer-layout" >  {/*白板最外层包裹 */}
                {/*白板和动态PPT*/}
                <div id="big_literally_wrap" className="big-literally-wrap">  {/*白板内层包裹区域*/}
                    <WhiteboardSmart  fileTypeMark={that.state.fileTypeMark} changeFileTypeMark={that.changeFileTypeMark.bind(that) } />
                    <NewpptSmart  fileTypeMark={that.state.fileTypeMark}  changeFileTypeMark={that.changeFileTypeMark.bind(that) } />
                    <H5Document  fileTypeMark={that.state.fileTypeMark}  changeFileTypeMark={that.changeFileTypeMark.bind(that) } />
                </div>
            </div>
        )
    };
};

export default  WhiteboardAndNewpptSmart;

