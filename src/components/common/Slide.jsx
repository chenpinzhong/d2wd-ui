import React from "react"
import $ from "jquery" //引入 jq
import "./module/jq_slide" //引入jq 插件
import "./css/jq_slide.css" //引入样式文件

class Slide extends React.Component{
  
  //默认渲染组件
  slide_list(){
    return (<>
      <div className="element" style={{backgroundColor:'#f44336'}}>demo1</div>
      <div className="element" style={{backgroundColor:'#1CDCCF'}}>demo2</div>
    </>)
  }

  //dom渲染完成
  componentDidMount(){
    const {width,height} = this.props
    let home_slide=$(".slide").slide();
    home_slide.init(width,height);
  }

  render(){
    const {height,slide_list} = this.props
    if(typeof(slide_list)!="undefined")this.slide_list=slide_list

    return(
      <>
        <div className="slide" style={{'height':height+'px'}}>
          {/* 列表部分 */}
          <div className="slide_content">
            <this.slide_list/>
          </div>
          {/* 控制按钮部分 */}
          <div className="left">
            <div className="control">
              <div className="bc"></div>
              <div className="left_show"></div>
            </div>
          </div>
          <div className="right">
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
