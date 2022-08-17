import { Outlet  } from "react-router-dom";
import React, {useRef,useState } from "react"
import Header from "../../components/admin/Header";
import Menu from "../../components/admin/Menu";
import End from "../../components/admin/End";
import ScrollBar from '../../components/common/ScrollBar' //滚动条组件
import "../../components/admin/css/base.css";
import NavTitle from '../../components/admin/NavTitle'

function IndexLayout() {
    //检查用户是否登陆


    let [scroll_width,set_scroll_width]=useState();//菜单的宽度 有滚动条时方便调整宽度
    let scroll_bar_params = {
        'container': '#content .content_show .content_box',/*容器*/
        'content': '#content .content_show .content_box .content_details', /*内容*/
        'scroll_bar': '#content .content_show .scroll_bar_box .scroll_bar',/*滚动条*/
        'direction': 'y',/*滚动条方向*/
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
            <Header />
            <Menu />
            <div ref={content} id="content">
                {/*导航标签*/}
                <NavTitle/>
                <div className="content_show">
                    <div className="content_box" style={{"width":scroll_width+"px"}}>
                        <div className="content_details">
                            <Outlet />
                        </div>
                    </div>
                    <ScrollBar params={scroll_bar_params} />
                </div>
            </div>
            <End />
        </>
    );
}
export default IndexLayout
