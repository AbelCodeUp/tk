/**
 * 白板界面与白板底层沟通的中间层处理类
 * @class HandlerWhiteboardAndCore
 * @description  提供白板界面与白板底层沟通的中间层处理类
 * @author QiuShao
 * @date 2017/09/05
 */
'use strict';
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
    let  that = this;
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(/^(rgb|RGB)/.test(that)){
        let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        let strHex = "#";
        for(let i=0; i<aColor.length; i++){
            let hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;
        }
        return strHex;
    }else if(reg.test(that)){
        let aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;
        }else if(aNum.length === 3){
            let numHex = "#";
            for(let i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;
    }
};
/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function(){
    let sColor = this.toLowerCase();
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            let sColorNew = "#";
            for(let i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for(let i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }else{
        return sColor;
    }
};
/*白板内部使用的工具*/
const whiteboardInnerUtils = {
    /**绑定事件
     @method addEvent
     @param   {element} element 添加事件元素
     {string} eType 事件类型
     {Function} handle 事件处理器
     {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
     */
    addEvent:(element, eType, handle, bol) => {
        bol = (bol!=undefined && bol!=null)?bol:false ;
        if(element.addEventListener){           //如果支持addEventListener
            element.addEventListener(eType, handle, bol);
        }else if(element.attachEvent){          //如果支持attachEvent
            element.attachEvent("on"+eType, handle);
        }else{                                  //否则使用兼容的onclick绑定
            element["on"+eType] = handle;
        }
    },
    /**事件解绑
     @method addEvent
     @param   {element} element 添加事件元素
     {string} eType 事件类型
     {Function} handle 事件处理器
     {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
     */
    removeEvent:(element, eType, handle, bol) => {
        if(element.addEventListener){
            element.removeEventListener(eType, handle, bol);
        }else if(element.attachEvent){
            element.detachEvent("on"+eType, handle);
        }else{
            element["on"+eType] = null;
        }
    },
};

/*白板类*/
class HandlerWhiteboardAndCore{
    constructor(){
        this.whiteboardToolsInfo = { //白板当前工具的状态
            primaryColor:"#000000" , //画笔的颜色
            secondaryColor:"#ffffff" , //填充的颜色
            backgroundColor:"#ffffff" , //背景颜色
            pencilWidth:5 , //笔的大小
            shapeWidth:5, //图形画笔大小
            eraserWidth:15 , //橡皮大小
            fontSize:18 , //字体大小
            fontFamily:"微软雅黑" ,
            fontStyle:"normal" ,
            fontWeight:"normal"
        };
        this.whiteboardTools = {} ; //白板标注工具
        this.defaultProductionOptions = { //默认的白板生产配置选项
            defaultWhiteboardClear:true , //默认清除白板
            defaultWhiteboardScalc:16/9 , //默认的白板比例
            defaultWhiteboardMagnification:1, //默认的白板放大比例
            defaultContainerWidthAndHeight:[0,0] , //白板承载容器的宽和高
            defaultMinHeight:undefined , //白板默认的最小高度
            defaultRotateDeg:0 , //默认的旋转角度
        };
        this.whiteboardIDPrefix = "whiteboard_" ;
        this.whiteboardInstanceDefaultID = "whiteboard_"+( -1 ) ;
        this.whiteboardInstanceStore = {} ; //白板实例存储中心
        this.whiteboardThumbnailStore = {} ; //白板缩略图存储中心
        this.uniqueWhiteboard = false ; //唯一的白板
        this.baseWhiteboardWidth = 960 ; //白板的宽高比例基数
        this.minMagnification = 1 ; //最小的白板放大倍数
        this.maxMagnification = 3 ; //最大的白板放大倍数
        this.useWhiteboardTool = {
            tool_pencil:false ,
            tool_highlighter:false ,
            tool_line:false ,
            tool_arrow:false ,
            tool_dashed:false ,
            tool_eraser:false ,
            tool_text:false ,
            tool_rectangle:false ,
            tool_rectangle_empty:false ,
            tool_ellipse:false ,
            tool_ellipse_empty:false ,
            tool_polygon:false ,
            tool_eyedropper:false ,
            tool_selectShape:false ,
            tool_mouse:false ,
            tool_laser:false ,
            action_undo:false ,
            action_redo:false ,
            action_clear:false ,
            zoom_big:false ,
            zoom_small:false ,
            zoom_default:false ,
        }; //使用的白板工具
    };

    /*初始化白板权限
     * @params
     whiteboardId:白板元素id（string , required） thumbnailId:缩略图元素id（string ） ，
     options:配置项(object)
     */
    productionWhiteboard({whiteboardId , thumbnailId , productionOptions = {} , handler = {} , fileid  } = {} ){
        const that = this ;
        if( !whiteboardId ){L.Logger.error('whiteboardId is required!'); return ;}
        let whiteboardInstanceID =  that._getWhiteboardInstanceID(fileid)  ;
        let whiteboardInstance = that._getWhiteboardInstanceByID(whiteboardInstanceID);
        if(whiteboardInstance){L.Logger.error( 'The production whiteboard(whiteboardInstanceID:'+whiteboardInstanceID+') fails, the whiteboard already exists!' ) ;return ;}
        let whiteboardElement = document.getElementById(whiteboardId);
        if(!whiteboardElement){L.Logger.error( 'Whiteboard elements do not exist , element id is:'+whiteboardId+'!' ) ;return ;}
        whiteboardInstance = {} ;
        productionOptions = Object.assign( {} , that.defaultProductionOptions , productionOptions  ) ;
        that.whiteboardInstanceStore[whiteboardInstanceID] = whiteboardInstance ; //白板实例
        whiteboardInstance.whiteboardInstanceID = whiteboardInstanceID ; //白板id
        whiteboardInstance.whiteboardScalc = productionOptions.defaultWhiteboardScalc ; //白板比例
        whiteboardInstance.whiteboardMagnification = productionOptions.defaultWhiteboardMagnification ; //白板缩放倍数
        whiteboardInstance.minHeight  = productionOptions.defaultMinHeight ;//白板最小的高度
        whiteboardInstance.rotateDeg  = productionOptions.defaultRotateDeg ;//白板的旋转角度
        whiteboardInstance.whiteboardToolsInfo = that.whiteboardToolsInfo ; //白板工具信息
        whiteboardInstance.stackStorage  = {} ;//白板数据栈对象
        whiteboardInstance.handler = {} ; //处理函数集合
        whiteboardInstance.handler.sendSignallingToServer = handler.sendSignallingToServer ;
        whiteboardInstance.handler.delSignallingToServer = handler.delSignallingToServer ;
        whiteboardInstance.active = false ; //白板激活状态
        whiteboardInstance.containerWidthAndHeight = productionOptions.defaultContainerWidthAndHeight ;
        whiteboardInstance.waitingProcessShapeData = {} ; //等待处理的白板数据
        whiteboardInstance.whiteboardElementId = whiteboardId ; //白板节点的id
        whiteboardInstance.whiteboardElement = whiteboardElement ; //白板的节点元素
        whiteboardInstance.fileid = fileid ; //文件id
        whiteboardInstance.thumbnailId = thumbnailId ; //白板缩略图元素id
        whiteboardInstance.lc = window.LC.init( whiteboardElement); //白板对象
        whiteboardInstance.lc.setColor('primary',that.whiteboardToolsInfo.primaryColor );
        whiteboardInstance.lc.setColor('secondary',that.whiteboardToolsInfo.secondaryColor  );
        whiteboardInstance.lc.setColor('background',that.whiteboardToolsInfo.backgroundColor );
        whiteboardInstance.lc.setZoom( 1 );
        whiteboardInstance.lc.setPan(0,0);
        whiteboardInstance.lc.on( "shapeSave", that._handlerShapeSaveEvent.bind(that , whiteboardInstance ) );
        whiteboardInstance.lc.on( "undo" , that._handlerUndoEvent.bind(that , whiteboardInstance ) ) ;
        whiteboardInstance.lc.on( "redo" ,that._handlerRedoEvent).bind(that , whiteboardInstance ) ;
        whiteboardInstance.lc.on( "clear" ,that._handlerClearEvent).bind(that , whiteboardInstance ) ;
        if(productionOptions.defaultWhiteboardClear){
            that.clearWhiteboardAllDataByFileid(fileid);
        };
    };

    /*清除白板的所有数据，包括存储的数据,通过fileid*/
    clearWhiteboardAllDataByFileid(fileid){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[clear]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
        that._clearWhiteboardAllDataByInstance(whiteboardInstance);
    };

    /*销毁白板实例，通过fileid*/
    destroyWhiteboardInstance(fileid){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[destroy]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
        that._destroyWhiteboardInstance(whiteboardInstance);
    };

    /*设置白板是否是唯一的白板*/
    setUniqueWhiteboard(isUniqueWhiteboard){
        this.uniqueWhiteboard = isUniqueWhiteboard ;
    };

    /*清空白板且清除白板数据栈*/
    clearRedoAndUndoStack(fileid , {clear=true , redo=true , undo=true } = {}){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[clearRedoAndUndoStack]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
        if(clear){ that._clearLc(whiteboardInstance , {triggerEvent:false}) };
        if(redo){ that._clearLcRedoStack(whiteboardInstance) };
        if(undo){ that._clearLcUndoStack(whiteboardInstance) };
    };

    /*重置白板的缩放比*/
    resetWhiteboardMagnification(fileid){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[reseetWhiteboardMagnification]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
        whiteboardInstance.whiteboardMagnification = that.defaultProductionOptions.defaultWhiteboardMagnification;
        that._zoomIsDisable(whiteboardInstance);
        that._resizeWhiteboardHandler(whiteboardInstance);
    };

    /*设置白板的图片*/
    setWhiteboardWatermarkImage(fileid ,watermarkImageUrl , {resetWhiteboardMagnification = true} = {} ){
        const that = this ;
        L.Logger.info('setWhiteboardWatermarkImage watermarkImageUrl:'+ watermarkImageUrl );
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[setWhiteboardWatermarkImage]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
        whiteboardInstance.lc.watermarkImage = null ;
        if(resetWhiteboardMagnification){
            that.resetWhiteboardMagnification(fileid);
        }
        if(watermarkImageUrl){ //图片地址没有，则使用默认白板
            that.hideCanvasBackground(fileid);
            whiteboardInstance.lc.watermarkScale = 1 ;
            that._resizeWhiteboardByScalc(whiteboardInstance ,{isChangeWatermarkScale:false});
            whiteboardInstance.lc.watermarkImage = null ;
        }else{
            that.showCanvasBackground(fileid);
            that._showWhiteLoading(whiteboardInstance);
            clearTimeout( whiteboardInstance.setWhiteboardWatermarkImageTimer );
            whiteboardInstance.setWhiteboardWatermarkImageTimer =  setTimeout(function(){
                let watermarkImage = new Image();
                watermarkImage.onload = function(){
                    let watermarkImageScalc =  watermarkImage.width / watermarkImage.height ;
                    whiteboardInstance.lc.setWatermarkImage(watermarkImage);
                    that._resizeWhiteboardByScalc(whiteboardInstance , { watermarkImage, watermarkImageScalc } );
                    that._hideWhiteLoading(whiteboardInstance);
                };
                watermarkImage.src = watermarkImageUrl;
            },150);
        }
    };

    /*根据resize更新白板的大小*/
    resizeWhiteboardHandler(fileid){
        const that = this ;
        if(fileid === undefined){
            for( let whiteboardInstance of  Object.values( that.whiteboardInstanceStore ) ){
                that._resizeWhiteboardHandler(whiteboardInstance);
            }
        }else{
            let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
            if(!whiteboardInstance){L.Logger.error( '[resizeWhiteboardHandler]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
            that._resizeWhiteboardHandler(whiteboardInstance);
        }
    };

    /*更新承载容器的宽高*/
    updateContainerWidthAndHeight(fileid , {width  , height}={}){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[showCanvasBackground]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
        if(width === undefined || height === undefined){L.Logger.error( '[updateContainerWidthAndHeight]width or height is not exist , [width:'+width+' , height:'+height+']!') ;return ;};
        whiteboardInstance.containerWidthAndHeight = [width , height] ;
        that.resizeWhiteboardHandler();
    };

    /*隐藏白板的背景canvas*/
    hideCanvasBackground(fileid){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[hideCanvasBackground]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
        if(whiteboardInstance.lc && whiteboardInstance.lc.backgroundCanvas){
            whiteboardInstance.lc.backgroundCanvas.style.display = 'none' ;
        }
    };

    /*显示白板的背景canvas*/
    showCanvasBackground(fileid){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
        if(!whiteboardInstance){L.Logger.error( '[showCanvasBackground]There are no white board Numbers that belong to fileid '+fileid ) ;return ;};
        if(whiteboardInstance.lc && whiteboardInstance.lc.backgroundCanvas){
            whiteboardInstance.lc.backgroundCanvas.style.display = '' ;
        }
    };

    /*更新白板字体*/
    updateTextFont(fileid , {fontSize  , fontFamily , fontStyle , fontWeight } = {} ){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(fileid!=undefined){
            whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
            if(!whiteboardInstance){L.Logger.error( '[updateTextFont]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
        }
        that.whiteboardToolsInfo.fontSize = fontSize != undefined ?  fontSize : that.whiteboardToolsInfo.fontSize ;
        that.whiteboardToolsInfo.fontFamily = fontFamily != undefined ?  fontFamily : that.whiteboardToolsInfo.fontFamily ;
        that.whiteboardToolsInfo.fontStyle = fontStyle != undefined ?  fontStyle : that.whiteboardToolsInfo.fontStyle ;
        that.whiteboardToolsInfo.fontWeight = fontWeight != undefined ?  fontWeight : that.whiteboardToolsInfo.fontWeight ;
        fontSize = that.whiteboardToolsInfo.fontSize  , fontFamily = that.whiteboardToolsInfo.fontFamily , fontStyle = that.whiteboardToolsInfo.fontStyle , fontWeight = that.whiteboardToolsInfo.fontWeight ;
        that._updateTextFont(whiteboardInstance , {fontSize ,fontFamily ,  fontStyle , fontWeight});
    };

    /*更新橡皮宽度*/
    updateEraserWidth(fileid , {eraserWidth} = {} ){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(fileid!=undefined){
            whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
            if(!whiteboardInstance){L.Logger.error( '[updateEraserWidth]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
        }
        that.whiteboardToolsInfo.eraserWidth = eraserWidth != undefined ?  eraserWidth : that.whiteboardToolsInfo.eraserWidth ;
        eraserWidth = that.whiteboardToolsInfo.eraserWidth;
        that._updateEraserWidth(whiteboardInstance , {eraserWidth});
    };

    /*更新画笔的宽度*/
    updatePencilWidth(fileid , {pencilWidth}={} ){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(fileid!=undefined){
            whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
            if(!whiteboardInstance){L.Logger.error( '[updatePencilWidth]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
        }
        that.whiteboardToolsInfo.pencilWidth = pencilWidth != undefined ?  pencilWidth : that.whiteboardToolsInfo.pencilWidth ;
        that._updatePencilWidth(whiteboardInstance , {pencilWidth});
    };

    /*更新形状的宽度*/
    updateShapeWidth(fileid , {shapeWidth}={} ){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(fileid!=undefined){
            whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
            if(!whiteboardInstance){L.Logger.error( '[uploadShapeWidth]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
        }
        that.whiteboardToolsInfo.shapeWidth = shapeWidth != undefined ?  shapeWidth : that.whiteboardToolsInfo.shapeWidth ;
        shapeWidth = that.whiteboardToolsInfo.shapeWidth;
        that._updateShapeWidth(whiteboardInstance , {shapeWidth});
    };


    /*激活白板工具*/
    activeWhiteboardTool(toolKey , fileid){
        const that = this ;
        if( that.useWhiteboardTool[toolKey]  === undefined ){L.Logger.error('The whiteboard does not have the '+toolKey+' tool!');return ;};
        let whiteboardInstance = undefined ;
        if( /^tool_/.test(toolKey) ){ //白板底层工具
            const _activeWhiteboardToolFromInner = (whiteboardInstance) => {
                that._setWhiteboardTools(toolKey , whiteboardInstance);
                that.changeWhiteboardTemporaryDeawPermission( toolKey !== 'tool_mouse' , whiteboardInstance );
                that._changeWhiteboardTemporaryDeawPermission(toolKey !== 'tool_mouse' , whiteboardInstance);
                that._handlerActiveToolLaser(toolKey , whiteboardInstance);

                if( toolKey == "tool_text" ){
                    that._updateTextFont(whiteboardInstance);
                }else if(toolKey == "tool_eraser"){
                    that._updateEraserWidth(whiteboardInstance);
                }else if(toolKey == "tool_pencil" || toolKey == "tool_highlighter" || toolKey == "tool_line"   || toolKey == "tool_arrow"  || toolKey == "tool_dashed"){
                    that._updatePencilWidth(whiteboardInstance);
                }else if(  toolKey == "tool_rectangle" || toolKey == "tool_rectangle_empty"  || toolKey == "tool_ellipse"  || toolKey == "tool_ellipse_empty"   || toolKey == "tool_polygon" ){
                    that._updateShapeWidth(whiteboardInstance);
                }

                if(  toolKey == "tool_ellipse_empty"  || toolKey == "tool_ellipse_empty" ){ //空心
                    whiteboardInstance.lc.setColor('secondary',"transparent" ) ;
                }else{
                    whiteboardInstance.lc.setColor('secondary',that.whiteboardToolsInfo.secondaryColor);
                }

                if( toolKey === 'tool_highlighter' ){  //荧光笔
                    let color = that.whiteboardToolsInfo.primaryColor.colorRgb().toLowerCase().replace("rgb","rgba").replace(")",",0.5)") ;
                    that.lc.setColor('primary', color  ) ;
                }else{
                    that.lc.setColor('primary',that.whiteboardToolsInfo.primaryColor);
                }
            };
            that._automaticTraverseWhiteboardInstance(whiteboardInstance , _activeWhiteboardToolFromInner);
        }else if(/^action_/.test(toolKey) ){ //白板执行的动作
            if(fileid!=undefined){
                whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
                if(!whiteboardInstance){L.Logger.error( '[activeWhiteboardTool]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
            }
            if(toolKey === 'action_undo'){
                whiteboardInstance.lc.undo();
            }else if( toolKey === 'action_redo' ){
                whiteboardInstance.lc.redo();
            }else if( toolKey === 'action_clear' ){
                whiteboardInstance.lc.clear();
            }
            that._actionIsDisable(whiteboardInstance);
        }else if(/^zoom_/.test(toolKey) ){ //白板的缩放调整
            if(fileid!=undefined){
                whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
                if(!whiteboardInstance){L.Logger.error( '[activeWhiteboardTool]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
            }
            if(toolKey === 'zoom_big'){
                if(whiteboardInstance.whiteboardMagnification < that.maxMagnification ){
                    whiteboardInstance.whiteboardMagnification += 0.5 ;
                }
            }else if( toolKey === 'zoom_small' ){
                if(whiteboardInstance.whiteboardMagnification > that.minMagnification ){
                    whiteboardInstance.whiteboardMagnification -= 0.5 ;
                }
            }else if( toolKey === 'zoom_default' ){
                whiteboardInstance.whiteboardMagnification = that.defaultProductionOptions.defaultWhiteboardMagnification ;
            }
            if(whiteboardInstance.whiteboardMagnification >  that.maxMagnification  ){
                whiteboardInstance.whiteboardMagnification = that.maxMagnification  ;
            }else if(whiteboardInstance.whiteboardMagnification < that.minMagnification ){
                whiteboardInstance.whiteboardMagnification = that.minMagnification ;
            }
            that._zoomIsDisable(whiteboardInstance);
            that._resizeWhiteboardHandler(whiteboardInstance);
        }
    }
    /*改变白板临时可画权限*/
    changeWhiteboardTemporaryDeawPermission(value , fileid){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(fileid){
            whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
            if(!whiteboardInstance){L.Logger.error( '[changeWhiteboardTemporaryDeawPermission]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
        }
        that._changeWhiteboardTemporaryDeawPermission(value , whiteboardInstance);
    };

    /*改变白板临时可画权限*/
    changeWhiteboardDeawPermission(value , fileid){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(fileid != undefined){
            whiteboardInstance = that._getWhiteboardInstanceByFileid(fileid);
            if(!whiteboardInstance){L.Logger.error( '[changeWhiteboardDeawPermission]There are no white board Numbers that belong to fileid '+fileid ) ;return ;}
        }
        that._changeWhiteboardDeawPermission(value , whiteboardInstance);
    };

    /*初始化标注工具*/
    registerWhiteboardTools(toolsDesc){
        const that = this ;
        if( !(toolsDesc && typeof toolsDesc === 'object') ){L.Logger.error('[initWhiteboardTools] tools desc cannot be empty and type json!');return;  };
        let toolsDescMap = {} ;
        for(let [toolKey , toolValue] of Object.entries(toolsDesc) ){
            if( that.useWhiteboardTool[toolKey]  === undefined ){L.Logger.warning('The whiteboard does not have the '+toolKey+' tool!');continue ;}
            toolsDescMap[toolKey] = that._productionToolDesc(toolKey , toolValue);
            that.useWhiteboardTool[toolKey] = true ;
        }
        that.whiteboardTools = toolsDescMap ;
    };

    /*批量接收白板数据操作shape画图*/
    _batchReceiveSnapshot(shapesArray , whiteboardInstance){
        const that = this ;
        if( !Array.isArray(shapesArray) ){L.Logger.error('shapesArray must be an array!');return ;} ;
        shapesArray.forEach( (shapeInfo , index) => {
            let doNotPaint = true ;
            if(index === shapesArray.length-1 ){
                doNotPaint = false ;
            }
            that._handlerShapeInfoToDraw( shapeInfo   , doNotPaint , whiteboardInstance);
        });
        that._actionIsDisable(whiteboardInstance);
    };

   /* 接收白板数据操作shape画图*/
    _receiveSnapshot(shapeInfo , whiteboardInstance){
        const that = this ;
        let doNotPaint = false ;
        that._handlerShapeInfoToDraw( shapeInfo   , doNotPaint , whiteboardInstance);
        that._actionIsDisable(whiteboardInstance);
    };

    /*处理shape画操作*/
    _handlerShapeInfoToDraw(shapeInfo , doNotPaint , whiteboardInstance){
        if(shapeInfo.data!=null && shapeInfo.data.eventType!=null){
            if( shapeInfo.source === 'delmsg' ){   //回放的delmsg数据不是发送上去的数据，而是撤销的动作的相关描述，所以这里需要做兼容，如果是来自于delmsg的则事件类型为shapeSaveEvent和clearEvent也执行撤销操作
                switch(shapeInfo.data.eventType){
                    case "shapeSaveEvent":
                    case "clearEvent":
                    case "undoEvent":
                        if(shapeInfo.data.actionName && shapeInfo.data.actionName === "AddShapeAction"){
                            whiteboardInstance.lc.undo(false , shapeInfo.data.shapeId);
                        }else if( shapeInfo.data.actionName && shapeInfo.data.actionName === "ClearAction" ){
                            whiteboardInstance.lc.undo(false , shapeInfo.data.clearActionId);
                        }
                        break ;
                }
            }else{
                switch(shapeInfo.data.eventType){
                    case "shapeSaveEvent":
                        if(shapeInfo.data && shapeInfo.data.data && shapeInfo.data.data.data){
                            shapeInfo.data.data = LC.JSONToShape(shapeInfo.data.data);
                        }
                        whiteboardInstance.lc.saveShape(  shapeInfo.data.data  , false  , null , doNotPaint);
                        break ;
                    case "undoEvent":
                        if(shapeInfo.data.actionName && shapeInfo.data.actionName === "AddShapeAction"){
                            whiteboardInstance.lc.undo(false , shapeInfo.data.shapeId);
                        }else if( shapeInfo.data.actionName && shapeInfo.data.actionName === "ClearAction" ){
                            whiteboardInstance.lc.undo(false , shapeInfo.data.clearActionId);
                        }
                        break ;
                    case "redoEvent":
                        if(shapeInfo.data.actionName && shapeInfo.data.actionName === "AddShapeAction"){
                            let flag = false ;  //恢复栈中是否有该shape
                            for (let i= whiteboardInstance.lc.redoStack.length-1 ; i>=0 ; i-- ) {
                                if( shapeInfo.data.shapeId === whiteboardInstance.lc.redoStack[i].shapeId){
                                    whiteboardInstance.lc.redoStack.splice(i,1);
                                    flag = true ;
                                    break ;
                                }
                            }
                            if(shapeInfo.data && shapeInfo.data.data && shapeInfo.data.data.data){
                                shapeInfo.data.data = LC.JSONToShape(shapeInfo.data.data);
                            }
                            whiteboardInstance.lc.saveShape(  shapeInfo.data.data  , false  , null , doNotPaint);
                        }else if( shapeInfo.data.actionName && shapeInfo.data.actionName === "ClearAction" ){
                            whiteboardInstance.lc.clear(false , null);
                        }
                        break ;
                    case "clearEvent":
                        whiteboardInstance.lc.clear(false , null);
                        break ;
                    case "laserMarkEvent":
                        let laserMark =  whiteboardInstance.lc.containerEl.parentNode.getElementsByClassName("laser-mark")[0] ;
                        switch (shapeInfo.data.actionName){
                            case "show":
                                laserMark.style.display = 'block' ;
                                break;
                            case "hide":
                                laserMark.style.display = 'none' ;
                                break;
                            case "move":
                                if(shapeInfo.data && shapeInfo.data.laser){
                                    let left = shapeInfo.data.laser.left ;
                                    let top = shapeInfo.data.laser.top ;
                                    laserMark.style.left = left+"%" ;
                                    laserMark.style.top = top+"%" ;
                                }
                                break;
                            default:
                                break;
                        }
                        break ;
                }
            }
        }
    };

    /*生产标注工具的描述信息*/
    _productionToolDesc(toolKey , toolValue){
        const that = this ;
        let toolDesc = {
            active:false ,
            toolId:toolValue.toolId || toolKey ,
            disabled:false
        };
        return toolDesc ;
    };

    /*更新标注工具的描述信息*/
    _updateToolDesc(toolKey , toolValue){
        const that = this ;
        if(that.whiteboardTools[toolKey]){
            for(let [key,value] of Object.entries(toolValue) ){
                if(  that.whiteboardTools[toolKey][key] !== undefined ){
                    that.whiteboardTools[toolKey][key] = value ;
                }
            }
        }
    };

    /*批量更新工具描述*/
    _batchUpdateToolDesc(updateDescArray){
        const that = this ;
        if( !Array.isArray(updateDescArray) ){L.Logger.error('updateDescArray must be an array!');return ;} ;
        for(let desc of updateDescArray){
            if( Array.isArray(desc) ){
                that._updateToolDesc( desc[0] , desc[1]);
            }
        }
    };

    /*设置白板的标注工具*/
    _setWhiteboardTools(toolKey  , whiteboardInstance){
        const that = this ;
        const _setWhiteboardToolsFromInner = (whiteboardInstance) => {
            let tool = that._productionToolByCore(toolKey  , whiteboardInstance) ;
            whiteboardInstance.lc.setTool(tool);
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _setWhiteboardToolsFromInner);
    };

    /*生产白板核心层工具，通过白板核心层来生产*/
    _productionToolByCore(toolKey , whiteboardInstance){
        const that = this ;
        let tool = undefined;
        if( that.useWhiteboardTool[toolKey] === undefined ){L.Logger.error('The whiteboard does not have the '+toolKey+' tool!');return tool;}
        switch (toolKey){
            case 'tool_pencil': //笔
                tool =  new LC.tools.Pencil(whiteboardInstance.lc);
                break;
            case 'tool_highlighter': //荧光笔
                tool =  new LC.tools.Pencil(whiteboardInstance.lc);
                break;
            case 'tool_line': //直线
                tool = new LC.tools.Line(whiteboardInstance.lc) ;
                break;
            case 'tool_arrow': //箭头
                tool = new LC.tools.Line(whiteboardInstance.lc);
                tool.hasEndArrow = true;
                break;
            case 'tool_dashed': //虚线
                tool = new LC.tools.Line(whiteboardInstance.lc);
                tool.isDashed = true;
                break;
            case 'tool_eraser': //橡皮
                tool = new LC.tools.Eraser(whiteboardInstance.lc);
                break;
            case 'tool_text': //文字
                tool = new LC.tools.Text(whiteboardInstance.lc) ;
                break;
            case 'tool_rectangle': //矩形
                tool = new LC.tools.Rectangle(whiteboardInstance.lc) ;
                break;
            case 'tool_rectangle_empty': //空心矩形
                tool = new LC.tools.Rectangle(whiteboardInstance.lc) ;
                break;
            case 'tool_ellipse': //椭圆
                tool = new LC.tools.Ellipse(whiteboardInstance.lc) ;
                break;
            case 'tool_ellipse_empty': //空心椭圆
                tool = new LC.tools.Ellipse(whiteboardInstance.lc) ;
                break;
            case 'tool_polygon': //多边形
                tool = new LC.tools.Polygon(whiteboardInstance.lc) ;
                break;
            case 'tool_eyedropper': //吸管
                tool = new LC.tools.Eyedropper(whiteboardInstance.lc) ;
                break;
            case 'tool_selectShape': //选中拖动
                tool = new LC.tools.SelectShape(whiteboardInstance.lc) ;
                break;
            case 'tool_mouse': //鼠标
                tool = whiteboardInstance.lc.tool ;
                break;
            case 'tool_laser': //激光笔
                tool = whiteboardInstance.lc.tool ;
                break;
            default:
                L.Logger.warning('Tool '+toolKey+' is not created in the whiteboard core layer!');
                tool = whiteboardInstance.lc.tool ;
                break;
        };
        return tool ;
    };

   /*获取白板实例id,根据fileid获取*/
    _getWhiteboardInstanceID(fileid){
        const that = this ;
        let whiteboardInstanceID = !that.uniqueWhiteboard && fileid!=undefined && fileid!=null  ? (that.whiteboardIDPrefix+fileid) :  that.whiteboardInstanceDefaultID ;
        return whiteboardInstanceID ;
    };

    /*获取白板实例,根据fileid获取*/
    _getWhiteboardInstanceByFileid(fileid){
        const that = this ;
        let whiteboardInstanceID =  that._getWhiteboardInstanceID(fileid)  ;
        let whiteboardInstance = that.whiteboardInstanceStore[whiteboardInstanceID] ;
        return whiteboardInstance ;
    };

    /*获取白板实例,根据whiteboardInstanceID获取*/
    _getWhiteboardInstanceByID(whiteboardInstanceID){
        const that = this ;
        let whiteboardInstance = that.whiteboardInstanceStore[whiteboardInstanceID] ;
        return whiteboardInstance ;
    };

    /*白板大小根据比例自适应*/
    _resizeWhiteboardByScalc(whiteboardInstance  , { watermarkImage , isChangeCanvas=true , isChangeWatermarkScale = true , watermarkImageScalc = this.defaultProductionOptions.defaultWhiteboardScalc } = {} ){
        let whiteboardInstance_lc = whiteboardInstance.lc ;
        if(whiteboardInstance_lc){
            let whiteboardInstance_element = whiteboardInstance.whiteboardElement ;
            let containerWidth = whiteboardInstance.containerWidthAndHeight[0] ;
            let containerHeight = whiteboardInstance.containerWidthAndHeight[1] ;
            if(containerHeight*watermarkImageScalc < containerWidth ){
                whiteboardInstance_element.style.width  = Math.round( containerHeight * watermarkImageScalc* whiteboardInstance.whiteboardMagnification ) ;
                whiteboardInstance_element.style.height  = Math.round( containerHeight * whiteboardInstance.whiteboardMagnification ) ;
            }else{
                whiteboardInstance_element.style.width  = Math.round( containerWidth * whiteboardInstance.whiteboardMagnification ) ;
                whiteboardInstance_element.style.height  = Math.round( containerWidth /watermarkImageScalc *  whiteboardInstance.whiteboardMagnification ) ;
            }
            if(isChangeCanvas){
                whiteboardInstance_lc.respondToSizeChange();
                let eleWidth = whiteboardInstance_element.clientWidth ;
                let eleHeight= whiteboardInstance_element.clientHeight ;
                let whiteboardScalc =  ( eleWidth + eleHeight  ) /  ( whiteboardInstance.baseWhiteboardWidth + whiteboardInstance.baseWhiteboardWidth*isChangeWatermarkScale ) ;
                whiteboardInstance_lc.setZoom(whiteboardScalc);
                whiteboardInstance_lc.setPan(0,0);
                if(isChangeWatermarkScale && watermarkImage ){
                    let watermarkImageWidth = watermarkImage.width ;
                    let watermarkImageHeight = watermarkImage.height ;
                    let lvW = whiteboardInstance_lc.backgroundCanvas.width / watermarkImageWidth ;
                    let lvH =  whiteboardInstance_lc.backgroundCanvas.height / watermarkImageHeight ;
                    let lv = (lvW+lvH)/2;
                    whiteboardInstance_lc.watermarkScale= lv  ;
                    whiteboardInstance_lc.setWatermarkImage(watermarkImage);
                }
            }
        }
    }

    /*清除白板的所有数据，包括存储的数据,通过whiteboardInstanceID*/
    _clearWhiteboardAllDataByInstance(whiteboardInstance){
        if(!whiteboardInstance){L.Logger.error('[_clear]The whiteboard instance does not exist!' ) ;return ;}
        whiteboardInstance.lc.clear(false);
        whiteboardInstance.lc.redoStack.length = 0 ;
        whiteboardInstance.lc.undoStack.length = 0 ;
        whiteboardInstance.stackStorage  = {} ;//白板数据栈对象
        whiteboardInstance.waitingProcessShapeData = {} ; //等待处理的白板数据
    };

    /*更新白板的大小*/
    _resizeWhiteboardHandler(whiteboardInstance){
        const that = this ;
        if(whiteboardInstance && whiteboardInstance.lc){
            let watermarkImage = whiteboardInstance.lc.watermarkImage ;
            if(watermarkImage && watermarkImage.src){
                let watermarkImageScalc = watermarkImage.width / watermarkImage.height ;
                that._resizeWhiteboardByScalc(whiteboardInstance , { watermarkImage, watermarkImageScalc } );
            }else{
                that._resizeWhiteboardByScalc(whiteboardInstance ,{isChangeWatermarkScale:false});
            }
        }
    };

    /*白板事件回调处理函数:shapeSave*/
    _handlerShapeSaveEvent(whiteboardInstance , eventData){

    };

    /*白板事件回调处理函数:undo*/
    _handlerUndoEvent(whiteboardInstance , eventData){

    };

    /*白板事件回调处理函数:redo*/
    _handlerRedoEvent(whiteboardInstance , eventData){

    };

    /*白板事件回调处理函数:clear*/
    _handlerClearEvent(whiteboardInstance , eventData){

    };

    /*销毁白板实例，通过实例whiteboardInstance*/
    _destroyWhiteboardInstance(whiteboardInstance){
        const that = this ;
        that._clearWhiteboardAllDataByInstance(whiteboardInstance);
        let whiteboardInstanceID = whiteboardInstance.whiteboardInstanceID ;
        let whiteboardElement = whiteboardInstance.whiteboardElement;
        if(!whiteboardElement){
            L.Logger.warning( '[destroy] whiteboard elements do not exist , element id is:'+whiteboardInstance.whiteboardElementId+'!' ) ;
        }else{
            whiteboardElement.innerHTML = '' ;
        }
        let thumbnailElement = whiteboardInstance.thumbnailId ? document.getElementById(whiteboardInstance.thumbnailId) : undefined;
        if(thumbnailElement){
            thumbnailElement.innerHTML = '' ;
        }
        for(let key of Object.keys(whiteboardInstance) ){
            whiteboardInstance[key] = null ;
            delete whiteboardInstance[key] ;
        }
        that.whiteboardInstanceStore[whiteboardInstanceID] = null ; //白板实例
        delete  that.whiteboardInstanceStore[whiteboardInstanceID]  ;
    };

    /*执行白板的clear方法*/
    _clearLc(whiteboardInstance , {triggerEvent=true} = {}){
        whiteboardInstance&&whiteboardInstance.lc?whiteboardInstance.lc.clear(false): L.Logger.warning('clear whiteboard is not exist!') ;
    };

    /*执行白板的redoStack方法*/
    _clearLcRedoStack(whiteboardInstance){
        whiteboardInstance&&whiteboardInstance.lc?whiteboardInstance.lc.redoStack.length = 0: L.Logger.warning('clearRedoStack whiteboard is not exist!') ;
    };

    /*执行白板的UndoStack方法*/
    _clearLcUndoStack(whiteboardInstance){
        whiteboardInstance&&whiteboardInstance.lc?whiteboardInstance.lc.undoStack.length = 0: L.Logger.warning('clearUndoStack whiteboard is not exist!') ;
    };

    /*显示白板正在loading*/
    _showWhiteLoading(whiteboardInstance){
        const that = this ;
        if(whiteboardInstance.lc.loadingElement){
            whiteboardInstance.lc.loadingElement.style.display = 'block' ;
        }
    };
    /*隐藏白板正在loading*/
    _hideWhiteLoading(whiteboardInstance){
        const that = this ;
        if(whiteboardInstance.lc.loadingElement){
            whiteboardInstance.lc.loadingElement.style.display = 'none' ;
        }
    };

    /*改变白板临时可画权限*/
    _changeWhiteboardTemporaryDeawPermission(value , whiteboardInstance){
        const that = this ;
        const _handerChangeWhiteboardTemporaryDeawPermission = (whiteboardInstance)=> {
            let whiteboardInstance_lc = whiteboardInstance.lc ;
            if( whiteboardInstance_lc.isTmpDrawAble !== value ){
                whiteboardInstance_lc.isTmpDrawAble = value ;
                let temporaryDrawPermission = whiteboardInstance_lc.containerEl.parentNode.getElementsByClassName("temporary-draw-permission")[0];
                if( whiteboardInstance_lc.isTmpDrawAble ){
                    temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/( yes| no)/g,"");
                    temporaryDrawPermission.className += " yes" ;
                }else{
                    temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/( yes| no)/g,"");
                    temporaryDrawPermission.className += " no" ;
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _handerChangeWhiteboardTemporaryDeawPermission);
    };

    /*改变白板可画权限*/
    _changeWhiteboardDeawPermission(value , whiteboardInstance){
        const that = this ;
        const _handerChangeWhiteboardDeawPermission = (whiteboardInstance)=> {
            let whiteboardInstance_lc = whiteboardInstance.lc ;
            if( whiteboardInstance_lc.isDrawAble !==  value){
                whiteboardInstance_lc.isDrawAble = value ;
                let drawPermission = whiteboardInstance_lc.containerEl.parentNode.getElementsByClassName("draw-permission")[0];
                if( whiteboardInstance_lc.isDrawAble ){
                    drawPermission.className = drawPermission.className.replace(/( yes| no)/g,"");
                    drawPermission.className += " yes" ;
                }else{
                    drawPermission.className = drawPermission.className.replace(/( yes| no)/g,"");
                    drawPermission.className += " no" ;
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _handerChangeWhiteboardDeawPermission);
    };

    _handlerActiveToolLaser( toolKey , whiteboardInstance){
        const that = this ;
        const _handlerActiveToolLaserFromInner = (whiteboardInstance)=> {
            let whiteboardInstance_lc = whiteboardInstance.lc ;
            let containerElParent = whiteboardInstance_lc.containerEl.parentNode ;
            let temporaryDrawPermission = containerElParent.getElementsByClassName("temporary-draw-permission")[0];
            let laserMark =  containerElParent.getElementsByClassName("laser-mark")[0] ;
            if(toolKey === 'tool_laser'){
                whiteboardInstance.selectLaserTool = true ;
                whiteboardInnerUtils.removeEvent(temporaryDrawPermission , 'mousemove');
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseenter');
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseleave');
                temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/ cursor-none/g,"");
                temporaryDrawPermission.className += " cursor-none" ;
                whiteboardInstance.laserPosition =  whiteboardInstance.laserPosition  || {left:0 , top:0} ;
                whiteboardInnerUtils.addEvent(temporaryDrawPermission , 'mousemove' , function (e) {
                    let offset = {left:temporaryDrawPermission.offsetLeft , top:temporaryDrawPermission.offsetTop};
                    let x = e.pageX , y = e.pageY ;
                    let x1 , y1 ;
                    let markContainerWidth  = temporaryDrawPermission.clientWidth ;
                    let markContainerHeight = temporaryDrawPermission.clientHeight ;
                    switch (whiteboardInstance.rotateDeg){
                        case 0:
                            x1 = x - offset.left ;
                            y1 = y - offset.top  ;
                            break;
                        case 90:
                            x1 =  y - offset.top ;
                            y1 = markContainerHeight - (x - offset.left );
                            break;
                        case 180:
                            x1 = markContainerWidth - (x - offset.left ) ;
                            y1 = markContainerHeight - ( y - offset.top) ;
                            break;
                        case 270:
                            x1 = markContainerWidth - ( y - offset.top) ;
                            y1 = x - offset.left ;
                            break;
                        default:
                            x1 = x - offset.left ;
                            y1 = y - offset.top  ;
                            break
                    }
                    let left = x1 /  $(this).width() *100;
                    let top =  y1  /  $(this).height() *100;
                    laserMark.style.left = left+"%"  ;
                    laserMark.style.top = top+"%"  ;
                    clearTimeout(whiteboardInstance.laserTimer);
                    whiteboardInstance.laserTimer = setTimeout(function(){
                        if( whiteboardInstance.laserPosition && ( Math.abs( left - whiteboardInstance.laserPosition.left ) > 0.3 || Math.abs( top - whiteboardInstance.laserPosition.top )>0.3 ) ){
                            let parameter = {
                                laser:{
                                    left:left ,
                                    top:top
                                },
                                action:{
                                    actionName:"move"
                                }
                            };
                            whiteboardInstance.laserPosition = parameter.laser ;
                            that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                        }
                    },100);
                    return false;
                } );
                whiteboardInnerUtils.addEvent(containerElParent , 'mouseenter' , function (e) {
                    let parameter = {
                        action:{
                            actionName:"show"
                        }
                    };
                    that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                    laserMark.style.display = 'block';
                    return false;
                });
                whiteboardInnerUtils.addEvent(containerElParent , 'mouseleave' , function (e) {
                    let parameter = {
                        action:{
                            actionName:"hide"
                        }
                    };
                    that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                    laserMark.style.display = 'none';
                    return false;
                });
            }else{
                whiteboardInnerUtils.removeEvent(temporaryDrawPermission , 'mousemove');
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseenter');
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseleave');
                temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/ cursor-none/g,"");
                laserMark.style.display = 'none';
                if(whiteboardInstance.selectLaserTool){
                    let parameter = {
                        action:{
                            actionName:"hide"
                        }
                    };
                    that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                    whiteboardInstance.selectLaserTool = false ;
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _handlerActiveToolLaserFromInner);
    };

    /*发送白板数据信令给服务器*/
    _sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} = {}){
        if(whiteboardInstance.handler.sendSignallingToServer){
            let { currpage , fileid } = whiteboardInstance.filedata  ;
            let id = assignId || idPrefix + "###_"+signallingName+"_"+fileid+"_"+currpage , toID = "__allExceptSender" ;
            whiteboardInstance.handler.sendSignallingToServer(signallingName ,id , toID ,  data , do_not_save);
        }
    };

    /*发送白板数据信令给服务器*/
    _delSignallingToServer(whiteboardInstance , { idPrefix , data , signallingName , assignId  } = {}){
        if(whiteboardInstance.handler.delSignallingToServer){
            let { currpage , fileid } = whiteboardInstance.filedata  ;
            let id = assignId || idPrefix + "###_"+signallingName+"_"+fileid+"_"+currpage , toID = "__allExceptSender" ;
            whiteboardInstance.handler.delSignallingToServer(signallingName ,id , toID ,  data );
        }
    };

    /*发送白板消息给信令服务器*/
    _sendWhiteboardMessageToSignallingServer( whiteboardInstance ,  eventType , parameter ){
        const that = this ;
        let idPrefix , data  , signallingName   , assignId , do_not_save  , shapeData , testData;
        switch(eventType){
            case "shapeSaveEvent":
                shapeData  = LC.shapeToJSON(parameter.shape);
                if(shapeData!=null && shapeData.className != null && (shapeData.className == "LinePath" || shapeData.className == "ErasedLinePath" )){
                    shapeData.data.smoothedPointCoordinatePairs = null ;
                    delete shapeData.data.smoothedPointCoordinatePairs;
                    let tmpData = shapeData.data.pointCoordinatePairs ;
                    tmpData.forEach(function (item) {
                        item[0] = Math.round( item[0] )  ;
                        item[1] = Math.round(  item[1]  ) ;
                    });
                }
                testData  = {eventType:eventType , actionName:parameter.action.actionName , shapeId:parameter.shapeId , data:shapeData  };
                idPrefix = parameter.shapeId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                break;
            case "undoEvent" :
                if( parameter.action.actionName === "AddShapeAction" ){
                    let shapeId = parameter.action.shapeId ;
                    testData  = {eventType:eventType , actionName:parameter.action.actionName  , shapeId:shapeId  };
                    idPrefix = shapeId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined ;
                    that._delSignallingToServer(whiteboardInstance , { idPrefix , data , signallingName , assignId } );
                }else if(parameter.action.actionName === "ClearAction"){
                    let clearActionId = parameter.action.id ;
                    testData  = {eventType:eventType , actionName:parameter.action.actionName  , clearActionId:clearActionId  };
                    idPrefix = clearActionId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined ;
                    that._delSignallingToServer(whiteboardInstance , { idPrefix , data , signallingName , assignId } );
                }
                break ;
            case "redoEvent" :
                if( parameter.action.actionName === "AddShapeAction" ){
                    shapeData  = LC.shapeToJSON(parameter.action.shape);
                    if(shapeData!=null && shapeData.className != null && (shapeData.className == "LinePath" || shapeData.className == "ErasedLinePath" )){
                        shapeData.data.smoothedPointCoordinatePairs = null ;
                        delete shapeData.data.smoothedPointCoordinatePairs;
                        let tmpData = shapeData.data.pointCoordinatePairs ;
                        tmpData.forEach(function (item) {
                            item[0] = Math.round( item[0] )  ;
                            item[1] = Math.round(  item[1]  ) ;
                        });
                    };
                    let shapeId =  parameter.action.shapeId ;
                    testData  = {eventType:eventType  , actionName:parameter.action.actionName  , shapeId:shapeId ,  data:shapeData };
                    let idPrefix = shapeId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                    that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                }else if(parameter.action.actionName === "ClearAction"){
                    let clearActionId = parameter.action.id ;
                    testData  = {eventType:eventType , actionName:parameter.action.actionName , clearActionId:clearActionId };
                    idPrefix = clearActionId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                    that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                }
                break ;
            case "clearEvent":
                let clearActionId = parameter.clearActionId;
                testData  = {eventType:eventType , actionName:parameter.action.actionName , clearActionId:clearActionId};
                idPrefix = clearActionId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                break ;
            case "laserMarkEvent":
                let laserMarkId =  "laserMarkEvent";
                testData  = {eventType:eventType , actionName:parameter.action.actionName };
                if(parameter && parameter.laser){
                    testData.laser = parameter.laser
                }
                idPrefix = laserMarkId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = true ;
                that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                break ;
        };
    };

    /*更新白板字体*/
    _updateTextFont( whiteboardInstance , {fontSize = this.whiteboardToolsInfo.fontSize ,fontFamily = this.whiteboardToolsInfo.fontFamily,fontStyle = this.whiteboardToolsInfo.fontStyle , fontWeight = this.whiteboardToolsInfo.fontWeight} = {} ){
        /*：font-style | font-variant | font-weight | font-size | line-height | font-family */
        /*
         font:italic small-caps bold 12px/1.5em arial,verdana;  （注：简写时，font-size和line-height只能通过斜杠/组成一个值，不能分开写。）
         等效于：
         font-style:italic;
         font-variant:small-caps;
         font-weight:bold;
         font-size:12px;
         line-height:1.5em;
         font-family:arial,verdana;
         */
        const that = this ;
        const _updateTextFontFromInner = (whiteboardInstance) => {
            let tool = whiteboardInstance.lc.tool ;
            if(tool.name == "Text"){
                tool.font = fontStyle+" "+fontWeight+" "+fontSize+"px "+fontFamily;
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateTextFontFromInner);
    };

    /*更新橡皮宽度*/
    _updateEraserWidth(whiteboardInstance , {eraserWidth = this.whiteboardToolsInfo.eraserWidth} = {} ){
        const that = this ;
        const _updateEraserWidthFromInner = (whiteboardInstance) => {
            whiteboardInstance.lc.trigger( 'setStrokeWidth', eraserWidth );
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateEraserWidthFromInner);
    };

    /*更新画笔的宽度*/
    _updatePencilWidth(whiteboardInstance , {pencilWidth = this.whiteboardToolsInfo.pencilWidth}={} ){
        const that = this ;
        const _updateEraserWidthFromInner = (whiteboardInstance) => {
            whiteboardInstance.lc.trigger( 'setStrokeWidth', pencilWidth );
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateEraserWidthFromInner);
    };

    /*更新形状的宽度*/
    _updateShapeWidth(whiteboardInstance , {shapeWidth = this.whiteboardToolsInfo.shapeWidth}={} ){
        const that = this ;
        const _updateEraserWidthFromInner = (whiteboardInstance) => {
            whiteboardInstance.lc.trigger( 'setStrokeWidth', shapeWidth );
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateEraserWidthFromInner);
    };

    /*undo、redo、clear等动作是否禁用*/
    _actionIsDisable(whiteboardInstance){
        const that = this ;
        const _actionIsDisableFromInnner = (whiteboardInstance) => {
            if(whiteboardInstance.active){ //如果白板处于激活动态
                if(whiteboardInstance.lc.shapes.length === 0 ){ //白板没有画笔数据
                    let updateDescArray = [
                        ['action_clear' , {disabled:true} ] ,
                        ['tool_eraser' , {disabled:true} ] ,
                        ['tool_eyedropper' , {disabled:true} ]
                    ];
                    that._batchUpdateToolDesc(updateDescArray);
                }else{
                    let updateDescArray = [
                        ['action_clear' , {disabled:false} ] ,
                        ['tool_eraser' , {disabled:false} ] ,
                        ['tool_eyedropper' , {disabled:false} ]
                    ];
                    that._batchUpdateToolDesc(updateDescArray);
                }
                if( !whiteboardInstance.lc.canRedo() ){ //不能够redo
                    that._updateToolDesc('action_redo' , {disabled:true});
                }else{
                    that._updateToolDesc('action_redo' , {disabled:false});
                }
                if( ! whiteboardInstance.lc.canUndo()  ){ //不能够undo
                    that._updateToolDesc('action_undo' , {disabled:true});
                }else{
                    that._updateToolDesc('action_undo' , {disabled:true});
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _actionIsDisableFromInnner);
    };

    /*白板缩放比例决定其描述信息*/
    _zoomIsDisable(whiteboardInstance){
        const that = this ;
        const _zoomIsDisableFromInnner = (whiteboardInstance) => {
            if(whiteboardInstance.active){ //如果白板处于激活动态
                if(whiteboardInstance.whiteboardMagnification <= that.minMagnification ){
                    let updateDescArray = [
                        ['zoom_small' , {disabled:true} ] ,
                        ['zoom_default' , {disabled:true} ] ,
                    ];
                    that._batchUpdateToolDesc(updateDescArray);
                }else{
                    let updateDescArray = [
                        ['zoom_small' , {disabled:false} ] ,
                        ['zoom_default' , {disabled:false} ] ,
                    ];
                    that._batchUpdateToolDesc(updateDescArray);
                }
                if( whiteboardInstance.whiteboardMagnification >=  that.maxMagnification ){
                    that._updateToolDesc('zoom_big' , {disabled:true});
                }else{
                    that._updateToolDesc('zoom_big' , {disabled:false});
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _zoomIsDisableFromInnner);
    };

    /*自动遍历白板实例，如果实例没有则遍历所有实例执行处理*/
    _automaticTraverseWhiteboardInstance(whiteboardInstance , callback ){
        if(whiteboardInstance){
            if(callback && typeof callback === 'function'){
                callback(whiteboardInstance);
            }
        }else{
            for(let whiteboardInstance of Object.values(that.whiteboardInstanceStore) ){
                if(callback && typeof callback === 'function'){
                    callback(whiteboardInstance);
                }
            }
        }
    };


};
const  HandlerWhiteboardAndCoreInstance = new HandlerWhiteboardAndCore();
/*setTimeout( () => {

    HandlerWhiteboardAndCoreInstance.productionWhiteboard({whiteboardId:'test-whiteboard'});
    Log.error( HandlerWhiteboardAndCoreInstance );
} , 2000) ;*/
export default HandlerWhiteboardAndCoreInstance ;
