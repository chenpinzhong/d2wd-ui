<?php
	namespace admin\model;
	//use run\controller\controller;//引入控制器类
	//语言类
	class language{
		public $language=array();
		
		public function __construct() {
			
			//中文
			$this->language['zh']=array();
			$this->language['zh']['welcome']="欢迎来到Floda在线商店";
			$this->language['zh']['home']="主页";
			$this->language['zh']['shop']="商店";
			$this->language['zh']['product']="产品细节";
			$this->language['zh']['login']="登录";
			$this->language['zh']['register']="注册";
			$this->language['zh']['my_account']="我的帐户";
			$this->language['zh']['shipping']="免运费";
			$this->language['zh']['shipping_all']="所有订单免运费";
			$this->language['zh']['support']="支持";
			$this->language['zh']['support24']="支持每天24小时";
			$this->language['zh']['money_return']="退货";
			$this->language['zh']['free_return']="30天内免费退货";
			$this->language['zh']['order_discount']="订单折扣";
			$this->language['zh']['on_every_order_over_15']="每个订单超过15美元";
			$this->language['zh']['wiki']="维基百科";
			$this->language['zh']['bbs']="论坛";
			$this->language['zh']['new_products']="新产品";
			$this->language['zh']['new_products_greetings']="只有经历人生的种种磨难，才能悟出人生的价值";//新产品的祝福语
			$this->language['zh']['view_more_products']="查看更多的产品";
			$this->language['zh']['top_seller']="最佳销售";
			$this->language['zh']['top_seller_greetings']="只有经历人生的种种磨难，才能悟出人生的价值";//最佳销售的祝福语
			
			//底部信息
			$this->language['zh']['my_account']="我的账户";//我的账户
			$this->language['zh']['my_account_address']="广东省, 深圳市, 福田区, 农轩路, 55号";//我的账户地址
			$this->language['zh']['my_account_mail_title']="邮箱";//邮箱
			$this->language['zh']['my_account_mail']="info@bigtree-tech.com";//邮箱
			$this->language['zh']['my_account_phones_title']="联系方式";
			$this->language['zh']['my_account_phones']="18855457441,18855457442";//联系方式
			$this->language['zh']['categories']="类别";//类别
			$this->language['zh']['information']="信息";//信息
			$this->language['zh']['home']="主页";//主页
			$this->language['zh']['about_us']="关于我们";//关于我们
			$this->language['zh']['contact_us']="联系我们";//联系我们
			$this->language['zh']['exchanges']="交流";//交流
			$this->language['zh']['shipping']="运输";//运输
			$this->language['zh']['quick_links']="快速链接";//快速链接
			$this->language['zh']['store_location']="商店地址";//商店地址
			#$this->language['zh']['my_account']="我的账户";
			$this->language['zh']['orders_tracking']="订单跟踪";//订单跟踪
			$this->language['zh']['size_guide']="尺码指南";//尺码指南
			$this->language['zh']['警告']="警告";//确定
			$this->language['zh']['信息填写错误']="信息填写错误";//填写错误
			$this->language['zh']['警告']="警告";//确定5ji k 
			$this->language['zh']['确定']="确定";//确定
			$this->language['zh']['取消']="取消";//确定
			#$this->language['zh']['contact_us']="联系我们";//联系我们
			

			
			//英语
			$this->language['en']=array();
			$this->language['en']['welcome']="Welcome to Floda online store";
			$this->language['en']['home']="HOME";
			$this->language['en']['shop']="SHOP";
			$this->language['en']['product']="PRODUCT DETAILS";
			$this->language['en']['login']="LOGIN";
			$this->language['en']['register']="register";
			$this->language['en']['my_account']="my account";
			$this->language['en']['shipping']="free shipping";
			$this->language['en']['shipping_all']="Free shipping all order";
			$this->language['en']['support']="SUPPORT";
			$this->language['en']['support24']="Support 24 hours a day";
			$this->language['en']['money_return']="Money Return";
			$this->language['en']['free_return']="Free Return";
			$this->language['en']['order_discount']="ORDER DISCOUNT";
			$this->language['en']['on_every_order_over_15']="On every order over $15";
			$this->language['en']['wiki']="Wiki";
			$this->language['en']['bbs']="BBS";
			$this->language['en']['new_products']="New Products";
			$this->language['en']['new_products_greetings']="Only through the hardships of life can we realize the value of life.";//新产品的祝福语
			$this->language['en']['view_more_products']="view more products";
			$this->language['en']['top_seller']="Top Seller";//最佳销售产品
			$this->language['en']['top_seller_greetings']="Only through the hardships of life can we realize the value of life.";//最佳销售的祝福语
			
			//底部信息
			$this->language['en']['my_account']="My Account";//最佳销售的祝福语
			$this->language['en']['my_account_address']="Guangdong Province, Shenzhen, Futian District, Nongxuan Road, No. 55";//我的账户地址
			$this->language['en']['my_account_mail_title']="Mail Us";//邮箱
			$this->language['en']['my_account_mail']="info@bigtree-tech.com";//邮箱
			$this->language['en']['my_account_phones_title']="Phones";
			$this->language['en']['my_account_phones']="18855457441,18855457442";//联系方式
			$this->language['en']['categories']="Categories";//类别
			$this->language['en']['information']="Information";//信息
			$this->language['en']['home']="Home";//主页
			$this->language['en']['about_us']="About Us";//关于我们
			$this->language['en']['contact_us']="Contact Us";//联系我们
			$this->language['en']['exchanges']="Exchanges";//交流
			$this->language['en']['shipping']="Shipping";//运输
			
			$this->language['en']['quick_links']="Quick Links";//快速链接
			$this->language['en']['store_location']="Store Location";//商店地址
			//$this->language['en']['my_account']='';
			$this->language['en']['orders_tracking']="Orders Tracking";//订单跟踪
			$this->language['en']['size_guide']="Size Guide";//尺码指南
			#$this->language['en']['contact_us']="联系我们";//联系我们
			$this->language['en']['警告']="warning";//警告
			$this->language['en']['确定']="confirm";//确定
			$this->language['en']['取消']="cancel";//取消
			
			
		}
		
		public function get($name){
			return $this->language[$name];
		}
	}
?>