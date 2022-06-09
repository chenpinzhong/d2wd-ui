import React from "react"
import slide_css from  './css/slide.css'
class Slide extends React.Component{
  
  render(){
    const {width,height} = this.props
    console.log(width,height)
    
    return(
      <>
        <div className="slide">
          <div className="slide_content">
            <div className="element" style={{backgroundColor:'#f44336'}}>div1</div>
            <div className="element" style={{backgroundColor:'#f44336'}}>div2</div>
          </div>
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
