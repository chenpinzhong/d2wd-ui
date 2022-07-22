import { Table } from 'antd';
import React from 'react';
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.columns = this.table_columns();
        this.data = this.table_data();
    }
    //表格列信息
    table_columns() {
        let columns = [
            //ID列
            {
                dataIndex: 'id',
                title: 'ID',
            },
            //用户名称
            {
                dataIndex: 'user_name',
                title: '用户名称',
            },
            //用户权限
            {
                dataIndex: 'user_rights',
                title: '用户权限',
                render: function (value) {
                    return <div>
                        {
                            value.map(function (value, index) {
                                return <span key={new Date() + Math.random()} style={{"marginRight":"5px"}}>{value}</span>
                            })   
                        } 
                        </div>  
                },
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
            //用户时间
            {
                dataIndex: 'user_time',//用户时间
                title: <>
                    <span>注册时间</span><br />
                    <span>登陆时间</span>
                </>,
                render: function (value) {
                    return <div>
                            <div className="add_time">{value.add_time}</div>
                            <div className="login_time">{value.login_time}</div>
                        </div>  
                },
            },
        ];
        return columns;
    }
    table_data(){
        //行数据
        let data = [
            {
                key: new Date() + Math.random(),
                'id': '1',
                'user_name': '陈品忠1',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '2',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '3',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '4',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '5',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '6',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '7',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '8',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '9',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '10',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '11',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '12',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '13',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '14',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '15',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
            {
                key: new Date() + Math.random(),
                'id': '16',
                'user_name': '陈品忠',
                'user_rights': ['超级管理员', '财务管理员', '功能管理员'],
                'phone_number': '153****4642',
                'user_status': '1',
                'user_time': {'add_time':'2022-07-21 00:00:00', 'login_time':'2022-07-21 00:00:00'},
                address: 'New York No. 1 Lake Park',
            },
        ];
        return data
    }
    //dom渲染完成
    componentDidMount() {

    }
    render() {
        return (
            <>
                <div className="title">用户模块/管理员/管理员列表</div>
                <div style={{"padding":"10px 15px 10px 10px"}}>
                    <Table
                        columns={this.columns}
                        dataSource={this.data}
                        bordered
                        title={() => '管理员列表'}
                        //footer={() => 'Footer'}
                    />
                </div>
            </>
        )
    }
}
export default Index;