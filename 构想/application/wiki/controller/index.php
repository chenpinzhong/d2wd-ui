<?php
	/**************************************************
	* 文件名:index.php
	* 版权:©2019 chenpinzhong，All rights reserved.
	* 描述:wiki列表
	*/
	namespace croe\controller;
	use wiki\model\language;
	use wiki\model\wiki_catalog;
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
			$wiki_sqlstr .=" and ts_wiki.wiki_status=".$mdb->qstr(1);
			
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