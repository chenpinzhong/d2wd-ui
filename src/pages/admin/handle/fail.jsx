import React from "react";
import { Button, Result } from 'antd';
class Index extends React.Component {
    state={
        time:5,//倒计时
    }
    //获取参数 没有时获取默认值
    get_params(name, val) {
        if (this.props.params.get(name)) return this.props.params.get(name);
        return val;
    }
    //返回
    go_back = () =>{
        window.history.go(-1);//返回到操作页面
    }
    //重试
    retry= () =>{
        if(this.get_params('url')===''){
            this.go_back()
        }else{
            window.location.href = this.get_params('url');
        }
    }
    //body原始被点击事件
    body_click=()=>{
        this.state.time=0;
        this.setState(this.state);
        clearTimeout(this.timer);//卸载定时器
    }
    //组件加载
    componentDidMount() {
        //如果用户除非了点击事件 则取消自动跳转
        document.querySelector("body").addEventListener('click',this.body_click);

        this.timer = setInterval(() => {
                this.state.time-=1;
                this.setState(this.state)
                //计时已满 自动跳转
                if(this.state.time==0)this.go_back()
            },1000);
    }
    //组件卸载
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {
        return <>
            <Result
                status="error"
                title={this.get_params('title','失败')}
                subTitle={this.get_params('msg','操作失败!')}
                extra={[
                    <Button type="primary" key="go_back" onClick={this.go_back}>返回{this.state.time>0?"("+this.state.time+")":""}</Button>,
                    <Button type="" key="retry" onClick={this.retry}>重试</Button>,
                ]}
            />
        </>
    }
}
export default Index
