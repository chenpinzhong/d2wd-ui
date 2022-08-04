/*
    后台左侧菜单组件
    作者:chenpinzhong
    开发备注:主要实现菜单功能
*/
import React from "react"
import { nanoid } from "nanoid"
import { useSelector} from 'react-redux' //redux

const NavTitle = (props) => {
    let store_menu_data = useSelector((state) => state.menu_data.menu_tier);//读取共享状态中的菜单数据
    let menu_length=store_menu_data.length-1;
    return (
        <>
            {/*<!--菜单-->*/}
            <div key={nanoid()}  className="content_title">
                {
                    store_menu_data.map(function(value,key){
                        return (
                            <div key={nanoid()} style={{"display":"inline-block"}}>
                                <span key={nanoid()} >
                                    <a key={nanoid()} href={value.href}>{value.name}</a>
                                </span>
                                {/*最后一个导航菜单 不需要分隔符*/}
                                {
                                    menu_length!==key?<span className="readcrumb_separator">/</span>:''
                                }
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
};
export default NavTitle
