/**
 * 检测设备-检测主界面的Smart组件
 * @module MainDetectionDeviceSmart
 * @description   提供检测设备-检测主界面的Smart组件
 * @author QiuShao
 * @date 2017/08/18
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import HandlerDetectionDevice from "./handler/handlerDetectionDevice" ;
import ReactSlider from "react-slider" ;

class MainDetectionDeviceSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:false ,
            selectShow:{
                videoinput:false ,
                audioinput:false ,
                audiooutput:false
            },
            devicesDesc:{
                videoinput:{},
                audioinput:{},
                audiooutput:{}
            },
            selectDevice:{
                videoinput: undefined,
                audioinput: undefined,
                audiooutput: undefined
            },
            audiooutputVolume:100 ,
            //xueln 添加
            isBroadcastClient:TkGlobal.isBroadcastClient

         
        };
      
       
        this.selectDevice = {
            videoinput: undefined,
            audioinput: undefined,
            audiooutput: undefined
        };
        this.deviceLabelMap = {
            videoinput:{
                default:TkGlobal.language.languageData.alertWin.settingWin.defult.text ,
                defaultLabel:TkGlobal.language.languageData.alertWin.settingWin.videoInput.text ,
                notDevice:TkGlobal.language.languageData.login.language.detection.selectOption.noCam
            },
            audioinput:{
                default:TkGlobal.language.languageData.alertWin.settingWin.defult.text ,
                defaultLabel:TkGlobal.language.languageData.alertWin.settingWin.audioInput.text ,
                notDevice:TkGlobal.language.languageData.login.language.detection.selectOption.noMicrophone
            },
            audiooutput:{
                default:TkGlobal.language.languageData.alertWin.settingWin.defult.text ,
                defaultLabel:TkGlobal.language.languageData.alertWin.settingWin.audioOutput.text ,
                notDevice:TkGlobal.language.languageData.login.language.detection.selectOption.noEarphones
            },
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;
     
       
       	HandlerDetectionDevice.addOndevicechange(that.handlerAddOndevicechange.bind(that));
        //注册执行检测界面的事件，调用检测界面的方法detectionDeviceHandlerExecute()
        eventObjectDefine.CoreController.addEventListener( "mainDetectionDevice" , that.handlerMainDetectionDevice.bind(that) ,  that.listernerBackupid   );
   		
   		
   		
   		
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this;
        HandlerDetectionDevice.exitDetectionDevicePage();
        HandlerDetectionDevice.removeOndevicechange();
        that._stepExecuteStopOrClear(3);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerAddOndevicechange(){
        this._enumerateDevices();
    };

    handlerMainDetectionDevice(recvEventData){
        const that = this ;
        that._loadSelectShow('videoinput' , true);
        that.setState({show:true});
        that._enumerateDevices();
       
    };

    /*下一步按钮的点击事件*/
    nextButtonOnClick(selectKey , selectValue = true , step){
        const that = this ;
        that._stepExecuteStopOrClear(step);
        that._loadSelectShow(selectKey , selectValue) ;       
    };

    /*确定按钮的点击事件*/
    okButtonOnClick(step){
        const that = this ;
        let {handlerOkCallback , saveLocalStorage=true} = that.props ;
        HandlerDetectionDevice.exitDetectionDevicePage();
        HandlerDetectionDevice.removeOndevicechange();
        that._stepExecuteStopOrClear(step);
        if(saveLocalStorage){
            for(let [deviceKind,deviceId] of Object.entries(that.selectDevice)){
                localStorage.setItem(L.Constant.deviceStorage[deviceKind],deviceId);
            }
        }
        eventObjectDefine.CoreController.dispatchEvent({type:'detectionDeviceFinsh' , message:{clearFinsh:that.props.clearFinsh}});
        if(handlerOkCallback && typeof handlerOkCallback === 'function'){
            handlerOkCallback(that.selectDevice);
        }
        that._resetDefaultStateAndData();
               
    };
    closeButtonOnClick(step) {
        const that = this ;
        HandlerDetectionDevice.exitDetectionDevicePage();
        HandlerDetectionDevice.removeOndevicechange();
        that._stepExecuteStopOrClear(step);
        eventObjectDefine.CoreController.dispatchEvent({type:'detectionDeviceFinsh' , message:{clearFinsh:that.props.clearFinsh}});
        that._resetDefaultStateAndData();
    };
    
    /*播放音乐*/
    playAudioToAudiooutput(audioId = 'music_audio', play = true){
        let $audio = $("#"+audioId) ;
        if($audio && $audio.length>0){
            if(play){
                $audio[0].play();
            }else{
                $audio[0].pause();
            }
        }
    };
	
    /*改变选中的设备*/
    changeSelectDeviceOnChange(deviceKind , event){
    	const that = this ;

    		
        let deviceId =  event.target.value ;
        that._changeStateSelectDevice(deviceKind , deviceId);
        that._deviceSwitch(deviceKind);
    	
        
    };

    /*处理音量改变事件*/
    handerVolumeOnAfterChange(volume){
        document.getElementById('music_audio').volume = volume/100 ;
        this.setState({audiooutputVolume:volume});
    };

    handerVolumeOnBeforeChange(volume){
    };


    /*加载选中的检测界面显示*/
    _loadSelectShow(selectKey , selectValue){
        for( let key of Object.keys(this.state.selectShow) ){
            if(key === selectKey ){
                this.state.selectShow[key] = selectValue ;
            }else{
                this.state.selectShow[key] = false ;
            }
        }
        this._checkSelectDevice();
        this.setState({selectShow:this.state.selectShow});
        this._deviceSwitch(selectKey);
    };

    _enumerateDevices(){
        const that = this ;
        HandlerDetectionDevice.enumerateDevices( (deviceInfo) => {
            that._changeDeviceElementDesc(deviceInfo);
            that._selectShowToDeviceSwitch();
            that._checkSelectDevice();
        });
        
    };

    /*根据枚举设备信息更改设备的描述信息*/
    _changeDeviceElementDesc(deviceInfo){
        const that = this ;
        let { devices ,useDevices , hasdevice } = deviceInfo ;
        let devicesDesc = {
            videoinput:{},
            audioinput:{},
            audiooutput:{}
        };
        let deviceNumJson = {
            videoinput:0 ,
            audioinput:0 ,
            audiooutput:0
        };
        for( let [key , value] of Object.entries(devices) ){
            value.map( (device , index) => {
                devicesDesc[key][device.deviceId] = {
                    deviceId: device.deviceId ,
                    groupId: device.groupId ,
                    kind: device.kind ,
                    label: device.label || (  device.deviceId === "default" ? that.deviceLabelMap[key].default :  that.deviceLabelMap[key].defaultLabel + ( ++deviceNumJson[key] ) ) ,
                    select: that.selectDevice[key]=== device.deviceId ||  useDevices[key] === device.deviceId
                }
            });
        }
        that.setState({devicesDesc:devicesDesc});
    };

    /*加载设备的节点数组*/
    _loadDeviceElementByDeviceDescArray(devicesDesc){
        const that = this ;
        let devicesElementInfo = {
            audioinputElementArray:[] ,
            audiooutputElementArray:[] ,
            videoinputElementArray:[] ,
        };
        for(let [deviceKind,deviceDescJson] of Object.entries(devicesDesc) ){
            for(let  deviceDesc of Object.values(deviceDescJson) ){
                let { deviceId ,groupId , kind , label , select } = deviceDesc ;
                if(select){
                    that.selectDevice[kind] = deviceId ;
                }
                devicesElementInfo[deviceKind+'ElementArray'].push(
                    <option key={deviceKind+'_'+deviceId}  data-deviceId={deviceId}  data-groupId={groupId}  data-kind={kind}  data-label={label}  value={deviceId}  > {label}</option>
                );
            }
        }
        for( let [key , value] of Object.entries(devicesElementInfo) ){
            if(value.length === 0){ //没有设备
                let  deviceId = undefined ,groupId = undefined , kind = key.replace(/ElementArray/g,'') , label = that.deviceLabelMap[kind].notDevice, select = true ;
                if(select){
                    that.selectDevice[kind] = deviceId ;
                }
                devicesElementInfo[key].push(
                    <option key={key}    data-deviceId={deviceId} data-groupId={groupId}  data-kind={kind}  data-label={label} value={deviceId}  > {label} </option>
                );
            }
        }
        return devicesElementInfo ;
    };

    _selectShowToDeviceSwitch(){ 
        const that = this ;
        for(let [key , value] of  Object.entries(that.state.selectShow) ){
            if(value){
                that._deviceSwitch(key);
            }
        }
    };

    _deviceSwitch(deviceKind){
        const that = this ;
        if(!that.selectDevice[deviceKind]){
            L.Logger.warning('deviceSwitch deviceId is not exist from selectDevice!');
            return ;
        }
        if(!that.state.selectShow[deviceKind]){
            L.Logger.warning('deviceSwitch deviceId is not exist from selectShow!');
            return;
        }
        switch (deviceKind){
            case 'videoinput':
            	//xueln add
            	if(that.state.isBroadcastClient){
            	
            		HandlerDetectionDevice.videoSourceChangeHandlerFromClient(that.selectDevice[deviceKind],{
	            		"elementId":"videoinput_video_stream"
	            	});
            	}else{
		   			HandlerDetectionDevice.videoSourceChangeHandler({deviceId:that.selectDevice[deviceKind]  , videoinputVideoElementId:'videoinput_video_stream' });
				}
                break;
            case 'audioinput': 
				
				if(that.state.isBroadcastClient){
            		
            		HandlerDetectionDevice.audioSourceChangeHandlerFromClient(that.selectDevice[deviceKind]);
            	}else{
            		HandlerDetectionDevice.audioSourceChangeHandler({deviceId:that.selectDevice[deviceKind]  , audioinputAudioElementId:'audioinput_audio_stream'   , audioinputVolumeContainerId:'volume_audioinput_container' } );
				}
                break;
            case 'audiooutput':         
            	if(that.state.isBroadcastClient){
            		
            		HandlerDetectionDevice.audioOutputChangeHandlerFromClient(that.selectDevice[deviceKind]);
            	}else{
                	HandlerDetectionDevice.audioOutputChangeHandler({deviceId:that.selectDevice[deviceKind]  , setSinkIdParentElementId:'main_detection_device' });
				}                
                break;
        }

    };

    _stepExecuteStopOrClear(step){
        const that = this ;
        if(step!=undefined){
            switch (step){
                case -1:
                case 1:
                case 2:
                case 3:
                case 4:
                	if(that.state.isBroadcastClient){
	            		HandlerDetectionDevice.stopDetecteCam(); 
	            		HandlerDetectionDevice.stopDetectMic();
	            	}  
                    HandlerDetectionDevice.stopStreamTracks();                                      
                    $("#videoinput_video_stream , #audioinput_audio_stream").removeAttr('src');
                    that.playAudioToAudiooutput('music_audio' , false);
                    break;
            }
         /*   if( step ===  1){
                HandlerDetectionDevice.stopStreamTracks();
                $("#audioinput_audio_stream").removeAttr('src');
                that.playAudioToAudiooutput('music_audio' , false);
            }else if( step ===  2){
                HandlerDetectionDevice.stopStreamTracks();
                $("#videoinput_video_stream  , #audioinput_audio_stream").removeAttr('src');
            }else if(step === 3){
                HandlerDetectionDevice.stopStreamTracks();
                $("#videoinput_video_stream").removeAttr('src');
                that.playAudioToAudiooutput('music_audio' , false);
            }else if(step === 4 || step === -1){
                HandlerDetectionDevice.stopStreamTracks();
                $("#videoinput_video_stream , #audioinput_audio_stream").removeAttr('src');
                that.playAudioToAudiooutput('music_audio' , false);
            }*/
        }
    };

    _changeStateSelectDevice(deviceKind , deviceId){
        const that = this ;
        if( that.state.selectDevice[deviceKind] !== deviceId){
            that.selectDevice[deviceKind] = deviceId ;
            that.state.selectDevice[deviceKind] = deviceId ;
            for( let [key , value] of Object.entries( that.state.devicesDesc[deviceKind]) ){
                if(key === deviceId){
                    value.select = true ;
                }else{
                    value.select = false ;
                }
            }
            that.setState({selectDevice:that.state.selectDevice , devicesDesc: that.state.devicesDesc});
        }

    };

    /*检测选中的设备是否和状态中的设备相等*/
    _checkSelectDevice(){
        for(let deviceKind of Object.keys(this.selectDevice) ){
            if( this.selectDevice[deviceKind] !== this.state.selectDevice[deviceKind] ){
                this._changeStateSelectDevice(deviceKind , this.selectDevice[deviceKind]  );
            }
        }
    };

    _cutDetectionItem(isEnter , step , selectKey , selectValue = true , e) {
        const that = this ;
    	if (isEnter) {
    		return false;
    	}
    	that._stepExecuteStopOrClear(step);
        that._loadSelectShow(selectKey , selectValue) ;
    };
    /*重置默认数据*/
    _resetDefaultStateAndData(){
        let state = {
            show:false ,
            selectShow:{
                videoinput:false ,
                audioinput:false ,
                audiooutput:false
            },
            devicesDesc:{
                videoinput:{},
                audioinput:{},
                audiooutput:{}
            },
            selectDevice:{
                videoinput: undefined,
                audioinput: undefined,
                audiooutput: undefined
            },
            audiooutputVolume:100 ,
        };
        this.selectDevice = {
            videoinput: undefined,
            audioinput: undefined,
            audiooutput: undefined
        };
        this.setState({selectShow:state.selectShow , devicesDesc:state.devicesDesc , selectDevice:state.selectDevice , audiooutputVolume:state.audiooutputVolume , show:state.show }) ;
    };

    render(){
        let that = this ;
        let { show  , selectShow , devicesDesc  , audiooutputVolume} = that.state ;
        let {isEnter, titleText , okText } = that.props;
        let { audioinputElementArray ,  audiooutputElementArray , videoinputElementArray } = that._loadDeviceElementByDeviceDescArray(devicesDesc);
        let audiooutputVolumeItemArray = [];
        for(let i=0 ; i< 16 ; i++){
            audiooutputVolumeItemArray.push(
                <li key={i} className="audiooutput-volume-item" ></li>
            );
        };

       
        
        
        return (
            <article id="main_detection_device" className="device-test" style={{display: !show ? 'none' : 'block'}}>
                <div className="net-testing">
                    <span className="device-test-header">{titleText || TkGlobal.language.languageData.login.language.detection.deviceTestHeader.device.text}</span>
                    <button id="close-detection" className="close-detection" onClick={that.closeButtonOnClick.bind(that , -1)} style={{display:isEnter?"none":"block"}}>+</button>
                </div>
                <div className="testing-bot">
                    <div className="testing-left en-testing-left">
                        <ul id="testing_box" className="testing-box">
                            <li className={"video-pic testing-option" + (selectShow.videoinput?' active':'')  } data-extend-id="skip-video" onClick={that._cutDetectionItem.bind(that,isEnter , 1 , 'videoinput')}>
                                <span className="videopic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.videoinput.text}</span>
                                <span className="green-video tk-img  icon_right"></span>
                                <span className="red-video tk-img  icon_warn"></span>
                            </li>

                            <li className={"listen-pic testing-option"+ (selectShow.audiooutput?' active':'')  } data-extend-id="skip-listen" onClick={that._cutDetectionItem.bind(that,isEnter,2, 'audiooutput')}>
                                <span className="listenpic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.audioouput.text}</span>
                                <span className="green-listen tk-img  icon_right "></span>
                                <span className="red-listen tk-img  icon_warn "></span>
                            </li>

                            <li className={"speak-pic testing-option"+ (selectShow.audioinput?' active':'')  } data-extend-id="skip-speak" onClick={that._cutDetectionItem.bind(that,isEnter,3, 'audioinput')}>
                                <span className="speakpic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.audioinput.text}</span>
                                <span className="green-speak tk-img  icon_right "></span>
                                <span className="red-speak tk-img  icon_warn "></span>
                            </li>
                        </ul>
                    </div>

                    <div className="testing-right en-testing-right">
                        <div className="video-right fixldy" id="skip-video"   style={{ display:selectShow.videoinput?'block':'none' }} >
                            <div className="video-right-inside device-right-inside">
                                <div className="camera-option-all clear-float">
                                    <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.videoinputExtend.cameraOptionAll.cameraOption.text}</span>
                                    <div className="styled-select" id="video-select">
                                        <select id="videoSource" value={that.state.selectDevice.videoinput} className="no-camera-option" onChange={that.changeSelectDeviceOnChange.bind(that ,'videoinput' ) } >

                                            
                                           {
                                           	videoinputElementArray
                                           }
                                          
                                        </select>
                                    </div>
                                </div>
                                <div className="notice-red">
                                    {TkGlobal.language.languageData.login.language.detection.videoinputExtend.cameraOptionAll.noticeRed.text}
                                </div>
                                <div className="camera-black" id="camera-black">
                              
                            		{/* xueln 添加 */
                            			this.state.isBroadcastClient?<embed id="videoinput_video_stream"  type="application/x-ppapi-proxy"></embed>:<video id="videoinput_video_stream" autoPlay></video>
                            		}

                                    
                                </div>
                                <div className="notice-carmera">
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.one}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.two}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.three}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.four}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.five}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.six}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.seven}</p>

                                </div>
                            </div>
                            <div className="see-button">
                                <button className="can-see next-st"  onClick={isEnter?that.nextButtonOnClick.bind(that , 'audiooutput' , true , 2 ):that.okButtonOnClick.bind(that , 4)} >{isEnter?TkGlobal.language.languageData.login.language.detection.button.next.text:okText}</button>
                            </div>
                        </div>

                        <div className="listen-right fixldy" id="skip-listen"  style={{ display:selectShow.audiooutput?'block':'none' }} >
                            <div className="listen-right-inside device-right-inside">
                                <div className="camera-option-all clear-float">
                                    <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.cameraOption.text}</span>
                                    <div className="styled-select">
                                        <select  id="audioOutput" value={that.state.selectDevice.audiooutput} className="no-camera-option" onChange={that.changeSelectDeviceOnChange.bind(that  ,'audiooutput' ) } >
                                            {
                                            
									   			audiooutputElementArray
                                            }
                                       
                                           
                                        </select>
                                    </div>
                                </div>
                                <div className="click-music clear-float">
                                    <ul className="music-play">
                                        <li><span className="clickmusic">{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.clickmusic.one}</span>
                                        </li>
                                        <li className="musicplay-pic">
                                            <button className="play-music"  onClick={that.playAudioToAudiooutput.bind(that , 'music_audio' , true ) } >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.playMusic}</button>
                                            <audio id="music_audio" src="music/music.mp3" className="audio-play"></audio>
                                        </li>
                                        <li className="listen-sure">
                                            <span >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.clickmusic.two}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="sound-vol">
                                    <div className="sound-btn icon_volume tk-img "></div>
                                    <ReactSlider className={"tk-slide tk-detection-device"} withBars  defaultValue={100}  onBeforeChange={that.handerVolumeOnBeforeChange.bind(that)}   onAfterChange={that.handerVolumeOnAfterChange.bind(that)}    />
                                    <span className="txtValue" >{audiooutputVolume}</span>
                                </div>
                                <div className="notice-carmera">
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.one}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.two}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.three}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.four}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.five}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.six}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.seven}</p>
                                </div>
                            </div>
                            <div className="listen-button">
                                <button className="can-listen next-st"   onClick={isEnter?that.nextButtonOnClick.bind(that , 'audioinput' , true , 3 ):that.okButtonOnClick.bind(that , 4) }   >{isEnter?TkGlobal.language.languageData.login.language.detection.button.next.text:okText}</button>
                            </div>
                        </div>

                        <div className="speak-right fixldy" id="skip-speak"   style={{ display:selectShow.audioinput?'block':'none' }} >
                            <div className="speak-right-inside device-right-inside">
                                <div className="camera-option-all clear-float ">
                                    <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.audioinputExtend.cameraOptionAll.cameraOption.text}</span>
                                    <div className="styled-select">
                                        <select id="audioSource" className="no-camera-option" value={that.state.selectDevice.audioinput}  onChange={that.changeSelectDeviceOnChange.bind(that  ,'audioinput' ) } >
                                            {
                                       
									   			audioinputElementArray
                                            }
                                           

                                        </select>
                                    </div>
                                </div>
                                <div className="notice-red">
                                    {TkGlobal.language.languageData.login.language.detection.audioinputExtend.cameraOptionAll.noticeRed.text}
                                </div>
                                <audio autoPlay id="audioinput_audio_stream"  className="audioinput-audio-detection add-display-none"></audio>
                                <div className="speak-sound">
                                    {TkGlobal.language.languageData.login.language.detection.audioinputExtend.cameraOptionAll.speakSound.text}
                                </div>
                                <div className="sound-green">
                                    <ul id="volume_audioinput_container">
                                        {audiooutputVolumeItemArray}
                                    </ul>
                                </div>
                                <div className="notice-carmera">
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.one}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.two}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.three}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.four}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.five}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.six}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.seven}</p>
                                </div>
                            </div>
                            <div className="other-button">
                                <button className="can-other next-st" data-extend-id="normal-into"   onClick={that.okButtonOnClick.bind(that , 4)}  >{okText || TkGlobal.language.languageData.login.language.detection.button.join.text}</button>
                            </div>

                        </div>
                    </div>
                </div>
            </article>
        )
    };
};
export  default  MainDetectionDeviceSmart ;

