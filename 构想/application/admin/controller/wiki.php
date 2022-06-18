<?php
	/**************************************************
	* 文件名:wiki.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:后台wiki管理
	*/
	namespace croe\controller;
	use admin\model\wiki_catalog;
	class wiki extends controller{
		
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
			$this->wiki_catalog=new wiki_catalog($mdb);
			$catalog_id=0;//默认
			$shop_id=1;//默认店铺
			$page_size=20;//分页数量
			$page=$this->request->param('page');//分页位置
			
			$param=$this->request->param();
			
			if(empty($page))$page=1;//默认第一页
			//维基百科id
			$wiki_id=$this->request->param('wiki_id');
			//维基百科名称
			$wiki_name=$this->request->param('wiki_name');
			//产品状态
			$wiki_status=$this->request->param('wiki_status');
			//类目id
			$wiki_catalog_id=$this->request->param('wiki_catalog_id');
			$count_record=0;
			
			//缓存
			$cache_data=get_file_cache('get_wiki_catalog');//获取缓存
			if($cache_data){
				$wiki_catalog_array=$cache_data;
			}else{
				$wiki_catalog_array=$this->wiki_catalog->get_wiki_catalog();//百科目录
				set_file_cache('get_wiki_catalog',$wiki_catalog_array,180);//设置缓存
			}
			
			//生成 类目树
			$catalog_tree_html=$this->catalog_tree($wiki_catalog_array,$wiki_catalog_id);
			
			//查询产品
			$wiki_sqlstr = "select ts_wiki.* from ts_wiki";
			//如果查询 产品名称存在
			if(!empty($wiki_name)){
				//使用右连接查询产品
				$wiki_name_join="";
				$wiki_name_join .=" right join ts_wiki_name on ts_wiki_name.wiki_id=ts_wiki.id";//产品id关联
				$wiki_name_join .=" and ts_wiki_name.language_type=".$mdb->qstr($current_language);//查询的语言
				$wiki_name_join .=" and ts_wiki_name.wiki_name like '%".trim($wiki_name)."%'";//筛选产品名称
				$wiki_sqlstr.=$wiki_name_join;
			}
			
			$wiki_sqlstr .=" where 1=1";
			
			//如果搜索产品类目
			if(!empty($wiki_catalog_id)){
				$wiki_sqlstr .=" and ts_wiki.wiki_catalog_id=".$mdb->qstr($wiki_catalog_id);
			}
			//如果根据产品id查询
			if(!empty($wiki_id)){
				$wiki_id_array=explode(",",$wiki_id);
				$wiki_sqlstr .=" and ts_wiki.id in('".implode("','",$wiki_id_array)."')";
			}
			//维基百科状态
			if(is_numeric($wiki_status)){
				$wiki_sqlstr .=" and ts_wiki.wiki_status=".$mdb->qstr($wiki_status);
			}
			
			//默认阅读数排序
			$wiki_sqlstr .=" order by ts_wiki.read_sum desc";
			
			//查询分页
			$wiki_sqlstr .=" limit ".(($page-1)*$page_size).",".$page_size;
			$count_record=$mdb->count($wiki_sqlstr);//总记录数
			$wiki_list_array=$this->get_wiki_list($wiki_sqlstr);
			
			//展示产品
			$this->assign("wiki_list_array",$wiki_list_array);
			
			/////////////////////////////////
			//设置页面 页面参数
			if(!isset($param['wiki_id']))$param['wiki_id']="";//wiki_id
			if(!isset($param['wiki_status']))$param['wiki_status']="";//wiki_status
			if(!isset($param['catalog_id']))$param['catalog_id']=0;//目录id
			if(!isset($param['wiki_name']))$param['wiki_name']="";//产品名称
			
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
		public function wiki_status(){
			$mdb=$this->mdb;
			$wiki_id=$this->request->param('id');//产品的id
			$wiki_status=$this->request->param('wiki_status');//产品的状态
			
			$error_array=array();//定义错误数组
			
			$wiki_rows=$mdb->table('ts_wiki')->where(array('id'=>$wiki_id))->find();
			if(!empty($wiki_rows)){
				$wiki_data=array();
				$wiki_data['wiki_status']=$wiki_status;
				$mdb->update('ts_wiki',$wiki_data,$wiki_id);
			}else{
				$error_array[]='产品不存在';
			}
			$message_info=array(
				"status"=>200,
				"time"=>3,//页面自动跳转时间
				"title"=>"修改成功",
				"message"=>"百科状态 修改成功!",
				"confirm"=>"/admin/wiki/index",//确认
				"cancel"=>"/admin/wiki/index",//取消
			);
			if(!empty($error_array)){
				$message_info=array(
					"status"=>100,
					"time"=>3,//页面自动跳转时间
					"title"=>"修改失败",
					"message"=>implode("|",$error_array),
					"confirm"=>"/admin/wiki/index",//确认
					"cancel"=>"/admin/wiki/index",//取消
				);
			}
			
			$this->assign("message_info",$message_info);//提示错误信息
			$this->display("admin/index/message.html");
			exit;
		}
		
		
		//获取一页产品
		public function get_wiki_list($wiki_sqlstr){
			//db 简写 数据库
			$db=$this->db;
			//调用的语言
			$current_language='zh';//后台语言显示为中文
			
			$wiki_sql=$db->query($wiki_sqlstr);
			
			$end_time=time();//判断是否为新品
			
			//维基百科数组
			$wiki_array=array();
			while($wiki_return=$db->fetch_assoc($wiki_sql)){
				$wiki_id=$wiki_return['id'];
				//查询产品名称
				$wiki_name_sqlstr="SELECT * FROM ts_wiki_name"
									." WHERE 1=1"
									." AND wiki_id=".$db->qstr($wiki_id)
									." AND language_type=".$db->qstr($current_language);//语言
				$wiki_name_rows=$db->find($wiki_name_sqlstr);
				//得到产品名称
				$wiki_return['wiki_name']=$wiki_name_rows['wiki_name'];//产品名称
				
				//加入产品数组
				$wiki_array[]=$wiki_return;
			}
			return $wiki_array;
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
				$catalog_html.='<option value ="'.$catalog_info['id'].'" '.$selected_string.'>'.$prefix_srting.$catalog_info['catalog_name'].'('.$catalog_info['wiki_count'].')'.'</option>';
				
				//追加子级节点
				$catalog_html.=$child_html;
			}
			return $catalog_html;
		}
		
		
		//新增维基
		public function wiki_add(){
			
			/*
			TRUNCATE ts_wiki;
			TRUNCATE ts_wiki_name;
			TRUNCATE ts_wiki_keyword;
			TRUNCATE ts_wiki_upload_file;
			TRUNCATE ts_wiki_description;
			*/
			
			$mdb=$this->mdb;
			$wiki_catalog_id=$this->request->param('wiki_catalog_id');//类目id
			$current_language='zh';//强制为中文
			
			if(is_numeric($wiki_catalog_id)){
				$title_name_zh=$this->request->param('title_name_zh');//标题描述中文
				$title_name_en=$this->request->param('title_name_en');//标题描述英文
				$keyword_array=$this->request->param('keyword_array');//关键词
				$upload_file_array=$this->request->param('upload_file_array');//上传文件
				$content_zh=$this->request->param('content_zh');//中文描述
				$content_en=$this->request->param('content_en');//英文描述
				$title_name=$title_name_zh;
				$wiki_id=0;//初始化 wiki_id
				//插入信息 产品表
				if(empty($error_array)){
					//查询产品是否存在
					$wiki_rows=$mdb->table('ts_wiki')->where(array('title_name'=>$title_name))->find();
					$wiki_data=array();
					$wiki_data['wiki_catalog_id']=$wiki_catalog_id;
					$wiki_data['title_name']=$title_name;
					$wiki_data['update_time']=gmdate("Y-m-d H:i:s",time());
					if(empty($wiki_rows)){
						$wiki_data['add_time']=gmdate("Y-m-d H:i:s",time());
						$wiki_id=$mdb->insert('ts_wiki',$wiki_data);
					}else{
						$wiki_id=$wiki_rows['id'];
						$mdb->update('ts_wiki',$wiki_data,$wiki_id);
					}
				}//wiki表结束
				
				//wiki名称信息
				if(empty($error_array)){
					//配置信息
					$language_type_array=array(
						'zh'=>array('wiki_name'=>$title_name_zh),
						'en'=>array('wiki_name'=>$title_name_en)
					);
					//产品标题处理
					foreach($language_type_array as $language_type=>$info){
						//查询产品是否存在
						$wiki_name_rows=$mdb->table('ts_wiki_name')->where(array('language_type'=>$language_type,'wiki_id'=>$wiki_id))->find();
						$wiki_name_data=array();
						$wiki_name_data['language_type']=$language_type;
						$wiki_name_data['wiki_id']=$wiki_id;
						$wiki_name_data['wiki_name']=$info['wiki_name'];
						$wiki_name_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($wiki_name_rows)){
							$wiki_name_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_wiki_name',$wiki_name_data);//不需要获取 wiki_name_id
						}else{
							$wiki_name_id=$wiki_name_rows['id'];
							$mdb->update('ts_wiki_name',$wiki_name_data,$wiki_name_id);
						}
					}
				}//wiki 维基百科 名称信息
				
				//关键词信息
				if(empty($error_array)){
					//循环产品参数信息组
					foreach($keyword_array as $info){
						//产品参数语言配置信息
						$language_type_array=array(
							'zh'=>array('keyword_name'=>$info['name_zh']),
							'en'=>array('keyword_name'=>$info['name_en'])
						);
						
						//产品参数处理
						foreach($language_type_array as $language_type=>$info){
							//查询产品是否存在
							$wiki_keyword_rows=$mdb->table('ts_wiki_keyword')->where(array('language_type'=>$language_type,'wiki_id'=>$wiki_id,'keyword_name'=>$info['keyword_name']))->find();
							
							$wiki_keyword_data=array();
							$wiki_keyword_data['language_type']=$language_type;//语言类型
							$wiki_keyword_data['wiki_id']=$wiki_id;//wiki_id
							$wiki_keyword_data['keyword_name']=$info['keyword_name'];//参数名称
							$wiki_keyword_data['update_time']=gmdate("Y-m-d H:i:s",time());
							if(empty($wiki_keyword_rows)){
								$wiki_keyword_data['add_time']=gmdate("Y-m-d H:i:s",time());
								$mdb->insert('ts_wiki_keyword',$wiki_keyword_data);//不需要获取 wiki_keyword_id
							}else{
								$wiki_keyword_id=$wiki_keyword_rows['id'];
								$mdb->update('ts_wiki_keyword',$wiki_keyword_data,$wiki_keyword_id);
							}
						}
					}
				}//产品参数结束
				
				//上传文件
				if(empty($error_array)){
					foreach($upload_file_array as $info){
						//判断文件是否已经存在
						$wuf_rows=$mdb->table('ts_wiki_upload_file')->where(array('wiki_id'=>$wiki_id,'file_src'=>$info['src']))->find();
						
						$wuf_data=array();
						$wuf_data['wiki_id']=$wiki_id;//wiki_id
						$wuf_data['file_src']=$info['src'];//文件路径
						$wuf_data['file_name']=$info['name'];//文件名称
						$wuf_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($wuf_rows)){
							$wuf_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_wiki_upload_file',$wuf_data);//不需要获取 wiki_keyword_id
						}else{
							$wuf_id=$wuf_rows['id'];
							$mdb->update('ts_wiki_upload_file',$wuf_data,$wuf_id);
						}
					}
				}//wiki 文件结束
				
				
				//wiki描述内容
				if(empty($error_array)){
					//配置信息
					$language_type_array=array(
						'zh'=>array('description'=>$content_zh),
						'en'=>array('description'=>$content_en)
					);
					//wiki描述内容
					foreach($language_type_array as $language_type=>$info){
						//wiki描述内容是否已经存在
						$wiki_description_rows=$mdb->table('ts_wiki_description')->where(array('language_type'=>$language_type,'wiki_id'=>$wiki_id))->find();
						
						$wiki_description_data=array();
						$wiki_description_data['language_type']=$language_type;
						$wiki_description_data['wiki_id']=$wiki_id;
						$wiki_description_data['description']=$info['description'];
						$wiki_description_data['update_time']=gmdate("Y-m-d H:i:s",time());
						if(empty($wiki_description_rows)){
							$wiki_description_data['add_time']=gmdate("Y-m-d H:i:s",time());
							$mdb->insert('ts_wiki_description',$wiki_description_data);//不需要获取 product_name_id
							
						}else{
							$wiki_description_id=$wiki_description_rows['id'];
							$mdb->update('ts_wiki_description',$wiki_description_data,$wiki_description_id);
						}
					}
				}//wiki描述内容
				
				//如果存在错误
				if(!empty($error_array)){
					$result=array('status'=>100,'msg'=>implode($error_array));
				}else{
					$result=array('status'=>200,'msg'=>'wiki添加成功','wiki_id'=>$wiki_id);
				}
				echo (json_encode($result));
				exit;
			}else{
				//调用其他控制器方法
				$catalog_array=$this->run_function('admin/wiki_catalog/get_wiki_catalog');
				$this->assign("catalog_json",json_encode($catalog_array,true));//设置语言参数
			}
		}
		
		//新增维基测试
		public function wiki_add_test(){
			$this->wiki_add();
		}
		
		//文件上传
		public function upload_file($input_name='upload_file'){
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
						$save_file_name_array[]=array('name'=>$file_name,'file'=>$save_file_name);
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
		
	}
?>