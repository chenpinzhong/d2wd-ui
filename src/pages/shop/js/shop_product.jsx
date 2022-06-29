import $ from "jquery" //引入 jq

//产品主图展示
class main_image_class {
    //构造器
    constructor(main_image) {
        this.main_image = main_image; //主图对象
        this.box_width = 420; //容器宽度
        this.box_height = 420; //同期高度
        this.zoom_modulus = 4; //缩放比例
        this.attribute_image_selector=".main_image #attribute_image";//当前主图
        this.hd_selector='.hd_display .overlay_content img';//高清图
        this.zoom_black_selector=".main_image .zoom_black";//拖动层
    }
    //初始化方法
    init = function (main_image) {
        //////////////////////////////////////////////////
        //主图放大模块
        //初始化时 加载一次属性图
        main_image.attribute_image_load(document.querySelector('#attribute_image'));
        //更新当前属性图
        $(".product_image_group .product_image").on('click', function(){
            $(".product_image_group .product_image").removeClass('selected');
            $(this).addClass('selected');
            let data_src = $(this).find("img").attr('data-src');//大图
            let src = $(this).find("img").attr('src');//小图
            let alt = $(this).find("img").attr('alt');//提示信息
            $(main_image.attribute_image_selector).attr({'src':src,'data-src':data_src,'alt':alt});
            $(main_image.hd_selector).attr({'src':data_src,'data-src':data_src,'alt':alt});
            //加载属性图
            main_image.attribute_image_load(document.querySelector('#attribute_image'))
        })
        //鼠标移入事件
        $(".main_image").on('mouseover', function (e) {
            $(".zoom_black,#hd_display").show();
        }).on('mousemove', function (e) {//鼠标移动事件
            main_image.zoom_mov(e);
        }).on('mouseout', function (e) {//鼠标移出事件
            $(".zoom_black,#hd_display").hide();
        });
        
        //容器宽度
        let box_width=$('.product_image_group .product_image_list_box').width();
        let image_box_width=0;//图片容器宽度
        let image_width=0;//单个图片宽度
        $('.product_image_group .product_image_list_box .product_image_list .product_image').each(function(){
            image_box_width+=$(this).outerWidth(true);
            image_width=$(this).outerWidth(true);
        });
        $('.product_image_group .product_image_list_box .product_image_list').css('width',image_box_width);

        //属性图滚动条控制
        $(".slider_control_prev").on('click',function(e){
            let dom=document.querySelector('.product_image_group .product_image_list_box .product_image_list');
            let margin_left=parseInt($(dom).css('margin-left'));
            $(dom).finish();
            margin_left=margin_left+image_width;
            //右边最大值
            if(margin_left>0)return false;
            $(dom).animate({'margin-left':margin_left+'px'},50);
        })
        
        $(".slider_control_next").on('click',function(e){
            let dom=document.querySelector('.product_image_group .product_image_list_box .product_image_list');
            let margin_left=parseInt($(dom).css('margin-left'));
            $(dom).finish();
            margin_left=margin_left-image_width;
            //左边最大值
            if(margin_left<=box_width-image_box_width)return false;
            $(dom).animate({'margin-left':margin_left+'px'},50);
        })
    };
    //移动事件处理
    zoom_mov = function (e) {
        //滑动区域大小
        let attribute_image = document.querySelector(this.attribute_image_selector);
        let box_left = $(this.attribute_image_selector).offset().left;
        let box_top = $(this.attribute_image_selector).offset().top;
        let box_width = attribute_image.width;
        let box_height = attribute_image.height;
        let box_right = box_left + box_width;
        let box_bottom = box_top + box_height;
        let zoom_width = $(this.zoom_black_selector).width();
        let zoom_height = $(this.zoom_black_selector).height();

        //计算x区间
        let c_left, c_top = 0;
        let is_move = true;
        if (box_left <= e.pageX && box_right >= e.pageX) {
            c_left = e.pageX - box_left - zoom_width / 2;
            if (c_left < 0)
                c_left = 0; //限制最左位置
            if (c_left > (box_width - zoom_width))
                c_left = box_width - zoom_width; //限制最右位置
        } else {
            is_move = false;
        }
        if (box_top <= e.pageY && box_bottom >= e.pageY) {
            c_top = e.pageY - box_top - zoom_height / 2;
            if (c_top < 0)
                c_top = 0; //限制最上位置
            if (c_top >= box_height - zoom_height)
                c_top = box_height - zoom_height; //限制最下位置
        } else {
            is_move = false;
        }
        //滑到模块位置显示
        if (is_move === true) {
            $(this.zoom_black_selector).css({ 'left': c_left, 'top': c_top });
            $(this.hd_selector).css({ 'left': -(c_left * this.zoom_modulus), 'top': -(c_top * this.zoom_modulus) });
        }
    };
    //图片加载方法
    attribute_image_load = function(img_this){
        var n_width, n_height;
        let img_src = img_this.src;
        //如果图片存在大图
        if (img_this.getAttribute('data-src') != null) {
            img_src = img_this.getAttribute('data-src');
            var new_img = new Image();
            new_img.src = img_src;
            new_img.onload = function(){};
        }
        // 现代浏览器
        if (img_this.naturalWidth) {
            n_width = img_this.naturalWidth;
            n_height = img_this.naturalHeight;
        }
        
        //小图显示位置调整
        let img_width = 0;
        let img_height = 0;
        //如果宽度大于高度
        if (n_width > n_height) {
            //计算宽度缩放比例
            let ratio = n_width / this.box_width; //缩放比例
            let new_height = n_height / ratio;
            let margin_top = (this.box_height - new_height) / 2; //顶部边距
            img_width = this.box_width;
            img_height = new_height;
            $(img_this).css({ "width": img_width, 'height': img_height, 'margin-top': margin_top, 'margin-left': 0 });
        } else { //如果高度大于宽度
            //计算宽度缩放比例
            let ratio = n_height / this.box_height; //缩放比例
            let new_width = n_width / ratio;
            let margin_left = (this.box_width - new_width) / 2; //左边边距
            img_width = new_width;
            img_height = this.box_height;
            $(img_this).css({ "width": img_width, 'height': img_height, 'margin-top': 0, 'margin-left': margin_left });
        }
        //大图
        $(this.hd_selector).attr('src', img_src).css({ 'width': img_width * this.zoom_modulus, 'height': img_height * this.zoom_modulus });
    };
}

