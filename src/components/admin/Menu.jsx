/*
    后台左侧菜单组件
    作者:chenpinzhong
    开发备注:主要实现菜单功能
*/

import React, { useState, useEffect } from "react"
import './css/menu.css'
import $ from "jquery"
import axios from "axios"
import ScrollBar from '../common/ScrollBar' //滚动条组件
import { useSelector, useDispatch } from 'react-redux'
import { set_menu } from '../../store/admin/menu_data'

const Menu = (props) => {
    const [menu_list, set_menu_list] = React.useState(0);
    useEffect(() => {
        let server_url = process.env.REACT_APP_SERVER_URL;
        //http://127.0.0.1:19730/admin/menu.api/index
        axios.get("http://localhost:3000/admin/menu.api/index").then(
            response => {
                //this.setState({ menu_list: response.data['data'] });//更新菜单列表
                //set_menu_list(response.data['data'])
                //menu_list=response.data['data'];
            },
            error => {
                console.log('获取菜单失败失败了', error);
            }
        );
    }, [])




    let params = {
        /*容器*/
        'container': '.menu_left .menu_left_box',
        /*内容*/
        'content': '.menu_left .menu_left_box .sider_menu',
        /*滚动条*/
        'scroll_bar': '.menu_left .scroll_bar_box .scroll_bar',
        /*滚动条方向*/
        'direction': 'y',
    }
    return (
        <>
            {/*<!--菜单-->*/}
            <div className="menu_left">
                <div className="menu_left_box">
                    <ul className="sider_menu menu">
                        {/*菜单列表*/}
                        {menu_list}
                    </ul>
                    {/*滚动条组件 绑定到对应元素上 selector="XXX" */}
                </div>
                <ScrollBar params={params} />
            </div>
        </>
    );
};
export default Menu
