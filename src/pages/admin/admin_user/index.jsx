import { Button, Form, Input,Table ,Space,Tooltip} from 'antd';
import React, {useEffect} from 'react';
import axios from "axios"
import {nanoid} from "nanoid"
import {set_menu, set_menu_tier} from "../../../store/admin/menu_data";
import {Option} from "antd/es/mentions";
import "../../../components/admin/css/base.css";
import "../css/base.css";//引入admin 管理的基础样式文件
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page_data: [],//分页数据
            table_loading:false,//页面数据是否加载中
            edit:'',
        };
        this.columns = this.table_columns();
    }
    //获取参数 没有时获取默认值
    get_params(name,val){
        if(this.props.params.get(name))return this.props.params.get(name);
        return val;
    }
    //dom渲染完成
    componentDidMount() {
        this.get_page_data(this.get_params('page',1),this.get_params('page_size',15));//获取页面数据
    }
    //获取页面数据
    get_page_data(page=1,page_size=10){
        let params_string='';
        this.props.params.forEach(function (val,key){
            params_string+="&"+key+"="+val
        })
        this.state.table_loading=true;//页面加载状态
        this.setState(this.state);//更新状态
        //第一次渲染时 需要进行菜单列表的请求
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "/admin/admin_user.api/index"+"?page="+page+"&page_size="+page_size+params_string).then(
            response => {
                this.state.page_data = response.data['data'];
                this.state.table_loading=false
                this.setState(this.state);
            },
            error => {
                console.log('获取用户数据失败', error);
            }
        );
    }
    //用户信息编辑操作
    edit(data){
        console.log(data)
    }
    //表格列信息
    table_columns() {
        //this.table_columns = this.table_columns.bind(this);
        let _this=this
        let columns = [
            //ID列
            {
                dataIndex: 'id',
                title: 'ID',
            },
            //账号名称
            {
                dataIndex: 'account_name',
                title: '账号名称',
            },
            //用户名称
            {
                dataIndex: 'user_name',
                title: '用户名称',
            },
            //真实名称
            {
                dataIndex: 'real_name',
                title: '真实名称',
            },
            //真实名称
            {
                dataIndex: 'real_name',
                title: '真实名称',
            },
            //级别
            {
                dataIndex: 'level',
                title: '级别',
            },
            //级别
            {
                dataIndex: 'age',
                title: '年龄',
            },
            //权限组
            {
                dataIndex: 'group_rights',
                title: '权限组',
            },
            //用户权限
            {
                dataIndex: 'user_rights',
                title: '用户权限',
            },
            //离线时间
            {
                dataIndex: 'offline_time',
                title: '离线时间',
            },
            //注册时间
            {
                dataIndex: 'add_time',
                title: '注册时间',
            },
            //更新时间
            {
                dataIndex: 'update_time',
                title: '更新时间',
            },

            //手机号
            {
                dataIndex: 'phone_number',
                title: '手机号',
            },
            //用户状态
            {
                dataIndex: 'user_status',
                title: '用户状态',

            },
            //用户状态
            {
                title: '操作',
                width:140,
                render:function(data) {
                    return <>
                        <Button size="small" type="link" data-id={data['id']} onClick={()=>_this.edit(data)}>编辑</Button>
                        <Button size="small" type="link" data-id={data['id']}>删除</Button>
                    </>
                },
            },
        ];
        return columns;
    }
    onFinish = (values: any) => {
        console.log('Success:', values);
    };

    onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };



    //页面刷新
    render() {
        let pagination = {
            showSizeChanger: true, //是否可以改变 pageSize
            showQuickJumper: false, //是否可以快速跳转至某页
            total: this.state.page_data.total,
            pageSize:this.state.page_data.per_page,
            current: this.state.page_data.current_page,
            pageSizeOptions:[10,15,20,30,50,100],
            //显示总条数
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} , 总共 ${total} 条`,
            //pageSize 变化的回调
            onShowSizeChange: (current, pageSize) => this.get_page_data(current,pageSize),
            //页码改变的回调，参数是改变后的页码及每页条数
            onChange: (current, pageSize) => this.get_page_data(current,pageSize),
        };
        return (
            <>
                <div style={{"padding": "10px","position":"relative"}}>
                    {/*搜索功能*/}
                    <div className="from_box" >
                        <form className="from_flex" onSubmit={()=>console.log('1')}>
                            <div className="from_element">
                                <label className="label" title="描述">账号名称:</label>
                                <Input name="account_name" placeholder="账号名称" defaultValue={this.props.params.get('account_name')}/>
                            </div>
                            <div className="from_element">
                                <label className="label"  title="用户名称">用户名称:</label>
                                <Input name="user_name" placeholder="用户名称" defaultValue={this.props.params.get('user_name')}/>
                            </div>
                            <div className="from_element">
                                <label className="label" title="真实名称">真实名称:</label>
                                <Input name="real_name" placeholder="真实名称" defaultValue={this.props.params.get('real_name')} />
                            </div>
                            <div className="from_element">
                                <input name="page"  type="hidden" value={this.get_params('page',1)} />
                                <input name="page_size" type="hidden" value={this.get_params('page_size',1)} />
                                <Button type="primary" htmlType="submit">提交</Button>
                            </div>
                        </form>
                    </div>
                    {/*表格与分页功能*/}
                    <Table rowKey="id"
                        columns={this.columns}
                        dataSource={this.state.page_data.data}
                        pagination={pagination}
                        position='bottomCenter'
                        bordered
                        loading={this.state.table_loading}
                        showSizeChanger='false'
                    />
                </div>
                {/*页面编辑功能*/}
                <>
                    <div className="page_edit">
                        <div className="page_content">
                            <div className="page_title">编辑数据</div>
                            <div style={{"marginTop":"20px"}}>
                                <form method="post">
                                    <div className="form_item">
                                        <div className="form_item_label item_col_25">账号名称</div>
                                        <div className="item_col_40">
                                            <Input placeholder="请输入账号名称" />
                                            {/*错误提示*/}
                                            <div role="alert" className="form_item_error">账号名称</div>
                                        </div>
                                        {/*普通提示*/}
                                        <div style={{marginLeft:"10px"}}>请输入账号密码</div>
                                    </div>
                                    <div className="form_item">
                                        <div className="form_item_label item_col_25">账号名称</div>
                                        <div className="item_content item_col_40">
                                            <Input placeholder="请输入账号名称" />
                                            {/*错误提示*/}
                                            <div role="alert" className="form_item_error">账号名称</div>
                                        </div>
                                        {/*普通提示*/}
                                        <div style={{marginLeft:"10px"}}>请输入账号密码</div>
                                    </div>
                                </form>


                                <Form name="basic" labelCol={{ span: 6 }} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} autoComplete="off" >
                                    <Form.Item label="账号名称">
                                        <Space>
                                            <Form.Item name="account_name" noStyle rules={[{ required: true, message: '账号名称' }]} >
                                                <Input readOnly style={{ width: 260 }} placeholder="账号名称" />
                                            </Form.Item>
                                            <Tooltip>管理员登陆的账号</Tooltip>
                                        </Space>
                                    </Form.Item>
                                    <Form.Item label="密码">
                                        <Space>
                                            <Form.Item name="password" noStyle rules={[{ required: true, message: '密码' }]} >
                                                <Input style={{ width: 260 }} placeholder="密码" />
                                            </Form.Item>
                                            <Tooltip>管理员登陆密码</Tooltip>
                                        </Space>
                                    </Form.Item>
                                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                        <Button type="primary" htmlType="submit">提交</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                        <div className="page_bg"></div>
                    </div>
                </>


                {this.state.edit}
            </>
        )
    }

}
export default Index;
