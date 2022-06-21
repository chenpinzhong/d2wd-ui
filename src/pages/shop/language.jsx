if(typeof($language)=="undefined"){
    var $language={'zh':[],'en':[]};
}

//中文
$language['zh']['current_menu']="shop";//当前菜单名称
$language['zh']['product_details']="产品详情";//产品详情
$language['zh']['product_list']="产品列表";//产品列表
$language['zh']['product_list_note']="店铺的所有产品";//产品列表备注
$language['zh']['product_category']="产品类目";//产品类目
$language['zh']['new_products']="新产品";//新产品
$language['zh']['new_products_greetings']="只有经历人生的种种磨难，才能悟出人生的价值";//新产品的祝福语
$language['zh']['view_more_products']="查看更多的产品";
$language['zh']['top_seller']="最佳销售";
$language['zh']['top_seller_greetings']="只有经历人生的种种磨难，才能悟出人生的价值";//最佳销售的祝福语
$language['zh']['add_to_wishlist']="加入商品收藏夹";//加入商品收藏夹
$language['zh']['quick_view']="快速查看";//快速查看
$language['zh']['add_to_cart']="加入购物车";//加入购物车
$language['zh']['new']="新品";//新品
$language['zh']['original_price']="原价";//原价
$language['zh']['promotion_price']="促销价";//促销价
$language['zh']['monthly_sales']="月销量";//月销量
$language['zh']['total_sales_volume']="总销量";//总销量
$language['zh']['evaluate_sum']="累计评价";//累计评价
$language['zh']['quantity']="数量";//数量
$language['zh']['unit']="件";//件
$language['zh']['inventory']="库存";//库存
$language['zh']['buy_now']="立即购买";//立即购买
$language['zh']['add_to_cart']="加入购物车";//加入购物车
$language['zh']['service_promise']="服务承诺";//服务承诺
$language['zh']['product_details']="商品详情";//商品详情
$language['zh']['review_information']="评论信息";//评论信息
$language['zh']['brand_name']="品牌名称";//评论信息
$language['zh']['product_parameters']="产品参数";//产品参数
$language['zh']['product_name']="产品名称";//产品名称
$language['zh']['price_range']="价格区间";//价格区间
$language['zh']['query']="查询";//查询

//英语
$language['en']['current_menu']="shop";//当前菜单名称
$language['en']['product_details']="product details";//产品详情
$language['en']['product_list']="product list";//产品列表
$language['en']['product_list_note']="product list";//产品列表备注
$language['en']['product_category']="product category";//产品类目
$language['en']['new_products']="New Products";//新产品
$language['en']['new_products_greetings']="Only through the hardships of life can we realize the value of life.";//新产品的祝福语
$language['en']['view_more_products']="view more products";
$language['en']['top_seller']="Top Seller";//最佳销售产品
$language['en']['top_seller_greetings']="Only through the hardships of life can we realize the value of life.";//最佳销售的祝福语
$language['en']['add_to_wishlist']="Add To Wishlist";//加入商品收藏夹
$language['en']['quick_view']="Quick View";//快速查看
$language['en']['add_to_cart']="Add to Cart";//加入购物车
$language['en']['new']="NEW";//新品
$language['en']['original_price']="original price";//原价
$language['en']['promotion_price']="promotion price";//促销价
$language['en']['monthly_sales']="monthly sales";//月销量
$language['en']['total_sales_volume']="total sales volume";//总销量
$language['en']['evaluate_sum']="evaluate sum";//累计评价
$language['en']['quantity']="quantity";//数量
$language['en']['unit']="unit";//件
$language['en']['inventory']="inventory";//库存
$language['en']['buy_now']="buy_now";//立即购买
$language['en']['add_to_cart']="Add to Cart";//加入购物车
$language['en']['service_promise']="service promise";//服务承诺
$language['en']['product_details']="product details";//商品详情
$language['en']['review_information']="Review information";//评论信息
$language['en']['brand_name']="Brand Name";//评论信息
$language['en']['product_parameters']="Product parameters";//产品参数
$language['en']['product_name']="product name";//产品名称
$language['en']['price_range']="The price range";//价格区间
$language['en']['query']="query";//查询

//获取语言 默认为中文
function language(type='zh'){
    if(typeof(type)=="undefined")type='zh'
    return $language[type];
}

export default language