import {Table} from 'antd';
import React, {useEffect} from 'react';
import axios from "axios"
import {nanoid} from "nanoid"
import {set_menu, set_menu_tier} from "../../../store/admin/menu_data"; //ajax请求

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page_data: [],table_loading:false};
        this.columns = this.table_columns();
    }

    //dom渲染完成
    componentDidMount() {
        this.get_page_data(1,20);//获取页面数据
    }
    //获取页面数据
    get_page_data(page=1,page_size=20){
        this.state.table_loading=true
        this.setState(this.state);
        //第一次渲染时 需要进行菜单列表的请求
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "/admin/user.api/index"+"?page="+page+"&page_size="+page_size).then(
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
    //表格列信息
    table_columns() {
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
        ];
        return columns;
    }

    render() {

        let pagination = {
            showSizeChanger: true, //是否可以改变 pageSize
            showQuickJumper: false, //是否可以快速跳转至某页
            total: this.state.page_data.total,
            pageSize:this.state.page_data.per_page,
            current: this.state.page_data.current_page,
            //显示总条数
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} , 总共 ${total} 条`,
            //pageSize 变化的回调
            onShowSizeChange: (current, pageSize) => this.get_page_data(current,pageSize),
            //页码改变的回调，参数是改变后的页码及每页条数
            onChange: (current, pageSize) => this.get_page_data(current,pageSize),
        };
        return (
            <>
                <div style={{"padding": "10px"}}>
                    <Table rowKey="id"
                        columns={this.columns}
                        dataSource={this.state.page_data.data}
                        pagination={pagination}
                        position='bottomCenter'
                        bordered
                        loading={this.state.table_loading}
                        size='middle'
                        showSizeChanger='false'
                        title={() => '管理员列表'}
                    />
                </div>
            </>
        )
    }

}
export default Index;
