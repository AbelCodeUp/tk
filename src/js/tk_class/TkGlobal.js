/**
 * TK全局变量类
 * @class TkGlobal
 * @description   提供 TK系统所需的全局变量
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import TkUtils from 'TkUtils';

window.GLOBAL = window.GLOBAL || {} ;
const TkGlobal = window.GLOBAL ;
TkGlobal.participantGiftNumberJson = TkGlobal.participantGiftNumberJson || {} ; //参与者拥有没有存储到参与者属性的礼物个数Json集合（注：没有存储到参与者属性中的礼物）
TkGlobal.classBegin = false ; //是否已经上课
TkGlobal.endClassBegin = false ; //结束上课
TkGlobal.routeName = undefined ; //路由的位置
TkGlobal.playback = false ; //是否回放
TkGlobal.isGetNetworkStatus = false ; //是否获取网络状态
TkGlobal.playPptVideoing = false ; //是否正在播放PPT视频
TkGlobal.playMediaFileing = false ; //是否正在播放媒体文件
TkGlobal.serviceTime = undefined ; //服务器的时间
TkGlobal.firstGetServiceTime = false ; //是否是第一次获取服务器的时间
TkGlobal.isHandleMsglist = false ; //是否已经处理msglist数据
TkGlobal.remindServiceTime = undefined ; //remind用的服务器的时间
TkGlobal.classBeginTime = undefined ; //上课的时间
TkGlobal.isSkipPageing = false ; //是否正在输入跳转页
TkGlobal.isClient =  TkUtils.getUrlParams("endtype") == 1 ; //是否客户端
TkGlobal.isBroadcast = TkUtils.getUrlParams("roomtype") == 10 ; //是否直播
TkGlobal.isBroadcastClient =  TkGlobal.isClient && TkGlobal.isBroadcast ; //是否是直播且客户端
TkGlobal.defaultFileInfo = {
    fileid:0,
    currpage:1 ,
    pagenum:1 ,
    filetype: 'whiteboard'  ,
    filename: 'whiteboard' ,
    swfpath: '' ,
    pptslide:1 ,
    pptstep:0,
    steptotal:0
} ; //默认的文件信息
TkGlobal.videoDragArray = null;
export  default TkGlobal ;
