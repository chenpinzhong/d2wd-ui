import React from "react";
import { UserOutlined,UnlockOutlined } from '@ant-design/icons';
import {Input, Button} from 'antd';
class Index extends React.Component {
    //获取参数 没有时获取默认值
    get_params(name, val) {
        if (this.props.params.get(name)) return this.props.params.get(name);
        return val;
    }
    render() {
        return <>
            <div className="main" style={{"width":"450px","margin":" 150px auto 100px auto"}}>
                <div className="login">
                    <div style={{"display":"flex","justifyContent": "center","marginBottom":"15px"}}>
                        <img src={process.env.PUBLIC_URL + '/d2wd-logo.png'} alt=""/>
                        <div style={{"fontSize":"28px","height":"48px","lineHeight":"48px"}}>管理系统</div>
                    </div>
                    <div className="inset">
                        <form method="post">
                            <div className="ant-row ant-form-item">
                                <Input htmlType="text" size="large" placeholder="账号" prefix={<UserOutlined />} />
                            </div>
                            <div className="ant-row ant-form-item">
                                <Input htmlType="password" size="large" placeholder="密码" prefix={<UnlockOutlined />} />
                            </div>
                            <div className="ant-row ant-form-item">
                                <Button htmlType="submit" type="primary" style={{"width":"100%","height":"40px"}}>登录</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    }
    }
    export default Index
