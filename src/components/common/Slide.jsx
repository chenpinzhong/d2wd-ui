import React, {useRef} from "react"
import $ from "jquery" //引入 jq
//import "./module/jq_slide" //引入jq 插件
import "./css/jq_slide.css" //引入样式文件
import {nanoid} from "nanoid"
import fail from "../../pages/admin/handle/fail";
import jQuery from "jquery"
class Slide extends React.Component{
    slide_data=<></>
    width=0;
    height=0;
    bind:false;//是否已绑定事件
    slide_box=React.createRef();
    element_index=1;//当前展示元素

    //默认渲染组件
    slide_list(slide_list){
        if(typeof (slide_list.length)==="undefined")return <></>;
        return slide_list.map(function (slide){
            return <div key={nanoid()} className='element'>
                <a href={slide['href']}><img src={process.env.PUBLIC_URL + slide['image_src']} alt={slide['name']}/></a>
            </div>
        })
    }
    last(){
        let slide_box=this.slide_box.current;
        let dom_element=$(slide_box).find('.slide_content .element');//幻灯片元素
        this.element_length=dom_element.length;//元素的个数
        this.element_width=dom_element.eq(0).width();//元素宽度
        this.element_height=dom_element.eq(0).height();//元素高度
        dom_element.finish();//动画结束

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
    next(){
        let slide_box=this.slide_box.current;
        let dom_element=$(slide_box).find('.slide_content .element');//幻灯片元素
        this.element_length=dom_element.length;//元素的个数
        this.element_width=dom_element.eq(0).width();//元素宽度
        this.element_height=dom_element.eq(0).height();//元素高度
        dom_element.finish();//动画结束
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

    render(){
        const {width,height,slide_list} = this.props
        this.width=width;
        this.height=height;
        if(typeof(slide_list)!="undefined"){
            this.slide_data=this.slide_list(slide_list)
        }

        return(
            <>
                <div className="slide" ref={this.slide_box} style={{'height':this.height+'px'}}>
                    {/* 列表部分 */}
                    <div className="slide_content">
                        {this.slide_data}
                    </div>
                    {/* 控制按钮部分 */}
                    <div className="left" onClick={()=>this.last()}>
                        <div className="control">
                            <div className="bc"></div>
                            <div className="left_show"></div>
                        </div>
                    </div>
                    <div className="right" onClick={()=>this.next()}>
                        <div className="control">
                            <div className="bc"></div>
                            <div className="right_show"></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default Slide
