<?php
	/**************************************************
	* 文件名:user.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:后台用户管理
	*/
	namespace croe\controller;
	class user extends controller{
		public function __construct() {
			parent::__construct();
			admin_check($this);
			//设置数据库连接
			$master=$this->config->get_db_master();//获取主库配置信息
			$this->mdb=$this->db->link($master);//连接主库
			
		}
		//登录模块
		public function login(){
			$mdb=$this->mdb;
			if($this->request->param('_POST')){
				$user_name=$this->request->param('user_name');//登录名称
				$password=$this->request->param('password');//登录密码
				$admin_user_rows=$mdb->table("ts_admin_user")->where(array("user_name"=>$user_name,"user_password"=>md5($password)))->find();
				if(!empty($admin_user_rows)){
					$_SESSION["admin_data"]=$admin_user_rows;//管理员登录
					header("Location: /admin/index/index");
				}else{
					echo '<script>
						alert("'."帐号或密码错误".'");
						window.location.href="/admin/user/login" 
					</script>';

				}
			}
		}


		public function index(){
			$mdb=$this->mdb;
			$user_sqlstr="select * from ts_admin_user";
			$user_sql=$mdb->query($user_sqlstr);
			$user_data_array=array();
			while($user_return=$mdb->fetch_assoc($user_sql)){
				$user_data_array[]=$user_return;
			}
			$this->assign("user_data",$user_data_array);
		}
		
		//添加管理员
		public function add_user(){
			
			$mdb=$this->mdb;
			$shop_id=1;//店铺id
			$user_name=$this->request->param('user_name');
			$user_password=$this->request->param('user_password');
			
			if(!empty($user_name) && !empty($user_password)){
				
				$user_sqlstr="SELECT * FROM ts_admin_user where 1=1 ";
				//用户名称
				$user_name=$this->request->param('user_name');
				
				if(!empty($user_name)){
					$user_sqlstr.=" and user_name =".$mdb->qstr($user_name);
				}
				$user_rows=$mdb->find($user_sqlstr);
				$user_data=array();
				$user_data['shop_id']=$shop_id;
				$user_data['user_name']=$user_name;
				$user_data['user_password']=md5($user_password);
				$user_data['registration_time']=gmdate("Y-m-d H:i:s",time());
				
				if(empty($user_rows)){
					//插入
					$user_id=$mdb->insert('ts_admin_user',$user_data);
				}else{
					//更新
					$user_id=$user_rows['id'];
					$mdb->update('ts_admin_user',$user_data,array('id'=>$user_id));
				}
				$result=array('status'=>200,'id'=>$user_id);
				echo (json_encode($result));
				exit;
			}
			
		}
		
	}
?>