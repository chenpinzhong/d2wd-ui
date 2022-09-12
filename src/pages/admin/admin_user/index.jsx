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
        axios.get(server_url + "/admin/admin_user/get"+search).then(
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

    //关闭编辑功能
    page_edit_close(){
        this.state.modify_page.show=!this.state.modify_page.show
        this.setState(this.state);//刷新页面
    }
    //添加数据
    add(){
        this.state.modify_page.show=true
        this.state.modify_page.edit_type='add'
        this.setState(this.state);//刷新页面
    }
    //编辑数据
    edit(data){
        this.state.modify_page.show=true
        this.state.modify_page.edit_type='edit'
        this.state.modify_page.default_data=data
        this.setState(this.state);//刷新页面
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
                        <Button size="small" type="link" data-id={data['id']} onClick={()=>alert('目前不支持删除')}>删除</Button>
                    </>
                },
            },
        ];
        return columns;
    }

    //修改数据页面的渲染
    modify_page(){
        let data=this.state.modify_page;
        let title='';
        let submit_title='';
        if(data.edit_type in  data.title_map)title=data.title_map[data.edit_type];
        if(data.edit_type in  data.submit_title_map)submit_title=data.submit_title_map[data.edit_type];

        //添加的页面
        let add_jsx=<>
            {/*提交类型 表示当前表单的操作类型*/}
            <input type="hidden" name="action_type" value={data.edit_type}/>
            {/*账号名称*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">账号名称</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入账号名称" name="account_name" />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}} className="form_item_error">账号名称</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入账号密码</div>
            </div>
            {/*密码*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">密码</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入密码" name="password" type="password" />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入密码</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入密码</div>
            </div>
            {/*手机号*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">手机号</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入手机号" name="phone" />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入手机号</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入手机号</div>
            </div>
            {/*用户名称*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">用户名称</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入真实名称" name="user_name" />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入用户名称</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入用户名称</div>
            </div>
            {/*真实名称*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">真实名称</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入真实名称" name="real_name" />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入真实名称</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入真实名称</div>
            </div>
            <div className="form_item">
                <div className="item_col_25"></div>
                <div className="form_item_col item_col_40">
                    <Button type="primary" htmlType="submit">{submit_title}</Button>
                </div>
            </div>
        </>
        //编辑的页面
        let edit_jsx=<>
            {/*提交类型 表示当前表单的操作类型*/}
            <input type="hidden" name="action_type" value={data.edit_type}/>
            <input type="hidden" name="id" value={data.default_data.id}/>
            {/*ID主键*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">ID</div>
                <div className="form_item_col item_col_40">
                    <label>{data.default_data.id}</label>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}></div>
            </div>

            {/*账号名称*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">账号名称</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入账号名称" name="account_name" defaultValue={data.default_data.account_name} />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}} className="form_item_error">账号名称</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入账号密码</div>
            </div>
            {/*密码*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">密码</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入密码" name="password" type="password" />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入密码</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入密码</div>
            </div>
            {/*手机号*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">手机号</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入手机号" name="phone" defaultValue={data.default_data.phone} />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入手机号</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入手机号</div>
            </div>
            {/*用户名称*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">用户名称</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入真实名称" name="user_name"  defaultValue={data.default_data.user_name}/>
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入用户名称</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入用户名称</div>
            </div>
            {/*真实名称*/}
            <div className="form_item">
                <div className="form_item_label item_col_25">真实名称</div>
                <div className="form_item_col item_col_40">
                    <Input placeholder="请输入真实名称" name="real_name" defaultValue={data.default_data.real_name} />
                    {/*错误提示*/}
                    <div role="alert" style={{display:"none"}}  className="form_item_error">请输入真实名称</div>
                </div>
                {/*普通提示*/}
                <div style={{marginLeft:"10px"}}>请输入真实名称</div>
            </div>
            <div className="form_item">
                <div className="item_col_25"></div>
                <div className="form_item_col item_col_40">
                    <Button type="primary" htmlType="submit">{submit_title}</Button>
                </div>
            </div>
        </>

        return <>
            <div className={"page_edit"+" "+(data.show?'':"hide")}>
                <div className="page_content">
                    <div className="page_title_box">
                        <div className="page_title">{title}</div>
                        <div className="page_edit_close" onClick={()=>{this.page_edit_close()}}><CloseOutlined /></div>
                    </div>
                    <div style={{"marginTop":"20px"}}>
                        <form method="post">
                            {data.edit_type==='add'?add_jsx:''}
                            {data.edit_type==='edit'?edit_jsx:''}
                        </form>
                    </div>
                </div>
                <div className="page_bg"></div>
            </div>
        </>
    }

    //页面刷新
    render() {
        let page_data=this.state.page_data

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
                                <input name="page_size" type="hidden" value={this.get_params('page_size',10)} />
                                <Button type="primary" htmlType="submit">查询</Button>
                            </div>
                        </form>
                    </div>
                    {/*表格与分页功能*/}
                    <Table rowKey="id"
                        columns={this.columns}
                        dataSource={this.state.page_data.data}
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
                {/*页面数据的修改*/}
                {this.modify_page()}
            </>
        )
    }
}
export default Index;
