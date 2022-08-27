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
    tree_data = [
        {
            title: '产品类目',
            key: '0',
            children: [
                {
                    title: '衣服',
                    key: '2',
                    children: [
                        {
                            title: '上衣',
                            key: '3',
                        },
                        {
                            title: '裙子',
                            key: '4',
                        }
                    ],
                },
                {
                    title: '生活用品',
                    key: '5',
                    children: [
                        {
                            title: '雨伞',
                            key: '雨伞',
                            children: [
                                {
                                    title: '太阳伞',
                                    key: '太阳伞',
                                },
                                {
                                    title: '油布伞',
                                    key: '油布伞',
                                },
                            ],
                        },
                        {
                            title: '充电宝',
                            key: '充电宝',
                        },
                    ],
                },

            ],
        },
    ];

    //根据id 得到选择的层级关系
    select_tree(id){
        let tree_data=this.tree_data
        let category_lavel = []

        //查找菜单层级
        function find_category(tree_data, id) {
            //找到页面对应的菜单层级关系
            let category_level = []
            tree_data.map(function (value, key) {
                if (typeof (value['children']) != "undefined") {
                    console.log(value['children'])
                    let temp_category_level=find_category(value['children'],id);
                    if (temp_category_level.length >= 1) {
                        temp_category_level.forEach(function (item) {
                            category_level.push(item)
                        })
                        category_level.push(value)
                    }
                }
                return value
            })
            console.log(category_level)
            return category_level
        }
        let category_array=find_category(tree_data, id);
        console.log(category_array)

        /*
        //找到页面对应的菜单层级关系
        let menu_lavel = []
        menu_data.map(function (value, key) {
            if (typeof (value['href']) != "undefined" && pathname.indexOf(value.href) >= 0) {
                menu_lavel.push(value);
            }
            if (typeof (value['child']) != "undefined") {
                let temp_menu = find_menu_tier(value['child'], pathname);
                if (temp_menu.length >= 1) {
                    temp_menu.forEach(function (item) {
                        menu_lavel.push(item)
                    })
                    menu_lavel.push(value)
                }
            }
            return value
        })
        return menu_lavel
        */





    }

    on_select(id,info){
        this.select_tree(id)
        console.log('selected', id, info);
    }

    //获取参数 没有时获取默认值
    get_params(name,val){
        if(this.props.params.get(name))return this.props.params.get(name);
        return val;
    }
    //dom渲染完成
    componentDidMount() {

    }

    //页面刷新
    render() {

        return (
            <>
                <div style={{"padding": "10px","position":"relative"}}>
                    {/*搜索功能*/}
                    <div className="from_box" >
                        <div className="product_category_box">
                            <div className="product_category_tree_box" style={{width:"400px"}}>
                                <Tree
                                    showLine
                                    height={300}
                                    defaultExpandAll
                                    defaultExpandedKeys={['0']}
                                    onSelect={(id,val)=>this.on_select(id,val)}
                                    treeData={this.tree_data}
                                />
                            </div>
                            <div className="product_category_modify">
                                <div className="modify_action">
                                    <label>当前选择:雨伞</label>
                                </div>
                                {/*改名操作*/}
                                <div className="modify_action">
                                    <Space>
                                        <Input /><Button type="primary">改名</Button>
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
                                        <Input /><Button type="primary">删除</Button>
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
