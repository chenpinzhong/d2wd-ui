import React from "react";
import { Button, Result } from 'antd';
import {nanoid} from "nanoid"
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_data: [],//分页数据
            table_loading: false,//页面数据是否加载中
        };
    }
    //获取参数 没有时获取默认值
    get_params(name, val) {
        if (this.props.params.get(name)) return this.props.params.get(name);
        return val;
    }

    //dom渲染完成
    componentDidMount() {
    }

    render() {
        return <>
            <Result
                status="success"
                title="操作成功"
                subTitle="用户信息添加成功!"
                extra={[
                    <Button type="primary" key={nanoid()}>跳转到后台</Button>,
                    <Button type="" key={nanoid()}>留在原地</Button>,
                ]}
            />
        </>
    }
}
export default Index
