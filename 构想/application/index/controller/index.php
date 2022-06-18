<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:首页
	*/
	namespace croe\controller;
	use index\model\language;
	use admin\model\product_model;
	class index extends controller{
		public function __construct(){
			parent::__construct();
			//获取主库配置信息
			$master=$this->config->get_db_master();
			//连接主库
			$this->mdb=$this->db->link($master);
			//引入语言模型
			$language=new language();
			set_page_config($this,$language);
		}
		
		public function index(){
			$mdb=$this->mdb;
			//拉取产品列表
			$product_model=new product_model($mdb,$this->current_language);
			//获取一些推荐产品

			//get_product_list($param=array(),$order_by="",$page=0,$page_size=20)
			$page=0;
			$page_size=8;
			$product_sqlstr="SELECT * FROM ts_product ";
			$product_sqlstr.=" WHERE 1=1 ";
			//目录id为空 则代表查询 所有产品
			if(!empty($param['catalog_id'])){
				$product_sqlstr.=" WHERE catalog_id=".$db->qstr($param['catalog_id']);
			}
			//产品名称
			if(!empty($param['product_name'])){
				$product_sqlstr.=" WHERE product_name like %".trim($param['product_name'])."%";
			}
			//最低总销量
			if(!empty($param['total_sales'])){
				$product_sqlstr.=" WHERE total_sales >= ".$db->qstr($param['total_sales']);
			}
			//排序
			if(!empty($order_by)){
				$product_sqlstr.=" order by ".trim($order_by);
			}
			//分页
			$product_sqlstr.=" limit ".($page*$page_size).",".$page_size;
			
			$product_list=$product_model->get_product_list($product_sqlstr,$this->current_language);

			$product_show_array=array();
			
			$line=0;//显示的行
			foreach($product_list as $index=>$product_info){
				if($index%4==0)$line+=1;
				$product_show_array[$line-1][]=$product_info;
			}
			$home_poster_array=$mdb->table('ts_home_poster')->where()->select();
			foreach($home_poster_array as $key=>$home_poster_rows){
				$poster_id=$home_poster_rows['id'];
				//多语言 更新名称
				$home_poster_rows=$mdb->table('ts_home_poster_name')->where(array('language_type'=>$this->current_language,'poster_id'=>$poster_id))->find();
				$home_poster_array[$key]['poster_name']=$home_poster_rows['poster_name'];
			}
			
			$this->assign("home_poster_array",$home_poster_array);//海报信息
			//展示产品
			$this->assign("product_show_array",$product_show_array);
		}
	}
?>