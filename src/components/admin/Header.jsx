import React from "react"
import './css/header.css'
import axios from "axios";

class Header extends React.Component {
    state={
        "id":0,
        "account_name": "",
        "user_name": "admin",
        "real_name": "admin",
        "phone": "",
        "group_rights": null,
        "user_rights": null,
        "age": null,
        "level": null,
        "add_time": null,
        "offline_time": null,
        "update_time": null
    };
    componentDidMount() {
        //this.get_page_data(this.get_params('page',1),this.get_params('page_size',15));//获取页面数据
        //this.setState(this.state);//更新状态
        //第一次渲染时 需要进行菜单列表的请求
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "/admin/admin_user/get_admin_info").then(
            response => {
                if(response.data.code=='200'){
                    this.state=response.data['data'];
                    this.setState(this.state);//更新状态
                }else{
                    console.log("获取用户信息失败 原因",response.data['msg']);
                }
            },
            error => {
                console.log('获取用户信息失败 接口错误', error);
            }
        );
        //鼠标移动到元素上 显示退出按钮
        document.querySelector('.nav_item.user_info').addEventListener('mouseenter',function (){
            document.querySelector('.nav_item .header_user_action').style.display='block';
        })
        document.querySelector('.nav_item.user_info').addEventListener('click',function (){
            document.querySelector('.nav_item .header_user_action').style.display='block';
        })
        //点击屏幕后 强制隐藏
        document.querySelector('body').addEventListener('click',function (e){
            let is_hide=true;//是否隐藏
            e.path.forEach(function (dom,index){
                if(typeof(dom.className)=='string' && dom.className.indexOf('user_info')>=0)is_hide=false;//用户信息处的点击不需要隐藏
            })
            if(is_hide){
                document.querySelector('.nav_item .header_user_action').style.display='none';
            }
        })
        //移出功能列表后 隐藏
        document.querySelector('.nav_item .header_user_action').addEventListener('mouseleave',function (){
            document.querySelector('.nav_item .header_user_action').style.display='none';
        })
    }
    render() {
        return (
            <>
                {/*<!--head标签-->*/}
                <div className="header">
                    <div className="header_logo"><img src={process.env.PUBLIC_URL + "/d2wd-logo.png"} alt="LOGO" /></div>
                    <div className="header_content"></div>
                    <div className="header_right">
                        <div className="nav_item">
                            <a href="#" data-refresh="搜索"><i className="lnr lnr_magnifier"></i></a>
                        </div>
                        <div className="nav_item">
                            <a href="#" data-refresh="消息"><i className="lnr lnr_alarm"></i></a>
                        </div>
                        <div className="nav_item">
                            <a href="#" data-refresh="设置"><i className="lnr lnr_cog"></i></a>
                        </div>
                        <div className="nav_item user_info">
                            <img src={process.env.PUBLIC_URL + "/head.jpg"} className="nav_img" width="40" height="40" alt="head"/>
                            <cite className="admin_name">{this.state['user_name']}</cite>
                            <i className="lnr lnr_chevron_down"></i>
                            <ul className="header_user_action" style={{"display":"none"}}>
                                <li><a className="c-color-text" href="/admin/login/quit"> 退出登录 </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Header
