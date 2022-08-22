import React from "react"
import 'antd/dist/antd.min.css';
import './css/header.css'
class Header extends React.Component {
    render() {
        return (
            <>
                {/*<!--head标签-->*/}
                <div className='header_area'>
                    <div className="main_header">
                        {/*<!--header_top-->*/}
                        <div className="header_top">
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col_lg_6"><div className="welcome_message"><p>欢迎来到d2wd在线商店</p></div></div>
                                    {/*<!--右边区域-->*/}
                                    <div className="text_right">
                                        <div className="header_top_settings">
                                            <ul className="nav">
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<!--header_main_area*/}
                        <div className="header_main_area">
                            <div className="container">
                                <div className="row">
                                    {/*<!--logo区域-->*/}
                                    <div className="col_lg_1">
                                        <div className="logo">
                                            <a href="/">
                                                <img src={process.env.PUBLIC_URL + "/d2wd-logo.png"} alt="LOGO" />
                                            </a>
                                        </div>
                                    </div>
                                    {/* <!--开始 logo 区域结束-->*/}
                                    {/*<!--主菜单区域开始 -->*/}
                                    <div className="col_lg_6">
                                        <div className="main_menu_area">
                                            <div className="main_menu">
                                                {/*<!--主菜单导航栏开始 -->*/}
                                                <nav className="desktop_menu">
                                                    <ul>
                                                        <li><a href="/" className="current_menu">主页</a></li>
                                                        <li><a href="/shop" className="">商店</a></li>
                                                        <li><a href="/wiki" className="">推荐</a></li>
                                                        <li><a href="/shop" className="">热点</a></li>
                                                        <li><a href="/shop" className="">相册</a></li>
                                                    </ul>
                                                </nav>
                                                {/*<!-- 主菜单导航栏开始 结束 -->*/}
                                            </div>
                                        </div>
                                    </div>
                                    {/*<!-- 主菜单区域结束 -->*/}
                                    {/*<!-- 迷你购物车区域开始 -->*/}
                                    <div className="col_lg_3">
                                        <div className="header_configure_wrapper">
                                            <div className="header_configure_area">
                                                <ul className="nav justify_content_end">
                                                    <li>
                                                        <a href="javacript:void(0);" className="offcanvas_btn">
                                                            <i className="lnr lnr_magnifier"></i>
                                                        </a>
                                                    </li>
                                                    <li className="user_hover">
                                                        <a href="javacript:void(0);">
                                                            <i className="lnr lnr_user"></i>
                                                        </a>
                                                        <ul className="dropdown_list" style={{ display: "none" }}>
                                                            <li><a className="/user/index/login">登录</a></li>
                                                            <li><a className="/user/index/register">注册</a></li>
                                                            <li><a className="/user/index/my_account">我的账户</a></li>
                                                            <li><a className="/user/index/change_password">修改密码</a></li>
                                                            <li><a className="/user/index/logout">退出登录</a></li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <a className="javacript:void(0);">
                                                            <i className="lnr lnr_heart"></i>
                                                            <div className="notification">0</div>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="javacript:void(0);" className="minicart_btn">
                                                            <i className="lnr lnr_cart"></i>
                                                            <div className="notification">2</div>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<!--迷你购物车区域结束-->*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Header
