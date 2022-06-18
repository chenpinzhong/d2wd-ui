<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:wiki详情
	*/
	namespace croe\controller;
	use wiki\model\language;
	use wiki\model\wiki_catalog;
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
		
		public function index(){
			$mdb=$this->mdb;
			$param=$this->request->param();
			if(empty($page))$page=1;//默认第一页
			//维基百科id
			$wiki_id=$this->request->param('id');
			if(empty($wiki_id))$wiki_id=1;
			
			$this->current_language;
			
			//查询维基名称
			$wiki_info=array();
			$wiki_name_rows=$mdb->table('ts_wiki_name')->where(array('wiki_id'=>$wiki_id,'language_type'=>$this->current_language))->find();
			
			if(empty($wiki_name_rows)){
				$wiki_info['wiki_name']='';
			}else{
				$wiki_info['wiki_name']=$wiki_name_rows['wiki_name'];
			}
			
			//查询wiki关键字
			$wiki_keyword_array=$mdb->table('ts_wiki_keyword')
									->where(array('wiki_id'=>$wiki_id,'language_type'=>$this->current_language))
									->select();
			
			if(empty($wiki_keyword_array)){
				$wiki_info['wiki_keyword_array']=array();
			}else{
				$wiki_info['wiki_keyword_array']=$wiki_keyword_array;
			}
			
			//查询wiki资料方便下载
			$wiki_upload_file_array=$mdb->table('ts_wiki_upload_file')
									->where(array('wiki_id'=>$wiki_id))
									->select();
			
			if(empty($wiki_upload_file_array)){
				$wiki_info['wiki_upload_file_array']=array();
			}else{
				$wiki_info['wiki_upload_file_array']=$wiki_upload_file_array;
			}
			//查询wiki内容
			$wiki_description_rows=$mdb->table('ts_wiki_description')
									->where(array('wiki_id'=>$wiki_id,'language_type'=>$this->current_language))
									->find();
			
			if(empty($wiki_description_rows)){
				$wiki_info['wiki_description']="";
			}else{
				$wiki_info['wiki_description']=$wiki_description_rows['description'];
			}
			$this->assign("wiki_info",$wiki_info);
			
		}
		
	}
?>