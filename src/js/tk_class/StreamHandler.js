/**
 * Stream流的相关处理类
 * @class StreamHandler
 * @description   提供Stream流相关的处理功能
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils' ;
import RoomHandler from 'RoomHandler' ;

class StreamHandler{
    constructor(stream){
        this.stream = stream ;
    }
    addEventListenerToRoomHandler(){
        let that = this ;
        /**@description Stream类-StreanEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.StreamEvent ){
            eventObjectDefine.Stream.addEventListener(TkConstant.EVENTTYPE.StreamEvent[eventKey] , function (recvEventData) {
                if(that['handler'+TkUtils.replaceFirstUper(eventKey) ] && typeof  that['handler'+TkUtils.replaceFirstUper(eventKey) ]  === "function" ){
                    that[ 'handler'+TkUtils.replaceFirstUper(eventKey) ](recvEventData);
                }
                eventObjectDefine.CoreController.dispatchEvent(recvEventData);
            });
        }
    };
    handlerAccessAccepted(accessAcceptedEventData){ //处理access-accepted事件
        RoomHandler.joinRoom();
    };
    handlerAccessDenied(accessDeniedEventData){ //处理access-denied事件
        RoomHandler.joinRoom();
    };
}
const  StreamHandlerInstance = new StreamHandler() ;
StreamHandlerInstance.addEventListenerToRoomHandler();
export default StreamHandlerInstance ;