/**
 * 用户列表的 Dumb组件
 * @module UserListDumb
 * @description   提供用户列表的Dumb组件
 * @author QiuShao
 * @date 2017/08/10
 */
'use strict';
import React , {PropTypes} from 'react';
import TkAppListDumb  from '../tkAppList/tkAppList';
import TkUtils  from 'TkUtils';

class UserListDumb extends React.Component{
    constructor(props){
        super(props);
    };

    /*加载用户列表所需要的props*/
    loadUserListProps(titleJson ,userListItemJson ){
        const _getListItemDataArray = (userListItemJson) => {
            const listItemDataArray = [] ;
            userListItemJson.forEach( (value , index) => {
                let {id , disabled  , children , textContext ,afterIconArray , show , active ,temporaryDisabled ,  onClick   , order} = value ;
                let tmpUserListItemJson = {
                    className:'user-container clear-float add-position-relative '+( disabled?' disabled ':' ') + ( active?' active ':' ')+ ( temporaryDisabled?' temporary-disabled ':' '),
                    id:id ? 'userlist_'+id : undefined ,
                    textContextArray:[
                        {
                            className:'user-name add-fl add-nowrap' ,
                            textContext:textContext ,
                        }
                    ] ,
                    order:order ,
                    children:children ,
                    show:show!=undefined?show:true ,
                    onClick:onClick ,
                    iconArray:(function (afterIconArray) {
                        const tmpArr = [] ;
                        afterIconArray = afterIconArray || [] ;
                        afterIconArray.forEach(function (item) {
                            const {after ,before , className , show ,title ,  ...other } = item;
                            tmpArr.push(
                                {
                                    attrJson:{
                                        className:before?'user-portrait add-fl add-block use-pic '+ ( className || '' ) :  className,
                                        title:title ,
                                    } ,
                                    before:before,
                                    after: after!=undefined? after:true,
                                    disabled:true ,
                                    show:show!=undefined?show:true ,
                                    onClick:undefined ,
                                    ...TkUtils.filterContainDataAttribute(other)
                                }
                            );
                        });
                        tmpArr.push({
                            attrJson:{
                                className:'user-portrait add-fl add-block use-pic ',
                            } ,
                            before:true,
                            disabled:true ,
                            show:true ,
                            onClick:undefined
                        });
                        return tmpArr ;
                    })(afterIconArray) ,
                };

                let indexMark = undefined ;
                for(let i=0 ; i<listItemDataArray.length;i++){
                    if(order>listItemDataArray[i].order){
                        indexMark = i ;
                        break;
                    }
                }
                if(indexMark!=undefined){
                    listItemDataArray.splice(indexMark , 0 , tmpUserListItemJson ) ;
                }else{
                    listItemDataArray.push(tmpUserListItemJson);
                }
            });
            return listItemDataArray ;
        };
        const userListProps = {
            id:'tool_user_list_extend' ,
            className:'tool-user-list-extend'  ,
            titleJson:{
                id:'tool_user_list' ,
                title:titleJson.title ,
                number:titleJson.number
            }  ,
            listPros:{
                id:'tool_participant_user_list' ,
                className:'t-participant-user-list add-over-auto-max-height  custom-scroll-bar' ,
                listItemDataArray:_getListItemDataArray(userListItemJson) ,
            }  ,
        };
        return {userListProps:userListProps} ;
    };

    render(){
        const that = this ;
        const {titleJson , userListItemJson , show , ...otherProps} = that.props ;
        const {userListProps} = that.loadUserListProps(titleJson ,userListItemJson ) ;
        return (
            <TkAppListDumb show={show} {...userListProps} {...otherProps}  />
        )
    };
};

UserListDumb.propTypes = {
    titleJson:PropTypes.object.isRequired ,
    userListItemJson:PropTypes.object.isRequired
};
export  default  UserListDumb ;

/*
数据格式：
props = {
  show:true ,
  titleJson:{
     title:title ,
     number:number
  } ,
 userListItemJson:Map( [userid:{
     id:id,
     disabled:disabled  ,
     textContext:textContext ,
     afterIconArray:[
         {
         className:className
         }
     ]
    }
 ] ) ,
 ...otherProps
}
* */
