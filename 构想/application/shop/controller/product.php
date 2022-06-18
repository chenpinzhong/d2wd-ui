<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:产品详情展示
	*/
	namespace croe\controller;
	use shop\model\language;
	use admin\model\product_model;
	class product extends controller{
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
			
		}
		//展示产品
		public function show(){
			$request=$this->request;
			$id=$request->param('id');
			$product_model=new product_model($this->mdb,$this->current_language);
			
			$product_info=$product_model->get_product_info($id);
			
			//设置产品信息
			$this->assign("product_info",$product_info);//设置语言参数
			
		}
	}
?>