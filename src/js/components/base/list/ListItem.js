/**
 * ListItem Dumb组件
 * @module ListItemDumb
 * @description   提供 List的ItemDumb组件
 * @author QiuShao
 * @date 2017/08/09
 */
'use strict';
import React  from 'react';
import TkUtils from 'TkUtils' ;
import CoreController from 'CoreController';

class ListItemDumb extends React.Component {
    constructor(props) {
        super(props);
    };

    /*加载图标元素*/
    loadIconArray(iconArray){
        const beforeElementArray = [] , afterElementArray = [] ;
        if(iconArray){
            iconArray.forEach( (value , index) =>{
                value.attrJson = value.attrJson || {} ;
                const {attrJson , disabled , after , before , context , show , onClick  } = value ;
                const {id , title  , className , ...otherAttrs} =  attrJson ;
                const iconTemp = <button key={index} style={ {display:!show?'none':undefined} } className={'tk-icon  tk-listitem-icon '+ (before?' tk-icon-before ':' tk-icon-after ') + (className?className:'') + ' ' + (disabled?' disabled ':' ')  } onClick={onClick && typeof onClick === "function"?onClick:undefined}  disabled={disabled?disabled:undefined} title={title} id={id} {...TkUtils.filterContainDataAttribute(otherAttrs) } >{context?context:''} </button> ;
                if(before){
                    beforeElementArray.push(iconTemp)
                }else if(after){
                    afterElementArray.push(iconTemp)
                }
            });
        }
        return{
            beforeElementArray:beforeElementArray ,
            afterElementArray:afterElementArray
        }
    }

    render() {
        let that = this;
        const { className , id  , iconArray , onClick , show ,   ...other  } = that.props  ;
        let { beforeElementArray ,  afterElementArray }  = that.loadIconArray(iconArray);
        return (
            <li  className={"tk-list-item "+className + (CoreController.handler.getAppPermissions('openFileIsClick')? "":" disabled") } disabled={CoreController.handler.getAppPermissions('openFileIsClick')? "":"disabled"} id={id}  onClick={onClick}  style={ {display:!show?'none':undefined} }  {...TkUtils.filterContainDataAttribute(other) } >
                <span className={"tk-icon-before-container tk-icon-size-"+beforeElementArray.length }  >
                    {beforeElementArray}
                </span>
                {that.props.children}
                <span className={"tk-icon-after-container tk-icon-size-"+afterElementArray.length} >
                    {afterElementArray}
                </span>
            </li>
        )
    };
}
;

export  default  ListItemDumb ;


