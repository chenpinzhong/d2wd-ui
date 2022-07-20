import React from "react"
import "./module/jq_scroll_bar" //引入jq 插件
import "./css/jq_scroll_bar.css" //引入样式文件

class ScrollBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scroll_box_height:0,//滚动条高度
            element_height:0,//元素高度
            show_scroll_height:0,//显示滚动条高度
            is_show_y:false,//y方向滚动条是否显示
            top:0,//距离顶部未知
            mousemove_event_start:0,//滚动条移动的开始位置
        };
    }
    //dom渲染完成
    componentDidMount() {
        const { params } = this.props;
        //定时检查是否需要滚动条
        setInterval(()=>this.check(),200);
        let _this=this
        let scroll_bar=document.querySelector(params.scroll_bar);
        //移动事件
        function mousemove_event(e){
            let dom = document.querySelector(params.container);//滚动对象
            let start = parseFloat(_this.mousemove_event_start);//开始滚动的位置
            let show_scroll_height = document.querySelector(params.scroll_bar).offsetHeight;//显示的滚动条高度
            let end = e.pageY;
            let curr_postion=end-start;
            
            if (curr_postion <= 0) {
                curr_postion=0;
            }else if(curr_postion+show_scroll_height>=_this.state.element_height){
                curr_postion=_this.state.element_height-show_scroll_height;
            }
            _this.state.top=curr_postion;
            _this.setState(_this.state);
            //控制真实滚动条
            //模拟滚动条
            let scroll_height=dom.offsetHeight-show_scroll_height;//滚动高度-滚动条高度=滚动高度
            //计算真实滚动条
            let true_scroll_height=document.querySelector(params.content).offsetHeight-dom.offsetHeight;//真实内容高度-容器高度=真实滚动高度
            document.querySelector(params.container).scrollTop=curr_postion/scroll_height*true_scroll_height;
        }
        //注册鼠标按下滚动条 事件
        scroll_bar.addEventListener('mousedown',function(e){
            e.stopPropagation();//阻止默认事件
            _this.mousemove_event_start=e.clientY-parseFloat(scroll_bar.style.top);
            console.log(e.clientY,parseFloat(scroll_bar.style.top))
            document.addEventListener('mousemove',mousemove_event,false);
        })
        //鼠标松开事件
        document.addEventListener('mouseup',function(e){
            document.removeEventListener('mousemove',mousemove_event,false);
        })
        //滚动事件
        //dom_scroll.addEventListener('DOMMouseScroll', e.scroll_handle, false);

    }
    //检查内容是否发生变化
    check(){
        const { params } = this.props;
        let dom = document.querySelector(params.container);
        let scroll_box_height = dom.scrollHeight;//滚动条容器高度
        let element_height = dom.offsetHeight;//元素实际高度
        //更新元素高度信息
        if(this.state.scroll_box_height!=scroll_box_height)this.state.scroll_box_height=scroll_box_height;
        if(this.state.element_height!=element_height)this.state.element_height=element_height;
        
        if (element_height / scroll_box_height >= 1) {
            this.state.is_show_y=false;//不需要滚动条
        } else {
            this.state.is_show_y=true;//需要滚动条
        }
        this.state.is_show_y=true
        this.setState(this.state)
    }
    render() {
        const { params } = this.props;
        return (
            <>
                <div className={"scroll_bar_box "+(this.state.is_show_y?'':'hide')}>
                    <div className="scroll_bar" style={{'top':this.state.top+"px"}}></div>
                </div>
            </>
        )
    }
}
export default ScrollBar
