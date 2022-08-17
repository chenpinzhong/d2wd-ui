import React from "react";
import { Button, Result } from 'antd';
class Index extends React.Component {
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
    render() {
        return <>
            <Result
                status="error"
                title={this.get_params('title','失败')}
                subTitle={this.get_params('msg','操作失败!')}
                extra={[
                    <Button type="primary" key="go_back" onClick={this.go_back}>返回</Button>,
                    <Button type="" key="retry" onClick={this.retry}>重试</Button>,
                ]}
            />
        </>
    }
}
export default Index