//主图展示
/*
<div class="product_showcase">
    <div class="main_image">
        <img alt="法式波点半身裙女2019新款夏气质中长款高腰显瘦优雅大摆a字裙子" src="http://127.0.0.1/upload/edit/20190816/a4ff1d618579db577eed38feba6330ce.jpg"/>
    </div>
*/
//图片显示初始化
//属性数据

let $product_data = {
    default_attributes: { "套装": "上衣", "尺码": "L", "颜色": "" },
    sku_array: [
        {
            "套装": "上衣",
            "尺码": "L",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 100.70,
            "qty": 0,
            "sku": 1011,
        },
        {
            "套装": "上衣",
            "尺码": "M",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 102.70,
            "qty": 101,
            "sku": 1012,
        },
        {
            "套装": "裙子",
            "尺码": "L",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 120.70,
            "qty": 103,
            "sku": 1013,
        },
        {
            "套装": "裙子",
            "尺码": "S",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 121.70,
            "qty": 1011,
            "sku": 1014,
        },
        {
            "套装": "裙子",
            "尺码": "M",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 122.70,
            "qty": 300,
            "sku": 1015,
        },
        {
            "套装": "套装",
            "尺码": "L",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 192.70,
            "qty": 150,
            "sku": 1016,
        },
        {
            "套装": "套装",
            "尺码": "S",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 193.70,
            "qty": 170,
            "sku": 1017,
        },
        {
            "套装": "套装",
            "尺码": "M",
            "颜色": "黑色",
            "原价": 200.70,
            "售价": 198.70,
            "qty": 400,
            "sku": 1018,
        }
    ]
}

