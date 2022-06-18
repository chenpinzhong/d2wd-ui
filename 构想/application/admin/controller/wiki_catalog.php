<?php
	/**************************************************
	* 文件名:wiki_catalog.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:后台wiki 类目管理
	*/
	namespace croe\controller;
	class wiki_catalog extends controller{
		public function __construct() {
			parent::__construct();
			//设置数据库连接
			$master=$this->config->get_db_master();//获取主库配置信息
			$this->mdb=$this->db->link($master);//连接主库
		}
		
		public function index(){
			$catalog_array=$this->get_wiki_catalog();
			$this->assign("catalog_json",json_encode($catalog_array,true));//设置语言参数
		}
		
		//获取类型所有信息
		public function get_wiki_catalog($pid=0){
			$mdb=$this->mdb;
			$catalog_sqlstr="SELECT * FROM ts_wiki_catalog where pid=".$mdb->qstr($pid);
			$catalog_sql=$mdb->query($catalog_sqlstr);
			$catalog_array=array();
			while($catalog_return=$mdb->fetch_assoc($catalog_sql)){
				$wiki_catalog_id=$catalog_return['id'];
				$catalog_pid=$catalog_return['pid'];
				
				//查询类目名称
				$catalog_name_sqlstr="SELECT * FROM ts_wiki_catalog_name where wiki_catalog_id=".$mdb->qstr($wiki_catalog_id);
				$catalog_name_sql=$mdb->query($catalog_name_sqlstr);
				$catalog_name_zh='';//类目中文名称
				$catalog_name_en='';//类目英文名称
				
				while($catalog_name_return=$mdb->fetch_assoc($catalog_name_sql)){
					$language_type=$catalog_name_return['language_type'];//语言类型
					//对于语言的目录名称
					$catalog_return['catalog_name'.'_'.$language_type]=$catalog_name_return['catalog_name'];
				}
				$catalog_return['child']=$this->get_wiki_catalog($wiki_catalog_id);
				
				$catalog_array[]=$catalog_return;
			}
			return $catalog_array;
		}
		
		//获取类目下所有的类目id
		public function get_wiki_catalog_id($pid=0){
			$mdb=$this->mdb;
			
			$catalog_sqlstr="SELECT * FROM ts_wiki_catalog where pid=".$mdb->qstr($pid);
			$catalog_sql=$mdb->query($catalog_sqlstr);
			$catalog_array=array();
			while($catalog_return=$mdb->fetch_assoc($catalog_sql)){
				$wiki_catalog_id=$catalog_return['id'];
				$catalog_array[]=$catalog_id;
				$catalog_array=array_merge($catalog_array,$this->get_wiki_catalog_id($wiki_catalog_id));//合并子集的id信息到数组
			}
			return $catalog_array;
		}
		
		//添加信息类目
		public function add_wiki_catalog(){
			$mdb=$this->mdb;
			$request=$this->request;
			
			$id=$request->param('id');//对那个id 进行增加
			if(empty($id)){
				$id=0;
			}
			$catalog_name_zh=$request->param('catalog_name_zh');
			$catalog_name_en=$request->param('catalog_name_en');
			
			$catalog_sqlstr="SELECT * FROM ts_wiki_catalog where 1=1 ";
			if(is_numeric($id)){
				$catalog_sqlstr.=" and pid =".$mdb->qstr($id);
			}
			if(!empty($catalog_name_zh)){
				$catalog_sqlstr.=" and catalog_name =".$mdb->qstr($catalog_name_zh);
			}
			$catalog_rows=$mdb->find($catalog_sqlstr);
			
			$catalog_data=array(
				'pid'=>$id,
				'catalog_name'=>$catalog_name_zh,
				'update_time'=>date('Y-m-d H:i:s',time()),
			);
			
			if(empty($catalog_rows)){
				//插入
				$wiki_catalog_id=$mdb->insert('ts_wiki_catalog',$catalog_data);
			}else{
				//更新
				$wiki_catalog_id=$catalog_rows['id'];
				$mdb->update('ts_wiki_catalog',$catalog_data,array('id'=>$wiki_catalog_id));
			}
			
			
			//设置目录的名称
			$category_name_array=array('zh'=>$catalog_name_zh,'en'=>$catalog_name_en);
			foreach($category_name_array as $language_type=>$catalog_name){
				//查询产品是否存在
				$catalog_name_rows=$mdb->table('ts_wiki_catalog_name')->where(array('language_type'=>$language_type,'wiki_catalog_id'=>$wiki_catalog_id))->find();
				
				$catalog_name_data=array();
				$catalog_name_data['wiki_catalog_id']=$wiki_catalog_id;
				$catalog_name_data['language_type']=$language_type;
				$catalog_name_data['catalog_name']=$catalog_name;
				$catalog_name_data['update_time']=gmdate("Y-m-d H:i:s",time());
				if(empty($catalog_name_rows)){
					$catalog_name_data['add_time']=gmdate("Y-m-d H:i:s",time());
					$mdb->insert('ts_wiki_catalog_name',$catalog_name_data);//不需要获取 product_name_id
				}else{
					$catalog_name_id=$catalog_name_rows['id'];
					$mdb->update('ts_wiki_catalog_name',$catalog_name_data,$catalog_name_id);
				}
				
			}
			
			$result=array('status'=>200,'wiki_catalog_id'=>$wiki_catalog_id);
			echo (json_encode($result));
		}
		
		//修改类目
		public function modify_wiki_catalog(){
			$mdb=$this->mdb;
			$request=$this->request;
			
			
			$id=$request->param('id');//对那个id 进行增加
			if(empty($id)){
				$id=0;
			}
			$catalog_name_zh=$request->param('catalog_name_zh');
			$catalog_name_en=$request->param('catalog_name_en');
			
			$catalog_sqlstr="SELECT * FROM ts_wiki_catalog where id=".$mdb->qstr($id);
			$catalog_rows=$mdb->find($catalog_sqlstr);
			
			$catalog_data=array(
				'id'=>$id,
				'catalog_name'=>$catalog_name_zh,
				'update_time'=>date('Y-m-d H:i:s',time()),
			);
			
			if(empty($catalog_rows)){
				//插入
				$wiki_catalog_id=$mdb->insert('ts_wiki_catalog',$catalog_data);
				
			}else{
				//更新
				$wiki_catalog_id=$catalog_rows['id'];
				$mdb->update('ts_wiki_catalog',$catalog_data,array('id'=>$wiki_catalog_id));
			}
			
			//设置目录的名称
			$category_name_array=array('zh'=>$catalog_name_zh,'en'=>$catalog_name_en);
			foreach($category_name_array as $language_type=>$catalog_name){
				//查询产品是否存在
				$catalog_name_rows=$mdb->table('ts_wiki_catalog_name')->where(array('language_type'=>$language_type,'wiki_catalog_id'=>$wiki_catalog_id))->find();
				
				$catalog_name_data=array();
				$catalog_name_data['wiki_catalog_id']=$wiki_catalog_id;
				$catalog_name_data['language_type']=$language_type;
				$catalog_name_data['catalog_name']=$catalog_name;
				$catalog_name_data['update_time']=gmdate("Y-m-d H:i:s",time());
				if(empty($catalog_name_rows)){
					$catalog_name_data['add_time']=gmdate("Y-m-d H:i:s",time());
					$mdb->insert('ts_wiki_catalog_name',$catalog_name_data);//不需要获取 product_name_id
				}else{
					$catalog_name_id=$catalog_name_rows['id'];
					$mdb->update('ts_wiki_catalog_name',$catalog_name_data,$catalog_name_id);
				}
				
			}
			
			$result=array('status'=>200,'wiki_catalog_id'=>$wiki_catalog_id);
			echo (json_encode($result));
		}
		
		//删除类目
		public function delete_wiki_catalog(){
			$mdb=$this->mdb;
			$request=$this->request;
			
			$id=$request->param('id');
			$catalog_sqlstr="SELECT * FROM ts_wiki_catalog where id=".$mdb->qstr($id);
			$catalog_rows=$mdb->find($catalog_sqlstr);
			if(empty($catalog_rows)){
				$status=200;//pid 不存在 已经被输出
			}else{
				$status=200;//pid 不存在 已经被输出
				//判断子集是否存在
				$catalog_id_array=$this->get_wiki_catalog_id($id);
				$catalog_id_array[]=$id;//也删除当前要删除的元素
				foreach($catalog_id_array as $catalog_id){
					$mdb->delete('ts_wiki_catalog',array('id'=>$catalog_id));
				}
			}
			
			$result=array('status'=>$status);
			echo (json_encode($result));
		}
	}
?>