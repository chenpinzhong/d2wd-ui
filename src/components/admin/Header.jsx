import React from "react"
import './css/header.css'

class Header extends React.Component {
    
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
                        <div className="nav_item">
                            <img src={process.env.PUBLIC_URL + "/head.jpg"} className="nav_img" width="40" height="40"/>
                            <cite className="admin_name">陈品忠GLKJ3959</cite>
                            <i className="lnr lnr_chevron_down"></i>
                        </div>

                    </div>
                </div>
            </>
        )
    }
}
export default Header
