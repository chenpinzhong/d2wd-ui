import React, {useEffect} from 'react';
import axios from "axios"
import {nanoid} from "nanoid"
import {set_menu, set_menu_tier} from "../../../store/admin/menu_data";

import {
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
} from 'antd';
import "../css/base.css";//引入admin 管理的基础样式文件
class Add extends React.Component {
    constructor(props) {
        super(props);
    }

    //获取参数 没有时获取默认值
    get_params(name, val) {
        if (this.props.params.get(name)) return this.props.params.get(name);
        return val;
    }

    //dom渲染完成
    componentDidMount() {
    }

    //页面刷新
    render() {
        return (
            <>
                <div style={{"padding": "10px"}}>
                    <div className="from_box ant-form ant-form-horizontal">
                        <form className="from_black" action="/admin/user.api/add" method="post"
                              onSubmit={() => console.log('1')}>
                            <div className="from_element">
                                <label className="label" title="密码">手机号:</label>
                                <Input className="input" name="phone" placeholder="手机号"/>
                                <span className="remarks" title="描述">常用的手机号</span>
                            </div>
                            <div className="from_element">
                                <label className="label" title="描述">账号名称:</label>
                                <Input className="input" name="account_name" placeholder="账号名称"/>
                                <span className="remarks" title="描述">登陆账号的名称</span>
                            </div>
                            <div className="from_element">
                                <label className="label" title="用户名称">用户名称:</label>
                                <Input className="input" name="user_name" placeholder="用户名称"/>
                                <span className="remarks" title="描述">登陆后显示的用户名称</span>
                            </div>
                            <div className="from_element">
                                <label className="label" title="真实名称">真实名称:</label>
                                <Input className="input" name="real_name" placeholder="真实名称"/>
                            </div>
                            <div className="from_element">
                                <label className="label" title="密码">密码:</label>
                                <Input className="input" name="password" type="password" placeholder="密码"/>
                                <span className="remarks" title="描述">密码请尽量复杂</span>
                            </div>
                            <div className="from_element">
                                <label className="label"></label>{/*占位标签*/}
                                <input name="page" type="hidden" value={this.get_params('page', 1)}/>
                                <input name="page_size" type="hidden" value={this.get_params('page_size', 1)}/>
                                <Button type="primary" htmlType="submit">提交</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}

export default Add;
