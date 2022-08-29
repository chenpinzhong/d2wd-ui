import React from 'react';
import "../../../components/admin/css/base.css";
import "../css/base.css";//引入admin 管理的基础样式文件

import {Button, Input, Tree} from 'antd';
import axios from "axios";


class Add extends React.Component {
    state={
        expanded_keys:[]
    };
    //产品类目树
    tree_data = [];
    //获取参数 没有时获取默认值
    get_params(name, val) {
        if (this.props.params.get(name)) return this.props.params.get(name);
        return val;
    }
    //默认展开
    default_expanded(product_catalog){
        let return_ids=[]
        for(let i=0;i<product_catalog.length;i++){
            let current_val=product_catalog[i]
            return_ids.push(current_val['key'])
            if(typeof (current_val['children'])!="object")continue;
            let temp_return_ids=this.default_expanded(current_val['children'])
            return_ids=return_ids.concat(temp_return_ids);
        }
        return return_ids
    }
    //展开方法
    on_expand = expanded_keys => {
        this.state.expanded_keys=expanded_keys;
        this.setState(this.state)
    }
    //dom渲染完成
    componentDidMount() {
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "/admin/product_catalog/get").then(
            response => {
                if(response.data.code=='200'){
                    this.state.product_catalog=response.data['data'];
                    let expanded_keys=this.default_expanded(this.state.product_catalog,2);
                    this.state.expanded_keys=expanded_keys;
                    this.setState(this.state);//更新状态
                }else{
                    console.log("获取用户信息失败 原因",response.data['msg']);
                }
            },
            error => {
                console.log('获取用户信息失败 接口错误', error);
            }
        );
    }
    //页面刷新
    render() {
        return (
            <>
                <div style={{"padding": "10px"}}>
                    <div className="from_box ant-form ant-form-horizontal">
                        <form className="from_black" action="/admin/user.api/add" method="post" onSubmit={() => console.log('1')}>
                            {/*导航功能*/}
                            <div tabIndex="0" className="next_nav_menu" style={{display:"none"}}>
                                <ul className="next_menu_content">
                                    <li className="next_nav_item selected">
                                        <div className="item_top"></div>
                                        <span data-id="current_category">类目信息</span>
                                    </li>
                                    <li className="next_nav_item">
                                        <div className="item_top" ></div>
                                        <span data-id="base_info">基础信息</span>
                                    </li>
                                    <li className="next_nav_item">
                                        <div className="item_top"></div>
                                        <span data-id="product_parameters">产品参数</span>
                                    </li>
                                    <li className="next_nav_item">
                                        <div className="item_top"></div>
                                        <span data-id="pledge">服务承诺</span>
                                    </li>
                                    <li className="next_nav_item">
                                        <div className="item_top" ></div>
                                        <span data-id="upload_images">图片上传</span>
                                    </li>
                                    <li className="next_nav_item">
                                        <div className="item_top"></div>
                                        <span data-id="sales_attribute">销售信息</span>
                                    </li>
                                    <li className="next_nav_item">
                                        <div className="item_top"></div>
                                        <span data-id="base_description">图文描述</span>
                                    </li>
                                    <li className="next_nav_item">
                                        <div className="item_top" ></div>
                                        <span data-id="payment_info">支付信息</span>
                                    </li>
                                </ul>
                            </div>
                            {/*产品类目*/}
                            <div className="from_element" id="current_category" style={{width:"1000px"}}>
                                <label className="label">产品目录</label>
                                <Tree
                                    showLine
                                    onExpand={this.on_expand}
                                    expandedKeys={this.state.expanded_keys}
                                    height={200}
                                    treeData={this.state.product_catalog}
                                />
                            </div>

                            {/*基础信息*/}
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">产品名称</label>
                                <Input className="input" name="product_name" placeholder="产品名称"/>
                                <span className="remarks" title="描述">产品名称</span>
                            </div>
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">品牌</label>
                                <Input className="input" name="brand_name" placeholder="品牌"/>
                                <span className="remarks" title="描述">品牌</span>
                            </div>
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">产品参数</label>
                                <Input className="input" name="brand_name" placeholder="产品参数"/>
                                <span className="remarks" title="描述">产品参数</span>
                                {/*
                                <li title="证书编号" data-parameters_name_zh="证书编号" data-parameters_value_zh="2017011606002401" data-parameters_name_en="证书编号"  data-parameters_value_en="2017011606002401">
                                证书编号 : 2017011606002401<div class="close"></div>
                                </li>
                                */}

                                <div className="com_struct">
                                    <button  type="button" className="next_btn">添加参数</button>
                                </div>
                            </div>
                            {/*富文本编辑器 https://www.wangeditor.com/*/}


                            <div className="from_element">
                                {/*占位标签*/}
                                <label className="label"></label>
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
