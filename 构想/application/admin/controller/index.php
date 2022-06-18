<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:后台主页
	*/
	namespace croe\controller;
	class index extends controller{
		public function __construct(){
			parent::__construct();

			//登录检查 权限检查
			admin_check($this);
			//获取主库配置信息
			$master=$this->config->get_db_master();
			//连接主库
			$this->mdb=$this->db->link($master);
			
		}
		public function index(){
			
		}
		public function show(){
			
		}
		
		/*海报*/
		public function poster(){
			$mdb=$this->mdb;
			$post_data=$this->request->param('_POST');
			//如果是更新海报
			if(isset($post_data['image_src_array'])){
				$mdb->query('TRUNCATE `sales_manage`.`ts_home_poster`');//清空海报表
				$mdb->query('TRUNCATE `sales_manage`.`ts_home_poster_name`');//清空海报表
				$image_url_array=$post_data['image_url_array'];//图片对应跳转的地址
				$image_src_array=$post_data['image_src_array'];
				$poster_name_zh_array=$post_data['poster_name_zh_array'];//
				$poster_name_en_array=$post_data['poster_name_en_array'];
				
				//配置信息
				$language_type_array=array(
					'zh'=>$poster_name_zh_array,
					'en'=>$poster_name_en_array
				);
				
				foreach($image_src_array as $key=>$image_src){
					//海报数据
					$poster_data=array();
					$poster_data['poster_name']=$poster_name_zh_array[$key];
					$poster_data['poster_img']=$image_src;
					$poster_data['poster_url']=$image_url_array[$key];
					$poster_data['add_time']=gmdate('Y-m-d H:i:s',time());
					$poster_data['update_time']=gmdate('Y-m-d H:i:s',time());
					$poster_id=$mdb->insert('ts_home_poster',$poster_data);
					
					//插入海报语言
					foreach($language_type_array as $language_type=>$poster_name_array){
						$poster_data=array();
						$poster_data['poster_id']=$poster_id;//海报id
						$poster_data['language_type']=$language_type;//语言类型 
						$poster_data['poster_name']=$poster_name_array[$key];//得到 海报名称 语言+顺序
						$poster_data['add_time']=gmdate('Y-m-d H:i:s',time());
						$poster_data['update_time']=gmdate('Y-m-d H:i:s',time());
						$mdb->insert('ts_home_poster_name',$poster_data);
					}
				}
				echo json_encode(array('status'=>200,'msg'=>'上传成功!'));
				exit;
			}//更新 海报处理结束
			else{
				$home_poster_array=$mdb->table('ts_home_poster')->where()->select();
				foreach($home_poster_array as $key=>$home_poster_rows){
					$poster_id=$home_poster_rows['id'];//海报的id
					
					//初始化 语言配置
					$home_poster_array[$key]['poster_name_zh']='';//海报中文名称
					$home_poster_array[$key]['poster_name_en']='';//海报英文名称
					
					//查询海报的名称
					$home_poster_name_array=$mdb->table('ts_home_poster_name')->where(array('poster_id'=>$poster_id))->select();
					
					foreach($home_poster_name_array as $k=>$home_poster_name_rows){
						$language_type=$home_poster_name_rows['language_type'];//语言名称
						$language_name='poster_name_'.$language_type;
						$home_poster_array[$key][$language_name]=$home_poster_name_rows['poster_name'];
					}//海报名称循环结束
					
				}//海报循环结束
				$this->assign("home_poster_array",$home_poster_array);//海报信息
			}
		}
		//文件上传
		public function upload_file($input_name='upload_images'){
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
						$save_file_name_array[]=array('name'=>$file_name,'images'=>$save_file_name);
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