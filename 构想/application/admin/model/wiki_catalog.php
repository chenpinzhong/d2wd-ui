<?php
	namespace admin\model;
	//语言类
	class wiki_catalog{
		public function __construct($db,$current_language='zh') {
			$this->db=$db;
			$this->current_language=$current_language;
		}
		//获取目录树
		public function get_wiki_catalog($pid=0) {
			$mdb=$this->db;
			$catalog_sqlstr="SELECT * FROM ts_wiki_catalog where pid=".$mdb->qstr($pid);
			$catalog_sql=$mdb->query($catalog_sqlstr);
			$catalog_array=array();
			while($catalog_return=$mdb->fetch_assoc($catalog_sql)){
				$wiki_catalog_id=$catalog_return['id'];
				$catalog_pid=$catalog_return['pid'];
				//获取类目中的产品数量
				$wiki_count=$mdb->table('ts_wiki')->where(array('wiki_catalog_id'=>$wiki_catalog_id))->count();
				$catalog_name_rows=$mdb->table('ts_wiki_catalog_name')->where(array('wiki_catalog_id'=>$wiki_catalog_id,'language_type'=>$this->current_language))->find();
				//对于语言的目录名称
				$catalog_return['catalog_name']=$catalog_name_rows['catalog_name'];
				$catalog_return['wiki_count']=$wiki_count;
				$catalog_return['child']=$this->get_wiki_catalog($wiki_catalog_id);
				$catalog_array[]=$catalog_return;
			}
			
			return $catalog_array;
			
		}
	
	}
?>