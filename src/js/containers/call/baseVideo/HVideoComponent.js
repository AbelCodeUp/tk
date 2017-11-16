/**
 * HVideoComponent 组件
 * @module HVideoComponent
 * @description   提供 HVideoComponent组件
 * @author xiagd
 * @date 2017/08/16
 */

'use strict';
import React  from 'react';
import TkGlobal from 'TkGlobal';
import Video from "../../../components/video/video";
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import WebAjaxInterface from 'WebAjaxInterface' ;
import CoreController from 'CoreController' ;
import ServiceTooltip from 'ServiceTooltip' ;
import { DragSource,DropTarget } from 'react-dnd';

const specSource = {
    beginDrag(props, monitor, component) {
        const { id, left, top, isDrag} = props;
        return { id, left, top, isDrag };
    },
    canDrag(props, monitor) {
        const { id } = props;
        if ((TkConstant.hasRole.roleStudent && props.isDrag == false) || TkConstant.hasRole.rolePatrol || !TkGlobal.classBegin ) {//视频没有拽出，是学生，则不能拖拽
            return false;
        }else {
            return true;
        }
    },
};

function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging(),
        isCanDrag:monitor.canDrag(),
    };
};

/*const specTarget = {

};*/

class HVideoComponent extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            classCss:'hvideo',
            userid:"",
            //display:'none',
            afterElementArray:[],
            buttonElementArray:[],
            studentElementArray:[],
            userNickName:'',
            giftnumber:this.props.giftnumber,
            raisehand:false,
            buttonsStyle:false,
        };
        this.btnIsHideOfDrag = {};//根据拖拽判断按钮是否隐藏
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount(){
        let that = this;
        let {id, isDrag} = that.props;
        let data = {message:{data:{isDrag:isDrag,extensionId:id}}};
        this.changeVideoBtnHide(data);
        that._init();
        eventObjectDefine.CoreController.dispatchEvent({type:'handleVideoDragListData',
            message:{data: TkGlobal.videoDragArray,},
        });
        /*eventObjectDefine.CoreController.dispatchEvent({type:'getOtherVideoInitfixed',
            message:{},
        });*/
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid ); //room-userproperty-changed事件-收到参与者属性改变后执行更新
        eventObjectDefine.CoreController.addEventListener( 'changeVideoBtnHide', that.changeVideoBtnHide.bind(that) ,that.listernerBackupid  );
        //eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        that._receviceStreamCompleted();
    }
    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
        that._receviceStreamCompleted();
    }
    changeVideoBtnHide(handledata) {
        let extensionId = handledata.message.data.extensionId;
        this.btnIsHideOfDrag[extensionId] = handledata.message.data.isDrag;
        let {buttonElementArray} = this.addUserData(this.props.stream);
        this.setState({
            buttonElementArray:buttonElementArray
        });
    };

    _receviceStreamCompleted(){
        this.props.receiveStreamCompleteCallback();
    }

    /*用户不存在缺省描述信息*/
    _productionDefaultDescInfo(stream){
        const that = this ;
        const userDescInfo =  {
            id:stream.getID(),
            disabled:false ,
            textContext:null ,
            order:0, //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-老师 ， 2-暂时未定）
            afterIconArray:[
                {
                    show:true ,
                    'className':'v-user-update-icon off' ,
                    'onClick':''
                } ,
                {
                    show:true ,
                    'className':'audio-icon off' ,
                    'onClick':''
                } ,
                {
                    show:true ,
                    'className':'video-icon off' ,
                    'onClick':''
                } ,
                {
                    show:true ,
                    'className':'pencil-icon off',
                    'onClick':''
                } ,{
                    show:true ,
                    'className':'hand-icon off',
                    'onClick':''
                } ,
            ]
        } ;

        userDescInfo.afterIconArray.length = 0 ;

        return userDescInfo ;
    };


    /*根据user生产用户描述信息*/
    _productionUserDescInfo(user){
        const that = this ;
        if (user == undefined )
            return ;
        const userDescInfo =  {
            id:user.id,
            textContext:user.nickname ,
            order:TkConstant.role.roleChairman?0:(TkConstant.role.roleTeachingAssistant?1:2), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-老师 ， 2-暂时未定）
            afterIconArray:[
                {
                    disabled:true,
                    show:true ,
                    'className':'v-user-pen ' + (user.candraw? 'on' : 'off') ,

                }  ,
                {
                    disabled:true,
                    show:user.hasaudio ,
                    'className':'v-device-microphone ' + ( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH  ) ?  'on' : 'off' ) + ' ' +( user.disableaudio ? 'disableaudio' : '') ,

                },
                {
                    disabled:true,
                    show:user.hasvideo ,
                    'className':'v-device-video ' + ( ( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'on' : 'off' )+ ' ' +( user.disablevideo ? 'disablevideo' : '') ,
                }
            ],
            buttonIconArray:[
                {
                    states:true,
                    disabled:false,
                    show:(user.candraw? 'no' : 'yes') ,
                    'className':'scrawl-btn',
                    'onClick':that.changeUserCandraw.bind(that,user.id),
                    title:user.candraw ?  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.on.title :  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.off.title,
                    isHide:(ServiceRoom.getTkRoom().getUser(user.id).role === TkConstant.role.roleTeachingAssistant?true:false),//如果是助教则隐藏
                } ,
                {
                    states:true,
                    disabled:false,
                    show:( user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? 'no' : 'yes')  ,
                    'className':'platform-btn',
                    'onClick':that.userPlatformUpOrDown.bind(that,user.id),
                    title: user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.up.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.down.title,
                    isHide:(that.btnIsHideOfDrag[user.id]?true:(ServiceRoom.getTkRoom().getUser(user.id).role === TkConstant.role.roleTeachingAssistant?true:false)),
                } ,
                {
                    states:user.hasaudio,
                    disabled:false,
                    show:(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH  ) ?  'no' : 'yes'  ,
                    'className':'audio-btn' ,
                    'onClick':that.userAudioOpenOrClose.bind(that,user.id),
                    title: user.disableaudio ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.disabled.title : (
                        user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH   ?
                            TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.off.title
                    ) ,
                    isHide:(that.btnIsHideOfDrag[user.id]?true:(ServiceRoom.getTkRoom().getUser(user.id).role === TkConstant.role.roleTeachingAssistant?true:false)),
                },
                {
                    states:true,
                    disabled:false,
                    show:'yes' ,
                    'className':'gift-btn' ,
                    'onClick':that.sendGiftToStudent.bind(that,user.id),
                    title:user.raisehand?TkGlobal.language.languageData.header.system.Raise.yesText : TkGlobal.language.languageData.header.system.Raise.noText,
                    isHide:(ServiceRoom.getTkRoom().getUser(user.id).role === TkConstant.role.roleTeachingAssistant?true:false),
                } ,
                {
                    states:true,
                    disabled:false,
                    show:'text' ,
                    'className':'restoreDrag-btn' ,
                    'onClick':that.initVideoDrag.bind(that,user.id),
                    title: TkGlobal.language.languageData.otherVideoContainer.button.restoreDrag.text,
                    isHide:(that.btnIsHideOfDrag[user.id]?false:true),
                } ,
            ],
            studentIconArray:[
                {
                    states:user.hasaudio,
                    show:(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH  ) ?  'no' : 'yes' ,
                    'className':'audio-btn',
                    'onClick':that.userAudioOpenOrClose.bind(that, user.id )
                } ,
                {
                    states:user.hasvideo,
                    show:( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'no' : 'yes',
                    'className':'video-btn' ,
                    'onClick':that.userVideoOpenOrClose.bind(that, user.id )
                }
            ],
            raisehand:user.raisehand,
        } ;

        if(!user.hasvideo && !user.hasaudio){
            userDescInfo.afterIconArray.length = 0 ;
            userDescInfo.buttonIconArray.length = 0 ;
        }
        return userDescInfo ;
    };

    //根据流获取user数据
    addUserData(stream) {

        let that = this;
        let userDescInfo={};
        //let afterElementArray = [],buttonElementArray = []  ;
        if (stream.getID() > 0 || stream.getID() === "local") {
            let userid = stream.extensionId;
            const user = ServiceRoom.getTkRoom().getUsers()[userid];
            userDescInfo = that._productionUserDescInfo(user);
            //that.setState({userDescInfo: userDescInfo});
        } else {
            //L.Logger.info('video productionDefaultDescInfo=',stream);
            //userDescInfo = that._productionDefaultDescInfo(stream);
            //that.setState({userDescInfo: userDescInfo});
        }

        //处理图标按钮状态
        let {afterElementArray,buttonElementArray,studentElementArray}= that.loadUserDataProps(userDescInfo);
        return{
            afterElementArray:afterElementArray,
            buttonElementArray:buttonElementArray,
            studentElementArray:studentElementArray
        }
    };



    /*加载视频需要的user props*/
    loadUserDataProps(userDescInfo){
        let that = this;
        let userid = "";
        //加载图标按钮
        //userid = userDescInfo.id;
        let {afterElementArray, buttonElementArray,studentElementArray} =this.loadIconArray(userDescInfo);

        return {
            afterElementArray,
            buttonElementArray,
            studentElementArray
        };
    };

    /*加载图标元素*/
    loadIconArray(userDescInfo){
        const afterElementArray = [], buttonElementArray = [],studentElementArray = [];
        const {id, textContext ,order , afterIconArray, buttonIconArray,studentIconArray,raisehand} = userDescInfo ;
        //this.btnIsHideOfDrag[id] = false;

        this.setState({
            userNickName:textContext
        });

        this.setState({
            raisehand:raisehand
        });

        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){
            this.setState({
                buttonsStyle:true
            });
        }

        if(afterIconArray){
            afterIconArray.forEach( (value , index) =>{
                //value.attrJson = value.attrJson || {} ;
                const {disabled ,show ,className, onClick  } = value ;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                if(show) {
                    const iconTemp = <button key={index}
                                             className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                             onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                             disabled={disabled ? disabled : undefined} id={id + "" + index}></button>;
                    afterElementArray.push(iconTemp)
                }

            });
        }

        if(buttonIconArray){

            buttonIconArray.forEach( (value , index) =>{
                //value.attrJson = value.attrJson || {} ;
                if(!TkGlobal.classBegin){return;};
                const {states,disabled ,show ,className, onClick, title,isHide  } = value ;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                if(states) {
                    let buttonName = className.split("-");
                    const iconTemp = <button key={index}
                                             className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                             onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                             disabled={disabled ? disabled : undefined}
                                             style={{display:isHide?'none':'block'}}
                                             id={id + "" + index}>{TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][show]} </button>;
                    buttonElementArray.push(iconTemp);
                }

            });
        }

        if(studentIconArray){

            studentIconArray.forEach( (value , index) => {
                if(!TkGlobal.classBegin)
                    return;
                //value.attrJson = value.attrJson || {} ;
                //L.Logger.info('video loadIconArray value=', value);
                const {states,show, className, onClick} = value;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                if(states){
                    if(className == 'audio-btn' || className === 'video-btn' ){
                        let buttonName = className.split("-");
                        const iconTemp = <button key={index}
                                                 className={''+ (className ? className : '')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined}>{TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][show]}</button>;
                        //L.Logger.info('video loadIconArray =', iconTemp);

                        studentElementArray.push(iconTemp)
                    }
                }
            });
        }

        return {
            afterElementArray,
            buttonElementArray,
            studentElementArray
        }
    }

    //*用户功能-上下讲台信令的发送*/
    userPlatformUpOrDown(userid){
        let that = this;
        //if(that.state.userid> 0 || that.state.userid === 'local') {
            ServiceSignalling.userPlatformUpOrDown(userid)
        //}
    }

    /*用户功能-打开关闭音频*/
    userAudioOpenOrClose(userid){

        let that = this;
        //if(that.state.userid> 0 || that.state.userid === 'local') {
            ServiceSignalling.userAudioOpenOrClose(userid)
        //}
    }

    /*用户功能-打开关闭视频*/
    userVideoOpenOrClose(userid){

        let that = this;
        //if(that.state.userid> 0 || that.state.userid === 'local') {
            ServiceSignalling.userVideoOpenOrClose(userid)
        //}
    }

    /*改变用户的画笔权限*/
    changeUserCandraw(userid){

        let that = this;
        //if(that.state.userid> 0 || that.state.userid === 'local') {
            ServiceSignalling.changeUserCandraw(userid)
        //}
    }

    //给学生发送礼物
    sendGiftToStudent(userid){
        let user = ServiceRoom.getTkRoom().getUsers()[userid]; //根据userid获取用户信息
        let message = {
            textBefore:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.aloneGift.before ,
            textMiddle:user.nickname  ,
            textAfter:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.aloneGift.after  ,
        };
        let allGiftMessage = `<span class="add-fl" >${message.textBefore}</span><span class="gift-username add-nowrap add-fl"  style="color:#4468d0;max-width: 2rem;" >&nbsp;${message.textMiddle}&nbsp;</span><span class="add-fl">${message.textAfter}</span>`;
        ServiceTooltip.showConfirm(allGiftMessage , function (answer) {
            if(answer){
                if( CoreController.handler.getAppPermissions('giveAloneUserSendGift') ){
                    let userIdJson = {};
                    if(user.role === TkConstant.role.roleStudent){ //如果是学生，则发送礼物
                        let userId = user.id;
                        let userNickname = user.nickname ;
                        userIdJson[userId] = userNickname ;
                        WebAjaxInterface.sendGift(userIdJson);
                    }
                }
            }
        });
    };


    _init(){
        let that = this;

        let {afterElementArray,buttonElementArray,studentElementArray} = that.addUserData(that.props.stream);
        this.setState({
            afterElementArray:afterElementArray
        });
        this.setState({
            buttonElementArray:buttonElementArray
        });
        this.setState({
            studentElementArray:studentElementArray
        });
    }


    /*处理room-userproperty-changed事件*/
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user = roomUserpropertyChangedEventData.user ;
        if(!that.props.stream || that.props.stream.extensionId !== user.id ){
            return;
        }

        let giftnumber = user.giftnumber;
         for( let [key , value] of Object.entries(changePropertyJson) ){
             if(key === 'publishstate' || key === 'disablevideo' ){ //发布状态改变时显示或者隐藏video
                 if( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ||  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) && !user.disablevideo  ){
                     that.props.stream.show();
                 }else{
                     that.props.stream.hide();
                 }
             }
            if( key !== 'giftnumber' ){
                if(!that.props.stream)
                    return;
                /*this.setState({
                    giftnumber:giftnumber
                });*/

                let {afterElementArray,buttonElementArray,studentElementArray} = that.addUserData(that.props.stream);
                this.setState({
                    afterElementArray:afterElementArray
                });
                this.setState({
                    buttonElementArray:buttonElementArray
                });
                this.setState({
                    studentElementArray:studentElementArray
                });
            } else if(key == 'giftnumber'){

                this.setState({
                    giftnumber:value
                });
            }
        }
    };
    initVideoDrag() {
        let {id,isDrag} = this.props;
        if (isDrag) {
            const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
            let lcVideoContainer = document.getElementById('main_content_tool_lc_video_container');
            let otherVideoWidth = (lcVideoContainer.clientWidth/defalutFontSize) / 6 - 0.15;
            eventObjectDefine.CoreController.dispatchEvent({
                type:'dblclickChangeOtherVideoStyle',
                message:{
                    id:id,
                    top:0,
                    left:0,
                    isDrag:false,
                },
            });
        }
    };

    otherVideoOndblclick(){
        let {id,isDrag,left,top} = this.props;
        if (TkConstant.hasRole.roleStudent) {return};
        if (isDrag) {
            this.initVideoDrag();
        }else {
            const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
            let contentEle = document.getElementById("content");
            let otherVideoEle = document.getElementById(id);
            let contentEleW = contentEle.clientWidth;
            let contentEleH = contentEle.clientHeight;
            const translateX = (contentEleW-otherVideoEle.clientWidth)*Math.random();
            const translateY = (contentEleH-otherVideoEle.clientHeight)*Math.random();
            let otherVideoLeft = translateX/(contentEleW-otherVideoEle.clientWidth);
            let otherVideoTop = translateY/(contentEleH-otherVideoEle.clientHeight);


            eventObjectDefine.CoreController.dispatchEvent({
                type:'dblclickChangeOtherVideoStyle',
                message:{
                    id:id,
                    top:otherVideoTop,
                    left:otherVideoLeft,
                    isDrag:true,
                },
            });
        }
    };

    layerIsShowOfIsDraging(isDragging) {
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
    }
    getOtherVideoWH() {
        const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        let lcVideoContainer = document.getElementById('main_content_tool_lc_video_container');
        let otherVideoWidth = ((lcVideoContainer.clientWidth/defalutFontSize) / 6 - 0.15);
        let otherVideoHeight = otherVideoWidth*3/4 + 'rem';
        otherVideoWidth = otherVideoWidth + 'rem';
        return {otherVideoWidth,otherVideoHeight};
    };
    getOtherVideoLT(left,top) {
        const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        let content = document.getElementById('content');
        let lcVideoContainer = document.getElementById('main_content_tool_lc_video_container');
        let otherVideoWidth = ((lcVideoContainer.clientWidth) / 6 - 0.15*defalutFontSize);
        let otherVideoHeight = otherVideoWidth*3/4;
        let contentW = content.clientWidth;
        let contentH = content.clientHeight;
        let otherVideoLeft = left*(contentW - otherVideoWidth)/defalutFontSize;
        let otherVideoTop = top*(contentH - otherVideoHeight)/defalutFontSize;
        return {otherVideoLeft,otherVideoTop};

    };


    render(){
        let that = this;
        const {connectDragSource,isDragging,left,top,id,isDrag,isCanDrag} = that.props;
        that.layerIsShowOfIsDraging(isDragging);
        let {otherVideoLeft,otherVideoTop} = that.getOtherVideoLT(left,top);

        //let {afterElementArray,buttonElementArray} = that.addUserData(that.props.stream);
        let afterElementArray = that.state.afterElementArray;
        let buttonElementArray = that.state.buttonElementArray;
        let studentElementArray = that.state.studentElementArray;
        let giftnumber = that.state.giftnumber;

        let assistantFlag = (that.props.stream.extensionId!==undefined && ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId)!==undefined && ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId).role === TkConstant.role.roleTeachingAssistant)?true:false;
        let buttonsStyle = !TkGlobal.classBegin?'none':((assistantFlag&&that.btnIsHideOfDrag[id] == false)?'none':that.state.buttonsStyle?'':'none');
        let raisehand = !buttonsStyle && that.state.raisehand?'block':'none';
        let userNickName = that.state.userNickName;
        //let studentButton = that.state.buttonsStyle?'none':'';
        let studentButton =  !TkGlobal.classBegin?'none':(that.props.stream.extensionId == ServiceRoom.getTkRoom().getMySelf().id?'':'none');
        /*<div className="stretch-video" style={{border:isDrag?'0.1rem solid #fff':'none'}}>*/
        return connectDragSource(
            <li id={id} className={"video-permission-container"} onDoubleClick={that.otherVideoOndblclick.bind(that)}
                style={{cursor:"move",top:otherVideoTop + 0.49-0.09 + 'rem',left:otherVideoLeft + 0.5-0.12 + 'rem',position:isDrag?'fixed':'',width:isDrag?that.getOtherVideoWH().otherVideoWidth:'calc(100% / 6 - 0.15rem )',height:isDrag?that.getOtherVideoWH().otherVideoHeight:'100%'}}>
                <div  className="video-wrap video-participant-wrap video-other-wrap add-position-relative" >
                    {this.props.stream.getID()>0 || this.props.stream.getID()=='local'?<Video stream={this.props.stream} classCss={this.state.classCss} ></Video>:undefined }
                    <div className="v-name-wrap clear-float other-name " >
                        <span className="v-name add-nowrap add-fl"  >
                            {userNickName}
                            <span className="gift-icon"></span>X
                            <span className="gift-num">{giftnumber}</span>
                        </span>
                        <span className="v-device-open-close add-fr clear-float">
                            {afterElementArray}
                        </span>
                    </div>
                    <div className="gift-show-container " style={{display: assistantFlag?'none':''}}>
                        <span className="gift-icon"></span>
                        <span className="gift-num">{giftnumber}</span>
                    </div>
                    <div className="video-hover-function-container" style={{display:!isCanDrag?"none":buttonsStyle}}>
                        <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } }  >
                            {buttonElementArray}
                        </span>
                    </div>
                    <div className="video-student-set-container" style={{display:that.btnIsHideOfDrag[id] == true?"none":(!isCanDrag&&assistantFlag?"none":studentButton)}}>
                        <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } }  >
                            {studentElementArray}
                        </span>
                    </div>
                </div>
                <div className="video-participant-raise-btn add-position-absolute-top0-right0"  style={{display: raisehand}}>
                    <span className="raise-img"></span>
                </div>
            </li>

        )
    };
};
/*const HVideoComponentDragTarget = DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(HVideoComponent);*/
export  default DragSource('talkDrag', specSource, collect)(HVideoComponent);

/*const HVideoComponentDragSource = DragSource('talkDrag', specSource, collect)(HVideoComponent);
export  default  DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(HVideoComponentDragSource) ;*/

