import React from 'react';
import "../../../components/admin/css/base.css";
import "../css/base.css";//引入admin 管理的基础样式文件
import { nanoid } from "nanoid"
import {Button, Image, Input, message, Space, Table, Tree,Popconfirm} from 'antd';
import axios from "axios";
import {CloseOutlined, PlusOutlined, UploadOutlined,QuestionCircleOutlined} from "@ant-design/icons";
import { Modal, Upload } from 'antd';

import AttributeEdit from "../../../components/admin/AttributeEdit" //属性编辑组件
import MyEditor from "../../../components/common/MyEditor" //编辑器组件


class Add extends React.Component{
    editor={
        editor_html:''
    }
    up_img1={
        file_extension: "png",
        file_id: "41",
        file_name: "O1CN017hfOEl22AESNS8Qyu_!!2-item_pic.png",
        file_path: "D:\\UI\\d2wd-server\\public/upload/temp/2022-09-05\\63154de41eaf6_O1CN017hfOEl22AESNS8Qyu_!!2-item_pic.png",
        file_size: 233230,
        file_type: "image/png",
        user_id: 0,
        web_path: "/upload/temp/2022-09-05\\63154de41eaf6_O1CN017hfOEl22AESNS8Qyu_!!2-item_pic.png",
        web_path_100: "/upload/temp/2022-09-05\\100_63154de41eaf6_O1CN017hfOEl22AESNS8Qyu_!!2-item_pic.png",
        web_path_400: "/upload/temp/2022-09-05\\400_63154de41eaf6_O1CN017hfOEl22AESNS8Qyu_!!2-item_pic.png",
    };
    up_img2={
        file_extension: "png",
        file_id: "42",
        file_name: "O1CN01hfgFGr22AESGHd3u6_!!2-item_pic.png",
        file_path: "D:\\UI\\d2wd-server\\public/upload/temp/2022-09-05\\63154e1f65050_O1CN01hfgFGr22AESGHd3u6_!!2-item_pic.png",
        file_size: 241491,
        file_type: "image/png",
        user_id: 0,
        web_path: "/upload/temp/2022-09-05\\63154e1f65050_O1CN01hfgFGr22AESGHd3u6_!!2-item_pic.png",
        web_path_100: "/upload/temp/2022-09-05\\100_63154e1f65050_O1CN01hfgFGr22AESGHd3u6_!!2-item_pic.png",
        web_path_400: "/upload/temp/2022-09-05\\400_63154e1f65050_O1CN01hfgFGr22AESGHd3u6_!!2-item_pic.png",
    };

    attribute_data1={
        attribute_name:"颜色",
        attribute_value_list:[
            {value: '白色', image_id: 41},
            {value: '粉色', image_id: 42},
        ],
    }
    attribute_data2={
        attribute_name:"容量",
        attribute_value_list:[
            {value: '64GB', image_id: false},
            {value: '128GB', image_id: false},
            {value: '256GB', image_id: false},
        ],
    }

    state={
        product_catalog:[],//产品类目数据
        expanded_keys:[],//默认展开的产品类目
        category_select:false,//是否打开选择目录
        attribute_select:false,//属性选择是否打开
        product_images:[this.up_img1,this.up_img2],
        attribute_info:[this.attribute_data1,this.attribute_data2],//目前产品拥有的属性
    };



    //接收编辑器的html 数据
    editor_get_html=(html)=>{
        this.editor.editor_html=html;
    }
    //获取请求参数
    get_params(name, val) {
        if (this.props.params.get(name)) return this.props.params.get(name);
        return val;
    }


