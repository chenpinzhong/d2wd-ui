import { Outlet } from "react-router-dom";
import Header from "../../components/admin/Header";
import Menu from "../../components/admin/Menu";
import End from "../../components/admin/End";
import ScrollBar from '../../components/common/ScrollBar' //滚动条组件
import "../../components/admin/css/base.css";
function IndexLayout() {
    let params = {
        /*容器*/
        'container': '#content .content_box',
        /*内容*/
        'content': '#content .content_box .content_details',
        /*滚动条*/
        'scroll_bar': '#content .scroll_bar_box .scroll_bar',
        /*滚动条方向*/
        'direction': 'y',
    }
    return (
        <>
            <Header />
            <Menu />
            <div id="content">
                <div className="content_box">
                    <div className="content_details">
                        <Outlet />
                    </div>
                </div>
                <ScrollBar params={params} />
            </div>
            <End />
        </>
    );
}
export default IndexLayout