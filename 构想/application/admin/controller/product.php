<?php
	/**************************************************
	* 文件名:run.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:后台产品编辑
	*/
	namespace croe\controller;
	use admin\model\language;
	use admin\model\product_catalog;
	use admin\model\product_model;
	class product extends controller{
		
		public function __construct() {
			parent::__construct();
			$master=$this->config->get_db_master();//获取主库配置信息
			$this->mdb=$this->db->link($master);//连接主库
		}
		
		//首页
		public function index(){
			$mdb=$this->mdb;
			$current_language='zh';//后面编辑语言默认为中文
			//获取类目信息
			$this->product_catalog=new product_catalog($mdb);
			
			//缓存
			$cache_data=get_file_cache('get_product_catalog');//获取缓存
			if($cache_data){
				$catalog_array=$cache_data;
			}else{
				$catalog_array=$this->product_catalog->get_product_catalog();//
				set_file_cache('get_product_catalog',$catalog_array,180);//设置缓存
			}
			
			$page_size=4;//分页数量
			$page=$this->request->param('page');//分页位置
			
			$param=$this->request->param();
			
			if(empty($page))$page=1;//默认第一页
			
			//产品id
			$product_id=$this->request->param('product_id');
			//产品状态
			$product_status=$this->request->param('product_status');
			//类目id
			$product_catalog_id=$this->request->param('product_catalog_id');
			
			//生成 类目树
			$catalog_tree_html=$this->catalog_tree($catalog_array,$product_catalog_id);
			
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
			$product_sqlstr = "select ts_product.* from ts_product";
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
			
			//$product_sqlstr .=" and ts_product.product_status=".$mdb->qstr(1);//产品状态为正常状态
			
			
			
			//如果搜索产品类目
			if(!empty($product_catalog_id)){
				$product_sqlstr .=" and ts_product.product_catalog_id=".$mdb->qstr($product_catalog_id);
			}
			//如果根据产品id查询
			if(!empty($product_id)){
				$product_id_array=explode(",",$product_id);
				$product_sqlstr .=" and ts_product.id in('".implode("','",$product_id_array)."')";
			}
			//产品状态
			if(is_numeric($product_status)){
				$product_sqlstr .=" and ts_product.product_status=".$mdb->qstr($product_status);
			}
			
			//页面分组代码
			if($product_sku_info_flag==true){
				$product_sqlstr .=" group by ts_product_sku_info.product_id";
			}
			
			//产品默认排序为销量排序
			$product_sqlstr .=" order by ts_product.total_sales desc";
			
			//查询分页
			$product_sqlstr .=" limit ".(($page-1)*$page_size).",".$page_size;
			
			$count_record=$mdb->count($product_sqlstr);//记录数
			//echo $product_sqlstr."->查询语句<br/>";
			//获取产品详细信息
			$product_list_array=$this->get_product_info_list($product_sqlstr);
			
			//file_put_contents("E:/1.json",json_encode($product_list_array));
			//展示产品
			$this->assign("product_list_array",$product_list_array);
			
			/////////////////////////////////
			//设置页面 页面参数
			if(!isset($param['product_id']))$param['product_id']="";//产品id
			if(!isset($param['product_status']))$param['product_status']="";//产品状态
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
			if(!isset($param['count_record'])){
				$param['count_record']=$count_record;//总记录数
			}
			
			$this->assign("catalog_tree_html",$catalog_tree_html);
			$this->assign("param",$param);
		}
		
		//修改产品状态
		public function product_status(){
			$mdb=$this->mdb;
			$product_id=$this->request->param('id');//产品的id
			$product_status=$this->request->param('product_status');//产品的状态
			
			$error_array=array();//定义错误数组
			
			$product_rows=$mdb->table('ts_product')->where(array('id'=>$product_id))->find();
			if(!empty($product_rows)){
				$product_data=array();
				$product_data['product_status']=$product_status;
				$mdb->update('ts_product',$product_data,$product_id);
			}else{
				$error_array[]='产品不存在';
			}
			$message_info=array(
				"status"=>200,
				"time"=>3,//页面自动跳转时间
				"title"=>"修改成功",
				"message"=>"产品状态 修改成功!",
				"confirm"=>"/admin/product/index",//确认
				"cancel"=>"/admin/product/index",//取消
			);
			if(!empty($error_array)){
				$message_info=array(
					"status"=>100,
					"time"=>3,//页面自动跳转时间
					"title"=>"修改失败",
					"message"=>implode("|",$error_array),
					"confirm"=>"/admin/product/index",//确认
					"cancel"=>"/admin/product/index",//取消
				);
				
			}
			$this->assign("message_info",$message_info);//提示错误信息
			$this->display("admin/index/message.html");
			exit;
		}
		//修改sku状态
		public function product_sku_status(){
			$mdb=$this->mdb;
			$sku_id=$this->request->param('id');//产品的id
			$sku_status=$this->request->param('sku_status');//产品sku状态
			
			$error_array=array();//定义错误数组
			
			$psi_rows=$mdb->table('ts_product_sku_info')->where(array('id'=>$sku_id))->find();
			if(!empty($psi_rows)){
				$psi_data=array();
				$psi_data['sku_status']=$sku_status;
				$mdb->update('ts_product_sku_info',$psi_data,$sku_id);
			}else{
				$error_array[]='产品不存在';
			}
			$message_info=array(
				"status"=>200,
				"time"=>3,//页面自动跳转时间
				"title"=>"修改成功",
				"message"=>$psi_rows['sku']."->sku状态 修改成功!",
				"confirm"=>"/admin/product/index",//确认
				"cancel"=>"/admin/product/index",//取消
			);
			if(!empty($error_array)){
				$message_info=array(
					"status"=>100,
					"time"=>3,//页面自动跳转时间
					"title"=>"sku状态 修改失败",
					"message"=>implode("|",$error_array),
					"confirm"=>"/admin/product/index",//确认
					"cancel"=>"/admin/product/index",//取消
				);
				
			}
			$this->assign("message_info",$message_info);//提示错误信息
			$this->display("admin/index/message.html");
			exit;
			
		}
		
		//获取一页产品
		public function get_product_info_list($product_sqlstr){
			//db 简写 数据库
			$db=$this->db;
			//调用的语言
			$current_language='zh';//后台语言显示为中文
			
			$product_sql=$db->query($product_sqlstr);
			
			$end_time=time();//判断是否为新品

			$product_array=array();
			while($product_return=$db->fetch_assoc($product_sql)){
				$product_id=$product_return['id'];
				//查询产品名称
				$product_name_sqlstr="SELECT * FROM ts_product_name"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND language_type=".$db->qstr($current_language);//语言
				$product_name_rows=$db->find($product_name_sqlstr);
				//得到产品名称
				$product_return['product_name']=$product_name_rows['product_name'];//产品名称
				
				//查询产品sku信息
				$product_sku_sqlstr="SELECT * FROM ts_product_sku"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND language_type=".$db->qstr($current_language);//语言
				$product_sku_sql=$db->query($product_sku_sqlstr);
				$product_child_array=array();//产品sku数组
				$product_return['attribute_name_array']=array();//属性名称
				while($product_sku_return=$db->fetch_assoc($product_sku_sql)){
					//得到属性值信息
					$pav_ids=$product_sku_return['pav_ids'];
					$sku=$product_sku_return['sku'];
					
					//查询sku_info信息
					
					$product_sku_info_sqlstr="SELECT * FROM ts_product_sku_info"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND sku=".$db->qstr($sku);
					$product_sku_info_rows=$db->find($product_sku_info_sqlstr);
					
					//得到属性id数组
					$pav_ids_array=explode(",",$pav_ids);
					$pav_string="'".implode("','",$pav_ids_array)."'";
					
					//查询属性值名称
					$pav_sqlstr="SELECT * FROM ts_product_attribute_value"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND id in (".$pav_string.")"
									." AND language_type=".$db->qstr($current_language)
									." order by attribute_id asc";//语言
					$pav_sql=$db->query($pav_sqlstr);
					$attribute_info_array=array();
					while($pav_return=$db->fetch_assoc($pav_sql)){
						$attribute_id=$pav_return['attribute_id'];
						$attribute_value=$pav_return['attribute_value'];
						$attribute_image=$pav_return['attribute_image'];
						//查询属性名称
						$pa_sqlstr="SELECT * FROM ts_product_attribute"
						." WHERE 1=1"
						." AND id=".$db->qstr($attribute_id);
						$pa_rows=$db->find($pa_sqlstr);
						$attribute_name=$pa_rows['attribute_name'];
						$attribute_info_array[$attribute_id]=array(
							'attribute_id'=>$attribute_id,
							'attribute_name'=>$attribute_name,
							'attribute_value'=>$attribute_value,
							'attribute_image'=>$attribute_image,
						);
						
						//记录已有的属性名称
						if(!array_key_exists($attribute_name,$product_return['attribute_name_array'])){
							$product_return['attribute_name_array'][$attribute_id]=$attribute_name;
						}
					}
					$product_child_array[$sku]=array();
					$product_child_array[$sku]['attribute_info']=$attribute_info_array;
					$product_child_array[$sku]['product_sku_info']=$product_sku_info_rows;
				}
				//获取到的sku子级信息
				$product_return['product_child']=$product_child_array;
				
				//查询产品展示图片
				$product_imsges_sqlstr="SELECT * FROM ts_product_imsges"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." order by id asc"
									." limit 1";
				$product_imsges_rows=$db->find($product_imsges_sqlstr);
				
				$product_return['product_image_show']=$product_imsges_rows['product_image_show'];
				//加入产品数组
				$product_array[]=$product_return;
			}
			return $product_array;
		}
		
		//新增产品
		public function product_add(){
			/*
				TRUNCATE ts_product;#清空 产品表
				TRUNCATE ts_product_name;#清空 产品名称表
				TRUNCATE ts_product_attribute;#清空 产品表
				TRUNCATE ts_product_attribute_value;#清空 产品表
				TRUNCATE ts_product_brand;#清空 产品品牌表
				TRUNCATE ts_product_description;#清空 产品描述表
				TRUNCATE ts_product_imsges;#清空 产品图片信息
				TRUNCATE ts_product_parameters;#清空 产品参数表
				TRUNCATE ts_product_pledge;#清空 产品保证信息表
				TRUNCATE ts_product_sku;#清空 产品sku表
				TRUNCATE ts_product_sku_info;#清空 产品sku_info表
			*/
			
			
			//$json_data=json_encode($this->request->param(),true);
			//file_put_contents(root_dir.'/product_add.json',$json_data);
			$mdb=$this->mdb;
			$product_catalog_id=$this->request->param('product_catalog_id');//类目id
			$language=new language();
			$product_model=new product_model($mdb);
			//$current_language=$_SESSION["current_language"];
			$current_language='zh';//强制为中文
			$this->assign("label",$language->get($current_language));//设置语言参数 给予对应模板
			$this->assign("current_language",json_encode($language->get($current_language)));//js模板使用
			
			if(is_numeric($product_catalog_id)){
				
				$error_array=array();//定义错误数组
				$payment_address=$this->request->param('payment_address');//购买地址 //不是强制填写
				$product_name_zh=$this->request->param('product_name_zh');//产品描述中文
				$product_name_en=$this->request->param('product_name_en');//产品描述英文
				$brand_zh=$this->request->param('brand_zh');//产品描述中文
				$brand_en=$this->request->param('brand_en');//产品描述英文
				
				$content_zh=$this->request->param('content_zh');//产品描述中文
				$content_en=$this->request->param('content_en');//产品描述英语
				$upload_img_array=$this->request->param('upload_img_array');//属性图
				$attribute_array=$this->request->param('attribute_array');//产品描述英语
				
				$attribute_array=$this->request->param('attribute_array');//属性信息
				$pledge_array=$this->request->param('pledge_array');//服务承诺 未建立表
				$product_parameters_array=$this->request->param('product_parameters_array');//产品参数
				$column_info_array=$this->request->param('column_info_array');//sku属性组
				$sku_info_table=$this->request->param('sku_info_table');//sku表
				
				if(empty($product_name_zh))$error_array[]='产品 中文名称 未填写';
				if(empty($product_name_en))$error_array[]='产品 英文名称 未填写';
				if(empty($content_zh))$error_array[]='产品 中文内容 未填写';
				if(empty($content_en))$error_array[]='产品 英文内容 未填写';
				if(empty($upload_img_array))$error_array[]='上传图片 未上传';
				
				
				$product_id=0;//初始化产品id
				//插入信息 产品表
				if(empty($error_array)){
					//查询产品是否存在
					$product_rows=$mdb->table('ts_product')->where(array('product_name'=>$product_name_zh))->find();
					$product_data=array();
					$product_data['product_catalog_id']=$product_catalog_id;
					$product_data['product_name']=$product_name_zh;
					$product_data['payment_address']=$payment_address;
					$product_data['product_status']=1;//产品状态
					
					$product_data['update_time']=gmdate("Y-m-d H:i:s",time());
					if(empty($product_rows)){
						$product_data['add_time']=gmdate("Y-m-d H:i:s",time());
						$product_id=$mdb->insert('ts_product',$product_data);
					}else{
						$product_id=$product_rows['id'];
						$mdb->update('ts_product',$product_data,$product_id);
					}
				}//产品表结束
				
				//产品名称信息
				if(empty($error_array)){
					//配置信息
					$language_type_array=array(
						'zh'=>array('product_name'=>$product_name_zh),
						'en'=>array('product_name'=>$product_name_en)
					);
					//产品标题处理
					foreach($language_type_array as $language_type=>$info){
						//查询产品是否存在
						$product_name_rows=$mdb->table('ts_product_name')->where(array('language_type'=>$language_type,'product_id'=>$product_id))->find();
						$product_name_data=array();
						$product_name_data['language_type']=$language_type;
						$product_name_data['product_id']=$product_id;
						$product_name_data['product_name']=$info['product_name'];
						$product_name_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_name_rows)){
							$product_name_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_name',$product_name_data);//不需要获取 product_name_id
						}else{
							$product_name_id=$product_name_rows['id'];
							$mdb->update('ts_product_name',$product_name_data,$product_name_id);
						}
					}
				}//产品名称信息
				
				//产品品牌信息
				if(empty($error_array)){
					//配置信息
					$language_type_array=array(
						'zh'=>array('brand_name'=>$brand_zh),
						'en'=>array('brand_name'=>$brand_en)
					);
					//产品标题处理
					foreach($language_type_array as $language_type=>$info){
						//查询产品是否存在
						$product_brand_rows=$mdb->table('ts_product_brand')->where(array('language_type'=>$language_type,'product_id'=>$product_id))->find();
						$product_brand_data=array();
						$product_brand_data['language_type']=$language_type;
						$product_brand_data['product_id']=$product_id;
						$product_brand_data['brand_name']=$info['brand_name'];//品牌名称
						$product_brand_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_brand_rows)){
							$product_brand_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_brand',$product_brand_data);//不需要获取 product_brand_id
						}else{
							$product_brand_id=$product_brand_rows['id'];
							$mdb->update('ts_product_brand',$product_brand_data,$product_brand_id);
						}
					}
				}//产品品牌信息
				
				//产品参数
				if(empty($error_array) && is_array($product_parameters_array)){
					
					//循环产品参数信息组
					foreach($product_parameters_array as $key_index=>$info){
						//产品参数语言配置信息
						$language_type_array=array(
							'zh'=>array('parameters_name'=>$info['parameters_name_zh'],'parameters_value'=>$info['parameters_value_zh']),
							'en'=>array('parameters_name'=>$info['parameters_name_en'],'parameters_value'=>$info['parameters_value_en'])
						);
						
						//产品参数处理
						foreach($language_type_array as $language_type=>$info){
							//查询产品是否存在
							$product_parameters_rows=$mdb->table('ts_product_parameters')->where(array('language_type'=>$language_type,'product_id'=>$product_id,'parameters_name'=>$info['parameters_name']))->find();
							
							$product_parameters_data=array();
							$product_parameters_data['language_type']=$language_type;//语言类型
							$product_parameters_data['product_id']=$product_id;//产品id
							$product_parameters_data['key_index']=$key_index;//顺序索引
							$product_parameters_data['parameters_name']=$info['parameters_name'];//参数名称
							$product_parameters_data['parameters_value']=$info['parameters_value'];//参数值
							$product_parameters_data['update_time']=gmdate("Y-m-d H:i:s",time());
							if(empty($product_parameters_rows)){
								$product_parameters_data['add_time']=gmdate("Y-m-d H:i:s",time());
								$mdb->insert('ts_product_parameters',$product_parameters_data);//不需要获取 product_parameters_id
							}else{
								$product_parameters_id=$product_parameters_rows['id'];
								$mdb->update('ts_product_parameters',$product_parameters_data,$product_parameters_id);
							}
						}
					}
				}//产品参数结束
				
				//服务承诺
				if(empty($error_array) && is_array($pledge_array)){
					foreach($pledge_array as $key_index=>$info){
						//承诺信息
						$language_type_array=array(
							'zh'=>array('pledge_value'=>$info['pledge_name_zh']),
							'en'=>array('pledge_value'=>$info['pledge_name_en'])
						);
						
						//产品参数处理
						foreach($language_type_array as $language_type=>$info){
							//查询产品的承诺是否已经存在
							$product_pledge_rows=$mdb->table('ts_product_pledge')->where(array('language_type'=>$language_type,'product_id'=>$product_id,'pledge_value'=>$info['pledge_value']))->find();
							
							$product_pledge_data=array();
							$product_pledge_data['language_type']=$language_type;//语言类型
							$product_pledge_data['product_id']=$product_id;//产品id
							$product_pledge_data['key_index']=$key_index;//顺序索引
							//$product_pledge_data['parameters_name']=$info['parameters_name'];//参数名称
							$product_pledge_data['pledge_value']=$info['pledge_value'];//参数值
							$product_pledge_data['update_time']=gmdate("Y-m-d H:i:s",time());
							if(empty($product_pledge_rows)){
								$product_pledge_data['add_time']=gmdate("Y-m-d H:i:s",time());
								$mdb->insert('ts_product_pledge',$product_pledge_data);//不需要获取 product_pledge_id
							}else{
								$product_pledge_id=$product_pledge_rows['id'];
								$mdb->update('ts_product_pledge',$product_pledge_data,$product_pledge_id);
							}
						}
					}
				}
				//产品内容
				if(empty($error_array)){
					//配置信息
					$language_type_array=array(
						'zh'=>array('description'=>$content_zh),
						'en'=>array('description'=>$content_en)
					);
					//产品标题处理
					foreach($language_type_array as $language_type=>$info){
						//查询产品是否存在
						$product_description_rows=$mdb->table('ts_product_description')->where(array('language_type'=>$language_type,'product_id'=>$product_id))->find();
						
						$product_description_data=array();
						$product_description_data['language_type']=$language_type;
						$product_description_data['product_id']=$product_id;
						$product_description_data['description']=$info['description'];
						$product_description_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_description_rows)){
							$product_description_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_description',$product_description_data);//不需要获取 product_name_id
							
						}else{
							$product_description_id=$product_description_rows['id'];
							$mdb->update('ts_product_description',$product_description_data,$product_description_id);
						}
					}
				}
				
				//上传图片
				if(empty($error_array)){
					foreach($upload_img_array as $key_index=>$upload_img){
						//查询产品是否存在
						$product_imsges_rows=$mdb->table('ts_product_imsges')->where(array('product_id'=>$product_id,'product_image'=>$upload_img))->find();
						$product_imsges_data=array();
						$product_imsges_data['product_id']=$product_id;
						$product_imsges_data['key_index']=$key_index;
						$product_imsges_data['product_image']=$upload_img;
						$product_imsges_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_imsges_rows)){
							$product_imsges_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_imsges',$product_imsges_data);//不需要获取 product_name_id
						}else{
							$product_description_id=$product_imsges_rows['id'];
							$mdb->update('ts_product_imsges',$product_imsges_data,$product_description_id);
						}
					}
				}
				
				//数据方法
				//获取数据字段
				if(empty($error_array)){
					//字段值 存储字段的类型 方便后面处理
					$field_array=array();
					foreach($column_info_array as $key_index=>$column_info){
						//产品属性处理
						if($column_info['type']=="attribute"){
							$attribute_name_zh=$column_info['attribute_name_zh'];
							$attribute_name_en=$column_info['attribute_name_en'];
							//////////////////////////////////////////////////////
							//多语言处理
							$language_type_array=array(
								'zh'=>array('attribute_name'=>$attribute_name_zh),
								'en'=>array('attribute_name'=>$attribute_name_en)
							);
							//插入名称信息
							foreach($language_type_array as $language_type=>$info){
								//查询产品属性是否存在
								$product_attribute_rows=$mdb->table('ts_product_attribute')
															->where(array('language_type'=>$language_type,'product_id'=>$product_id,'attribute_name'=>$info['attribute_name']))
															->find();
								
								$product_attribute_data=array();
								$product_attribute_data['language_type']=$language_type;
								$product_attribute_data['product_id']=$product_id;
								$product_attribute_data['key_index']=$key_index;//添加顺序
								$product_attribute_data['attribute_name']=$info['attribute_name'];
								$product_attribute_data['update_time']=gmdate("Y-m-d H:i:s",time());
								if(empty($product_attribute_rows)){
									$product_attribute_data['add_time']=gmdate("Y-m-d H:i:s",time());
									$product_attribute_id=$mdb->insert('ts_product_attribute',$product_attribute_data);//不需要获取 product_name_id
								}else{
									$product_attribute_id=$product_attribute_rows['id'];
									$mdb->update('ts_product_attribute',$product_attribute_data,$product_attribute_id);
								}
								//多语言的id插入
								$column_info['language_type_array'][$language_type]['product_attribute_id']=$product_attribute_id;
							}//多语言循环结束
						}//属性值处理
						//价格 上架状态 库存数量 属于常量不需要写入 属性表中
						$field_array[]=$column_info;
					}//字段循环
				}
				
				//获取sku信息
				if(empty($error_array)){
					//循环遍历所有sku行
					foreach($sku_info_table as $sku_info){
						
						//定义sku信息
						$shop_id=0;//仓库id
						$sku_weight=0;//sku数量
						$sku_qty=0;//sku数量
						$sku_price="";//sku价格
						$sku_status="";//sku状态
						
						////////////////////////////////////
						//遍历单行字段 准备生成sku
						$pav_group_array=array();//属性值组
						foreach($field_array as $key=>$field_info){
							//sku属性值处理
							if($field_info['type']=="attribute"){
								//////////////////////////////////////////////////////
								//多语言处理
								$language_type_array=array(
									'zh'=>array(
											'attribute_value'=>$sku_info[$key]['attribute_value_zh'],
											'img_src'=>$sku_info[$key]['img_src']
										),
									'en'=>array(
											'attribute_value'=>$sku_info[$key]['attribute_value_en'],
											'img_src'=>$sku_info[$key]['img_src']
									)
								);
								
								//多语言处理
								foreach($language_type_array as $language_type=>$info){
									//得到当前语言的属性id
									$attribute_id=$field_info['language_type_array'][$language_type]['product_attribute_id'];
									//插入产品的属性值信息
									
									//查询产品属性是否存在
									$pav_rows=$mdb->table('ts_product_attribute_value')
													->where(array('language_type'=>$language_type,'product_id'=>$product_id,'attribute_id'=>$attribute_id,'attribute_value'=>$info['attribute_value']))
													->find();
									
									$pav_data=array();
									$pav_data['language_type']=$language_type;
									$pav_data['product_id']=$product_id;
									$pav_data['attribute_id']=$attribute_id;//属性id
									$pav_data['attribute_value']=$info['attribute_value'];//属性值
									$pav_data['attribute_image']=empty($info['img_src'])?"":$info['img_src'];//属性图
									$pav_data['update_time']=gmdate("Y-m-d H:i:s",time());
									if(empty($pav_rows)){
										$pav_data['add_time']=gmdate("Y-m-d H:i:s",time());
										$pav_id=$mdb->insert('ts_product_attribute_value',$pav_data);//不需要获取 product_name_id
									}else{
										$pav_id=$pav_rows['id'];
										$mdb->update('ts_product_attribute_value',$pav_data,$pav_id);
									}
									$pav_group_array[$language_type][]=$pav_id;
								}
							};
							
							//产品数量
							if($field_info['type']=="product_qty"){
								$sku_qty=$sku_info[$key]['product_qty'];
							}
							//产品重量
							if($field_info['type']=="product_weight"){
								$sku_weight=$sku_info[$key]['product_weight'];
							}
							//产品原价
							if($field_info['type']=="product_old_price"){
								$sku_old_price=$sku_info[$key]['product_old_price'];
							}
							//产品价格
							if($field_info['type']=="product_price"){
								$sku_price=$sku_info[$key]['product_price'];
							}
							//产品状态
							if($field_info['type']=="product_status"){
								$sku_status=$sku_info[$key]['product_status'];
							}
						};//sku属性处理结束
						
						//////////////////////////////
						//生成sku
						//程序申请到sku
						$apply_sku=$product_model->apply_sku();
						foreach($pav_group_array as $language_type=>$pav_group){
							//查询产品属性是否存在
							$pav_rows=$mdb->table('ts_product_sku')
											->where(array('language_type'=>$language_type,'product_id'=>$product_id,'pav_ids'=>implode(',',$pav_group)))
											->find();
							
							$ps_data=array();
							$ps_data['language_type']=$language_type;
							$ps_data['product_id']=$product_id;
							$ps_data['pav_ids']=implode(',',$pav_group);//属性id
							$ps_data['sku']=$apply_sku;//申请到的sku
							$ps_data['update_time']=gmdate("Y-m-d H:i:s",time());
							if(empty($pav_rows)){
								$ps_data['add_time']=gmdate("Y-m-d H:i:s",time());
								$ps_id=$mdb->insert('ts_product_sku',$ps_data);//不需要获取 product_name_id
							}else{
								//已经存在就不需要申请的sku
								$apply_sku=$pav_rows['sku'];
								$ps_id=$pav_rows['id'];
								$ps_data['sku']=$apply_sku;//申请到的sku
								$mdb->update('ts_product_sku',$ps_data,$ps_id);
							}
						}
						//设置sku的库存信息等
						//根据当前的信息建立sku表存放 产品的价格信息
						
						
						//插入sku_info信息
						$psi_rows=$mdb->table('ts_product_sku_info')
										->where(array('shop_id'=>$shop_id,'sku'=>$apply_sku))
										->find();
						
						$psi_data=array();
						
						$psi_data['shop_id']=$shop_id;
						$psi_data['product_id']=$product_id;
						$psi_data['sku']=$apply_sku;//申请到的sku
						$psi_data['sku_weight']=$sku_weight;
						$psi_data['sku_qty']=$sku_qty;
						$psi_data['sku_old_price']=$sku_old_price;
						$psi_data['sku_price']=$sku_price;
						$psi_data['sku_status']=$sku_status;
						$psi_data['update_time']=gmdate("Y-m-d H:i:s",time());
						
						if(empty($psi_rows)){
							$psi_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$psi_id=$mdb->insert('ts_product_sku_info',$psi_data);//不需要获取 product_name_id
						}else{
							$psi_id=$psi_rows['id'];
							$mdb->update('ts_product_sku_info',$psi_data,$psi_id);
						}
					}
				}
				
				//如果存在错误
				if(!empty($error_array)){
					$result=array('status'=>100,'msg'=>implode($error_array));
				}else{
					$result=array('status'=>200,'msg'=>'产品添加成功','product_id'=>$product_id);
				}
				echo (json_encode($result));
				exit;
			}else{
				//调用其他控制器方法
				$catalog_array=$this->run_function('admin/product_catalog/get_product_catalog');
				$this->assign("catalog_json",json_encode($catalog_array,true));//设置语言参数
			}
		}
		
		//新增产品测试
		public function product_add_test(){
			$this->product_add();
		}

		//获取父目录
		public function get_parent_catalog($pid=0) {
			$mdb=$this->mdb;
			$catalog_name_array=array();
			$product_catalog_rows=$mdb->table('ts_product_catalog')->where(array('id'=>$pid))->find();
			if(!empty($product_catalog_rows)){
				$pid=$product_catalog_rows['pid'];
				$catalog_name_array[]=$product_catalog_rows['catalog_name'];//得到类目名称
				$catalog_name_array=array_merge($catalog_name_array,$this->get_parent_catalog($pid));
			}
			return $catalog_name_array;
		}
		
		//编辑产品
		public function product_edit(){
			$mdb=$this->mdb;
			$product_id=$this->request->param('id');//获取编辑的产品id
			$post_data=$this->request->param('_POST');
			
			if(!empty($post_data['product_id'])){
				$product_model=new product_model($mdb);//产品模型申请sku用
				$error_array=array();
				//更新产品信息
				$product_id=$post_data['product_id'];
				$product_catalog_id=$post_data['product_catalog_id'];
				
				$payment_address=$post_data['payment_address'];//购买地址 //不是强制填写
				$product_name_zh=$post_data['product_name_zh'];//产品描述中文
				$product_name_en=$post_data['product_name_en'];//产品描述英文
				$brand_zh=$post_data['brand_zh'];//产品描述中文
				$brand_en=$post_data['brand_en'];//产品描述英文
				
				$content_zh=$post_data['content_zh'];//产品描述中文
				$content_en=$post_data['content_en'];//产品描述英语
				$upload_img_array=$post_data['upload_img_array'];//属性图
				
				$pledge_array=null;
				if(!empty($post_data['pledge_array'])){
					$pledge_array=$post_data['pledge_array'];//服务承诺 未建立表
				}
				
				$product_parameters_array=$post_data['product_parameters_array'];//产品参数
				$column_info_array=$post_data['column_info_array'];//sku属性组
				$sku_info_table=$post_data['sku_info_table'];//sku表
				
				if(empty($product_name_zh))$error_array[]='产品 中文名称 未填写';
				if(empty($product_name_en))$error_array[]='产品 英文名称 未填写';
				if(empty($content_zh))$error_array[]='产品 中文内容 未填写';
				if(empty($content_en))$error_array[]='产品 英文内容 未填写';
				if(empty($upload_img_array))$error_array[]='上传图片 未上传';
				
				//更新产品信息
				if(empty($error_array)){
					$product_rows=$mdb->table('ts_product')->where(array('id'=>$product_id))->find();
					$product_data=array();
					$product_data['product_catalog_id']=$product_catalog_id;//产品类目id
					$product_data['product_name']=$product_name_zh;//方便查看的产品名称 中文
					$product_data['payment_address']=$payment_address;//购买地址
					$product_data['product_status']=1;//产品状态
					$product_data['update_time']=gmdate("Y-m-d H:i:s",time());
					if(!empty($product_rows)){
						$product_id=$product_rows['id'];
						$mdb->update('ts_product',$product_data,$product_id);
					}
				}//更新产品信息
				
				//产品名称信息
				if(empty($error_array)){
					
					//配置信息
					$language_type_array=array(
						'zh'=>array('product_name'=>$product_name_zh),
						'en'=>array('product_name'=>$product_name_en)
					);
					//产品标题处理
					foreach($language_type_array as $language_type=>$info){
						//查询产品是否存在
						$product_name_rows=$mdb->table('ts_product_name')->where(array('language_type'=>$language_type,'product_id'=>$product_id))->find();
						$product_name_data=array();
						$product_name_data['language_type']=$language_type;
						$product_name_data['product_id']=$product_id;
						$product_name_data['product_name']=$info['product_name'];
						$product_name_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_name_rows)){
							$product_name_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_name',$product_name_data);//不需要获取 product_name_id
						}else{
							$product_name_id=$product_name_rows['id'];
							$mdb->update('ts_product_name',$product_name_data,$product_name_id);
						}
					}
				}//产品名称信息
				
				//产品品牌信息
				if(empty($error_array)){
					//配置信息
					$language_type_array=array(
						'zh'=>array('brand_name'=>$brand_zh),
						'en'=>array('brand_name'=>$brand_en)
					);
					//产品标题处理
					foreach($language_type_array as $language_type=>$info){
						//查询产品是否存在
						$product_brand_rows=$mdb->table('ts_product_brand')->where(array('language_type'=>$language_type,'product_id'=>$product_id))->find();
						$product_brand_data=array();
						$product_brand_data['language_type']=$language_type;
						$product_brand_data['product_id']=$product_id;
						$product_brand_data['brand_name']=$info['brand_name'];//品牌名称
						$product_brand_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_brand_rows)){
							$product_brand_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_brand',$product_brand_data);//不需要获取 product_brand_id
						}else{
							$product_brand_id=$product_brand_rows['id'];
							$mdb->update('ts_product_brand',$product_brand_data,$product_brand_id);
						}
					}
				}//产品品牌信息
				
				//产品参数
				if(empty($error_array) && is_array($product_parameters_array)){
					
					//删除掉以前的参数
					$mdb->delete('ts_product_parameters',array('product_id'=>$product_id));//删除掉与当前产品相关的产品参数
					//循环产品参数信息组
					foreach($product_parameters_array as $key_index=>$info){
						//产品参数语言配置信息
						$language_type_array=array(
							'zh'=>array('parameters_name'=>$info['parameters_name_zh'],'parameters_value'=>$info['parameters_value_zh']),
							'en'=>array('parameters_name'=>$info['parameters_name_en'],'parameters_value'=>$info['parameters_value_en'])
						);
						
						//产品参数处理
						foreach($language_type_array as $language_type=>$info){
							//查询产品是否存在
							$product_parameters_rows=$mdb->table('ts_product_parameters')->where(array('language_type'=>$language_type,'product_id'=>$product_id,'parameters_name'=>$info['parameters_name']))->find();
							
							$product_parameters_data=array();
							$product_parameters_data['language_type']=$language_type;//语言类型
							$product_parameters_data['product_id']=$product_id;//产品id
							$product_parameters_data['key_index']=$key_index;//顺序索引
							$product_parameters_data['parameters_name']=$info['parameters_name'];//参数名称
							$product_parameters_data['parameters_value']=$info['parameters_value'];//参数值
							$product_parameters_data['update_time']=gmdate("Y-m-d H:i:s",time());
							if(empty($product_parameters_rows)){
								$product_parameters_data['add_time']=gmdate("Y-m-d H:i:s",time());
								$mdb->insert('ts_product_parameters',$product_parameters_data);//不需要获取 product_parameters_id
							}else{
								$product_parameters_id=$product_parameters_rows['id'];
								$mdb->update('ts_product_parameters',$product_parameters_data,$product_parameters_id);
							}
						}
					}
				}//产品参数结束
				
				//服务承诺
				if(empty($error_array) && is_array($pledge_array)){
					
					$mdb->delete('ts_product_pledge',array('product_id'=>$product_id));//删除掉与当前产品相关的服务承诺
					foreach($pledge_array as $key_index=>$info){
						//承诺信息
						$language_type_array=array(
							'zh'=>array('pledge_value'=>$info['pledge_name_zh']),
							'en'=>array('pledge_value'=>$info['pledge_name_en'])
						);
						
						//产品参数处理
						foreach($language_type_array as $language_type=>$info){
							//查询产品的承诺是否已经存在
							$product_pledge_rows=$mdb->table('ts_product_pledge')->where(array('language_type'=>$language_type,'product_id'=>$product_id,'pledge_value'=>$info['pledge_value']))->find();
							
							$product_pledge_data=array();
							$product_pledge_data['language_type']=$language_type;//语言类型
							$product_pledge_data['product_id']=$product_id;//产品id
							$product_pledge_data['key_index']=$key_index;//顺序索引
							//$product_pledge_data['parameters_name']=$info['parameters_name'];//参数名称
							$product_pledge_data['pledge_value']=$info['pledge_value'];//参数值
							$product_pledge_data['update_time']=gmdate("Y-m-d H:i:s",time());
							if(empty($product_pledge_rows)){
								$product_pledge_data['add_time']=gmdate("Y-m-d H:i:s",time());
								$mdb->insert('ts_product_pledge',$product_pledge_data);//不需要获取 product_pledge_id
							}else{
								$product_pledge_id=$product_pledge_rows['id'];
								$mdb->update('ts_product_pledge',$product_pledge_data,$product_pledge_id);
							}
						}
					}
				}
				
				
				//产品内容
				if(empty($error_array)){
					$mdb->delete('ts_product_description',array('product_id'=>$product_id));//删除掉与当前产品相关的产品内容
					//配置信息
					$language_type_array=array(
						'zh'=>array('description'=>$content_zh),
						'en'=>array('description'=>$content_en)
					);
					//产品标题处理
					foreach($language_type_array as $language_type=>$info){
						//查询产品是否存在
						$product_description_rows=$mdb->table('ts_product_description')->where(array('language_type'=>$language_type,'product_id'=>$product_id))->find();
						
						$product_description_data=array();
						$product_description_data['language_type']=$language_type;
						$product_description_data['product_id']=$product_id;
						$product_description_data['description']=$info['description'];
						
						$product_description_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_description_rows)){
							$product_description_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_description',$product_description_data);//不需要获取 product_name_id
							
						}else{
							$product_description_id=$product_description_rows['id'];
							$mdb->update('ts_product_description',$product_description_data,$product_description_id);
							echo $current_sqlstr;
							exit;
							
						}
					}
				}
				
				//上传图片
				if(empty($error_array)){
					$mdb->delete('ts_product_imsges',array('product_id'=>$product_id));//删除掉与当前产品相关的上传图片
					foreach($upload_img_array as $key_index=>$upload_img){
						//查询产品是否存在
						$product_imsges_rows=$mdb->table('ts_product_imsges')->where(array('product_id'=>$product_id,'product_image'=>$upload_img))->find();
						$product_imsges_data=array();
						$product_imsges_data['product_id']=$product_id;
						$product_imsges_data['key_index']=$key_index;
						$product_imsges_data['product_image']=$upload_img;
						$product_imsges_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($product_imsges_rows)){
							$product_imsges_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_product_imsges',$product_imsges_data);//不需要获取 product_name_id
						}else{
							$product_description_id=$product_imsges_rows['id'];
							$mdb->update('ts_product_imsges',$product_imsges_data,$product_description_id);
						}
					}
				}
				
				//数据方法
				//获取数据字段
				if(empty($error_array)){
					$mdb->delete('ts_product_attribute',array('product_id'=>$product_id));//删除以前的属性信息
					
					//字段值 存储字段的类型 方便后面处理
					$field_array=array();
					foreach($column_info_array as $key_index=>$column_info){
						//产品属性处理
						if($column_info['type']=="attribute"){
							$attribute_name_zh=$column_info['attribute_name_zh'];
							$attribute_name_en=$column_info['attribute_name_en'];
							//////////////////////////////////////////////////////
							//多语言处理
							$language_type_array=array(
								'zh'=>array('attribute_name'=>$attribute_name_zh),
								'en'=>array('attribute_name'=>$attribute_name_en)
							);
							//插入名称信息
							foreach($language_type_array as $language_type=>$info){
								//查询产品属性是否存在
								$product_attribute_rows=$mdb->table('ts_product_attribute')
															->where(array('language_type'=>$language_type,'product_id'=>$product_id,'attribute_name'=>$info['attribute_name']))
															->find();
								
								$product_attribute_data=array();
								$product_attribute_data['language_type']=$language_type;
								$product_attribute_data['product_id']=$product_id;
								$product_attribute_data['key_index']=$key_index;//添加顺序
								$product_attribute_data['attribute_name']=$info['attribute_name'];
								$product_attribute_data['update_time']=gmdate("Y-m-d H:i:s",time());
								if(empty($product_attribute_rows)){
									$product_attribute_data['add_time']=gmdate("Y-m-d H:i:s",time());
									$product_attribute_id=$mdb->insert('ts_product_attribute',$product_attribute_data);//不需要获取 product_name_id
								}else{
									$product_attribute_id=$product_attribute_rows['id'];
									$mdb->update('ts_product_attribute',$product_attribute_data,$product_attribute_id);
								}
								//多语言的id插入
								$column_info['language_type_array'][$language_type]['product_attribute_id']=$product_attribute_id;
							}//多语言循环结束
						}//属性值处理
						//价格 上架状态 库存数量 属于常量不需要写入 属性表中
						$field_array[]=$column_info;
					}//字段循环
				}
				
				
				
				//获取sku信息
				if(empty($error_array)){
					
					$mdb->delete('ts_product_attribute_value',array('product_id'=>$product_id));//删除以前的属性值信息
					$mdb->delete('ts_product_sku',array('product_id'=>$product_id));//删除以前的产品sku信息
					$mdb->delete('ts_product_sku_info',array('product_id'=>$product_id));//删除以前的产品sku_info信息
					
					//循环遍历所有sku行
					foreach($sku_info_table as $sku_info){
						//定义sku信息
						$shop_id=0;//仓库id
						$sku_weight=0;//sku数量
						$sku_qty=0;//sku数量
						$sku_price="";//sku价格
						$sku_status="";//sku状态
						
						////////////////////////////////////
						//遍历单行字段 准备生成sku
						$pav_group_array=array();//属性值组
						foreach($field_array as $key=>$field_info){
							//sku属性值处理
							if($field_info['type']=="attribute"){
								//////////////////////////////////////////////////////
								//多语言处理
								$language_type_array=array(
									'zh'=>array(
											'attribute_value'=>$sku_info[$key]['attribute_value_zh'],
											'img_src'=>$sku_info[$key]['img_src']
										),
									'en'=>array(
											'attribute_value'=>$sku_info[$key]['attribute_value_en'],
											'img_src'=>$sku_info[$key]['img_src']
									)
								);
								
								//多语言处理
								foreach($language_type_array as $language_type=>$info){
									//得到当前语言的属性id
									$attribute_id=$field_info['language_type_array'][$language_type]['product_attribute_id'];
									//插入产品的属性值信息
									
									//查询产品属性是否存在
									$pav_rows=$mdb->table('ts_product_attribute_value')
													->where(array('language_type'=>$language_type,'product_id'=>$product_id,'attribute_id'=>$attribute_id,'attribute_value'=>$info['attribute_value']))
													->find();
									
									$pav_data=array();
									$pav_data['language_type']=$language_type;
									$pav_data['product_id']=$product_id;
									$pav_data['attribute_id']=$attribute_id;//属性id
									$pav_data['attribute_value']=$info['attribute_value'];//属性值
									$pav_data['attribute_image']=empty($info['img_src'])?"":$info['img_src'];//属性图
									$pav_data['update_time']=gmdate("Y-m-d H:i:s",time());
									if(empty($pav_rows)){
										$pav_data['add_time']=gmdate("Y-m-d H:i:s",time());
										$pav_id=$mdb->insert('ts_product_attribute_value',$pav_data);//不需要获取 product_name_id
									}else{
										$pav_id=$pav_rows['id'];
										$mdb->update('ts_product_attribute_value',$pav_data,$pav_id);
									}
									$pav_group_array[$language_type][]=$pav_id;
								}
							};
							
							//产品数量
							if($field_info['type']=="product_qty"){
								$sku_qty=$sku_info[$key]['product_qty'];
							}
							//产品重量
							if($field_info['type']=="product_weight"){
								$sku_weight=$sku_info[$key]['product_weight'];
							}
							//产品原价
							if($field_info['type']=="product_old_price"){
								$sku_old_price=$sku_info[$key]['product_old_price'];
							}
							//产品价格
							if($field_info['type']=="product_price"){
								$sku_price=$sku_info[$key]['product_price'];
							}
							//产品状态
							if($field_info['type']=="product_status"){
								$sku_status=$sku_info[$key]['product_status'];
							}
						};//sku属性处理结束
						
						//////////////////////////////
						//生成sku
						//程序申请到sku
						$apply_sku=$product_model->apply_sku();
						foreach($pav_group_array as $language_type=>$pav_group){
							//查询产品属性是否存在
							$pav_rows=$mdb->table('ts_product_sku')
											->where(array('language_type'=>$language_type,'product_id'=>$product_id,'pav_ids'=>implode(',',$pav_group)))
											->find();
							
							$ps_data=array();
							$ps_data['language_type']=$language_type;
							$ps_data['product_id']=$product_id;
							$ps_data['pav_ids']=implode(',',$pav_group);//属性id
							$ps_data['sku']=$apply_sku;//申请到的sku
							$ps_data['update_time']=gmdate("Y-m-d H:i:s",time());
							if(empty($pav_rows)){
								$ps_data['add_time']=gmdate("Y-m-d H:i:s",time());
								$ps_id=$mdb->insert('ts_product_sku',$ps_data);//不需要获取 product_name_id
							}else{
								//已经存在就不需要申请的sku
								$apply_sku=$pav_rows['sku'];
								$ps_id=$pav_rows['id'];
								$ps_data['sku']=$apply_sku;//申请到的sku
								$mdb->update('ts_product_sku',$ps_data,$ps_id);
							}
						}
						//设置sku的库存信息等
						//根据当前的信息建立sku表存放 产品的价格信息
						
						
						//插入sku_info信息
						$psi_rows=$mdb->table('ts_product_sku_info')
										->where(array('shop_id'=>$shop_id,'sku'=>$apply_sku))
										->find();
						
						$psi_data=array();
						
						$psi_data['shop_id']=$shop_id;
						$psi_data['product_id']=$product_id;
						$psi_data['sku']=$apply_sku;//申请到的sku
						$psi_data['sku_weight']=$sku_weight;
						$psi_data['sku_qty']=$sku_qty;
						$psi_data['sku_old_price']=$sku_old_price;
						$psi_data['sku_price']=$sku_price;
						$psi_data['sku_status']=$sku_status;
						$psi_data['update_time']=gmdate("Y-m-d H:i:s",time());
						
						if(empty($psi_rows)){
							$psi_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$psi_id=$mdb->insert('ts_product_sku_info',$psi_data);//不需要获取 product_name_id
						}else{
							$psi_id=$psi_rows['id'];
							$mdb->update('ts_product_sku_info',$psi_data,$psi_id);
						}
					}//sku循环结束
				}//错误信息判断结束
				
				//如果存在错误
				if(!empty($error_array)){
					$result=array('status'=>100,'msg'=>implode($error_array));
				}else{
					$result=array('status'=>200,'msg'=>'产品修改成功','product_id'=>$product_id);
				}
				echo (json_encode($result));
				exit;
			}else{
				$language=new language();
				$current_language='zh';//强制为中文
				$this->assign("label",$language->get($current_language));//设置语言参数 给予对应模板
				$this->assign("current_language",json_encode($language->get($current_language)));//js模板使用
				
				$product_info=array();
				//调用其他控制器方法
				$catalog_array=$this->run_function('admin/product_catalog/get_product_catalog');
				$this->assign("catalog_json",json_encode($catalog_array,true));//设置语言参数
				
				//产品信息
				$product_rows=$mdb->table('ts_product')->where(array('id'=>$product_id))->find();
				$product_catalog_id=$product_rows['product_catalog_id'];
				$product_catalog_rows=$mdb->table('ts_product_catalog')->where(array('id'=>$product_catalog_id))->find();
				$catalog_name=$product_catalog_rows['catalog_name'];
				
				$catalog_name_array=array_reverse($this->get_parent_catalog($product_catalog_id));
				
				$product_info['product_id']=$product_id;
				$product_info['catalog_name']=implode(">>",$catalog_name_array);//类目id
				$product_info['product_catalog_id']=$product_catalog_id;//类目id
				$product_info['shop_id']=$product_rows['shop_id'];//店铺id
				$product_info['payment_address']=$product_rows['payment_address'];//购买地址
				$product_info['monthly_sales']=$product_rows['monthly_sales'];//月销量
				$product_info['total_sales']=$product_rows['total_sales'];//总销量
				$product_info['total_evaluate']=$product_rows['total_evaluate'];//总评价
				
				//产品名称 多语言
				$product_name_array=$mdb->table('ts_product_name')->where(array('product_id'=>$product_id))->select();
				$product_name_info=array();
				foreach($product_name_array as $product_name_rows){
					//配置不同的语言信息
					$product_name_info[$product_name_rows['language_type']]=$product_name_rows;
				}
				$product_info['product_name_info']=$product_name_info;
				
				//获取品牌信息
				$product_brand_array=$mdb->table('ts_product_brand')->where(array('product_id'=>$product_id))->select();
				$product_brand_info=array();
				foreach($product_brand_array as $product_brand_rows){
					//配置不同的语言信息
					$product_brand_info[$product_brand_rows['language_type']]=$product_brand_rows;
				}
				$product_info['product_brand_info']=$product_brand_info;
				
				/////////////////////////////////////////////////////////////////////
				//产品参数
				$product_parameters_array=$mdb->table('ts_product_parameters')->where(array('product_id'=>$product_id))->order_by('key_index asc')->select();
				$product_parameters_info=array();
				foreach($product_parameters_array as $product_parameters_rows){
					$key_index=$product_parameters_rows['key_index'];//索引位置
					if(!isset($product_parameters_info[$key_index])){
						$product_parameters_info[$key_index]=array();
					}
					//配置不同的语言信息
					//$product_brand_info[$product_parameters_rows['language_type']]=$product_parameters_rows;
					$language_type=$product_parameters_rows['language_type'];//语言类型
					$parameters_name=$product_parameters_rows['parameters_name'];//参数名称
					$parameters_value=$product_parameters_rows['parameters_value'];//属性值
					
					$product_parameters_info[$key_index][$language_type]=array(
						'parameters_name'=>$parameters_name,
						'parameters_value'=>$parameters_value
					);
				}
				$product_info['product_parameters_info']=$product_parameters_info;
				
				/////////////////////////////////////////////////////////////////////
				//服务承诺
				$product_pledge_array=$mdb->table('ts_product_pledge')->where(array('product_id'=>$product_id))->order_by('key_index asc')->select();
				$product_pledge_info=array();
				foreach($product_pledge_array as $product_pledge_rows){
					$key_index=$product_pledge_rows['key_index'];//索引位置
					if(!isset($product_parameters_info[$key_index])){
						$product_pledge_info[$key_index]=array();
					}
					
					//配置不同的语言信息
					$language_type=$product_pledge_rows['language_type'];//语言类型
					$pledge_value=$product_pledge_rows['pledge_value'];//属性值
					$product_pledge_info[$key_index][$language_type]=array('pledge_value'=>$pledge_value);
				}
				$product_info['product_pledge_info']=$product_pledge_info;
				
				//查询上传图片
				
				/////////////////////////////////////////////////////////////////////
				//查询上传图片
				$product_imsges_array=$mdb->table('ts_product_imsges')->where(array('product_id'=>$product_id))->order_by('key_index asc')->select();
				$product_imsges_info=array();
				foreach($product_imsges_array as $product_imsges_rows){
					$key_index=$product_imsges_rows['key_index'];//索引位置
					if(!isset($product_imsges_info[$key_index])){
						$product_imsges_info[$key_index]=array();
					}
					
					//配置不同的语言信息
					$language_type=$product_imsges_rows['language_type'];//语言类型
					$product_image=$product_imsges_rows['product_image'];//属性值
					$product_imsges_info[$key_index][$language_type]=array('product_image'=>$product_image);
				}
				$product_info['product_imsges_info']=$product_imsges_info;
				
				
				
				//产品属性
				$product_attribute_array=$mdb->table('ts_product_attribute')->where(array('product_id'=>$product_id))->select();
				
				$attribute_info_array=array();
				foreach($product_attribute_array as $product_attribute_rows){
					$attribute_id=$product_attribute_rows['id'];//属性id
					$language_type=$product_attribute_rows['language_type'];//语言类型
					$key_index=$product_attribute_rows['key_index'];//顺序位置
					$attribute_name=$product_attribute_rows['attribute_name'];//属性名称
					
					//查询属性的相关属性值
					$pav_array=$mdb->table('ts_product_attribute_value')->where(array('attribute_id'=>$attribute_id))->select();
					$pav_info=array();
					foreach($pav_array as $pav_rows){
						$attribute_value_id=$pav_rows['id'];//属性值
						$attribute_value=$pav_rows['attribute_value'];//属性值
						$attribute_image=$pav_rows['attribute_image'];//属性图
						
						$temp_language_type=$pav_rows['language_type'];//属性的语言类型
						$pav_info[]=array('attribute_value_id'=>$attribute_value_id,'attribute_value'=>$attribute_value,'attribute_image'=>$attribute_image);
					}
					$attribute_info_array[$key_index][$language_type]=array('attribute_name'=>$attribute_name,'product_attribute_value'=>$pav_info);
				}
				
				$product_info['attribute_info_array']=$attribute_info_array;//属性信息
				
				//生成html节点
				$attribute_all_html="";//全部节点
				foreach($product_info['attribute_info_array'] as $key_index=>$attribute_info){
					$attribute_html='<div class="attributes">';
					$attribute_html.='<div class="attributes_name" data-attribute_name_en="'.$attribute_info['en']['attribute_name'].'" data-attribute_name_zh="'.$attribute_info['zh']['attribute_name'].'">'.$attribute_info['zh']['attribute_name'].'</div>';
					if(isset($attribute_info['zh']) && isset($attribute_info['en'])){
						
						//用主语言循环
						foreach($attribute_info['zh']['product_attribute_value'] as $key=>$val){
							if(!empty($val['attribute_image'])){
								$attribute_html.='<div class="attributes_value attribute_img" 
										data-attribute_value_en="'.$attribute_info['en']['product_attribute_value'][$key]['attribute_value'].'" 
										data-attribute_value_zh="'.$attribute_info['zh']['product_attribute_value'][$key]['attribute_value'].'" 
										data-img_src="'.$attribute_info['zh']['product_attribute_value'][$key]['attribute_image'].'">
									<a title="'.$attribute_info['zh']['product_attribute_value'][$key]['attribute_value'].'"><img src="'.$attribute_info['zh']['product_attribute_value'][$key]['attribute_image'].'" style="height: 30px; width: auto; margin-left: 0px;"></a>
								</div>';
							}else{
								$attribute_html.='<div class="attributes_value" 
														data-attribute_value_en="'.$attribute_info['en']['product_attribute_value'][$key]['attribute_value'].'" 
														data-attribute_value_zh="'.$attribute_info['zh']['product_attribute_value'][$key]['attribute_value'].'" 
														data-img_src="">'
													.$attribute_info['zh']['product_attribute_value'][$key]['attribute_value']
												.'</div>';
							}
						}//属性循环
					}
					$attribute_html.='</div>';
					
					$attribute_all_html.=$attribute_html;//增加一个元素
				}
				
				//获取产品编辑内容
				
				$product_description_info=$mdb->table('ts_product_description')->where(array('product_id'=>$product_id))->select();
				$product_description_array=array();
				foreach($product_description_info as $product_description_rows){
					$language_type=$product_description_rows['language_type'];
					$product_description_array[$language_type]=$product_description_rows['description'];
				}
				
				$product_info['attribute_html']=$attribute_all_html;//属性信息
				
				/////////////////////////////////////////////////////////////////////////////////////////////
				//属性相关信息 方便做智能sku信息匹配填写
				//sku信息
				$product_sku_array=$mdb->table('ts_product_sku')->where(array('product_id'=>$product_id,'language_type'=>'zh'))->select();
				
				$sku_info=array();
				foreach($product_sku_array as $key=>$product_sku_rows){
					$sku =$product_sku_rows['sku'];//sku信息
					$pav_ids=$product_sku_rows['pav_ids'];//属性值id
					$pav_ids_array=explode(',',$pav_ids);//分割属性值
					$attribute_value_info=array();
					//得到属性值id
					foreach($pav_ids_array as $pav_id){
						//查询属性值信息
						$pav_rows=$mdb->table('ts_product_attribute_value')->where(array('id'=>$pav_id))->find();
						if(!empty($pav_rows)){
							$attribute_id=$pav_rows['attribute_id'];//属性id
							$attribute_value=$pav_rows['attribute_value'];//属性值
							$attribute_name='';
							$pa_rows=$mdb->table('ts_product_attribute')->where(array('id'=>$attribute_id))->find();
							if(!empty($pa_rows)){
								$attribute_name=$pa_rows['attribute_name'];//属性名称
							}
							$attribute_info=array('attribute_name'=>$attribute_name,'attribute_value'=>$attribute_value);
							$attribute_value_info[$pav_id]=$attribute_info;
						}
					}//属性值循环结束
					
					
					//查询sku_info信息
					$sku_info_rows=$mdb->table('ts_product_sku_info')->where(array('product_id'=>$product_id,'sku'=>$sku))->find();
					if(empty($sku_info_rows))$sku_info_rows=array();
					
					
					$sku_info[$sku]=array('attribute_value_info'=>$attribute_value_info,'sku_info'=>$sku_info_rows);
				}//sku循环结束
				
				//file_put_contents('E:/1.json',json_encode($sku_info));
				$product_info['sku_info']=$sku_info;//sku_info 方便js 智能填写值
				#$product_info['attribute_html']=$attribute_all_html;//属性值关系信息
				$product_info['product_description_array']=$product_description_array;//产品描述信息
				
				//////////////////////////////////////////////
				//调用模板显示
				$this->assign("product_info",$product_info);
			}
			
		}
		
		//图片上传
		public function upload_image($input_name='images'){
			set_time_limit(1200);//上传文件最大执行时间 为 20分钟
			$error_array=array();
			if (count($_FILES) <= 0) $error_array['count_file']="未上传文件";
			if(empty($error_array)){
				$name_array = $_FILES[$input_name]["name"];//得到图片名称
				$save_file_name_array=array();//已经上传的图片
				//遍历上传的图片
				foreach($_FILES[$input_name]["name"] as $k=>$file_name){
					if($_FILES[$input_name]["error"][$k]==0){
						$save_file_name=$this->save_file_name($file_name);
						move_uploaded_file($_FILES[$input_name]['tmp_name'][$k], root_dir.DS.$save_file_name);
						$save_file_name_array[]=$save_file_name;
					}else{
						$error_array['error']=$file_name."上传文件错误";
					}
				}
			}
			
			//信息返回处理
			if(empty($error_array)){
				$return_array=array(
					'status'=>'200',
					'file_name'=>$save_file_name_array,
					'msg'=>'文件上传成功',
				);
			}else{
				$return_array=array(
					'status'=>'100',
					'msg'=>'文件上传失败->'.implode('|',$error_array),
					'error_array'=>$error_array,
				);
			}
			echo json_encode($return_array);
			exit;
		}
		
		//生成不存在的文件名称
		public function save_file_name($file_name){
			
			$path_parts= pathinfo($file_name);
			$file_name=$path_parts['filename'];//文件名称
			$file_extension=$path_parts['extension'];//文件后缀
			$file_name = $file_name.'_'.sprintf('%04d', rand(0, 9999)).'.'.$file_extension;
			$file_dir=upload_file.DS.date('Ymd');
			
			if(!is_dir(root_dir.DS.$file_dir))mkdir(root_dir.DS.$file_dir);
			$save_file_name = $file_dir.DS.$file_name;
			
			//如果文件存在
			if(file_exists($save_file_name)){
				$this->save_file_name($file_name);
			}else{
				return $save_file_name;
			}
			
		}
		
		
		/**
		类目树
		参数1 目录组
		参数2 默认的选择的目录id=0
		参数3 当前显示的级别 默认=0
		*/
		public function catalog_tree($catalog_array=array(),$catalog_id=0,$level=0){
			$catalog_html="";
			foreach($catalog_array as $catalog_info){
				//判断类目是否有子集
				$prefix_srting='';
				if($level>0){
					$prefix_srting=implode(array_pad(array(),$level,'--')).'>';
				}
				$child_html='';
				if(!empty($catalog_info['child'])){
					$child_html=$this->catalog_tree($catalog_info['child'],$catalog_id,$level+1);
				}
				
				//设置默认选择
				$selected_string='';
				if($catalog_info['id']==$catalog_id){
					$selected_string='selected="selected"';
				}
				$catalog_html.='<option value ="'.$catalog_info['id'].'" '.$selected_string.'>'.$prefix_srting.$catalog_info['catalog_name'].'('.$catalog_info['product_count'].')'.'</option>';
				
				//追加子级节点
				$catalog_html.=$child_html;
			}
			return $catalog_html;
		}
	}
?>