import $ from "jquery" //引入 jq
//属性图展示实现
main_image_class=function($main_image){
	this.main_image=$main_image;//主图对象
	this.box_width=420;
	this.box_height=420;
	this.zoom_modulus=4;
	//移动事件处理
	this.zoom_mov=function(e){
		var box_width=$(".main_image #attribute_image").width();
		var box_height=$(".main_image #attribute_image").height();
		var zoom_left=$(".main_image .zoom_black").offset().left;
		var zoom_top=$(".main_image .zoom_black").offset().top;
		var zoom_width=$(".main_image .zoom_black").width();
		var zoom_height=$(".main_image .zoom_black").height();
		mov_x = e.pageX - $(".main_image #attribute_image").offset().left;
		mov_y = e.pageY - $(".main_image #attribute_image").offset().top;
		//计算放大块存在的位置
		var zoom_w=zoom_width/2;
		var zoom_h=zoom_height/2;
		if(mov_x<=zoom_w)mov_x=0;
		if(mov_y<=zoom_h)mov_y=0;
		
		//居中计算
		var c_left=0;
		var c_top=mov_y-zoom_h
		
		if(mov_x-zoom_w<=0){
			c_left=0;
		}else if(mov_x+zoom_w>=box_width){
			c_left=box_width-zoom_width;
		}else {
			c_left=mov_x-zoom_w;
		}
		
		if(mov_y-zoom_h<=0){
			c_top=0;
		}else if(mov_y+zoom_h>=box_height){
			c_top=box_height-zoom_height;
		}else{
			c_top=mov_y-zoom_h;
		}
		
		
		//放大层 超出修正
		$(".zoom_black").css({'left':c_left,'top':c_top})
		$("#hd_display .overlay_content img").css({'left':-(c_left*this.zoom_modulus),'top':-(c_top*this.zoom_modulus)})
		
		
	}
	this.init=function(box_width,box_height,attribute_image_onload){
		//注册主图加载完毕事件
		this.box_width=box_width;
		this.box_height=box_height;
		
		$("#attribute_image").attr("onload",attribute_image_onload)
		
		//产品属性图
		$(".product_image_group .product_image").click(function(){
			$(".product_image_group .product_image").removeClass('selected');
			$(this).addClass('selected');
			var $new_src=$(this).find("img").data('src');
			$(".main_image img").attr('src',$new_src);//替换新的产品图片
			
		})
		
	}
	
	//主图加载完毕
	this.image_load=function(img_this){
		var n_width, n_height;
		if (img_this.naturalWidth) { // 现代浏览器
			n_width = img_this.naturalWidth;
			n_height = img_this.naturalHeight;
		}else { // IE6/7/8
			var new_img = new Image();
			new_img.src = img_this.src;
			new_img.onload = function() {
				n_width = new_img.width;
				n_height = new_img.height;
			}
		}
		var img_width=0;
		var img_height=0;
		//如果宽度大于高度
		if(n_width>n_height){
			//计算宽度缩放比例
			var ratio=n_width/this.box_width;//缩放比例
			var new_height=n_height/ratio;
			var margin_top=(this.box_height-new_height)/2;//顶部边距
			img_width=this.box_width;
			img_height=new_height;
			
			$(img_this).css({"width":img_width,'height':img_height,'margin-top':margin_top,'margin-left':0});
			$(".zoom_black").css({'margin-top':margin_top,'margin-left':0});
		}else{//如果高度大于宽度
			//计算宽度缩放比例
			var ratio=n_height/this.box_height;//缩放比例
			var new_width=n_width/ratio;
			var margin_left=(this.box_width-new_width)/2;//左边边距
			img_width=new_width;
			img_height=this.box_height;
			$(img_this).css({"width":img_width,'height':img_height,'margin-top':0,'margin-left':margin_left});
			$(".zoom_black").css({'margin-top':0,'margin-left':margin_left});
		}
		
		//显示原始图片
		$(".hd_display .overlay_content img").attr('src',img_this.src).css({'width':img_width*this.zoom_modulus,'height':img_height*this.zoom_modulus})
		
	}
	
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
/*
$product_data={
	default_attributes:{"套装":"上衣","尺码":"L","颜色":""},
	sku_array:[
		{
			"套装":"上衣",
			"尺码":"L",
			"颜色":"黑色",
			"原价":200.70,
			"售价":100.70,
			"qty":0,
			"sku":1011,
		},
		{
			"套装":"上衣",
			"尺码":"M",
			"颜色":"黑色",
			"原价":200.70,
			"售价":102.70,
			"qty":101,
			"sku":1012,
		},
		{
			"套装":"裙子",
			"尺码":"L",
			"颜色":"黑色",
			"原价":200.70,
			"售价":120.70,
			"qty":103,
			"sku":1013,
		},
		{
			"套装":"裙子",
			"尺码":"S",
			"颜色":"黑色",
			"原价":200.70,
			"售价":121.70,
			"qty":1011,
			"sku":1014,
		},
		{
			"套装":"裙子",
			"尺码":"M",
			"颜色":"黑色",
			"原价":200.70,
			"售价":122.70,
			"qty":300,
			"sku":1015,
		},
		{
			"套装":"套装",
			"尺码":"L",
			"颜色":"黑色",
			"原价":200.70,
			"售价":192.70,
			"qty":150,
			"sku":1016,
		},
		{
			"套装":"套装",
			"尺码":"S",
			"颜色":"黑色",
			"原价":200.70,
			"售价":193.70,
			"qty":170,
			"sku":1017,
		},
		{
			"套装":"套装",
			"尺码":"M",
			"颜色":"黑色",
			"原价":200.70,
			"售价":198.70,
			"qty":400,
			"sku":1018,
		}
	]
}
*/
//属性选择
attributes_class=function($product_data){
	this.product_data=$product_data;
	this.attributes_info={};
	this.attributes_info=$product_data.default_attributes;
	
	//初始化
	this.init=function($attributes){
		//注册事件  用户操作购买数量
		$(".promo_row .qty_action").click(function(){
			var $class_name=$(this).attr('class');
			var $sku_qty=parseInt($("#sku_qty").val(),10);
			var $inventory=parseInt($("#stock .inventory").text(),10);//sku总库存
			if($sku_qty<=0)$sku_qty=1;
			//数量操作
			if($class_name.indexOf("reduce")>=0){//减少
				if($sku_qty-1>=1)$("#sku_qty").val($sku_qty-1);
			}else if($class_name.indexOf("increase")>=0){//增加
				if($inventory<$sku_qty+1)alert('数量大于库存数量!');
				if($sku_qty+1<=$inventory)$("#sku_qty").val($sku_qty+1);
			}
		});
		//属性选择,属性图选择
		$(".sales_info .promo_row .attributes_value,.sales_info .promo_row .attributes_image").click(function(){
			//if($(this).is('.of_stock'))return false;
			var $promo_row=$(this).parents('.promo_row');
			var $attributes_name=$promo_row.find('>.name').data('name');//属性名称
			var $attributes_value=$(this).data('value');
			
			//如果用户已经选择
			if($(this).is('.selected')){
				//取消选择
				$promo_row.find('.attributes_value,.attributes_image').removeClass('selected');
				$attributes.attributes_info[$attributes_name]="";//清空属性选择
			}else{
				$promo_row.find('.attributes_value,.attributes_image').removeClass('selected');
				//移除样式
				$attributes.attributes_info[$attributes_name]=$attributes_value;
				$(this).addClass('selected');
			}
			$attributes.selected();//刷新其他信息
		});
		
		//属性行自动选择
		$(".sales_info .promo_row").each(function(){
			var $attr_name=$(this).find('.name').data('name');//属性名称
			if(typeof($attr_name)!="undefined"){
				var $attr_arr=$(this).find('.attributes_value,.attributes_image');
				var $attr_len=$attr_arr.length;
				//其他属性值自动选择
				var $attributes_info=$attributes.attributes_info;
				var $temp_val=$attributes_info[$attr_name];
				var $item_click=false;
				if($temp_val!=""){
					$attr_arr.each(function(){
						if($(this).data('value')==$temp_val){
							$(this).trigger('click');//单属性值自动选择
							$item_click=true;
						}
					})
				}
				if($attr_len==1 && $item_click==false)$attr_arr.eq(0).trigger('click');//单属性值自动选择
			}
		})
		
	}
	
	//用户选择后计算
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
}

//dom加载完成
$(function(){
	
	//产品详情 产品评论切换
    $("#detail .tab_bar_box .tab").on('click',function(){
		var $temp_name=$(this).data('name');
		//产品描述 评论信息切换
		if($temp_name=="product_details"){
			$("#desc_content,#attributes").show();
			$("#review").hide();
		}else if($temp_name=="product_review"){
			$("#desc_content,#attributes").hide();
			$("#review").show();
		}
		
		//css样式处理
		$("#detail .tab_bar_box .tab").each(function(){
			$(this).removeClass('selected');
		})
		$(this).addClass('selected');
    })
	
	//属性事件
	$attributes=new attributes_class($product_data);
	$attributes.init($attributes);//初始化事件注册
	
	$main_img=new main_image_class($(".product_showcase .main_image"));
	$main_img.image_load($("#attribute_image")[0]);//
	$main_img.init(420,420,"$main_img.image_load(this);");//设置事件
	//鼠标移入事件
	$("#attribute_image,.main_image .zoom_black").on('mouseenter',function(e){
		$main_img.zoom_mov(e);
		$(".zoom_black,#hd_display").show();
	});
	
	//鼠标移出事件
	$("#attribute_image,.main_image .zoom_black").on('mouseout',function(e){
		$(".zoom_black,#hd_display").hide();
	});
	$(".main_image .zoom_black").on('mousemove',function(e){
		$main_img.zoom_mov(e);
	});
})