//属性选择
class attributes_class {
    constructor($product_data) {
        this.product_data = $product_data;
        this.attributes_info = {};
        this.attributes_info = $product_data.default_attributes;

        //初始化
        this.init = function ($attributes) {
            //注册事件  用户操作购买数量
            $(".promo_row .qty_action").on('click', function () {
                var $class_name = $(this).attr('class');
                var $sku_qty = parseInt($("#sku_qty").val(), 10);
                var $inventory = parseInt($("#stock .inventory").text(), 10); //sku总库存
                if ($sku_qty <= 0)
                    $sku_qty = 1;
                //数量操作
                if ($class_name.indexOf("reduce") >= 0) { //减少
                    if ($sku_qty - 1 >= 1)
                        $("#sku_qty").val($sku_qty - 1);
                } else if ($class_name.indexOf("increase") >= 0) { //增加
                    if ($inventory < $sku_qty + 1)
                        alert('数量大于库存数量!');
                    if ($sku_qty + 1 <= $inventory)
                        $("#sku_qty").val($sku_qty + 1);
                }
            });
            //属性选择,属性图选择
            $(".sales_info .promo_row .attributes_value,.sales_info .promo_row .attributes_image").on('click', function () {
                //if($(this).is('.of_stock'))return false;
                var $promo_row = $(this).parents('.promo_row');
                var $attributes_name = $promo_row.find('>.name').data('name'); //属性名称
                var $attributes_value = $(this).data('value');

                //如果用户已经选择
                if ($(this).is('.selected')) {
                    //取消选择
                    $promo_row.find('.attributes_value,.attributes_image').removeClass('selected');
                    $attributes.attributes_info[$attributes_name] = ""; //清空属性选择
                } else {
                    $promo_row.find('.attributes_value,.attributes_image').removeClass('selected');
                    //移除样式
                    $attributes.attributes_info[$attributes_name] = $attributes_value;
                    $(this).addClass('selected');
                }
                $attributes.selected(); //刷新其他信息
            });

            //属性行自动选择
            $(".sales_info .promo_row").each(function () {
                var $attr_name = $(this).find('.name').data('name'); //属性名称
                if (typeof ($attr_name) != "undefined") {
                    var $attr_arr = $(this).find('.attributes_value,.attributes_image');
                    var $attr_len = $attr_arr.length;
                    //其他属性值自动选择
                    var $attributes_info = $attributes.attributes_info;
                    var $temp_val = $attributes_info[$attr_name];
                    var $item_click = false;
                    if ($temp_val !== "") {
                        $attr_arr.each(function () {
                            if ($(this).data('value') === $temp_val) {
                                $(this).trigger('click'); //单属性值自动选择
                                $item_click = true;
                            }
                        });
                    }
                    if ($attr_len === 1 && $item_click === false)
                        $attr_arr.eq(0).trigger('click'); //单属性值自动选择
                }
            });
        };
        //用户选择后计算
        /*
        this.selected=function(){
            //用户选择的值
            var $attributes_sum=0;
            var $temp_sum=0;//相同属性数量
            var $attributes_info=this.attributes_info;
            var $allow_select=$sku_array=this.product_data.sku_array
            for($key in $attributes_info){
                $attributes_sum+=1;//得到有效属性数量
            }
            
            //根据目前选择的属性 计算其他属性是否显示
            for($key in $attributes_info){
                var $temp_val=$attributes_info[$key];
                if($temp_val=="")break;
                $temp_array=new Array();
                //计算
                for($i=0;$i<$allow_select.length;$i++){
                    var $temp_sku_info=$allow_select[$i];
                    if($temp_sku_info[$key]==$temp_val){
                        $temp_array[$temp_array.length]=$temp_sku_info;
                    }
                }
                $allow_select=$temp_array;//刷新允许选择
            }
            //根据允许选择列表 来展示
            
            for($key in $attributes_info){
                var $temp_val=$attributes_info[$key];
                var $allow_select_array=new Array();//允许选择的数组
                for($i=0;$i<$allow_select.length;$i++){
                    var $temp_sku_info=$allow_select[$i];
                    $allow_select_array[$allow_select_array.length]=$temp_sku_info[$key];
                }
                
                //处理那些无 库存的信息
                $(".sales_info .promo .promo_row").each(function(){
                    var $name=$(this).find('.name').data('name');
                    if($name==$key){
                        $(this).find('.attributes_value,attributes_image').each(function(){
                            var $temp_val=$(this).data('value');
                            if($allow_select_array.indexOf($temp_val)>=0){
                                $(this).removeClass("of_stock");
                            }else {
                                $(this).addClass("of_stock");
                            }
                        })
                    }
                })
            }
            
            //获取sku库存等信息
            $sku_info={};
            $temp_sku_info={};//循环临时数据
            //判断用户选择的属性 符合的规则是那个sku
            for($i=0;$i<$sku_array.length;$i++){
                $temp_sku_info=$sku_array[$i];
                //对比当前选择的情况
                $temp_sum=0;
                for($key in $attributes_info){
                    if($temp_sku_info[$key]!=$attributes_info[$key])break;
                    $temp_sum+=1;
                }
                //如果相同属性数量=总属性数量 则当前的sku 是用户选择的sku
                if($temp_sum==$attributes_sum){
                    $sku_info=$temp_sku_info;
                    break;
                }
            }
            //如果不是空对象则设置信息
            if(JSON.stringify($sku_info)!='{}'){
                $("#stock .inventory").text($sku_info['qty']);//设置库存信息
                $(".promo_row .new_price .price").text($sku_info['售价']);//设置售价
                $(".promo_row .old_price .price").text($sku_info['原价']);//设置原价
            }
        }
        */
    }
}
//dom加载完成
$(function () {
    //产品详情 产品评论切换
    $("#detail .tab_bar_box .tab").on('click', function () {
        var $temp_name = $(this).data('name');
        //产品描述 评论信息切换
        if ($temp_name === "product_details") {
            $("#desc_content,#attributes").show();
            $("#review").hide();
        } else if ($temp_name === "product_review") {
            $("#desc_content,#attributes").hide();
            $("#review").show();
        }
        //css样式处理
        $("#detail .tab_bar_box .tab").each(function () {
            $(this).removeClass('selected');
        })
        $(this).addClass('selected');
    })

    //属性事件
    let $attributes = new attributes_class($product_data);
    $attributes.init($attributes);//初始化事件注册

    //产品图 放大展示模块
    let main_image = new main_image_class($("#detail"));
    main_image.init(main_image);//初始化
})
