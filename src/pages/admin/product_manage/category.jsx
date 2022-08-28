import { Button, Input,Tree,Space} from 'antd';
import React, {useEffect} from 'react';
import axios from "axios"
import {nanoid} from "nanoid"
import {set_menu, set_menu_tier} from "../../../store/admin/menu_data";
import {Option} from "antd/es/mentions";
import "../../../components/admin/css/base.css";
import "../css/base.css";
import {DownOutlined } from "@ant-design/icons";//引入图标

//引入admin 管理的基础样式文件
class Index extends React.Component {
    //产品类目树
    
    //状态信息
    state={
        select_category_id:'',
        select_category_title:'',
        current_category_title:'',
        tree_data:[],
        expanded_keys:[],
    }
    

    
    //根据id 得到选择的层级关系
    select_tree(id_array){
        let tree_data=this.state.tree_data
        if(id_array.length==0)return false;
        let id=id_array[0];//可以多选但是 目前只处理一个
        //查找菜单层级
        function find_category(tree_data, id) {
            //找到页面对应的菜单层级关系
            let category_level = []
            tree_data.map(function (value) {
                if(value['key']==id)category_level.push(value)
                if (typeof (value['children']) != "undefined") {
                    let temp_category_level=find_category(value['children'],id);
                    if (temp_category_level.length >= 1) {
                        temp_category_level.forEach(function (item) {
                            category_level.push(item)
                        })
                        category_level.push(value)
                    }
                }
            })
            return category_level
        }
        let category_array=find_category(tree_data,id);
        category_array=category_array.reverse();//数组反转

        let title_array=new Array()
        category_array.forEach(function(val){
            if(typeof(val['title'])=="string")title_array.push(val['title'])
        })
        //更新状态
        this.state.current_category_title=title_array.join('->')
        this.setState(this.state);
    }

    on_select(id,info){

        this.state.select_category_id=info.node.key;//选择类目的id
        this.state.select_category_title=info.node.title;//选择类目的标题
        this.setState(this.state);
        this.select_tree(id)
    }

    //获取参数 没有时获取默认值
    get_params(name,val){
        if(this.props.params.get(name))return this.props.params.get(name);
        return val;
    }
    //dom渲染完成
    componentDidMount() {
        //第一次渲染时 需要进行菜单列表的请求
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "admin/product_manage/get").then(
            response => {
                this.state.tree_data = response.data['data'];
                this.setState(this.state);
            },
            error => {
                console.log('获取用户数据失败', error);
            }
        );
    }

    //页面刷新
    render() {
        //等树节点加载完成后渲染
        let temp_tree='';
        if(this.state.tree_data.length>=1){
            temp_tree=<Tree
                        showLine
                        height={300}
                        defaultExpandAll={true}
                        onSelect={(ids,val)=>this.on_select(ids,val)}
                        treeData={this.state.tree_data}
                        /> 
        }

        return (
            <>
                <div style={{"padding": "10px","position":"relative"}}>
                    {/*搜索功能*/}
                    <div className="from_box" >
                        <div className="product_category_box">
                            <div className="product_category_tree_box" style={{width:"400px"}}>
                                {temp_tree}
                            </div>
                            <div className="product_category_modify">
                                <div className="modify_action">
                                    <label>当前选择:<span style={{"color":"red"}}> {this.state.current_category_title}</span></label>
                                </div>
                                {/*改名操作*/}
                                <div className="modify_action">
                                    <Space>
                                        <Input value={this.state.select_category_title}  /><Button type="primary">改名</Button>
                                    </Space>
                                </div>
                                {/*添加操作*/}
                                <div className="modify_action">
                                    <Space>
                                        <Input /><Button type="primary">添加</Button>
                                    </Space>
                                </div>
                                {/*删除*/}
                                <div className="modify_action">
                                    <Space>
                                        <Input value={this.state.select_category_title}  /><Button type="primary">删除</Button>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Index;
