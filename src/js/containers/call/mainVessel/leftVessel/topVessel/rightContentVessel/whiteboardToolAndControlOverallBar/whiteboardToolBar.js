/**
 * 右侧内容-白板标注工具Smart组件
 * @module WhiteboardToolBarSmart
 * @description   承载右侧内容-白板标注工具的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceRoom from 'ServiceRoom';

class WhiteboardToolBarSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fileTypeMark:'general' ,
            selectColor:'000000' ,
            show:true ,
            showItemJson:{
                mouse:true ,
                laser:true ,
                brush:true ,
                text:true ,
                shape:true ,
                undo:true ,
                redo:true ,
                eraser:true  ,
                clear:true ,
                colorAndSize:true
            }
        };
        this.colors = {
            smipleList:["#000000" , "#2d2d2d" , "#5b5b5b" , "#8e8e8e" , "#c5c5c5" , "#ffffff" ,"#ff0001" , "#06ff02" , "#0009ff" , "#ffff03"  , "#00ffff"  , "#ff03ff"]  ,
            moreList:[
                [ "#000000" , "#002d00" , "#015b00" ,  "#028e01" , "#03c501" , "#06ff02" , "#2d0000" , "#2d2d00" , "#2d5b00" , "#2d8e01" , "#2dc501" , "#2eff02"  , "#5b0000" , "#5b2d00"  , "#5b5b00" , "#5b8e01" , "#5bc501" , "#5cff02" ],
                [ "#00002d" , "#002d2d" , "#015b2d" , "#028e2d" , "#03c52d" , "#05ff2d" , "#2d002d" , "#2d2d2d" , "#2d5b2d" , "#2d8e2d" , "#2dc52d"  ,"#2eff2d" , "#5b002d" , "#5b2d2d" , "#5b5b2d" , "#5b8e2d" , "#5bc52d" , "#5cff2d" ],
                [ "#00015b" , "#002d5b" , "#005b5b" , "#018e5b" , "#02c55b" , "#05ff5b" , "#2d015b" , "#2d2d5b" , "#2d5b5b" , "#2d8e5b" , "#2dc55b" , "#2eff5b"  , "#5b005b" , "#5b2d5b" , "#5b5b5b" , "#5b8e5b" , "#5bc55b" , "#5cff5b" ],
                [ "#00038e" , "#002d8e" , "#005b8e" , "#008e8e" , "#01c58e" , "#03ff8e" , "#2c038e" , "#2d2d8e" , "#2d5b8e" , "#2d8e8e" , "#2dc58e" , "#2dff8e" , "#5b028e" , "#5b2d8e" , "#5b5b8e" , "#5b8e8e" , "#5bc58e" , "#5bff8e" ],
                [ "#0005c5" , "#002ec5" , "#005bc5" , "#008ec5" , "#00c5c5" , "#01ffc5" , "#2c05c5" , "#2c2ec5" , "#2c5bc5" , "#2c8ec5" , "#2dc5c5" , "#2dffc5" , "#5b04c5" , "#5b2ec5" , "#5b5bc5" , "#5b8ec5" , "#5bc5c5" , "#5bffc5" ],
                [ "#0009ff" , "#002eff" , "#005cff" , "#008fff" , "#00c5ff" ,"#00ffff" ,"#2c08ff" ,"#2c2eff" , "#2c5cff" , "#2c8fff" , "#2cc5ff" , "#2dffff" , "#5b08ff" , "#5b2eff" , "#5b5cff" , "#5b8fff" , "#5bc5ff" , "#5bffff" ],
                [ "#8e0000" , "#8e2d00" , "#8e5b01" , "#8e8e01" , "#8fc502" , "#8fff03" ,"#c50001" , "#c52c01" , "#c55b01" , "#c58e01" , "#c5c502" , "#c5ff03" , "#ff0001" , "#ff2c01" , "#ff5b01" , "#ff8e02" , "#ffc502" , "#ffff03" ],
                [ "#8e002d" , "#8e2d2d" , "#8e5b2d" , "#8e8e2d" , "#8fc52d" , "#8fff2d" , "#c5002d" , "#c52c2d" , "#c55b2d" , "#c58e2d" , "#c5c52d" , "#c5ff2d" , "#ff002d" , "#ff2c2d" , "#ff5b2d" , "#ff8e2d" , "#ffc52d" , "#ffff2d" ],
                [ "#8e005b" , "#8e2d5b" , "#8e5b5b" , "#8e8e5b" , "#8fc55b" , "#8fff5b" ,"#c5005b" , "#c52c5b" , "#c55b5b" , "#c58e5b" , "#c5c55b" , "#c5ff5b" , "#ff005b" , "#ff2c5b" , "#ff5b5b" , "#ff8e5b" , "#ffc55b" , "#ffff5b" ],
                [ "#8e018e" , "#8e2d8e" , "#8e5b8e" , "#8e8e8e" , "#8ec58e" , "#8fff8e" , "#c5008e" , "#c52d8e" , "#c55b8e" , "#c58e8e" , "#c5c58e" , "#c5ff8e" , "#ff008e" , "#ff2c8e" , "#ff5b8e" , "#ff8e8e" , "#ffc58e" , "#ffff8e" ],
                [ "#8e03c5" , "#8e2dc5" , "#8e5bc5" , "#8e8ec5" , "#8ec5c5" , "#8effc5" , "#c502c5" , "#c52dc5" , "#c55bc5" , "#c58ec5" , "#c5c5c5" , "#c5ffc5" , "#ff00c5" , "#ff2dc5" , "#ff5bc5" , "#ff8ec5" , "#ffc5c5" , "#ffffc5" ],
                [ "#8e07ff","#8e2eff" , "#8e5cff" , "#8e8fff" , "#8ec5ff" , "#8effff" , "#c505ff" , "#c52eff" , "#c55bff" , "#c58eff" , "#c5c5ff" , "#c5ffff" , "#ff03ff" , "#ff2dff", "#ff5bff" , "#ff8eff" , "#ffc5ff" , "#ffffff" ]
            ]
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        $("#tool_mouse , #simple_color_000000").trigger("click"); //默认选中鼠标
        eventObjectDefine.CoreController.dispatchEvent({type:'toolsInitBind'});
        eventObjectDefine.CoreController.addEventListener('changeFileTypeMark' , that.handlerChangeFileTypeMark.bind(that) , that.listernerBackupid ); //设置翻页栏属于普通文档还是动态PPT
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that) , that.listernerBackupid  ); //roomConnected事件
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_canDraw" ,that.handlerUpdateAppPermissions_canDraw.bind(that) , that.listernerBackupid  ); //updateAppPermissions_canDraw：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that)  , that.listernerBackupid ); //initAppPermissions：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener('resetDefaultAppPermissions' ,that.handlerResetDefaultAppPermissions.bind(that)  , that.listernerBackupid ); //resetDefaultAppPermissions：白板可画权限更新
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerChangeFileTypeMark(recvEventData){
        this.setState({fileTypeMark:recvEventData.message.fileTypeMark});
    };
    handlerRoomConnected(recvEventData){
        if( TkConstant.hasRole.roleChairman ){ //如果是老师
            for(let key of  Object.keys(this.state.showItemJson) ){
                this.state.showItemJson[key] = true ;
            }
            this.setState({showItemJson:this.state.showItemJson});
        }
    };
    handlerUpdateAppPermissions_canDraw(recvEventData){
        this._changeCanDrawPermissions();
    };
    handlerInitAppPermissions(recvEventData){
        this._changeCanDrawPermissions();
    };
    handlerResetDefaultAppPermissions(){
        this._changeCanDrawPermissions();
    };
    /*所有li的点击事件处理*/
    allLiClick( clickId ,  active = false , more = false , removeOtherActive = true ){
        let $li =  $("#header_tool_vessel").find("li") ;
        if(removeOtherActive){
            $li.removeClass('active') ;
        }
        if(active){
            $li.filter("#"+clickId).addClass('active') ;
        }
        if(more){
            let $filterLi = $li.filter("#"+clickId) ;
            if( !$filterLi.hasClass('more') ){
                $filterLi.addClass('more').siblings('li').removeClass('more');
            }else{
                $filterLi.removeClass('more');
                if( clickId === 'whiteboard_tool_vessel_color_strokesize' ){
                    $filterLi.removeClass('active');
                }
            }
        }else{
            $li.removeClass('more') ;
        }
        if( clickId !== 'whiteboard_tool_vessel_text' ){
            $li.filter("#"+clickId).find(".header-tool-extend li[data-select=true]").trigger('click' , [true] );
        }
        if( !(clickId === 'whiteboard_tool_vessel_undo' || clickId === 'whiteboard_tool_vessel_redo' || clickId === 'whiteboard_tool_vessel_clear' || clickId === 'whiteboard_tool_vessel_color_strokesize' ) ){ //撤销、恢复、清除、选择颜色则不通知鼠标更换事件
            eventObjectDefine.CoreController.dispatchEvent({type:'updateSelectMouse' , message:{selectMouse:  clickId === 'whiteboard_tool_vessel_mouse'} })//通知白板标注工具是否更换为鼠标
        }
    };

    /*所有的扩展栏中点击事件处理*/
    allExtnedClick(clickId , clickType ){
        const that = this ;
        switch (clickType){
            case  'pencil':
                $("#whiteboard_tool_vessel_brush").find(".header-tool").attr("data-iconclass" , clickId );
                $("#"+clickId).attr('data-select' , true ).siblings('li').attr('data-select' , false);
                break ;
            case  'text':
                $("#"+clickId).attr('data-select' , true ).siblings('li').attr('data-select' , false);
                let fontFamily = $("#"+clickId).text() ;
                eventObjectDefine.CoreController.dispatchEvent({type:'updateWhiteboardToolStatus' , message:{ toolStatus:{fontFamily:fontFamily} }});
                eventObjectDefine.CoreController.dispatchEvent({type:'executeUploadTextFont'});
                break ;
            case  'shape':
                $("#whiteboard_tool_vessel_shape").find(".header-tool").attr("data-iconclass" , clickId );
                $("#"+clickId).attr('data-select' , true ).siblings('li').attr('data-select' , false);
                break ;
        }
    };

    /*所有li的鼠标移出事件处理*/
    allLiMouseLeave( elementId ){
        $("#"+elementId).removeClass('more') ;
        if(elementId === 'whiteboard_tool_vessel_color_strokesize'){
            $("#"+elementId).removeClass('active') ;
        }
    };

    /*改变大小的点击事件*/
    changeStrokeSizeClick(elementId , strokeJson ){
        let $li =  $("#header_tool_vessel").find("li.tool-li.active:not(#whiteboard_tool_vessel_color_strokesize)") ;
        let selectedTool = {} ;
        if($li.length>0){
            switch ( $li.attr('id') ){
                case 'whiteboard_tool_vessel_brush':
                    selectedTool.pencil = true ;
                    break;
                case 'whiteboard_tool_vessel_text':
                    selectedTool.text = true ;
                    break;
                case 'whiteboard_tool_vessel_shape':
                    selectedTool.shape = true ;
                    break;
                case 'whiteboard_tool_vessel_eraser':
                    selectedTool.eraser = true ;
                    break;
            }
        }
        eventObjectDefine.CoreController.dispatchEvent({type:'changeStrokeSize' , message:{strokeJson:strokeJson  , selectedTool:selectedTool}});
        $("#"+elementId).addClass('active').siblings('.h-tool-measure').removeClass('active');
    };

    /*改变选中的颜色点击事件*/
    changeStrokeColorClick(elementId , selectColor){
        eventObjectDefine.CoreController.dispatchEvent({type:'changeStrokeColor' , message:{selectColor:selectColor}});
        $("#"+elementId).parents("#header_color_list").find("li").removeClass('active');
        $("#"+elementId).addClass('active');
        this.setState({selectColor:selectColor});
    }

    /*关闭所有的li的扩展选项*/
    _removeAllClassMore(){
        $("#header_tool_vessel").find("li").removeClass('more').filter('#whiteboard_tool_vessel_color_strokesize').remove('active');
    };

    /*加载*/
    _loadSmipleAndMoreListToArray(smipleList , moreList){
        const that = this ;
        let smipleColorElementArray = [] ;
        let moreColorElementArray = [] ;
        smipleList.map( (item , index) => {
            smipleColorElementArray.push(
                <li key={index}  onClick={that.changeStrokeColorClick.bind( that , "simple_color_"+that._colorFilter(item) , that._colorFilter(item) )} style={{backgroundColor:item}}  id={"simple_color_"+that._colorFilter(item)} ></li>
            );
        });
        moreList.map( (itemArr , itemArrIndex) => {
            if( Array.isArray(itemArr ) ){
                let tempArr = [] ;
                itemArr.map( (item , itemIndex) => {
                    tempArr.push(
                        <li key={itemIndex}  onClick={that.changeStrokeColorClick.bind( that , "more_color_"+that._colorFilter(item) , that._colorFilter(item) )}  style={{backgroundColor:item}} id={"more_color_"+that._colorFilter(item)} ></li>
                    );
                });
                moreColorElementArray.push(
                    <ul key={itemArrIndex} className="clear-float" >
                        {tempArr}
                    </ul>
                );
            }
        });
        return {
            smipleColorElementArray:smipleColorElementArray ,
            moreColorElementArray:moreColorElementArray
        }
    };
    _colorFilter(text){
        return text.replace(/#/g,"");
    };

    /*改变可画权限*/
    _changeCanDrawPermissions(){
        let show = CoreController.handler.getAppPermissions('canDraw');
        this.setState({show:show});
    };

    render(){
        let that = this ;
        let { smipleColorElementArray  , moreColorElementArray} = that._loadSmipleAndMoreListToArray( that.colors.smipleList  , that.colors.moreList );
        let {mouse , laser , brush , text , shape , undo , redo , eraser  , clear ,colorAndSize} = that.state.showItemJson ;
        return (
            <ol className="add-fl clear-float h-tool" id="header_tool_vessel"  style={{display:!that.state.show ? 'none' : ''}}  > {/*白板工具栏*/}
                <li className="tool-li tl-mouse"  id="whiteboard_tool_vessel_mouse"  style={{display:!mouse?'none':undefined }} >
                    <button className="header-tool"  title={TkGlobal.language.languageData.header.tool.mouse.title}  id="tool_mouse"   onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_mouse' , true , false , true) }  >
                        <span className="tool-img-wrap"></span>
                    </button>
                </li>

                <li className="tool-li tl-laser"   id="whiteboard_tool_vessel_laser" style={{display:!laser?'none':undefined }}  >
                    <button className="header-tool"  title={TkGlobal.language.languageData.header.tool.pencil.laser.title}  id="tool_laser"  onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_laser' , true , false , true) } >
                        <span className="tool-img-wrap"></span>
                    </button>
                </li>

                <li className="tool-li tl-pencil" id="whiteboard_tool_vessel_brush"  onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_brush') }   style={{display:!brush?'none':undefined }}  >
                    <button  className="header-tool tool-pencil  tool-more"  data-tool="pencil"    data-open="false"  title={TkGlobal.language.languageData.header.tool.pencil.title}    onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_brush' , true , true , true) }   >
                        <span className="tool-img-wrap tool-pencil-icon" ></span>
                    </button>
                    <div className="header-tool-extend tool-pencil-extend">
                        <ul className="clear-float">
                            <li  data-lc-event = "tool_pencil"  onClick={that.allExtnedClick.bind(that , 'tool_pencil' , 'pencil' ) } id="tool_pencil" data-select="true" data-bing-imgurl="img/call_layout/top/tools/icon_pencil_normal.png" ><span  className="add-nowrap"   >{TkGlobal.language.languageData.header.tool.pencil.pen.text}</span></li>
                            <li  data-select="false" onClick={that.allExtnedClick.bind(that , 'tool_highlighter' , 'pencil' ) }   id="tool_highlighter"  data-bing-imgurl="img/call_layout/top/tools/icon_highlighterl_normal.png" ><span  className="add-nowrap"   >{TkGlobal.language.languageData.header.tool.pencil.Highlighter.text}</span></li>
                            <li id="tool_line" onClick={that.allExtnedClick.bind(that , 'tool_line' , 'pencil' ) }  data-select="false" data-bing-imgurl="img/call_layout/top/tools/icon_line_normal.png" ><span  className="add-nowrap"    >{TkGlobal.language.languageData.header.tool.pencil.linellae.text}</span></li>
                            <li id="tool_arrow"  onClick={that.allExtnedClick.bind(that , 'tool_arrow'  , 'pencil') } data-select="false"  data-bing-imgurl="img/call_layout/top/tools/icon_arrow_normal.png"  ><span  className="add-nowrap"   >{TkGlobal.language.languageData.header.tool.pencil.arrow.text}</span></li>
                        </ul>
                    </div>
                </li>

                <li  className="tool-li tl-text"   id="whiteboard_tool_vessel_text"  onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_text') }   style={{display:!text?'none':undefined }}  >
                    <button className="header-tool  tool-text  tool-more"  data-tool="text"  data-open="false"  title={TkGlobal.language.languageData.header.tool.text.title}  data-lc-event = "tool_text" id="tool_text"  onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_text' , true , true , true ) }   >
                        <span className="tool-img-wrap"></span>
                    </button>
                    <div className="header-tool-extend tool-text-extend" id="tool_text_extend">
                        <ul className="clear-float">
                            <li data-select="true"  id="tool_text_msyh"   onClick={that.allExtnedClick.bind(that , 'tool_text_msyh'  , 'text' ) } data-fontFamily={TkGlobal.language.languageData.header.tool.text.Msyh.text}  ><span  className="add-nowrap"  >{TkGlobal.language.languageData.header.tool.text.Msyh.text}</span></li>
                            <li data-select="false" id="tool_text_ming"  onClick={that.allExtnedClick.bind(that , 'tool_text_ming'  , 'text') } data-fontFamily={TkGlobal.language.languageData.header.tool.text.Ming.text}    ><span  className="add-nowrap"  >{TkGlobal.language.languageData.header.tool.text.Ming.text}</span></li>
                            <li data-select="false"  id="tool_text_arial"  onClick={that.allExtnedClick.bind(that , 'tool_text_arial'  , 'text' ) } data-fontFamily={TkGlobal.language.languageData.header.tool.text.Arial.text}   ><span  className="add-nowrap"  >{TkGlobal.language.languageData.header.tool.text.Arial.text}</span></li>
                        </ul>
                    </div>
                </li>

                <li  className="tool-li tl-shape"    id="whiteboard_tool_vessel_shape"   onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_shape') }   style={{display:!shape?'none':undefined }}  >
                    <button className="header-tool  tool-shape   tool-more"  data-tool="shape"  data-open="false" title={TkGlobal.language.languageData.header.tool.shape.title}  data-change-ico="false" data-lc-event = "tool_shape_list" id="tool_shape_list" onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_shape' , true , true , true) } >
                        <span className="tool-img-wrap"></span>
                    </button>
                    <div className="header-tool-extend tool-shape-extend">
                        <ul className="clear-float">
                            <li data-select="true"  onClick={that.allExtnedClick.bind(that , 'tool_rectangle_empty'  , 'shape' ) } id="tool_rectangle_empty"  data-empty="true"  data-bing-imgurl="img/call_layout/top/tools/icon_shape_normal.png"  ><span className="add-nowrap"   >{TkGlobal.language.languageData.header.tool.shape.outlinedRectangle.text}</span></li>
                            <li data-select="false"  onClick={that.allExtnedClick.bind(that , 'tool_rectangle'  , 'shape' ) }  id="tool_rectangle"  data-bing-imgurl="img/call_layout/top/tools/icon_rectangle_normal.png"  ><span className="add-nowrap" >{TkGlobal.language.languageData.header.tool.shape.filledRectangle.text}</span></li>
                            <li data-select="false"  onClick={that.allExtnedClick.bind(that , 'tool_ellipse_empty'  , 'shape' ) } id="tool_ellipse_empty"  data-empty="true"   data-bing-imgurl="img/call_layout/top/tools/icon_circle_01_normal.png"  ><span className="add-nowrap" >{TkGlobal.language.languageData.header.tool.shape.outlinedCircle.text}</span></li>
                            <li data-select="false"   onClick={that.allExtnedClick.bind(that , 'tool_ellipse'  , 'shape' ) } id="tool_ellipse"  data-bing-imgurl="img/call_layout/top/tools/icon_circle_02_normal.png"  ><span className="add-nowrap" >{TkGlobal.language.languageData.header.tool.shape.filledCircle.text}</span></li>
                        </ul>
                    </div>
                </li>

                <li  className="tool-li tl-undo"  id="whiteboard_tool_vessel_undo"    style={{display:!undo?'none':undefined }}   >
                    <button className="header-tool not-active" id="tool_operation_undo"  title={TkGlobal.language.languageData.header.tool.undo.title} onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_undo' , false , false , false ) }  >
                        <span className="tool-img-wrap"></span>
                    </button>
                </li>

                <li  className="tool-li tl-redo" id="whiteboard_tool_vessel_redo"  style={{display:!redo?'none':undefined }}  >
                    <button className="header-tool not-active" id="tool_operation_redo" title={TkGlobal.language.languageData.header.tool.redo.title} onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_redo' , false , false , false ) }  >
                        <span className="tool-img-wrap"></span>
                    </button>
                </li>

                <li  className="tool-li tl-eraser"  id="whiteboard_tool_vessel_eraser"   style={{display:!eraser?'none':undefined }} >
                    <button className="header-tool tool-eraser" data-tool="eraser" data-open="false" title={TkGlobal.language.languageData.header.tool.eraser.title} data-change-ico="true"   data-lc-event = "tool_eraser" id="tool_eraser"   onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_eraser' , true , false , true ) } >
                        <span className="tool-img-wrap"></span>
                    </button>
                </li>

                <li  className="tool-li tl-clear"  id="whiteboard_tool_vessel_clear"  style={{display:!clear?'none':undefined }} >
                    <button className="header-tool not-active" id="tool_operation_clear" title={TkGlobal.language.languageData.header.tool.clear.title} onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_clear' , false , false , false ) }  >
                        <span className="tool-img-wrap"></span>
                    </button>
                </li>

                <li  className="tool-li tl-color"   id="whiteboard_tool_vessel_color_strokesize" onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_color_strokesize') } style={{display:!colorAndSize?'none':undefined }} >
                    <button className="header-tool" id="tool_stroke_color_vessel" title={TkGlobal.language.languageData.header.tool.colorAndMeasure.title} onClick={that.allLiClick.bind(that , 'whiteboard_tool_vessel_color_strokesize' , true  , true , false) } >
                        <span id="tool_stroke_color"  className="tool-img-wrap h-tool-color no-hover">
                            <span data-curr-type="simple" data-curr-color="000000" className="tool-color-show tk-tool-color" id="header_curr_color"  style={{backgroundColor:"#"+that.state.selectColor}} >
                                <span className="tool_triangle"></span>
                            </span>
                        </span>
                    </button>
                    <div className="header-tool-extend tool-color-extend clear-float tk-tool-color-extend" >
                        <div className="tool-measure-container add-fl"  id="tool_measure">
                            <div className="h-tool-measure-title"><span>{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectMeasure}</span></div>
                            <div id="tool_color_measure_small" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_small' , {pencil:5 , text:18 , eraser:15 , shape:5} ) } className="h-tool-measure h-tool-measure-small active"  data-pencil-size="5"  data-text-size="18"  data-eraser-size="15"  data-shape-size="5"  >
                                <span></span>
                            </div>
                            <div id="tool_color_measure_middle" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_middle' , {pencil:15 , text:36 , eraser:45 , shape:15} ) } className="h-tool-measure h-tool-measure-middle"  data-pencil-size="15"  data-text-size="36"  data-eraser-size="45"  data-shape-size="15"  >
                                <span></span>
                            </div>
                            <div id="tool_color_measure_big" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_big' , {pencil:30 , text:72 , eraser:90 , shape:30} ) } className="h-tool-measure h-tool-measure-big" data-pencil-size="30"  data-text-size="45"  data-eraser-size="90"  data-shape-size="30"  >
                                <span></span>
                            </div>
                        </div>
                        <div className="tool-color-container add-fl">
                            <div className="header-tool-extend-option-wrap  header-tool-extend-option-color ">
                                <div className="h-tool-extend-option-title"  >{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectColorText}</div>
                                <div className="h-tool-extend-option-content">
                                    <div className="h-curr-color-wrap" id="header_curr_select_color"><span className="h-curr-color" ></span></div>
                                    <div className="h-color-list-wrap clear-float" id="header_color_list">
                                        <div className="h-color-simple add-fl">
                                            <ul className="clear-float" >
                                                {smipleColorElementArray}
                                            </ul>
                                        </div>
                                        <div className="h-color-more add-fl">
                                            {moreColorElementArray}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ol>
        )
    };
};
export default  WhiteboardToolBarSmart;

