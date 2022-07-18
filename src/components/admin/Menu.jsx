/*
    后台左侧菜单组件
    作者:chenpinzhong
    开发备注:主要实现菜单功能
*/

import React from "react"
import './css/menu.css'
import $ from "jquery"
import axios from "axios"
class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { menu_list: [] };
    }
    //插入DOM 树中
    componentDidMount() {
        let server_url = process.env.REACT_APP_SERVER_URL;
        //http://127.0.0.1:19730/admin/menu.api/index
        axios.get("http://127.0.0.1:3000/admin/menu.api/index").then(
            response => {
                this.setState({ menu_list: response.data['data'] });//更新菜单列表
            },
            error => {
                console.log('获取菜单失败失败了', error);
            }
        );
    }
    menu_click=(id)=>{
        this.state.menu_list.map(function(value,key) {
            if(value.id==id)value.fold=!value.fold;
        })
        //更新状态
        this.setState(this.state.menu_list);
    }
    render() {
        var _this=this;
        function child_menu(child_value,level){
            //子孙菜单渲染
            return (
                <li title="分析页" className="menu_item" key={child_value.id} data-id={child_value.id}>
                    {/*子菜单标题*/}
                    <div className="item_title" onClick={(e)=>{_this.menu_click(child_value.id)}} >
                        <div className={"menu_title_content child_menu_level_"+level} >
                            <a href="/dashboard/monitor">
                                <span className="menu_item">
                                    <span className="menu_item_title">{child_value.name}</span>
                                </span>
                            </a>
                        </div>
                        <i className="menu_submenu_arrow"></i>
                    </div>
                    <ul className="menu_sub menu_inline child_menu">
                        {
                            child_value['child'].map(function (child_value, k) {
                                if (typeof (child_value['child']) != "undefined"){
                                    //孙菜单渲染
                                    return child_menu(child_value,level+1)
                                } else {
                                    //子菜单渲染
                                    return (
                                        <li key={child_value.id} title={child_value.name} className="menu_item" >
                                            <div className={"menu_title_content child_menu_level_"+(level+1)}>
                                                <a href={child_value.href}>
                                                    <span className="menu_item">
                                                        <span className="menu_item_title">{child_value.name}</span>
                                                    </span>
                                                </a>
                                            </div>
                                        </li>
                                    )
                                }
                            })
                        }
                    </ul>
                </li>
            );
        }
        //渲染菜单列表
        let menu_list = this.state.menu_list.map(function (value, key) {
            //子级信息
            let menu_child = [];
            if (typeof (value['child'] != "undefined")) {
                value['child'].map(function (child_value, k) {
                    let menu_child_content = null;
                    if (typeof (child_value['child']) != "undefined") {
                        menu_child_content = child_menu(child_value,1)
                    } else {
                        //正常菜单渲染
                        menu_child_content = (
                            <li title="分析页" className="menu_item" key={child_value.id} data-id={child_value.id}>
                                <div className="menu_title_content">
                                    <a href={child_value.href}>
                                        <span className="menu_item">
                                            <span className="menu_item_title">{child_value.name}</span>
                                        </span>
                                    </a>
                                </div>
                            </li>
                        );
                    }
                    menu_child.push(menu_child_content);
                })
            }
            
            return (
                <li key={'menu_list_' + key} data-id={'menu_list_' + key} className={"menu_submenu "+(value.fold?'fold':'unfold')}>
                    {/*菜单标题*/}
                    <div role="menuitem" className="menu_submenu_title" key={value.id} data-id={value.id} onClick={(e)=>{_this.menu_click(value.id)}} >
                        <div className="menu_title_content">
                            <span className="menu_item" title="Dashboard">
                                <span role="img" aria-label="dashboard" className="anticon anticon_dashboard">
                                    <svg viewBox="64 64 896 896" focusable="false" data-icon="dashboard" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                        <path d="M924.8 385.6a446.7 446.7 0 00-96-142.4 446.7 446.7 0 00-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 00-142.4 96 446.7 446.7 0 00-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 01140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 00-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 000 79.2 55.95 55.95 0 0079.2 0 55.87 55.87 0 0014.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm260 218v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8zm12.7-197.2l-31.1-31.1a8.03 8.03 0 00-11.3 0l-56.6 56.6a8.03 8.03 0 000 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm-458.6-31.1a8.03 8.03 0 00-11.3 0l-31.1 31.1a8.03 8.03 0 000 11.3l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6zM262 530h-80c-4.4 0-8 3.6-8 8v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8z"></path>
                                    </svg>
                                </span>
                                <span className="menu_item_title">{value.name}</span>
                            </span>
                        </div>
                        {/*菜单是否展开*/}
                        <i className="menu_submenu_arrow"></i>
                    </div>
                    {/*子菜单*/}
                    <ul className="menu_sub menu_inline">
                        {menu_child}
                    </ul>
                </li>
            )
        })
        return (
            <>
                {/*<!--菜单-->*/}
                <div className="menu_left">
                    <ul className="sider_menu menu">
                        {/*菜单列表*/}
                        {menu_list}
                    </ul>
                </div>
            </>
        )
    }
}
export default Menu
