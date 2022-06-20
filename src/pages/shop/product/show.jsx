/*
    用户首页
    作者:chenpinzhong
    开发备注:主要实现网站首页
*/
//商店首页
import '../css/index.css'
function Index(){
    return (
        <>
            {/*<!-- breadcrumb 区域开始 -->*/}
            <div className="breadcrumb_area common_bg">
                <div className="container">
                    <div className="row">
                        <div className="col_12">
                            <div className="breadcrumb_wrap">
                                <nav aria-label="breadcrumb">
                                    <h1>产品详情</h1>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb_item"><a href="index.html"><i className="fa fa_home"></i></a></li>
                                        <li className="breadcrumb_item active" aria-current="page">产品详情</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<!--产品头部信息 -->*/}
		    <div id="detail">
                1
            </div>
        </>
    )
}
export default Index