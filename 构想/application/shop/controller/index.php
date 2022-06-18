<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:产品展示首页
	*/
	namespace croe\controller;
	use shop\model\language;
	use shop\model\product_catalog;
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
			//设置页面基本信息
			set_page_config($this,$language);
		}
		
		public function index(){
			$mdb=$this->mdb;
			$current_language=$this->current_language;
			$this->product_catalog=new product_catalog($mdb,$current_language);
			$product_model=new product_model($mdb,$current_language);
			
			//获取类目信息
			$catalog_array=$this->product_catalog->get_product_catalog();
			
			//生成 类目树
			$catalog_tree_html=$this->catalog_tree($catalog_array);
			$this->assign("catalog_tree_html",$catalog_tree_html);//设置 类目树
			
			//查询产品总数量
			$page_size=8;//分页数量
			$page=$this->request->param('page');//分页位置
			
			$param=$this->request->param();
			
			if(empty($page))$page=1;//默认第一页
			
			$product_catalog_id=$this->request->param('product_catalog_id');//类目id
			$product_name=$this->request->param('product_name');//产品名称
			
			//是否查询sku_info表  这个标记 最后要根据产品id 来分组
			$product_sku_info_flag=false;
			
			$bottom_price=$this->request->param('bottom_price');//最低价格
			$peak_price=$this->request->param('peak_price');//最高价格
			
			////////////////////////////////////////////////////////
			//判断是否查询sku_info 表
			//最低价格
			if(!empty($bottom_price) && is_numeric($bottom_price)){
				$product_sku_info_flag=true;
			}
			//最高价格
			if(!empty($peak_price) && is_numeric($peak_price)){
				$product_sku_info_flag=true;
			}

			//查询产品
			$product_sqlstr = "select ts_product.id from ts_product";
			//如果查询 产品名称存在
			if(!empty($product_name)){
				//使用右连接查询产品
				$product_name_join="";
				$product_name_join .=" right join ts_product_name on ts_product_name.product_id=ts_product.id";//产品id关联
				$product_name_join .=" and ts_product_name.language_type=".$mdb->qstr($current_language);//查询的语言
				$product_name_join .=" and ts_product_name.product_name like '%".trim($product_name)."%'";//筛选产品名称
				$product_sqlstr.=$product_name_join;
			}
			//如果用户搜索产品属性时则启用这条语句
			if($product_sku_info_flag==true){
				//右连接查询子产品
				$product_sku_info_join="";
				$product_sku_info_join .=" right join ts_product_sku_info on ts_product_sku_info.product_id=ts_product.id";//产品id关联
				
				//最低价格筛选
				if(!empty($bottom_price) && is_numeric($bottom_price)){
					$product_sku_info_join .=" and ts_product_sku_info.sku_price>=".$mdb->qstr($bottom_price);//最低价格筛选
				}
				//最高价格筛选
				if(!empty($peak_price) && is_numeric($peak_price)){
					$product_sku_info_join .=" and ts_product_sku_info.sku_price<=".$mdb->qstr($peak_price);//最高价格筛选
				}
				$product_sqlstr.=$product_sku_info_join;
			}
			
			$product_sqlstr .=" where 1=1";
			$product_sqlstr .=" and ts_product.product_status=".$mdb->qstr(1);//产品状态为正常状态
			
			//如果搜索产品类目
			if(!empty($product_catalog_id)){
				$product_sqlstr .=" and ts_product.product_catalog_id=".$mdb->qstr($product_catalog_id);
			}
			
			//页面分组代码
			if($product_sku_info_flag==true){
				$product_sqlstr .=" group by ts_product_sku_info.product_id";
			}
			
			//产品默认排序为销量排序
			$product_sqlstr .=" order by ts_product.total_sales desc";
			
			//查询分页
			$product_sqlstr .=" limit ".(($page-1)*$page_size).",".$page_size;
			
			$record_count=$mdb->count($product_sqlstr);//记录数
			
			$product_list_array=$product_model->get_product_list($product_sqlstr);
			
			//展示产品
			$this->assign("product_list_array",$product_list_array);
			
			
			/////////////////////////////////
			//设置页面 页面参数
			if(!isset($param['product_catalog_id']))$param['product_catalog_id']=0;//目录id
			if(!isset($param['product_name']))$param['product_name']="";//产品名称
			if(!isset($param['bottom_price']))$param['bottom_price']="";//最低价格
			if(!isset($param['peak_price']))$param['peak_price']="";//最高价格 
			
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

		//获取类目数
		public function catalog_tree($catalog_array=array()){
			$catalog_html="";
			$catalog_html.="<ul>";
			//child
			foreach($catalog_array as $catalog_info){
				//判断类目是否有子集
				$child_html='';
				$child_class='';
				if(!empty($catalog_info['child'])){
					$child_html=$this->catalog_tree($catalog_info['child']);
					$child_class='child';
				}
				
				$catalog_html.='<li data-id="'.$catalog_info['id'].'" class="'.$child_class.'">'
					.'<div class="catalog_name">'.$catalog_info['catalog_name'].'('.$catalog_info['product_count'].')'.'</div>'
					.$child_html
				.'</li>';
			}
			$catalog_html.="</ul>";
			return $catalog_html;
		}
	}
?>