import { Button, Input,Table ,Pagination} from 'antd';
import React, {useEffect} from 'react';
import axios from "axios"
import {nanoid} from "nanoid"
import {set_menu, set_menu_tier} from "../../../store/admin/menu_data";
import {Option} from "antd/es/mentions";
import "../../../components/admin/css/base.css";
import "../css/base.css";
import {CloseOutlined} from "@ant-design/icons";//引入图标

//引入admin 管理的基础样式文件
class Index extends React.Component {
    state = {
        page_data: {
            current_page:1,//当前分页
            per_page:'20', //默认分页大小
            pageSizeOptions:[10,15,20,30,50,100]//分页选项
        },//分页数据
        table_loading:false,//页面数据是否加载中
        //编辑数据
        modify_page:{
            show:false,
            edit_type:'add',//add,edit  add 是添加数据 不会显示默认数据 ,edit会显示默认数据
            title_map:{'add':'添加用户信息','edit':'编辑用户信息'},
            submit_title_map:{'add':'提交','edit':'提交'},
            default_data:{}//默认数据
        },
    };
    columns = this.table_columns();

    //获取参数 没有时获取默认值
    get_params(name,val){
        if(this.props.params.get(name))return this.props.params.get(name);
        return val;
    }
    //dom渲染完成
    componentDidMount() {
        this.get_page_data(this.get_params('page',1),this.get_params('page_size',10));//获取页面数据

        window.addEventListener("popstate", function(e) {
            window.location.href=window.location.href;//强制刷新
        }, false);
    }
    //获取页面数据
    get_page_data(page=1,page_size=10){
        let params_string='';
        let key_list=[]
        this.props.params.forEach(function(val,key){
            key_list.push(key)
            if(key=='page'){
                params_string+="&"+key+"="+page
                return val;
            }
            if(key=='page_size'){
                params_string+="&"+key+"="+page_size
                return  val;
            }
            params_string+="&"+key+"="+val;
            return  val;
        })
        //如果没有分页信息就补充
        if(key_list.indexOf('page')<0)params_string+="&page="+page
        if(key_list.indexOf('page_size')<0)params_string+="&page_size="+page_size

        let search="?"+params_string.substr(1)
        window.history.pushState({}, '', search)
        this.state.table_loading=true;//页面加载状态
        this.setState(this.state);//更新状态

        //第一次渲染时 需要进行菜单列表的请求
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.post(server_url + "/admin/product_manage/get"+search).then(
            response => {
                this.table_data_handle(response.data['data'])
                this.state.table_loading=false
                this.setState(this.state);
            },
            error => {
                console.log('获取用户数据失败', error);
            }
        );
    }

    //数据展示处理
    table_data_handle(data){
        this.state.page_data = data;//得到分页数据
        this.setState(this.state);
    }


    //关闭编辑功能
    page_edit_close(){
        this.state.modify_page.show=!this.state.modify_page.show
        this.setState(this.state);//刷新页面
    }
    //表格列信息
    table_columns() {
        //this.table_columns = this.table_columns.bind(this);
        let _this=this
        let columns = [
            //ID列
            {
                title: 'ID',
                dataIndex: 'id',
            },
            //产品名称
            {
                title: '产品名称',
                dataIndex: 'product_name',
            },
            //用户名称
            {
                title: '用户名称',
                dataIndex: 'brand_name',
            },
            //产品状态
            {
                title: '产品状态',
                dataIndex: 'product_status',
            },
            //添加时间
            {
                title: '添加时间',
                dataIndex: 'add_time',
            },
            //更新时间
            {
                title: '更新时间',
                dataIndex: 'update_time',

            },
            //操作
            {
                title: '操作',
                width:140,
                render:function(data) {
                    return <>
                        <Button size="small" type="link" data-id={data['id']} onClick={()=>_this.edit(data)}>编辑</Button>
                        <Button size="small" type="link" data-id={data['id']} onClick={()=>alert('目前不支持删除')}>删除</Button>
                    </>
                },
            },
        ];
        return columns;
    }

    //页面刷新
    render() {
        let page_data=this.state.page_data
        const expandedRowRender = () => {
            const columns = [
                {
                    title: "Date",
                    dataIndex: "date",
                    key: "date"
                },
            ];
            const data = [];

            for (let i = 0; i < 3; ++i) {
                data.push({
                    key: i.toString()+"ASDASASAA",
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56"
                });
            }
            return <Table columns={columns} dataSource={data} pagination={false} />;
        };



        return (
            <>
                <div style={{"padding": "10px","position":"relative"}}>
                    {/*搜索功能*/}
                    <div className="from_box" >
                        <form className="from_flex" onSubmit={()=>console.log('1')}>
                            <div className="from_element">
                                <label className="label" title="产品ID">产品ID:</label>
                                <Input name="product_id" placeholder="产品ID" defaultValue={this.props.params.get('product_id')}/>
                            </div>
                            <div className="from_element">
                                <label className="label"  title="产品名称">产品名称:</label>
                                <Input name="product_name" placeholder="产品名称" defaultValue={this.props.params.get('product_name')}/>
                            </div>
                            <div className="from_element">
                                <input name="page"  type="hidden" value={this.get_params('page',1)} />
                                <input name="page_size" type="hidden" value={this.get_params('page_size',10)} />
                                <Button type="primary" htmlType="submit">查询</Button>
                            </div>
                        </form>
                    </div>
                    {/*表格与分页功能*/}
                    <Table rowKey="id"
                           columns={this.columns}
                           dataSource={this.state.page_data.data}
                           expandable={{
                               expandedRowRender,
                               defaultExpandedRowKeys: ['0'],
                           }}
                           position='bottomCenter'
                           pagination={false}
                           bordered
                           loading={this.state.table_loading}
                           showSizeChanger='false'
                    />
                    <div className="page_bottom">
                        <div className="bottom_function">
                            <a href='#' onClick={()=>this.add()}>添加用户</a>
                        </div>
                        <div className='paging_module'>
                            <Pagination
                                current={page_data.current_page}
                                showSizeChanger={true}
                                showQuickJumper={false}
                                total={page_data.total}
                                pageSizeOptions={page_data.pageSizeOptions}
                                pageSize={page_data.per_page}
                                showTotal={(total, range) => `显示 ${range[0]}-${range[1]} , 总共 ${total} 条`}
                                onShowSizeChange={(current, page_size) => this.get_page_data(current,page_size)}
                                onChange={(current, page_size) => this.get_page_data(current,page_size)}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Index;
