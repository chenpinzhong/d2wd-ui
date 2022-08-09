/*
    后台左侧菜单组件
    作者:chenpinzhong
    开发备注:主要实现菜单功能
*/
import React, {useRef,useState,useEffect } from "react"
import './css/menu.css' //菜单样式组件
import axios from "axios" //ajax请求
import ScrollBar from '../common/ScrollBar' //滚动条组件
import { nanoid } from "nanoid"
import { useSelector, useDispatch } from 'react-redux' //redux
import { set_menu,set_menu_tier} from '../../store/admin/menu_data' //菜单数据方法

const Menu = (props) => {
    const dispatch = useDispatch();//设置数据方法·
    let store_menu_data = useSelector((state) => state.menu_data);//读取共享状态中的菜单数据
    let [menu_list,set_menu_list]=useState();//菜单列表数据
    let [scroll_width,set_scroll_width]=useState();//菜单的宽度 有滚动条时方便调整宽度
    if(typeof(menu_list)=="undefined")menu_list=[];
    let end_menu_tier={};
    if(store_menu_data.menu_tier.length>=0){
        let menu_tier=store_menu_data.menu_tier;
        end_menu_tier=menu_tier[menu_tier.length-1];
    }
    if(typeof(end_menu_tier)=="undefined")end_menu_tier={}
    if(typeof(end_menu_tier.href)=="undefined")end_menu_tier.href='';

    //第一次渲染时 需要进行菜单列表的请求
    useEffect(() => {
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "/admin/menu.api/index").then(
            response => {
                //更新共享菜单数据
                dispatch(set_menu(response.data['data']));
                let menu_list = JSON.parse(JSON.stringify(response.data['data']));//深拷贝数据
                set_menu_list([...menu_list])
                dispatch(set_menu_tier(window.location.pathname));
            },
            error => {
                console.log('获取菜单失败失败了', error);
            }
        );
    }, [dispatch,set_menu_list])




    //菜单的点击事件
    function menu_click(e,id){
        e.preventDefault();//阻止默认事件
        e.stopPropagation();//阻止事件冒泡
        let fold;
        //子菜单处理
        function query_child_menu(value,level){
            value.map(function (value, k) {
                if(value.id===id)fold=value.fold=!value.fold;
                if (typeof (value['child']) != "undefined") {
                    return query_child_menu(value['child'],level+1);
                }
                return value
            })
            return typeof(fold)=='undefined'?false:fold;
        }
        menu_list.map(function(value,key) {
            //一级元素
            if(value.id===id){
                fold=value.fold=!value.fold;
            }
            //子级元素
            if (typeof (value['child']) !== "undefined") {
                fold=query_child_menu(value['child'],1);
            }
            return value
        })
        set_menu_list([...menu_list]);
    }
    //渲染子菜单
    function child_menu(value,level){

        //子孙菜单渲染
        return (
            <li title={value.name} className={"menu_item "+(value.fold?'fold':'')} key={value.id}  data-id={'menu_list_' + value.id}>
                {/*子菜单标题*/}
                <div className="item_title" onClick={(e)=>{menu_click(e,value.id)}}  >
                    <div className={"menu_title_content child_menu_level_"+level} >
                        <a href={value.href}>
                            <span className="menu_item">
                                <span className="menu_item_title">{value.name}</span>
                            </span>
                        </a>
                    </div>
                    <i className="menu_submenu_arrow"></i>
                </div>
                <ul className={"menu_sub menu_inline child_menu "+(value.fold?'fold':'')} data-id={'menu_ul_' + value.id}>
                    {
                        value['child'].map(function (value, k) {
                            if (typeof (value['child']) != "undefined"){
                                //孙菜单渲染
                                return child_menu(value,level+1)
                            } else {
                                let select=typeof(value.href)!="undefined" && end_menu_tier.href!=="" && value.href.indexOf(end_menu_tier.href)>=0?"select":""
                                //子菜单渲染
                                return (
                                    <li key={value.id} title={value.name} className={"menu_item "+select}>
                                        <div className={"menu_title_content child_menu_level_"+(level+1)}>
                                            <a href={value.href}>
                                                <span className="menu_item">
                                                    <span className="menu_item_title">{value.name}</span>
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
    let menu_data = menu_list.map(function(value,key){
        //子级信息
        let menu_child = [];
        if (typeof (value['child'] !== "undefined")) {
            value['child'].map(function (value, k) {
                let menu_child_content = null;
                if (typeof (value['child']) != "undefined") {
                    menu_child_content = child_menu(value,1)
                } else {
                    let select=typeof(value.href)!="undefined" && end_menu_tier.href!=="" && value.href.indexOf(end_menu_tier.href)>=0?"select":""
                    //正常菜单渲染
                    menu_child_content = (
                        <li title={value.name} className={"menu_item "+select} key={value.id} data-id={'menu_list_' + value.id}>
                            <div className="menu_title_content">
                                <a href={value.href}>
                                    <span className="menu_item">
                                        <span className="item_title menu_item_title">{value.name}</span>
                                    </span>
                                </a>
                            </div>
                        </li>
                    );
                }
                menu_child.push(menu_child_content);
                return value
            })
        }
        return (
            <li key={nanoid()} data-id={'menu_list_' + value.id} className={"menu_submenu menu_item "+(value.fold?'fold':'')}>
                {/*菜单标题*/}
                <div role="menuitem" className="menu_submenu_title item_title"  data-id={value.id} onClick={(e)=>{menu_click(e,value.id)}} >
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
                    <i className="menu_submenu_arrow" ></i>
                </div>
                {/*子菜单*/}
                <ul className={"menu_sub menu_inline "+(value.fold?'fold':'')} data-id={'menu_ul_' + value.id}>
                    {menu_child}
                </ul>
            </li>
        )
    })
    //滚动条参数
    let scroll_bar_params = {
        'container': '.menu_left .menu_left_box',/*容器*/
        'content': '.menu_left .menu_left_box .sider_menu',/*内容*/
        'scroll_bar': '.menu_left .scroll_bar_box .scroll_bar',/*滚动条*/
        'direction': 'y',/*滚动条方向*/
        'is_show_y':false,
        'size_change':size_change
    }
    //菜单主要dom对象
    const content = useRef()

    //检查是否存在滚动条
    function size_change(){
        if(typeof(content.current)==="undefined")return false;
        let scroll_bar=document.querySelector(scroll_bar_params.scroll_bar)
        if(scroll_bar==null)return false;
        let temp_width=scroll_bar.clientWidth
        if(temp_width>0){
            let scroll_bar_width=document.querySelector(scroll_bar_params.scroll_bar).clientWidth;//滚动条宽度
            let new_width=content.current.clientWidth-scroll_bar_width;//容器宽度
            set_scroll_width(new_width)//设置菜单宽度
        }else{
            let new_width=content.current.clientWidth
            set_scroll_width(new_width)//设置菜单宽度
        }
    }
    setInterval(() => size_change(), 200);

    return (
        <>
            {/*<!--菜单-->*/}
            <div ref={content}  className="menu_left">
                <div  className="menu_left_box" style={{"width":scroll_width+"px"}}>
                    <ul className="sider_menu menu">
                        {/*菜单列表*/}
                        {menu_data}
                    </ul>
                    {/*滚动条组件 绑定到对应元素上 selector="XXX" */}
                </div>
                <ScrollBar  params={scroll_bar_params} />
            </div>
        </>
    );
};
export default Menu