    ////////////////////////////////////////////////////////////////////
    //类型选择 方法
    //打开选择类目
    open_category_select(){
        this.state.category_select=true;
        this.setState(this.state)
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
        return  title_array.join('->')
    }
    //类目选择
    on_select(id,info){
        this.state.current_category_title=this.select_tree(id)
        this.setState(this.state);
        this.page_edit_close('category_select')
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
    //类目树 展开方法
    on_expand = expanded_keys => {
        this.state.expanded_keys=expanded_keys;
        this.setState(this.state)
    }
    //打开属性选择器
    open_attribute_select(){
        this.state.attribute_select=true;
        this.setState(this.state)
    }

    ////////////////////////////////////////////////////////////////////
    //产品图 方法

    //添加产品图
    product_images_add(file){
        this.state.product_images.push(file);
        this.setState(this.state);
    }

    //移除当前的产品图
    product_images_del(file_id){
        let product_images=[];
        let product_images_index=false;
        this.state.product_images.map(function (value,index){
            if(value['file_id']==file_id)product_images_index=index;
        })
        if(product_images_index===false)return false;
        this.state.product_images.splice(product_images_index,1);//移除掉一个成员
        this.setState(this.state);
    }

    ////////////////////////////////////////////////////////////////////
    //产品属性 方法
    //添加属性
    add_attribute=(attribute_name,attribute_value_list)=>{
        let attribute_data={
            attribute_name:attribute_name,
            attribute_value_list:attribute_value_list,
        }
        let check_flag=false;//默认不存在
        this.state.attribute_info.forEach(function (value,index){
            if(value['attribute_name']==attribute_name)check_flag=true;
        })
        //如果属性不存在
        if(check_flag==false){
            this.state.attribute_info.push(attribute_data)
            message.info("属性名:"+attribute_name+" 添加成功!").then(r =>{});
        }else{
            message.error("属性名:"+attribute_name+" 已经存在!").then(r =>{});
        }
        this.page_edit_close('attribute_select');//关键编辑功能
        this.update_product_table();//更新产品表
        this.setState(this.state)
    }

    //删除属性
    del_attribute(attribute_name){
        let del_index=false;
        this.state.attribute_info.forEach(function (value,index){
            if(value['attribute_name']==attribute_name)del_index=index;
        })
        if(typeof(del_index)=="number"){
            this.state.attribute_info.splice(del_index,1);//移除掉一个成员
            message.info("删除属性成功:"+attribute_name).then(r =>{});
        }else{
            message.error("删除属性错误:"+attribute_name+" 不存在!").then(r =>{});
        }
        this.update_product_table();//更新产品表
        this.setState(this.state)
    }

    ////////////////////////////////////////////////////////////////////
    //产品表方法
    //更新产品表
    update_product_table(){
        let attribute_info=this.state.attribute_info;
        let sku_info=[];
        //笛卡尔乘积
        function cartesian_product(attribute_set_array){
            let result_array=[];//返回数据
            let attribute_name_array=[];//得到属性名集合
            attribute_set_array.forEach(function(value,index){
                attribute_name_array.push(index)
            })
            if(attribute_name_array.length==0)return [];//空数据 提前返回
            //第一个集合
            let attribute_index=0;
            let current_attribute_index=attribute_name_array[attribute_index];
            let current_attribute_set_array=attribute_set_array[current_attribute_index];//上次计算的属性
            let attribute_name=current_attribute_set_array['attribute_name']
            let attribute_value_list=current_attribute_set_array['attribute_value_list']
            attribute_value_list.forEach(function (attribute_value){
                let obj={};
                obj[attribute_name]=attribute_value;
                result_array.push(obj)
            })
            //后续集合处理
            while(attribute_index<attribute_name_array.length-1){
                let before_array=result_array;//当前的循环集合
                result_array=[];//清空当前记录
                attribute_index++;
                let current_attribute_name=attribute_set_array[attribute_index]['attribute_name'];
                let current_attribute_set_array = attribute_set_array[attribute_index]['attribute_value_list'];//当前属性集合
                before_array.forEach(function (val1){
                    current_attribute_set_array.forEach(function (attribute_value){
                        let obj={};
                        obj[current_attribute_name]=attribute_value;
                        result_array.push({...val1,...obj})
                    })
                })
            }
            return result_array;
        }
        let return_array=cartesian_product(attribute_info);

        //补充信息
        //库存,价格,售价
        sku_info=return_array.map(function (val,index){
            val['uid']={'value':index};
            val['库存']={'value':0};
            val['价格']={'value':0};
            val['售价']={'value':0};
            return val
        })
        console.log(sku_info)
    }


    //通用功能 关闭编辑功能
    page_edit_close(name){
        this.state[name]=false
        this.setState(this.state);//刷新页面
    }

    get_html(){
        console.log(this.editor.editor_html)
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

        this.update_product_table();
    }
    //页面刷新
    render() {
        let _this=this;//方便操作
        let server_url = process.env.REACT_APP_SERVER_URL;
        const update_props = {
            action: server_url+'/admin/upload/attribute_image',//上传地址
            listType: 'text',
            name:'attribute_image',
            showUploadList:false,
            multiple: true,//多文件上传
            onChange:function (data){
                let file=data['file'];
                //图片上传中
                if(file['status']=='uploading'){
                    console.log("上传文件","上传进度",'文件名:'+file['name']+" 文件大小:"+(file['size']/1024/1024).toFixed(2)+"MB","上传进度",file['percent'])
                }
                //图片上传完成
                if(file['status']=='done'){
                    let response=file['response'];
                    if(response["code"]==200){
                        _this.state.product_images.push(response['data']);//增加产品图
                        _this.setState(_this.state);
                    }else{
                        console.log("上传文件","存在错误",'文件名:'+file['name'],response['data']["msg"])
                    }
                }
            },
        };
        let product_images=this.state.product_images;

        //属性编辑方法
        let attribute_edit_props={
            'product_images':this.state.product_images,//属性的产品图 引用类型
            'attribute_info':[],//目前已有的属性信息
            'add_attribute':this.add_attribute,
        }


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

                            {/*类目选择功能*/}
                            <div className={"page_edit "+(this.state.category_select==true?'':'hide') } ref={this.category_select}>
                                <div className="page_content">
                                    <div className="page_title_box">
                                        <div className="page_title">选择类目</div>
                                        <div className="page_edit_close" onClick={()=>{this.page_edit_close('category_select')}}><CloseOutlined /></div>
                                    </div>
                                    <div style={{"margin":"20px"}}>
                                        <Tree
                                            showLine
                                            onExpand={this.on_expand}
                                            expandedKeys={this.state.expanded_keys}
                                            onSelect={(ids,val)=>this.on_select(ids,val)}
                                            height={300}
                                            treeData={this.state.product_catalog}
                                        />
                                    </div>
                                </div>
                                <div className="page_bg"></div>
                            </div>

                            {/*属性选择功能*/}
                            <div className={"page_edit "+(this.state.attribute_select==true?'':'hide') } ref={this.attribute_select}>
                                <div className="page_content">
                                    <div className="page_title_box">
                                        <div className="page_title">添加属性</div>
                                        <div className="page_edit_close" onClick={()=>{this.page_edit_close('attribute_select')}}><CloseOutlined /></div>
                                    </div>
                                    <div style={{"margin":"20px"}}>
                                        <AttributeEdit {...attribute_edit_props}/>
                                    </div>
                                </div>
                                <div className="page_bg"></div>
                            </div>

                            {/*产品目录*/}
                            <div className="from_element" id="current_category" style={{width:"1000px"}}>
                                <label className="label">产品目录</label>
                                <div className="remarks">{this.state.current_category_title}</div>
                                <input type="hidden" name="category_id"/>
                                <Button style={{padding:"0px 5px"}} type="link" onClick={()=>this.open_category_select()}>选择目录</Button>
                            </div>
                            {/*基础信息*/}
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">产品名称</label>
                                <Input className="input" name="product_name" placeholder="产品名称"/>
                                <span className="remarks" title="描述">产品名称</span>
                            </div>
                            {/*品牌信息*/}
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">品牌</label>
                                <Input className="input" name="brand_name" placeholder="品牌"/>
                                <span className="remarks" title="描述">品牌</span>
                            </div>

                            {/*上传产品图*/}
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">产品图</label>
                                <div>
                                    <Upload {...update_props}>
                                        <Button type="dashed" icon={<UploadOutlined />}>上传图片</Button>
                                    </Upload>
                                    <div className="product_image_list">
                                        {product_images.map(function (image_data){
                                            return (
                                                <div key={nanoid()} className="product_image" >
                                                    <Image
                                                        data-id={image_data['file_id']}
                                                        width={100}
                                                        src={image_data['web_path']}
                                                    />
                                                    <div data-id={image_data['file_id']} className="sub_close" onClick={()=>_this.product_images_del(image_data['file_id'])}>
                                                        <CloseOutlined style={{fontSize:"12px"}} />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/*产品属性*/}
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">产品属性</label>
                                <div>
                                    <Button type="dashed"  onClick={()=>this.open_attribute_select()}>增加属性</Button>
                                    <div className="attribute_info_list" style={{marginTop:"5px"}}>
                                        <Space>
                                            {
                                                this.state.attribute_info.map(function (val){
                                                    return(
                                                        <Popconfirm key={nanoid()} icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
                                                                    title={"是否删除:"+val['attribute_name']}
                                                                    okText={"确认"}
                                                                    cancelText={"取消"}
                                                                    onConfirm={()=>_this.del_attribute(val['attribute_name'])}
                                                                    >
                                                            <Button >{val['attribute_name']}</Button>
                                                        </Popconfirm>
                                                    )
                                                })
                                            }
                                        </Space>
                                    </div>
                                </div>
                            </div>
                            {/*子产品表*/}
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">产品表</label>
                                <div>
                                    <Table/>
                                </div>
                            </div>


                            {/*产品描述*/}
                            <div className="from_element"  style={{width:"1000px"}}>
                                <label className="label">产品描述</label>
                                {/*富文本编辑器 https://www.wangeditor.com/*/}
                                <div>
                                    <MyEditor get_html={this.editor_get_html}/>
                                </div>
                            </div>

                            <div className="from_element">
                                {/*占位标签*/}
                                <label className="label"></label>
                                <input name="page" type="hidden" value={this.get_params('page', 1)}/>
                                <input name="page_size" type="hidden" value={this.get_params('page_size', 1)}/>
                                <Button type="primary" onClick={()=>this.get_html()} >获取数据</Button>
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
