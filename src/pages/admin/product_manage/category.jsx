import { Button, Input,Tree,Space,message} from 'antd';
import React from 'react';
import axios from "axios"
import "../../../components/admin/css/base.css";
import "../css/base.css";
//引入图标

//引入admin 管理的基础样式文件
class Index extends React.Component {
    category_modify = React.createRef();//修改
    category_add = React.createRef();//添加
    category_del = React.createRef();//删除

    //状态信息
    state={
        select_category_id:'',//选择的ID
        select_category_title:'',//选择的目录名称
        current_category_title:'',//当前的目录名称
        edit_category_title:'',//编辑的目录名称
        add_category_title:'',//添加的目录名称
        product_catalog:[],
        expanded_keys:[],
    }

    //根据id 得到选择的层级关系
    select_tree(id_array){
        let tree_data=this.state.product_catalog
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
        this.state.select_category_title=info.node.title;//选择的目录名称
        this.state.edit_category_title=info.node.title;//编辑的目录名称
        this.state.add_category_title=info.node.title;//添加的目录名称
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
        this.get_product_catalog()
    }
    //类目树 默认展开
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
    get_product_catalog(){
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "admin/product_catalog/get").then(
            response => {
                this.state.product_catalog = response.data['data'];
                let expanded_keys=this.default_expanded(this.state.product_catalog,2);
                this.state.expanded_keys=expanded_keys;
                this.setState(this.state);
            },
            error => {
                console.log('获取用户数据失败', error);
            }
        );
    }
    //类目编辑操作
    category_edit(e,type){
        let server_url = process.env.REACT_APP_SERVER_URL;
        let select_category_id=this.state.select_category_id;
        if(select_category_id==""){
            message.error('请先选择要操作的目录!').then(r => {console.log('请先选择要操作的目录!')});
            return false
        }
        let data= {};
        data['type']=type;
        data['category_id']=select_category_id;
        if(type=='category_modify')data['category_name']=this.category_modify.current.input.value;
        if(type=='category_add')data['category_name']=this.category_add.current.input.value;

        axios.post(server_url + "admin/product_catalog/category_edit",data).then(
            response => {
                if(response.data['code']=='200'){
                    this.get_product_catalog();//刷新产品目录
                    message.success(response.data['msg']);//错误信息
                }else{
                    message.error(response.data['msg']);
                }
            },
            error => {
                message.error('编辑目录错误');
            }
        );
    }
    //输入框 修改对应值
    modify_change(e,name){
        this.setState({[name]:  e.target.value})
    }
    //类目树 展开方法
    on_expand = expanded_keys => {
        this.state.expanded_keys=expanded_keys;
        this.setState(this.state)
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
                                    onExpand={this.on_expand}
                                    expandedKeys={this.state.expanded_keys}
                                    onSelect={(ids,val)=>this.on_select(ids,val)}
                                    treeData={this.state.product_catalog}
                                />
                            </div>
                            <div className="product_category_modify">
                                <div className="modify_action">
                                    <label>当前选择:<span style={{"color":"red"}}> {this.state.current_category_title}</span></label>
                                </div>
                                {/*改名操作*/}
                                <div className="modify_action">
                                    <Space>
                                        <Input ref={this.category_modify} value={this.state.edit_category_title}   onChange ={e=>this.modify_change(e,'edit_category_title')} />
                                        <Button type="primary" onClick={(e)=>this.category_edit(e,'category_modify')}>改名</Button>
                                    </Space>
                                </div>
                                {/*添加操作*/}
                                <div className="modify_action">
                                    <Space>
                                        <Input ref={this.category_add} value={this.state.add_category_title}  onChange ={e=>this.modify_change(e,'add_category_title')}  />
                                        <Button type="primary" onClick={(e)=>this.category_edit(e,'category_add')}>添加</Button>
                                    </Space>
                                </div>
                                {/*删除*/}
                                <div className="modify_action">
                                    <Space>
                                        <Input ref={this.category_del} disabled  value={this.state.select_category_title}  />
                                        <Button type="primary" onClick={(e)=>this.category_edit(e,'category_del')}>删除</Button>
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
