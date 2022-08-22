import React from "react"
import "./css/scroll_bar.css" //引入样式文件

class ScrollBar extends React.Component {
    state = {is_show_y: false,}
    old_is_show_y=false;
    //dom渲染完成
    componentDidMount() {
        const { params } = this.props;
        //定时检查是否需要滚动条
        setInterval(() => this.check(), 200);
        let mousemove_event_start = 0;//移动的起始位置
        let dom = document.querySelector(params.container);//滚动对象
        let content = document.querySelector(params.content);//显示内容
        let scroll_bar = document.querySelector(params.scroll_bar);//滚动条
        //let scroll_bar_width=6;//滚动条宽度=6
        //console.log(dom.clientWidth,scroll_bar.clientWidth)

        //移动事件
        function mousemove_event(e) {
            e.preventDefault();//阻止默认事件
            e.stopPropagation();//阻止事件冒泡
            let start = parseFloat(mousemove_event_start);//开始滚动的位置
            let show_scroll_height = scroll_bar.offsetHeight;//显示的滚动条高度
            let end = e.pageY;
            let curr_postion = end - start;
            let element_height = dom.offsetHeight;//元素高度

            if (curr_postion <= 0) {
                curr_postion = 0;
            } else if (curr_postion + show_scroll_height >= element_height) {
                curr_postion = element_height - show_scroll_height;
            }
            scroll_bar.style.top = curr_postion + "px";
            //控制真实滚动条
            //模拟滚动条
            let scroll_height = dom.offsetHeight - show_scroll_height;//滚动高度-滚动条高度=滚动高度
            //计算真实滚动条
            let true_scroll_height = content.offsetHeight - dom.offsetHeight;//真实内容高度-容器高度=真实滚动高度
            dom.scrollTop = curr_postion / scroll_height * true_scroll_height;
        }
        //注册鼠标按下滚动条 事件
        scroll_bar.addEventListener('mousedown', function (e) {
            e.stopPropagation();//阻止事件冒泡
            if (scroll_bar.style.top === "") scroll_bar.style.top = "0px";
            mousemove_event_start = e.clientY - parseFloat(scroll_bar.style.top);
            document.addEventListener('mousemove', mousemove_event, false);
        })
        //鼠标松开事件
        document.addEventListener('mouseup', function (e) {
            document.removeEventListener('mousemove', mousemove_event, false);
        })
        //滚动事件
        function scroll_handle(e) {
            e.preventDefault();//阻止默认事件
            e.stopPropagation();//阻止事件冒泡
            if (e.type === 'DOMMouseScroll') {//火狐浏览器
                if (e.detail > 0) {
                    dom.scrollTop += 20;
                } else {
                    dom.scrollTop -= 20;
                }
            } else {//谷歌浏览器
                //计算虚拟的滚动条高度
                if (e.wheelDelta <= 0) {
                    dom.scrollTop += 20;
                } else {
                    dom.scrollTop -= 20;
                }
            }

            let ratio = dom.scrollTop / (dom.scrollHeight - dom.clientHeight);
            let curr_postion = (document.querySelector(params.container).offsetHeight - document.querySelector(params.scroll_bar).offsetHeight) * ratio;
            scroll_bar.style.top = curr_postion + "px";
        }
        if (dom.addEventListener) dom.addEventListener('DOMMouseScroll', scroll_handle, false);
        dom.onmousewheel = scroll_handle;
    }
    //检查内容是否发生变化
    check() {
        const { params } = this.props;
        let state = this.state
        let dom = document.querySelector(params.container);
        if(dom==null)return false;
        let scroll_box_height = dom.scrollHeight;//滚动条容器高度
        let element_height = dom.offsetHeight;//元素实际高度
        //更新元素高度信息
        if (state.scroll_box_height !== scroll_box_height) state.scroll_box_height = scroll_box_height;
        if (state.element_height !== element_height) state.element_height = element_height;
        if (element_height / scroll_box_height >= 1) {
            state.is_show_y = false;//不需要滚动条
        } else {
            state.is_show_y = true;//需要滚动条
        }
        this.setState(state)
    }

    render() {
        return (
            <>
                <div className={"scroll_bar_box " + (this.state.is_show_y ? '' : 'hide')}>
                    <div className="scroll_bar" style={{ 'top': this.state.top + "px" }}></div>
                </div>
            </>
        )
    }
}
export default ScrollBar
