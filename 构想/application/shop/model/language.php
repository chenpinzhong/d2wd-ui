<?php
	namespace shop\model;
	use index\model\language as base_language;
	//语言类
	class language extends base_language{
		public $language=array();
		
		public function __construct() {
			parent::__construct();
			
			//中文
			$this->language['zh']['current_menu']="shop";//当前菜单名称
			$this->language['zh']['product_details']="产品详情";//产品详情
			$this->language['zh']['product_list']="产品列表";//产品列表
			$this->language['zh']['product_list_note']="店铺的所有产品";//产品列表备注
			$this->language['zh']['product_category']="产品类目";//产品类目
			
			$this->language['zh']['new_products']="新产品";
			$this->language['zh']['new_products_greetings']="只有经历人生的种种磨难，才能悟出人生的价值";//新产品的祝福语
			$this->language['zh']['view_more_products']="查看更多的产品";
			$this->language['zh']['top_seller']="最佳销售";
			$this->language['zh']['top_seller_greetings']="只有经历人生的种种磨难，才能悟出人生的价值";//最佳销售的祝福语
			$this->language['zh']['add_to_wishlist']="加入商品收藏夹";//加入商品收藏夹
			$this->language['zh']['quick_view']="快速查看";//快速查看
			$this->language['zh']['add_to_cart']="加入购物车";//加入购物车
			$this->language['zh']['new']="新品";//新品
			$this->language['zh']['original_price']="原价";//原价
			$this->language['zh']['promotion_price']="促销价";//促销价
			$this->language['zh']['monthly_sales']="月销量";//月销量
			$this->language['zh']['total_sales_volume']="总销量";//总销量
			$this->language['zh']['evaluate_sum']="累计评价";//累计评价
			$this->language['zh']['quantity']="数量";//数量
			$this->language['zh']['unit']="件";//件
			$this->language['zh']['inventory']="库存";//库存
			$this->language['zh']['buy_now']="立即购买";//立即购买
			$this->language['zh']['add_to_cart']="加入购物车";//加入购物车
			$this->language['zh']['service_promise']="服务承诺";//服务承诺
			$this->language['zh']['product_details']="商品详情";//商品详情
			$this->language['zh']['review_information']="评论信息";//评论信息
			$this->language['zh']['brand_name']="品牌名称";//评论信息
			$this->language['zh']['product_parameters']="产品参数";//产品参数
			$this->language['zh']['product_name']="产品名称";//产品名称
			$this->language['zh']['price_range']="价格区间";//价格区间
			$this->language['zh']['query']="查询";//查询
			
			//英语
			$this->language['en']['current_menu']="shop";//当前菜单名称
			$this->language['en']['product_details']="product details";//产品详情
			$this->language['en']['product_list']="product list";//产品列表
			$this->language['en']['product_list_note']="product list";//产品列表备注
			$this->language['en']['product_category']="product category";//产品类目
			
			$this->language['en']['new_products']="New Products";
			$this->language['en']['new_products_greetings']="Only through the hardships of life can we realize the value of life.";//新产品的祝福语
			$this->language['en']['view_more_products']="view more products";
			$this->language['en']['top_seller']="Top Seller";//最佳销售产品
			$this->language['en']['top_seller_greetings']="Only through the hardships of life can we realize the value of life.";//最佳销售的祝福语
			$this->language['en']['add_to_wishlist']="Add To Wishlist";//加入商品收藏夹
			$this->language['en']['quick_view']="Quick View";//快速查看
			$this->language['en']['add_to_cart']="Add to Cart";//加入购物车
			$this->language['en']['new']="NEW";//新品
			$this->language['en']['original_price']="original price";//原价
			$this->language['en']['promotion_price']="promotion price";//促销价
			$this->language['en']['monthly_sales']="monthly sales";//月销量
			$this->language['en']['total_sales_volume']="total sales volume";//总销量
			$this->language['en']['evaluate_sum']="evaluate sum";//累计评价
			$this->language['en']['quantity']="quantity";//数量
			$this->language['en']['unit']="unit";//件
			$this->language['en']['inventory']="inventory";//库存
			$this->language['en']['buy_now']="buy_now";//立即购买
			$this->language['en']['add_to_cart']="Add to Cart";//加入购物车
			$this->language['en']['service_promise']="service promise";//服务承诺
			$this->language['en']['product_details']="product details";//商品详情
			$this->language['en']['review_information']="Review information";//评论信息
			$this->language['en']['brand_name']="Brand Name";//评论信息
			$this->language['en']['product_parameters']="Product parameters";//产品参数
			$this->language['en']['product_name']="product name";//产品名称
			$this->language['en']['price_range']="The price range";//价格区间
			$this->language['en']['query']="query";//查询
			
		}
		
		public function get($name){
			return $this->language[$name];
		}
	}
?>