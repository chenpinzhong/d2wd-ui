<?php
	namespace index\model;
	//语言类
	class language{
		public $language=array();
		
		public function __construct() {
			
			
			//中文
			$this->language['zh']=array();
			$this->language['zh']['current_menu']="index";//当前菜单名称
			$this->language['zh']['current_language']="zh";//当前语言
			
			$this->language['zh']['symbol']="¥";//货币符号
			$this->language['zh']['currency_name']="RMB";//货币名称
			$this->language['zh']['exchange_rate']="1";//货币汇率\
			
			
			
			$this->language['zh']['country_name']="中国";
			$this->language['zh']['flag']="zh.png";
			$this->language['zh']['welcome']="Welcome to BIGTREETECH online store";
			$this->language['zh']['home']="主页";
			$this->language['zh']['shop']="商店";
			$this->language['zh']['product']="产品细节";
			$this->language['zh']['login']="登录";
			$this->language['zh']['register']="注册";
			$this->language['zh']['my_account']="我的帐户";
			$this->language['zh']['change_password']="修改密码";
			
			$this->language['zh']['logout']="退出登录";
			
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
			$this->language['zh']['add_to_wishlist']="加入商品收藏夹";//加入商品收藏夹
			$this->language['zh']['quick_view']="快速查看";//快速查看
			$this->language['zh']['add_to_cart']="加入购物车";//加入购物车
			$this->language['zh']['new']="新品";//新品
			
			//底部信息
			$this->language['zh']['my_account']="我的账户";//我的账户
			$this->language['zh']['my_account_address']="广东省, 深圳市, 龙岗区, 上雪科技园东区9号B栋2楼";//我的账户地址
			$this->language['zh']['my_account_mail_title']="邮箱";//邮箱
			$this->language['zh']['my_account_mail']="info@bigtree-tech.com";//邮箱
			$this->language['zh']['my_account_phones_title']="联系方式";
			$this->language['zh']['my_account_phones']="18319347649,13798980050";//联系方式
			
			
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
			#$this->language['zh']['contact_us']="联系我们";//联系我们
			$this->language['zh']['copyright_information']='Copyright © 2020. Shenzhen Bigtree Technology Co., Ltd. All rights reserved. <a href="http://www.beian.miit.gov.cn">粤ICP备19032208号</a>';//版权信息
			
			//英语
			$this->language['en']=array();
			$this->language['en']['current_menu']="index";//当前菜单名称
			$this->language['en']['current_language']="en";//当前语言
			
			$this->language['en']['symbol']="$";//货币符号
			$this->language['en']['currency_name']="USD";//货币名称
			$this->language['en']['exchange_rate']="7.0";//货币汇率
			
			
			$this->language['en']['country_name']="USA";
			$this->language['en']['flag']="en.png";
			$this->language['en']['welcome']="Welcome to BIGTREETECH online store";
			$this->language['en']['home']="HOME";
			$this->language['en']['shop']="SHOP";
			$this->language['en']['product']="PRODUCT DETAILS";
			$this->language['en']['login']="login";
			$this->language['en']['register']="register";
			$this->language['en']['my_account']="my account";
			$this->language['en']['logout']="logout";
			$this->language['en']['change_password']="change password";
			
			
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
			$this->language['en']['add_to_wishlist']="Add To Wishlist";//加入商品收藏夹
			$this->language['en']['quick_view']="Quick View";//快速查看
			$this->language['en']['add_to_cart']="Add to Cart";//加入购物车
			$this->language['en']['new']="NEW";//新品
			
			
			//底部信息
			$this->language['en']['my_account']="My Account";//最佳销售的祝福语
			$this->language['en']['my_account_address']="Floor 2, Building B, No.9, East Area, Shangxue Technology Park, Bantian St., Longgang Dist. Shenzhen City, Guangdong Province, China";//我的账户地址
			$this->language['en']['my_account_mail_title']="Mail Us";//邮箱
			$this->language['en']['my_account_mail']="info@bigtree-tech.com";//邮箱
			$this->language['en']['my_account_phones_title']="Phones";
			$this->language['en']['my_account_phones']="18319347649,13798980050";//联系方式
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
			#$this->language['zh']['contact_us']="联系我们";//联系我们
			
			$this->language['en']['size_guide']="Size Guide";//尺码指南
			
			//版权信息
			$this->language['en']['copyright_information']='Copyright © 2020. Shenzhen Bigtree Technology Co., Ltd. All rights reserved. <a href="http://www.beian.miit.gov.cn">粤ICP备19032208号</a>';//版权信息
			
			
		}
		
		public function get($name){
			return $this->language[$name];
		}
	}
?>
