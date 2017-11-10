/**
 * UI-总控制中心处理类
 * @class HandlerCoreController
 * @description  用于CoreController核心控制器的处理
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';
//gogotalk 
import TkConstant from 'TkConstant';

class HandlerCoreController {
    /*根据公司domain决定加载的页面样式布局
    * @method setPageStyleByDomain*/
    setPageStyleByDomain(){
        let domain = TkUtils.getUrlParams("domain");
        domain = 'igogotalk';//测试数据!!!!!!
        TkGlobal.format  = "normal";
        switch (domain){
            case  'icoachu': //英练邦
                TkGlobal.format = "icoachu" ;
                $(document.head).append('<link rel="shortcut icon" href='+ require('../../img/call_layout/logo/icu_logo_ico.png')+' type="image/png" />');
                break;
            case  'igogotalk': //gogotalk
                TkGlobal.format = "igogotalk" ;
                // $(document.head).append('<link rel="shortcut icon" href='+ require('../../img/call_layout/logo/icu_logo_ico.png')+' type="image/png" />');
                break;
            default:
                TkGlobal.format = "normal" ;
                break;
        };
        // alert(TkUtils.getUrlParams('roomtype', window.location.href ));
        //gogotalk 增加一对一 样式判断
        if(TkGlobal.format == "igogotalk" && TkUtils.getUrlParams('roomtype', window.location.href ) == TkConstant.ROOMTYPE.oneToOne ){
            // alert(1);
            //gogotalk 增加一对一 样式判断
            $(document.body).removeClass("normal igogotalk").addClass(TkGlobal.format).attr("data-company" , TkGlobal.format );
        }else{
            if(TkGlobal.format == "igogotalk"){
                $(document.body).removeClass("igogotalk").attr("data-company" , TkGlobal.format );
            }else{
                $(document.body).removeClass("normal").addClass(TkGlobal.format).attr("data-company" , TkGlobal.format );
            }
        }
        // $(document.body).removeClass("normal igogotalk").addClass(TkGlobal.format).attr("data-company" , TkGlobal.format );
    }

};
const handlerCoreControllerInstance = new HandlerCoreController();
export default handlerCoreControllerInstance;