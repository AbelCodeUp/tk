/**
 * videoContainer 组件
 * @module videoContainer
 * @description   提供 VideoContainer组件
 * @author xiagd
 * @date 2017/08/12
 */

'use strict';
import React  from 'react';
import TkGlobal from 'TkGlobal';
import Video from "../../../components/video/video";
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import WebAjaxInterface from 'WebAjaxInterface' ;
import CoreController from 'CoreController' ;
import ServiceTooltip from 'ServiceTooltip' ;


class VVideoComponent extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            classCss:'vvideo',
            userid:"",
            display:'none',
            afterElementArray:[],
            buttonElementArray:[],
            studentElementArray:[],
            userNickName:'',
            giftnumber:this.props.giftnumber,
            raisehand:false,
            buttonsStyle:false,
            studentStyle:false,
            giftnumberStyle:true
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount(){
        let that = this;
        that._init();
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid ); //room-userproperty-changed事件-收到参与者属性改变后执行更新
        //eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令

        that._receviceStreamCompleted();
    };

    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
        that._receviceStreamCompleted();
    }
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
                    show:'no' ,
                    'className':'scrawl-btn',
                    'onClick':that.changeUserCandraw.bind(that)
                } ,
                {
                    show:'no' ,
                    'className':'platform-btn',
                    'onClick':that.userPlatformUpOrDown.bind(that)
                } ,
                {
                    show:'no' ,
                    'className':'audio-btn' ,
                    'onClick':that.userAudioOpenOrClose.bind(that)
                } ,
                {
                    show:'no' ,
                    'className':'video-btn' ,
                    'onClick':that.userVideoOpenOrClose.bind(that)
                } ,
                {
                    show:'no' ,
                    'className':'gift-btn',
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
        const userDescInfo =  {
            id:user.id,
            disabled:false ,
            textContext:user.nickname ,
            order:user.role === TkConstant.role.roleStudent ? 0 : ( user.role === TkConstant.role.roleChairman?1:user.role === TkConstant.role.roleTeachingAssistant?2:3), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-老师 ， 2-暂时未定）
            afterIconArray:[
                {
                    disabled:true,
                    show:true ,
                    'className':'v-user-pen ' + (user.candraw? 'on' : 'off') ,

                } ,
                {
                    disabled:true,
                    show:user.hasaudio  ,
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
                    show:user.candraw? 'no' : 'yes' ,
                    'className':'scrawl-btn' ,
                    'onClick':that.changeUserCandraw.bind(that, user.id )
                } ,
                {
                    states:true,
                    show:user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? 'no' : 'yes'  ,
                    'className':'platform-btn',
                    'onClick':that.userPlatformUpOrDown.bind(that, user.id )
                } ,
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
                } ,{
                    states:true,
                    show:'yes'  ,
                    'className':'gift-btn',
                    'onClick':that.sendGiftToStudent.bind(that,user.id),
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
            //userDescInfo.afterIconArray.length = 0 ;
            //userDescInfo.buttonIconArray.length = 0 ;
        }
        return userDescInfo ;
    };

    //根据流获取user数据
    addUserData(stream) {
        //L.Logger.info('video addUserData=',this.state.userid);
        let that = this;
        let userDescInfo={};
        if (stream.getID() > 0 || stream.getID() === "local") {
            let userid = stream.extensionId;
            const user = ServiceRoom.getTkRoom().getUsers()[userid];


            if(!user)       //什么情况下获取不到用户
                return;
            userDescInfo = that._productionUserDescInfo(user);
            //that.setState()
            //that.setState({userDescInfo: userDescInfo});
        } /*else {
            L.Logger.info('video productionDefaultDescInfo=',stream);
            userDescInfo = that._productionDefaultDescInfo(stream);
            //that.setState({userDescInfo: userDescInfo});
        }*/

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
        //L.Logger.info('video userData 456=',userDescInfo);

        let userid = "";

        //加载图标按钮

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

        const {id,disabled , textContext ,order , afterIconArray ,buttonIconArray,studentIconArray,raisehand} = userDescInfo ;

        //L.Logger.info('vvideo loadIconArray iconArraye=',order);
        this.setState({
            userNickName:textContext
        });

        this.setState({
            raisehand:raisehand
        });

        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){//除了学生都隐藏
            this.setState({
                buttonsStyle:true
            });
        }

        if(afterIconArray){
            afterIconArray.forEach( (value , index) =>{
                //value.attrJson = value.attrJson || {} ;
                const {disabled ,show ,className, onClick  } = value ;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                //老师为1
                if ((order == 1 || order == 2) && (className.indexOf('v-device-video') != -1 || className.indexOf('v-device-microphone') == -1 )) {
                    const iconTemp = <button key={index}
                                             className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                             onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                             disabled={disabled ? disabled : undefined} id={id + "" + index}></button>;
                    afterElementArray.push(iconTemp)
                }  else if(order == 0) {  //学生为0
                    if(show){
                        const iconTemp = <button key={index}
                                                 className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                                 disabled={disabled ? disabled : undefined} id={id + "" + index}></button>;
                        afterElementArray.push(iconTemp)
                    }
                }

            });

        }

        if(buttonIconArray){
            buttonIconArray.forEach( (value , index) => {
                if(!TkGlobal.classBegin)
                    return;

                const {states,show, className, onClick} = value;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;

                //老师为1
                if(states){
                    if ((order == 1 || order == 2) && (className === 'audio-btn' || className === 'video-btn' )){

                        let buttonName = className.split("-");
                        const iconTemp = <button key={index}
                                                 className={"" + (className ? className : '')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined}> {TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][show]} </button>;
                        //L.Logger.info('video loadIconArray =', iconTemp);

                        buttonElementArray.push(iconTemp)
                    } else if((order == 0)  && (className != 'video-btn' )){  //学生为0
                        let buttonName = className.split("-");
                        const iconTemp = <button key={index}
                                                 className={''+ (className ? className : '')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined}>{TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][show]}</button>;
                        //L.Logger.info('video loadIconArray =', iconTemp);

                        buttonElementArray.push(iconTemp)
                    }
                }

            });
        }

        if(studentIconArray){
            studentIconArray.forEach( (value , index) => {
                if(!TkGlobal.classBegin)
                    return;
                const {states,show, className, onClick} = value;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                if(states) {
                    //老师为1
                    if ((order == 1 || order === 2) && (className === 'audio-btn' || className === 'video-btn' )) {

                    } else if ((order == 0) && (className == 'audio-btn' || className === 'video-btn' )) {  //学生为0
                        let buttonName = className.split("-");
                        const iconTemp = <button key={index}
                                                 className={'' + (className ? className : '')}
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
        ServiceSignalling.userPlatformUpOrDown(userid);
    }

    /*用户功能-打开关闭音频*/
    userAudioOpenOrClose(userid){
        ServiceSignalling.userAudioOpenOrClose(userid);
    }

    /*用户功能-打开关闭视频*/
    userVideoOpenOrClose(userid){
        ServiceSignalling.userVideoOpenOrClose(userid);
    }

    /*改变用户的画笔权限*/
    changeUserCandraw(userid){
        ServiceSignalling.changeUserCandraw(userid);
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
    }


    //视频加载完发送消息
    receiveStreamComplete(){
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:true} });
    }

    _init(){
       // L.Logger.info('video _init=',this.state.userid);
        let that = this;
        if(!that.props.stream)
            return;

        let {afterElementArray,buttonElementArray,studentElementArray} = that.addUserData(that.props.stream);
        this.setState({
            afterElementArray:afterElementArray,
            buttonElementArray:buttonElementArray,
            studentElementArray:studentElementArray
        });
        /*this.setState({
            buttonElementArray:buttonElementArray
        });
        this.setState({
            studentElementArray:studentElementArray
        });*/
    }


    /*处理room-userproperty-changed事件*/
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){

        //L.Logger.info('video handlerRoomUserpropertyChanged=',this.state.userid);
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user = roomUserpropertyChangedEventData.user ;

        if(!that.props.stream || that.props.stream.extensionId !== user.id ){
            return;
        };

        for( let [key , value] of Object.entries(changePropertyJson) ){
            if(key === 'publishstate' || key === 'disablevideo' ){ //发布状态改变时显示或者隐藏video

                if( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ||  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) && !user.disablevideo  ){
                    that.props.stream.show();

                    this.setState({
                        giftnumberStyle:false
                    });
                }else{
                    that.props.stream.hide();
                    this.setState({
                        giftnumberStyle:true
                    });
                }
            }
            if( key !== 'giftnumber' ){
                if(that.props.stream.extensionId === user.id){
                    if(!that.props.stream)
                        return;
                    let {afterElementArray,buttonElementArray,studentElementArray} = that.addUserData(that.props.stream);
                    this.setState({
                        afterElementArray:afterElementArray,
                        buttonElementArray:buttonElementArray,
                        studentElementArray:studentElementArray
                    });
                    /*this.setState({
                        buttonElementArray:buttonElementArray
                    });
                    this.setState({
                        studentElementArray:studentElementArray
                    });*/
                }
            } else if(key == 'giftnumber'){

                this.setState({
                    giftnumber:value
                });
            }
        }
    };


    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        that._clearElementArray(); //清空所有元素描述数组
    };


    handlerRoomDisconnected(recvEventData){
        const that = this ;
        that._clearElementArray();//清空所有元素描述数组
    };

    /*清空所有元素描述数组*/
    _clearElementArray(){
        const that = this ;
        let afterElementArray=that.state.afterElementArray;
        let buttonElementArray = that.state.buttonElementArray;
        let studentElementArray = that.state.studentElementArray;
        afterElementArray.length = 0 ;//清空数组
        buttonElementArray.length = 0 ;//清空数组
        studentElementArray.length = 0 ;//清空数组

        this.setState({
            afterElementArray:afterElementArray,
            buttonElementArray:buttonElementArray,
            studentElementArray:studentElementArray
        });
    };

    render(){
        let that = this;
        let afterElementArray = that.state.afterElementArray;
        let buttonElementArray = that.state.buttonElementArray;
        let studentElementArray = that.state.studentElementArray;
        let giftnumber = that.state.giftnumber;

        let assistantFlag = that.props.stream.extensionId!==undefined &&  ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId) !== undefined && ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId).role === TkConstant.role.roleTeachingAssistant?true:false;
        let buttonsStyle = CoreController.handler.getAppPermissions('teacherVframeBtnIsShow')?"":"none";
        let raisehand = (!buttonsStyle && that.props.classCss.indexOf("video-hearer-wrap")!= -1 && that.state.raisehand)?'block':'none';

        if (TkConstant.hasRole.roleTeachingAssistant && that.props.classCss.indexOf("video-hearer-wrap")==-1) {//如果是助教并且是老师视频框
            assistantFlag&&TkGlobal.classBegin?buttonsStyle = "":buttonsStyle = "none";
        }
        let studentStyle = this.props.showGift?((that.props.classCss.indexOf("video-hearer-wrap")==-1)?"none":"block"):"none";
        let userNickName = that.state.userNickName;
        let studentButton = CoreController.handler.getAppPermissions('studentVframeBtnIsHide')?"none":"";

        return (
            <div id={'video_container_'+this.props.stream.extensionId} className={this.props.classCss}  onDoubleClick={that.props.handlerOnDoubleClick.bind(that) } > {/*老师类名:video-chairman-wrap*/}
                <div data-video="false"  className="video-permission-container add-position-relative clear-float">
                    <div  className="video-wrap  participant-right video-participant-wrap add-position-relative" >
                        {this.props.stream.getID()>0 || this.props.stream.getID()=='local'?<Video stream={this.props.stream} classCss={this.state.classCss} ></Video>:undefined }
                        <div className="v-name-wrap clear-float other-name " >
                            <span className="v-name add-nowrap add-fl"  >{userNickName}</span>
                            <span className="v-device-open-close add-fr clear-float"  style={{display: studentStyle}}>
                                {afterElementArray}
                            </span>
                        </div>
                        <div className="gift-show-container"  style={{display: studentStyle}} >
                            <span className="gift-icon"></span>
                            <span className="gift-num">{giftnumber}</span>
                        </div>
                        <div className="video-hover-function-container"  style={{display:buttonsStyle}} >
                            <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } } >
                                {buttonElementArray}
                            </span>
                        </div>
                        <div className="video-student-set-container" style={{display:studentButton}}>
                            <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } }  >
                                 {studentElementArray}
                            </span>
                        </div>
                    </div>
                    <div className="video-participant-raise-btn add-position-absolute-top0-right0"  style={{display: raisehand}}>
                        <span className="raise-img"></span>
                    </div>
                </div>
            </div>
        )
    };
};


export  default  VVideoComponent;
