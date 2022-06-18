<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:论坛首页
	*/
	namespace croe\controller;
	use bbs\model\language;
	use bbs\model\bbs_catalog;
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
		
		//首页
		public function index(){
			$mdb=$this->mdb;
			$current_language=$this->current_language;
			$bbs_catalog_sqlstr="SELECT * FROM ts_bbs_catalog";
			$bbs_catalog_sql=$mdb->query($bbs_catalog_sqlstr);
			
			//维基百科数组
			$bbs_catalog_array=array();
			$line=0;//行
			$column_sum=3;//列数
			$serial_number=0;//记录序号
			while($bbs_catalog_return=$mdb->fetch_assoc($bbs_catalog_sql)){
				if($serial_number%$column_sum==0){
					$line+=1;
					$bbs_catalog_array[$line]=array();//程序中的当前行
				}
				$serial_number+=1;
				$bbs_catalog_id=$bbs_catalog_return['id'];
				//查询产品名称
				$bbs_catalog_name_sqlstr="SELECT * FROM ts_bbs_catalog_name"
									." WHERE 1=1"
									." AND bbs_catalog_id=".$mdb->qstr($bbs_catalog_id)
									." AND language_type=".$mdb->qstr($current_language);//语言
				$bbs_catalog_name_rows=$mdb->find($bbs_catalog_name_sqlstr);
				//得到产品名称
				$bbs_catalog_return['bbs_name']=$bbs_catalog_name_rows['catalog_name'];//产品名称
				
				//获取主题数
				$bbs_content_sqlstr="SELECT * FROM ts_bbs_content"
									." WHERE 1=1"
									." AND bbs_catalog_id=".$mdb->qstr($bbs_catalog_id);
				$theme_number=$mdb->count($bbs_content_sqlstr);
			
				$bbs_catalog_return['theme_number']=$theme_number;
				
				//获取最后发帖时间
				$bbs_content_sqlstr="SELECT * FROM ts_bbs_content"
									." WHERE 1=1"
									." AND bbs_catalog_id=".$mdb->qstr($bbs_catalog_id)
									." ORDER BY id desc";
				$bbs_content_rows=$mdb->find($bbs_content_sqlstr);
				if(!empty($bbs_content_rows)){
					$bbs_catalog_return['last_reply_time']=$bbs_content_rows['add_time'];//最后一次回复时间
				}else{
					$bbs_catalog_return['last_reply_time']='0000-00-00 00:00:00';
				}
				
				//获取帖子数量
				$bbs_content_comment_sqlstr="SELECT * FROM ts_bbs_content_comment"
									." WHERE 1=1"
									." AND bbs_catalog_id=".$mdb->qstr($bbs_catalog_id);
				$post_number=$mdb->count($bbs_content_comment_sqlstr);
				$bbs_catalog_return['post_number']=$post_number;
				
				//获取最后发帖时间
				$bbs_content_sqlstr="SELECT * FROM ts_bbs_content"
									." WHERE 1=1"
									." AND bbs_catalog_id=".$mdb->qstr($bbs_catalog_id)
									." order by id desc";
				$bbs_content_rows=$mdb->find($bbs_content_sqlstr);
				if(empty($bbs_content_rows)){
					$bbs_catalog_return['last_post_time']="0000-00-00 00:00:00";
				}else{
					$bbs_catalog_return['last_post_time']=$bbs_content_rows['add_time'];
				}
				
				
				//加入产品数组
				$bbs_catalog_array[$line][]=$bbs_catalog_return;
			}
			
			$this->assign("bbs_catalog_array",$bbs_catalog_array);
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
					.'<div class="catalog_name">'.$catalog_info['catalog_name'].'('.$catalog_info['wiki_count'].')'.'</div>'
					.$child_html
				.'</li>';
			}
			$catalog_html.="</ul>";
			return $catalog_html;
		}
		
	}
?>