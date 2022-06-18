<?php
	/**************************************************
	* 文件名:show.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:论坛帖子展示
	*/
	namespace croe\controller;
	use bbs\model\language;
	use bbs\model\bbs_catalog;
	use admin\model\product_model;
	class show extends controller{
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
		
		
		//查看帖子
		public function index(){
			$mdb=$this->mdb;
			$param=$this->request->param();
			
			$page_size=10;//分页数量
			$page=$this->request->param('page');//分页位置
			$param=$this->request->param();
			if(empty($page))$page=1;//默认第一页
			
			
			//帖子id
			$bbs_id=$this->request->param('id');
			if(empty($bbs_id))$bbs_id=1;
			
			
			$this->current_language;
			
			//查询论坛内容
			$bc_sqlstr="SELECT * FROM ts_bbs_content"
			." where 1=1 "
			." and id =".$mdb->qstr($bbs_id);
			
			$bc_rows=$mdb->find($bc_sqlstr);
			
			//帖子的阅读次数+1
			$data_array=array();
			$data_array['read_count']=array("type"=>"custom","value"=>"`read_count` + 1");//自定义语句
			$mdb->update('ts_bbs_content',$data_array,array('id'=>$bbs_id));
			
			
			//发帖人的id
			$user_id=$bc_rows['user_id'];
			
			//查询用户信息
			$user_sqlstr="SELECT * FROM ts_user"
			." where 1=1 "
			." and id =".$mdb->qstr($user_id);
			$user_rows=$mdb->find($user_sqlstr);
			
			$bc_rows['user_name']=$user_rows['user_name'];//得到用户名称
			//获取发帖人信息
			$user_id=$bc_rows['user_id'];
			$param['bbs_content']=$bc_rows;
			$param['id']=$bbs_id;
			
			//查询帖子回复信息
			$bcc_sqlstr="SELECT * FROM ts_bbs_content_comment"
			." where 1=1 "
			." and bbs_content_id =".$mdb->qstr($bbs_id)//帖子id
			." and comment_user_id = ".$mdb->qstr($user_id);//对发帖人的回复
			//查询分页
			
			$record_count=$mdb->count($bcc_sqlstr);//记录数
			$bcc_sqlstr .=" limit ".(($page-1)*$page_size).",".$page_size;
			$bcc_sql=$mdb->query($bcc_sqlstr);
			
			$bcc_array=array();
			while($bcc_return=$mdb->fetch_assoc($bcc_sql)){
				//查询发帖人员名称
				$temp_user_id=$bcc_return['user_id'];
				$user_sqlstr="SELECT * FROM ts_user"
				." where 1=1 "
				." and id =".$mdb->qstr($temp_user_id);//用户名称
				$user_rows=$mdb->find($user_sqlstr);
				$bcc_return['user_name']=$user_rows['user_name'];
				$bcc_array[]=$bcc_return;
			}
			
			$param['bcc_array']=$bcc_array;
			
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
			
			//总记录数
			if(!isset($param['record_count'])){
				$param['record_count']=$record_count;//总记录数
			}
			$this->assign("param",$param);
		}
		
		/*发表回复*/
		public function post_review(){
			
			//定义数据库类
			$mdb=$this->mdb;
			
			//定义错误数组
			$error_array=array();
			
			//获取请求参数
			$param=$this->request->param();
			
			$goto_url="";//跳转的地址
			
			//帖子id
			$bbs_id=$this->request->param('id');
			$comment_user_id=$this->request->param('comment_user_id');//层主的id
			$user_content=$this->request->param('review_content');//评论的内容
			if(empty($bbs_id))$bbs_id=1;
			
			
			//判断是否是否登录
			if(isset($this->user_data['id'])){
				$user_id=$this->user_data['id'];
			}else{
				$goto_url="/user/index/login";
				$error_array[]=$this->language['您未登录,请登录后评论'];//用户未登录就开始评论
			}
			
			//查询贴子信息
			if(empty($error_array)){
				
				//查询发帖的用户信息
				$bc_sqlstr="SELECT * FROM ts_bbs_content"
				." where 1=1 "
				." and id =".$mdb->qstr($bbs_id);//帖子id
				$bc_rows=$mdb->find($bc_sqlstr);
				
				if(!empty($bc_rows)){
					$comment_user_id=$bc_rows['user_id'];//发帖人的id
				}else{
					$goto_url="/bbs/";
					$error_array[]=$this->language['帖子不存在!'];//用户未登录就开始评论
				}
				
			}
			
			//查询当前的楼层
			if(empty($error_array)){
				//查询帖子是否有评论
				$bcc_sqlstr="SELECT max(`comment_floor`) as comment_floor FROM ts_bbs_content_comment"
				." where 1=1 "
				." and bbs_content_id =".$mdb->qstr($bbs_id);//帖子id
				$bcc_rows=$mdb->find($bcc_sqlstr);
				
				//获取当前楼层
				$current_comment_floor=1;
				if(empty($bcc_rows['comment_floor'])){
					$current_comment_floor=1;
				}else{
					$current_comment_floor=$bcc_rows['comment_floor']+1;
				}
			}
			//插入评论信息
			if(empty($error_array)){
				$data_array=array();
				$data_array['bbs_catalog_id']=$bc_rows['bbs_catalog_id'];//类目的id
				$data_array['bbs_content_id']=$bbs_id;//帖子id
				$data_array['comment_floor']=$current_comment_floor;//楼层的id
				$data_array['comment_user_id']=$comment_user_id;//层主的id
				$data_array['user_id']=$user_id;//评论人的id
				$data_array['user_content']=$user_content;//评论的内容
				$data_array['add_time']=gmdate("Y-m-d H:i:s",time());//评论的数据
				$data_array['update_time']=gmdate("Y-m-d H:i:s",time());//更新的时间
				$bcc_id=$mdb->insert('ts_bbs_content_comment',$data_array);
				
				if(empty($bcc_id)){
					$error_array[]=$this->language['评论系统异常!'];//用户未登录就开始评论
				}
			}
			//输出信息
			if(!empty($error_array)){
				$result=array('status'=>100,'msg'=>implode($error_array),'goto_url'=>$goto_url);
			}else{
				$result=array('status'=>200,'msg'=>$this->language['评论成功!'],'bcc_id'=>$bcc_id);
			}
			echo (json_encode($result));
			exit;
			
			
		}
		
		
	}
?>