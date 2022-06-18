<?php
	namespace wiki\model;
	use index\model\language as base_language;
	//语言类
	class language extends base_language{
		public $language=array();
		
		public function __construct() {
			parent::__construct();
			//中文
			$this->language['zh']['current_menu']="wiki";//当前菜单名称
			$this->language['zh']['wiki_list']="维基列表";//维基百科列表
			$this->language['zh']['wiki_list_note']="维基列表";//维基百科备注
			$this->language['zh']['wiki_content']="维基内容";//维基百科列表
			$this->language['zh']['wiki_content_note']="维基内容";//维基百科备注
			$this->language['zh']['wiki_title']="标题";//标题
			$this->language['zh']['wiki_keywords']="关键字";//关键字
			$this->language['zh']['wiki_ddownload']="资料下载";//资料下载
			$this->language['zh']['wiki_description']="内容描述";//内容描述
			$this->language['zh']['wiki_id']="wiki_id";//wiki_id
			$this->language['zh']['wiki_name']="wiki名称";//wiki名称
			$this->language['zh']['query']="查询";//查询
			$this->language['zh']['serial_number']="序号";//序号
			//$this->language['zh']['wiki_title']="title";//标题
			$this->language['zh']['update_time']="更新时间";//更新时间
			
			//英语
			$this->language['en']['current_menu']="wiki";//当前菜单名称
			$this->language['en']['wiki_list']="Wiki list";//维基百科列表
			$this->language['en']['wiki_list_note']="Wiki list";//维基百科备注
			$this->language['en']['wiki_content']="Wiki content";//维基百科列表
			$this->language['en']['wiki_content_note']="Wiki content";//维基百科备注
			$this->language['en']['wiki_title']="Wiki title";//标题
			$this->language['en']['wiki_keywords']="Wiki Keywords";//关键字
			$this->language['en']['wiki_ddownload']="Wiki Download";//资料下载
			$this->language['en']['wiki_description']="Wiki Description";//内容描述
			$this->language['en']['wiki_id']="wiki_id";//wiki_id
			$this->language['en']['wiki_name']="wiki name";//wiki名称
			$this->language['en']['query']="query";//查询
			$this->language['en']['serial_number']="serial number";//序号
			//$this->language['en']['wiki_title']="title";//标题
			$this->language['en']['update_time']="UpdateTime";//更新时间
		}
		
		public function get($name){
			return $this->language[$name];
		}
	}
?>