/**
 *  应用系统列表的Dumb组件
 * @module TkAppListDumb
 * @description   提供应用系统列表的Dumb组件
 * @author QiuShao
 * @date 2017/08/10
 */
'use strict';
import React  , {PropTypes} from 'react';
import List  from '../base/list/List';
import TkUtils  from 'TkUtils';
import TkConstant from 'TkConstant';
import eventObjectDefine  from 'eventObjectDefine';
import ReactDom from 'react-dom';



class TkAppListDumb extends React.Component{
    constructor(props){
        super(props);
        this.uploadFile = this.uploadFile.bind(this) ;
    };

    uploadFile(){
        const {uploadButtonJson} = this.props ;
        if(uploadButtonJson && uploadButtonJson.uploadFile && typeof uploadButtonJson.uploadFile  === "function" ){
            uploadButtonJson.uploadFile();
        }
    }

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;
        //初始化
        that._init();
    }

    _init(){
        let that = this;
        let buttonDocument = ReactDom.findDOMNode(this.refs.uploadDocumentFile);
        let buttonH5Document = ReactDom.findDOMNode(this.refs.uploadH5DocumentFile);
        //监控onClick事件
        buttonH5Document.addEventListener("click",function(){
            //dispatch 事件，
            eventObjectDefine.CoreController.dispatchEvent({type:'uploadH5DocumentFile'}) ;
        })

    }

    render(){
        let that = this ;
        let { id , className  , show ,  titleJson  , listPros  , uploadButtonJson , ...otherProps} = that.props ;
        return (
            <div id={id} className={"tk-app-list tool-extend "+ (className || '') }   {...TkUtils.filterContainDataAttribute(otherProps)}   style={ {display:show?'block':'none'} }  >
                <div className="tk-app-list-title  add-position-relative" id={titleJson.id}>
                    <span className="tk-list-title-context add-nowrap ">{titleJson.title}（<span className="tk-list-title-number" >{titleJson.number?titleJson.number:0}</span>）</span>
                </div>
                <List {...listPros} />
                <div className="tk-app-list-button-container"  style={{display:(uploadButtonJson && uploadButtonJson.show)?'block':'none'}} >
                    <button className="upload-btn "  onClick={that.uploadFile}  ref="uploadDocumentFile" >{uploadButtonJson && uploadButtonJson.buttonText ? uploadButtonJson.buttonText : '' }</button>
                </div>
                <div className="tk-app-list-button-container_h5"  style= {{display:(uploadButtonJson && uploadButtonJson.show && !this.props.isMediaUI && TkConstant.joinRoomInfo.isUpdateH5Document)?'block':'none'}} >
                    <button className="upload-btn H5"  onClick={that.uploadFile}  ref="uploadH5DocumentFile" >{uploadButtonJson && uploadButtonJson.buttonH5Text ? uploadButtonJson.buttonH5Text : '' }</button>
                </div>
            </div>
        )
    };
};
TkAppListDumb.propTypes = {
    titleJson:PropTypes.object.isRequired ,
    listPros:PropTypes.object.isRequired ,
    uploadButtonJson:PropTypes.object
};
export  default  TkAppListDumb ;

/*
数据格式:
props = {
    id:id ,
    className:className  ,
    titleJson:{
        id:id ,
        title:title ,
        number:number
    }  ,
    listPros:{...listPros}  ,
    uploadButtonJson:{
         show:show ,
         buttonText:buttonText ,
         uploadFile:uploadFile
    } ,
    ...otherProps
}
* */
