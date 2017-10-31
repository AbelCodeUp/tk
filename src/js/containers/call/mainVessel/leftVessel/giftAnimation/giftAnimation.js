/**
 * 礼物动画smart组件
 * @module GiftAnimationSmart
 * @description   提供发送礼物时显示的动画
 * @author QiuShao
 * @date 2017/08/25
 */

'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine' ;
import TkConstant from 'TkConstant' ;

class GiftAnimationSmart extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that)  , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerRoomUserpropertyChanged(recvEventData){
         let changeUserproperty = recvEventData.message ;
         let user = recvEventData.user ;
         for( let key of Object.keys(changeUserproperty) ){
             if(key === "giftnumber") {
                 if(user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {
                     let $giftAnimationContainer = $("#gift_animation_container")
                     let $giftAnimation = $('<div class="gift-animation"></div>');
                     $giftAnimationContainer.append($giftAnimation);
                     $giftAnimation.removeClass("giftAnimationSmall giftAnimationBig scalc").addClass(" giftAnimationBig ");
                     setTimeout(function() {
                         $giftAnimation.removeClass("giftAnimationBig giftAnimationSmall scalc").addClass("scalc giftAnimationSmall");
                         let processedPariicipantId = user.id;
                         let $videoParticipant = $("#hvideo" + processedPariicipantId) ;
                         $videoParticipant =  $videoParticipant.length>0 ? $videoParticipant : $("#vvideo" + processedPariicipantId)
                         let defalutFontSize = window.innerWidth / 19.2;
                         if($videoParticipant.length > 0) {
                             let left = $videoParticipant.offset().left + $videoParticipant.width() - 1.38 * defalutFontSize / 1.4;
                             let top = $videoParticipant.offset().top - 1.38 * defalutFontSize / 1.5;
                             $giftAnimation.animate({
                                 left: left / defalutFontSize + "rem",
                                 top: top / defalutFontSize + "rem"
                             }, 500, function() {
                                 $giftAnimation.remove();
                             });
                         } else {
                             $giftAnimation.remove();
                         }
                     }, 1300);
                 }
             }
         }
    };

    render(){
        return (
            <section className="gift-animation-container" id="gift_animation_container"></section>
        )
    }
};
export default  GiftAnimationSmart;