<?php
	namespace shop\model;
	//语言类
	class catalog{
		public function __construct($db,$current_language='zh') {
			$this->db=$db;
			$this->current_language=$current_language;
		}
		//获取目录树
		public function get_catalog($pid=0) {
			$mdb=$this->db;
			$catalog_sqlstr="SELECT * FROM ts_catalog where pid=".$mdb->qstr($pid);
			$catalog_sql=$mdb->query($catalog_sqlstr);
			$catalog_array=array();
			while($catalog_return=$mdb->fetch_assoc($catalog_sql)){
				$catalog_id=$catalog_return['id'];
				$catalog_pid=$catalog_return['pid'];
				//获取类目中的产品数量
				$product_count=$mdb->table('ts_product')->where(array('catalog_id'=>$catalog_id,'shop_id'=>1))->count();

				$catalog_name_rows=$mdb->table('ts_catalog_name')->where(array('catalog_id'=>$catalog_id,'language_type'=>$this->current_language))->find();
				//对于语言的目录名称
				$catalog_return['catalog_name']=$catalog_name_rows['catalog_name'];
				$catalog_return['product_count']=$product_count;
				$catalog_return['child']=$this->get_catalog($catalog_id);
				$catalog_array[]=$catalog_return;
			}
			return $catalog_array;
			
		}
	
	}
?>