import React from "react"
import $ from "jquery" //引入 jq
import "./module/jq_scroll_bar" //引入jq 插件
import "./css/jq_scroll_bar.css" //引入样式文件

class ScrollBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { menu_list: [] };
    }
    //dom渲染完成
    componentDidMount() {
        const { params } = this.props;
        let dom = document.querySelector(params.container)
        let scroll_box_height = dom.scrollHeight;//滚动条容器高度
        let offset_height = dom.offsetHeight;//元素实际高度
        let scroll_height = dom.querySelector('.scroll_bar_box .scroll_bar').offsetHeight;//滚动条高度
        console.log(offset_height / scroll_box_height >= 1, offset_height, scroll_box_height)
        if (offset_height / scroll_box_height >= 1) {
            //不需要滚动条
            dom.querySelector('.scroll_bar_box').style.display = 'none';
        } else {
            //需要滚动条
            dom.querySelector('.scroll_bar_box').style.display = 'black';
        }
    }
    render() {
        const { params } = this.props;
        return (
            <>
                <div className="scroll_bar_box">
                    <div className="scroll_bar"></div>
                </div>
            </>
        )
    }
}
export default ScrollBar
