import jQuery from "jquery"
(function($){
	$.fn.extend({
		slide:function(width,height){
			//获取元素个数
			let $_this=this;
			let dom_slide=$(this);//幻灯片
			let dom_element=$(this).find('.slide_content .element');//幻灯片元素
			this.element_index=1;//当前展示元素  不是从0开始 是从1 开始
			this.element_length=dom_element.length;//元素的个数
			this.element_width=dom_element.eq(0).width();//元素宽度
			this.element_height=dom_element.eq(0).height();//元素高度
			
			//初始化方法
			this.init=function ($this){
				dom_element.css('left',this.element_width);//将全部元素隐藏到视野外面
				dom_element.eq(0).css('left',0);//只显示第一个元素
				
				//注册事件
				$(dom_slide).find('.left').on('click',function(){
					$_this.last();
				})
				//注册事件
				$(dom_slide).find('.right').on('click',function(){
					$_this.next();
				})
			}
			//展示下一个元素
			this.next=function(){
				dom_element.finish();
				//<-根据当前元素 得到上一个元素
				//当前元素
				let current_element =dom_element.eq(this.element_index-1);
				//下一个元素
				let next_element='';
				if(this.element_index>=this.element_length){
					this.element_index=1;
				}else{
					this.element_index+=1;
				}
				
				next_element=dom_element.eq(this.element_index-1);//下一个元素
				//设置初始位置
				current_element.css({'left':'0px'}).animate({left:'-'+this.element_width+'px'});
				next_element.css({'left':this.element_width+'px'}).animate({left:0+'px'});
			}
			//展示上一个元素
			this.last=function(){
				dom_element.finish();
				//->根据当前元素 得到下一个元素
				//当前元素
				let current_element =dom_element.eq(this.element_index-1);
				let next_element='';
				//下一个元素
				if(this.element_index===1){
					this.element_index=this.element_length;
				}else{
					this.element_index-=1;
				}
				next_element=dom_element.eq(this.element_index-1);//下一个元素
				//设置初始位置
				current_element.stop(true).css({'left':'0px'}).animate({left:'+'+this.element_width+'px'});
				next_element.stop(true).css({'left':'-'+this.element_width+'px'}).animate({left:0+'px'});
			}
			return this;
		}
	})
})(jQuery)
export default jQuery