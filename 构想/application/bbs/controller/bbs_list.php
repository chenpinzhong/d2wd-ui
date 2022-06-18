<?php
	/**************************************************
	* 文件名:bbs_list.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:论坛列表
	*/
	namespace croe\controller;
	use bbs\model\language;
	use bbs\model\bbs_catalog;
	class bbs_list extends controller{
		public function __construct(){
			parent::__construct();
			//获取主库配置信息
			$master=$this->config->get_db_master();
			//连接主库
			$this->mdb=$this->db->link($master);
			
			//引入语言模型
			$language=new language();
			
			//设置页面基本信息
			set_page_config($this,$language);
		}
		
		//帖子列表
		public function index(){
			$mdb=$this->mdb;
			$current_language=$this->current_language;
			$param=$this->request->param();
			$bbs_catalog_id=$this->request->param('type');//类型
			$query_string=$this->request->param('q');//查询的值
			
			$page_size=8;//分页数量
			//如果没有设置 默认读取第一行
			if(empty($bbs_catalog_id)){
				//查询一行
				$bbs_catalog_sqlstr="SELECT * FROM ts_bbs_catalog order by id asc limit 1";
				$bbs_catalog_rows=$mdb->find($bbs_catalog_sqlstr);
				$bbs_catalog_id=$bbs_catalog_rows['id'];
			}
			
			if(empty($bbs_catalog_id)){
				echo 'bbs论坛类目未设置!';
				exit;
			} 
			
			//获取论坛信息
			$bbs_catalog_sqlstr="SELECT * FROM ts_bbs_catalog"
			." where 1=1 "
			." and id=".$mdb->qstr($bbs_catalog_id);
			
			$bbs_catalog_rows=$mdb->find($bbs_catalog_sqlstr);
			$param['catalog_name']=$bbs_catalog_rows['catalog_name'];
			
			
			//查询论坛内容
			$bbs_content_sqlstr="SELECT * FROM ts_bbs_content"
			." where 1=1 "
			." and bbs_catalog_id =".$mdb->qstr($bbs_catalog_id);
			
			//记录数
			$record_count=$mdb->count($bbs_content_sqlstr);
			
			$bbs_content_sql=$mdb->query($bbs_content_sqlstr);
			$bbs_content_array=array();
			while($bbs_content_return=$mdb->fetch_assoc($bbs_content_sql)){
				//获取发帖人信息
				$user_id=$bbs_content_return['user_id'];
				
				//查询用户信息
				$user_sqlstr="SELECT * FROM ts_user"
				." where 1=1 "
				." and id =".$mdb->qstr($user_id);
				$user_rows=$mdb->find($user_sqlstr);
				
				$bbs_content_return['user_name']=$user_rows['user_name'];//得到用户名称
				
				$bbs_content_array[]=$bbs_content_return;
			}
			$param['bbs_content_array']=$bbs_content_array;
			
			//当前分页位置
			if(!isset($param['page'])){
				$param['page']=1;
			}else{
				$param['page']=$page;
			}
			
			//分页大小
			if(!isset($param['page_size'])){
				$param['page_size']=$page_size;//分页大小
			}else{
				$param['page_size']=$page_size;
			}
			
			//查询的值
			if(!isset($param['q'])){
				$param['q']=$query_string;//分页大小
			}else{
				$param['q']="";
			}
			
			
			//总记录数
			if(!isset($param['record_count'])){
				$param['record_count']=$record_count;//总记录数
			}
			
			$this->assign("param",$param);
			
		}
		//发布帖子
		public function release_post(){
			$mdb=$this->mdb;
			$current_language=$this->current_language;
			
			$param=$this->request->param();//获取请求信息
			$param['current_language']=$current_language;
			$bbs_catalog_id=$this->request->param('type');//bbs类型
			
			$catalog_id=$this->request->param('catalog_id','_POST');//bbs目录名称
			$title_name=$this->request->param('title_name','_POST');//标题名称
			$release_content=$this->request->param('release_content','_POST');//发布内容
			
			$goto_url="/bbs/";
			
			if(empty($bbs_catalog_id))$bbs_catalog_id=1;
			
			//查询论坛类型
			$bbs_catalog_sqlstr="SELECT * FROM ts_bbs_catalog"
			." where 1=1 "
			." and id=".$mdb->qstr($bbs_catalog_id);
			$bbs_catalog_rows=$mdb->find($bbs_catalog_sqlstr);
			
			//查询论坛类型名称
			$bcn_sqlstr="SELECT * FROM ts_bbs_catalog_name"
			." where 1=1 "
			." and bbs_catalog_id=".$mdb->qstr($bbs_catalog_id)
			." and language_type=".$mdb->qstr($current_language);
			$bcn_rows=$mdb->find($bcn_sqlstr);
			$catalog_name=$bcn_rows['catalog_name'];
			
			//如果是发布帖子操作
			if(!empty($catalog_id)){
				//初始化错误信息
				$error_array=array();
				
				//判断是否是否登录
				if(isset($this->user_data['id'])){
					$user_id=$this->user_data['id'];
				}else{
					$goto_url="/user/index/login";
					$error_array[]=$this->language['您未登录,请登录后评论'];//用户未登录就开始评论
				}
				
				//查询名称是否重复
				
				$bbs_content_rows=$mdb->table('ts_bbs_content')->where(array('title'=>$title_name))->find();
				if(!empty($bbs_content_rows)){
					$error_array[]=$this->language['帖子已经存在!'];//用户未登录就开始评论
				}
				
				
				if(empty($error_array)){
					$data_array=array();
					$data_array['bbs_catalog_id']=$catalog_id;//帖子id
					$data_array['user_id']=$user_id;//用户id
					$data_array['title']=$title_name;//层主的id
					$data_array['content']=$release_content;//发表的内容
					$data_array['add_time']=gmdate("Y-m-d H:i:s",time());//评论的数据
					$data_array['update_time']=gmdate("Y-m-d H:i:s",time());//更新的时间
					$bcc_id=$mdb->insert('ts_bbs_content',$data_array);
					if(empty($bcc_id)){
						$error_array[]=$this->language['发布内容异常!'];//用户未登录就开始评论
					}
				}
				//输出信息
				if(!empty($error_array)){
					$result=array('status'=>100,'msg'=>implode($error_array),'goto_url'=>$goto_url);
				}else{
					$goto_url='/bbs/bbs_list?type='.$catalog_id;
					$result=array('status'=>200,'msg'=>$this->language['发布成功!'],'goto_url'=>$goto_url,'bcc_id'=>$bcc_id);
				}
				echo (json_encode($result));
				exit;
			}
			
			//查询的值
			if(empty($param['catalog_id'])){
				
				$param['catalog_id']=$bbs_catalog_id;
			}
			
			
			$param['catalog_name']=$catalog_name;
			
			$this->assign("param",$param);
			
			
		}
		
		
	}
?>