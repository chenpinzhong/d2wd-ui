<?php
	namespace admin\model;
	use shop\model\language;
	//use \croe\controller\controller as controller;
	class product_model{
		public function __construct($db,$current_language="zh") {
			$this->db=$db;//数据库连接类
			$this->current_language=$current_language;
			$this->language=new language();
			$this->exchange_rate=1;//默认汇率
			$language_info=$this->language->get($this->current_language);
			$this->exchange_rate=$language_info['exchange_rate'];//得到汇率
			
		}
		//申请一个sku
		public function apply_sku(){
			$product_sku_sqlstr="SELECT max(sku) as max_sku FROM ts_product_sku WHERE 1 LIMIT 1";
			$product_sku_rows=$this->db->find($product_sku_sqlstr);
			if(!empty($product_sku_rows['max_sku'])){
				return $product_sku_rows['max_sku']+1;
			}else{
				return "100000";
			}
		}
		//获取产品info
		public function get_product_info($product_id){
			//db 简写 数据库
			$db=$this->db;
			//调用的语言
			$current_language=$this->current_language;
			
			//产品的全部信息
			$product_info=array();
			
			$product_sqlstr="SELECT * FROM ts_product WHERE id=".$db->qstr($product_id);
			
			$product_rows=$db->find($product_sqlstr);
			
			
			//获取到产品信息
			$shop_id=$product_rows['shop_id'];//店铺id
			$product_info['shop_id']=$product_rows['shop_id'];//店铺id
			$product_info['product_id']=$product_rows['id'];//产品id
			$product_info['product_catalog_id']=$product_rows['product_catalog_id'];//类目id
			$product_info['payment_address']=$product_rows['payment_address'];//购买地址
			$product_info['monthly_sales']=$product_rows['monthly_sales'];//月销量
			$product_info['total_sales']=$product_rows['total_sales'];//总销量
			$product_info['total_evaluate']=$product_rows['total_evaluate'];//总评价
			$product_info['add_time']=$product_rows['add_time'];//产品的添加时间
			$product_info['update_time']=$product_rows['update_time'];//产品的更新时间
			
			//获取类目详细信息
			
			//查询产品名称
			$product_name_sqlstr="SELECT * FROM ts_product_name"
								." WHERE 1=1"
								." AND product_id=".$db->qstr($product_id)
								." AND language_type=".$db->qstr($current_language);
			
			$product_name_rows=$db->find($product_name_sqlstr);
			$product_info['product_name']=$product_name_rows['product_name'];//产品名称
			
			
			//查询产品图片 //目前产品图片默认为中国
			$product_imsges_sqlstr="SELECT * FROM ts_product_imsges"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND language_type=".$db->qstr($current_language)
									." order by key_index asc"
									." LIMIT 99";
			$product_imsges_sql=$db->query($product_imsges_sqlstr);
			$pi_affected_rows=$db->affected_rows;//获取记录数量
			//如果记录数量为0 则使用默认语言类型查询
			if($pi_affected_rows==0){
				//使用默认语言查询
				$product_imsges_sqlstr="SELECT * FROM ts_product_imsges"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND language_type=".$db->qstr('zh')
									." order by key_index asc"
									." LIMIT 99";
				$product_imsges_sql=$db->query($product_imsges_sqlstr);
			}
			
			//遍历查询结果
			$product_imsges_array=array();
			while($product_imsges_return=$db->fetch_assoc($product_imsges_sql)){
				$product_imsges_array[]=$product_imsges_return['product_image'];
			}
			$product_info['product_imsges_array']=$product_imsges_array;
			
			
			//获取产品品牌
			$product_brand_rows=$db->table('ts_product_brand')->where(array('language_type'=>$current_language,'product_id'=>$product_id))->find();
			$product_info['brand_name']=$product_brand_rows['brand_name'];
			
			/////////////////////////////////////////////////////
			//产品参数
			$product_parameters_sqlstr="SELECT * FROM ts_product_parameters"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND language_type=".$db->qstr($current_language)
									." LIMIT 9999";
			$product_parameters_sql=$db->query($product_parameters_sqlstr);
			$product_imsges_affected_rows=$db->affected_rows;//获取记录数量
			$product_parameters_array=array();
			while($product_parameters_return=$db->fetch_assoc($product_parameters_sql)){
				$product_parameters_array[$product_parameters_return['parameters_name']]=$product_parameters_return['parameters_value'];
			}
			$product_info['product_parameters_array']=$product_parameters_array;
			
			
			/////////////////////////////////////////////////////
			//服务承诺
			$product_pledge_sqlstr="SELECT * FROM ts_product_pledge"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_id)
									." AND language_type=".$db->qstr($current_language)
									." LIMIT 9999";
			$product_pledge_sql=$db->query($product_pledge_sqlstr);
			$product_imsges_affected_rows=$db->affected_rows;//获取记录数量
			$product_pledge_array=array();
			while($product_pledge_return=$db->fetch_assoc($product_pledge_sql)){
				$product_pledge_array[]=$product_pledge_return['pledge_value'];//获取到承诺的值
			}
			$product_info['product_pledge_array']=$product_pledge_array;
			
			//获取产品内容
			$product_description_sqlstr="SELECT * FROM ts_product_description"
								." WHERE 1=1"
								." AND product_id=".$db->qstr($product_id)
								." AND language_type=".$db->qstr($current_language);
								
			$product_description_rows=$db->find($product_description_sqlstr);
			$product_info['description']=$product_description_rows['description'];//产品名称
			
			
			//复杂数据建立
			///////////////////////////////////////////////////////////
			//查询产品sku信息
			$product_attribute_sqlstr="SELECT * FROM ts_product_attribute"
									." WHERE 1=1"
									." AND language_type=".$db->qstr($current_language)
									." AND product_id=".$db->qstr($product_id)
									." LIMIT 9999";
			$product_attribute_sql=$db->query($product_attribute_sqlstr);
			$product_attribute_array=array();//产品属性信息
			//存储属性新 属性id属性名称
			$attribute_name_array=array();
			
			while($product_attribute_return=$db->fetch_assoc($product_attribute_sql)){
				$attribute_id=$product_attribute_return['id'];//属性id
				$attribute_name=$product_attribute_return['attribute_name'];//属性名称
				$attribute_name_array[$attribute_id]=$attribute_name;//属性名组
				
				$attribute_value_list=array();//属性值组
				//查询对应属性的子属性
				$pav_sqlstr="SELECT * FROM ts_product_attribute_value"
									." WHERE 1=1"
									." AND language_type=".$db->qstr($current_language)
									." AND product_id=".$db->qstr($product_id)
									." AND attribute_id=".$db->qstr($attribute_id)
									." LIMIT 9999";
				$pav_sql=$db->query($pav_sqlstr);
				while($pav_return=$db->fetch_assoc($pav_sql)){
					$attribute_value_array=array();
					$attribute_value_array['attribute_value_id']=$pav_return['id'];//属性值
					$attribute_value_array['attribute_name']=$attribute_name;//属性值
					$attribute_value_array['attribute_value']=$pav_return['attribute_value'];//属性值
					$attribute_value_array['attribute_image']=$pav_return['attribute_image'];//属性图
					$attribute_value_list[]=$attribute_value_array;
				}
				
				//属性的详细信息
				$product_attribute_array[$attribute_id]=array(
					'attribute_id'=>$attribute_id,
					'attribute_name'=>$attribute_name,
					'attribute_value_list'=>$attribute_value_list,
				);
			};
			
			$product_info['product_attribute_array']=$product_attribute_array;
			
			///////////////////////////////////////////
			//获取sku销售信息
			$product_sku_sqlstr="SELECT * FROM ts_product_sku"
						." WHERE 1=1"
						." AND language_type=".$db->qstr($current_language)
						." AND product_id=".$db->qstr($product_id)
						." LIMIT 9999";
			$product_sku_sql=$db->query($product_sku_sqlstr);
			$sku_info_array=array();
			while($product_sku_return=$db->fetch_assoc($product_sku_sql)){
				//product_sku_info
				$sku=$product_sku_return['sku'];
				$sku_info_array[$sku]=array();
				$pav_ids=explode(',',$product_sku_return['pav_ids']);
				
				$attribute_value_list=array();
				foreach($pav_ids as $pav_id){
					
					//通过属性值id
					$pav_sqlstr="SELECT * FROM ts_product_attribute_value"
									." WHERE 1=1"
									." AND id=".$db->qstr($pav_id)
									." LIMIT 9999";
					$pav_sql=$db->query($pav_sqlstr);
					while($pav_return=$db->fetch_assoc($pav_sql)){
						$attribute_value_array=array();
						$attribute_value_array['attribute_value_id']=$pav_return['id'];//属性值ID
						$attribute_value_array['attribute_name']=$attribute_name_array[$pav_return['attribute_id']];//获取属性名称 根据属性id获取
						$attribute_value_array['attribute_value']=$pav_return['attribute_value'];//属性值
						$attribute_value_array['attribute_image']=$pav_return['attribute_image'];//属性图
						$attribute_value_list[]=$attribute_value_array;
					}
				}
				$sku_info_array[$sku]['attribute_value_list']=$attribute_value_list;
				//sku的其他信息
				
				//获取产品的基本信息
				$product_sku_info_rows=$db->table('ts_product_sku_info')->where(array('sku'=>$sku))->find();
				
				//计算汇率
				//sku价格
				
				$sku_price=$product_sku_info_rows['sku_price']/$this->exchange_rate;
				$product_sku_info_rows['sku_price']=sprintf('%.2f',$sku_price);
				
				//原价
				$sku_old_price=$product_sku_info_rows['sku_old_price']/$this->exchange_rate;
				$product_sku_info_rows['sku_old_price']=sprintf('%.2f',$sku_old_price);
				
				$sku_info_array[$sku]['product_sku_info']=$product_sku_info_rows;
			}
			
			$product_info['sku_info_array']=$sku_info_array;
			
			//获取sku最小售价 以及原价
			$psi_sqlstr="SELECT * FROM ts_product_sku_info"
							." WHERE product_id=".$db->qstr($product_id)
							." ORDER BY sku_price ASC"
							." LIMIT 1";
			$psi_rows=$db->find($psi_sqlstr);
			
			//最低价格
			$sku_price=$psi_rows['sku_price']/$this->exchange_rate;
			$product_info['min_price']=sprintf('%.2f',$sku_price);//最小售价
			
			$sku_old_price=$psi_rows['sku_old_price']/$this->exchange_rate;
			
			$product_info['min_old_price']=sprintf('%.2f',$sku_old_price);//最小售价的 原价
			
			
			return $product_info;
		}
		
		
		//获取一页产品
		public function get_product_list($product_sqlstr){
			//db 简写 数据库
			$db=$this->db;
			//调用的语言
			$current_language=$this->current_language;
			
			$product_sql=$db->query($product_sqlstr);
			
			$end_time=time();//判断是否为新品

			$product_array=array();
			while($product_return=$db->fetch_assoc($product_sql)){
				
				//查询产品名称
				$product_name_sqlstr="SELECT * FROM ts_product_name"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_return['id'])
									." AND language_type=".$db->qstr($current_language);//语言
				$product_name_rows=$db->find($product_name_sqlstr);
				$product_info['product_name']=$product_name_rows['product_name'];//产品名称
				
				//得到产品名称
				$product_return['product_name']=$product_info['product_name'];
				
				//得到产品降价幅度
				$price_scale_sqlstr="SELECT ROUND(sku_price/sku_old_price,2) as price_reduction FROM ts_product_sku_info"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_return['id'])
									." order by price_reduction asc"
									." limit 1";
				$price_scale_rows=$db->find($price_scale_sqlstr);
				
				//降价比例
				$product_return['price_reduction']=$price_scale_rows['price_reduction'];
				
				
				//得到产品最低价格
				$lowest_price_sqlstr="SELECT sku,sku_price,sku_old_price,update_time FROM ts_product_sku_info"
										." WHERE 1=1"
										." AND product_id=".$db->qstr($product_return['id'])
										." order by sku_price asc"
										." limit 1";
				$lowest_price_rows=$db->find($lowest_price_sqlstr);
				
				
				//最低价格
				$sku_price=$lowest_price_rows['sku_price']/$this->exchange_rate;
				$product_return['sku_price']=sprintf('%.2f',$sku_price);//最小售价
				//原价
				$sku_old_price=$lowest_price_rows['sku_old_price']/$this->exchange_rate;
				
				$product_return['sku_old_price']=sprintf('%.2f',$sku_old_price);//最小售价的 原价
				
				//根据更新时间来判断是否为新品
				$start_time=strtotime($lowest_price_rows['update_time']);
				
				//如果超过2天算旧的产品
				if(($end_time-$start_time)<3600*24*30){
					$product_return['new_product']=true;
				}else{
					$product_return['new_product']=false;
				}
				
				//查询产品展示图片
				$product_imsges_sqlstr="SELECT * FROM ts_product_imsges"
									." WHERE 1=1"
									." AND product_id=".$db->qstr($product_return['id'])
									." order by id asc"
									." limit 1";
				$product_imsges_rows=$db->find($product_imsges_sqlstr);
				
				$product_return['product_image_show']=$product_imsges_rows['product_image_show'];
				//加入产品数组
				$product_array[]=$product_return;
			}
			return $product_array;
		}
		
		
	}
?>