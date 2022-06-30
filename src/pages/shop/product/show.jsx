/*
    用户首页
    作者:chenpinzhong
    开发备注:主要实现网站首页
*/
//商店首页
import '../css/index.css'
import React, { useEffect } from "react"
import cookie from 'react-cookies' //读取cookie
import language from '../language' //多语言方案
import '../js/shop_product' //展示产品

function Index() {
    const [qty_val, set] = React.useState(0);
    const handle_qty=(e)=>{
        let value = e.target.value.replace(/[^\d]/, '')
        set(value)
    }
    

    let $language_label = language(cookie.load('language_type'));//语言标签
    
    let $product_info = {}
    $product_info.product_name = 'iphone 13';//产品名称
    $product_info.min_old_price = '6999.99';//原价
    $product_info.min_price = '5999.99';//促销价格
    
    $product_info.monthly_sales = 200;//月销量
    $product_info.total_sales = 400;//总销量
    $product_info.total_evaluate = 100;//累计评价
    $product_info.payment_address = '';//购买地址
    
    //默认数量
    return (
        <>
            {/*<!-- breadcrumb 区域开始 -->*/}
            <div className="breadcrumb_area common_bg">
                <div className="container">
                    <div className="row">
                        <div className="col_12">
                            <div className="breadcrumb_wrap">
                                <nav aria-label="breadcrumb">
                                    <h1>产品详情</h1>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb_item"><a href="index.html"><i className="fa fa_home"></i></a></li>
                                        <li className="breadcrumb_item active" aria-current="page">产品详情</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*<!--产品头部信息 -->*/}
            <div id="detail">
                <div className="detail_meta">
                    <div className="detail_content">
                        {/*<!--产品展示-->*/}
                        <div className="product_showcase">
                            <div className="main_image">
                                {/*产品主图*/}
                                <img id="attribute_image" alt="产品名称" src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                {/*<!--缩放区域 控制-->*/}
                                <div className="zoom_black"></div>
                            </div>
                            <div className="product_image_group">
                                {/*<!--用户缩放层-->*/}
                                <div className="product_image_list_box">
                                    <div className="product_image_list">
                                        <div className="product_image selected">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                        <div className="product_image ">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                        <div className="product_image ">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                        <div className="product_image ">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                        <div className="product_image ">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                        <div className="product_image ">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                        <div className="product_image ">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                        <div className="product_image ">
                                            <img alt="产品名称"  src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} data-src={process.env.PUBLIC_URL + '/images/product/iphone13 purple.jpg'} />
                                        </div>
                                    </div>
                                </div>
                                {/*<!--操作层-->*/}
                                <div className="slider_banner">
                                    <button className="slider_control slider_control_prev" aria-hidden="true" tabIndex="-1"><i className="lnr lnr_chevron_left"></i></button>
                                    <button className="slider_control slider_control_next" aria-hidden="true" tabIndex="-1"><i className="lnr lnr_chevron_right"></i></button>
                                </div>
                            </div>
                        </div>
                        {/*<!--主图放大信息-->*/}
                        <div id="hd_display" className="hd_display">
                            <div className="overlay_content">
                                <img alt="产品名称" src={process.env.PUBLIC_URL + '/images/product/bpic23597_web.jpg'} style={{ "position": "absolute", "top": "0px", "left": "0px" }} />
                            </div>
                        </div>
                        {/*<!--购买信息-->*/}
                        <div className="sales_info">
                            {/*<!--产品标题-->*/}
                            <div className="product_name">{$product_info.product_name}</div>
                            {/*<!--促销信息-->*/}
                            <div className="promo">
                                {/*<!--原价-->*/}
                                <div className="promo_row">
                                    <div className="name">{$language_label.original_price}</div>
                                    <div className="old_price">
                                        <em className="{$language_label.currency_name}">{$language_label.symbol}</em><span className="price">{$product_info.min_old_price}</span>
                                    </div>
                                </div>
                                {/*<!--促销价-->*/}
                                <div className="promo_row">
                                    <div className="name">{$language_label.promotion_price}</div>
                                    <div className="new_price">
                                        <em className="{$language_label.currency_name}">{$language_label.symbol}</em><span className="price">{$product_info.min_price}</span>
                                    </div>
                                </div>
                                {/*<!--销量信息-->*/}
                                <ul className="sales">
                                    {/*<!--月销量-->*/}
                                    <div className="sell_count">
                                        <span className="label">{$language_label.monthly_sales}</span>
                                        <span className="count">{$product_info.monthly_sales}</span>
                                    </div>
                                    {/*<!--总销量-->*/}
                                    <div className="sell_count">
                                        <span className="label">{$language_label.total_sales_volume}</span>
                                        <span className="count">{$product_info.total_sales}</span>
                                    </div>
                                    {/*<!--累计评价-->*/}
                                    <div className="sell_count">
                                        <span className="label">{$language_label.evaluate_sum}</span>
                                        <span className="count">{$product_info.total_evaluate}</span>
                                    </div>
                                </ul>

                                {/*<!--属性信息区域 开始-->*/}
                                {/*{foreach $product_info.product_attribute_array as $attribute}*/}
                                <div className="promo_row">
                                    {/*<div className="name" data-id="{$attribute.attribute_id}" data-name="{$attribute.attribute_name}">{$attribute.attribute_name}</div>*/}
                                    {/*{foreach $attribute.attribute_value_list as $attribute_info}*/}
                                    {/*    {if $attribute_info.attribute_image==""}*/}
                                    {/*        <div className="attributes_value" data-id="{$attribute_info.id}" data-value="{$attribute_info.attribute_value}">{$attribute_info.attribute_value}</div>*/}
                                    {/*    {else}*/}
                                    {/*        <div style="color:#F00;" className="attributes_value attribute_img" data-id="{$attribute_info.id}" data-value="{$attribute_info.attribute_value}">*/}
                                    {/*            <a title="{$attribute_info.attribute_value}" src="{$attribute_info.attribute_image}"><img src="{$attribute_info.attribute_image}" onload="img_onload(this,40);" style="width:40px;"></a>*/}
                                    {/*        </div>*/}
                                    {/*    {/if}*/}
                                    {/*{/foreach}*/}
                                </div>
                                {/*{/foreach}*/}

                                {/*<!--属性信息区域 结束-->*/}
                                {/*<!--数量-->*/}
                                <div className="promo_row">
                                    <div className="name">{$language_label.quantity}</div>
                                    <div className="tock" id="stock">
                                        <a href="#!" title="减1" className="qty_action reduce">-</a>
                                        <input id="sku_qty" type="text" className="qty_val" value={qty_val} onChange={handle_qty}  title="请输入购买量" />
                                        <a href="#!" className="qty_action increase" title="加1">+</a>
                                        &nbsp;
                                        {$language_label.quantity}({$language_label.inventory} <span className="inventory">11</span>{$language_label.unit})
                                    </div>
                                </div>
                                {/*<!--购买产品-->*/}
                                <div id="shopping_cart" className="action">
                                    {/*<!--立即购买-->*/}
                                    <div className="btn_buy">
                                        <a href={$product_info.payment_address} title="点击此按钮，到下一步确认购买信息" className="J_LinkBuy" >立即购买</a>
                                    </div>
                                    {/*<!--添加购物车-->*/}
                                    <div className="btn_add">
                                        <a href="#!" title="{$language_label.add_to_cart}" className="J_LinkAdd" >
                                            <i className="lnr lnr-cart"></i>{$language_label.add_to_cart}
                                        </a>
                                    </div>
                                </div>
                                {/*<!--服务承诺-->*/}
                                <div className="promo_row bottom_row">
                                    <div className="name">{$language_label.service_promise}</div>
                                    {/*{foreach $product_info.product_pledge_array as $product_pledge}*/}
                                    {/*<div className="promise">{$product_pledge}</div>*/}
                                    {/*{/foreach}*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<!--评论信息导航栏-->*/}
                <div className="tab_bar_box">
                    <div className="tab selected" data-name="product_details" data-name_zh="商品详情">{$language_label.product_details}</div>
                    <div className="tab" data-name="product_review" data-name_zh="评论信息" >{$language_label.review_information}</div>
                </div>
                <div className="tab_bar_box" style={{"height":"500px"}}></div>
            </div>
        </>
    )
}
export default Index