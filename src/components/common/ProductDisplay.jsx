import React from "react"
import "./css/product_display.css" //引入样式文件
class ProductDisplay extends React.Component{
  render(){
    return(
      <>
        <div className="product_display">
            <div className="product_item mt_40">
                <figure className="product_thumb">
                    <a href="/shop/product/show/id/1">
                        <img className="pri-img" src={process.env.PUBLIC_URL + '/images/product/iphone13 black.jpg'} width="270" height="270" alt="product"/>
                    </a>
                    <div className="product_badge">
                        <div className="product_label new"><span>new</span></div>
                        <div className="product_label discount"><span>0%</span></div>
                    </div>
                </figure>
                <div className="product_caption">
                    <p className="product_name">
                        {/*<!--产品名称-->*/}
                        <a href="/shop/product/show/id/1">iphone13</a>
                    </p>
                    <div className="price_box">
                        <span className="price_regular">¥5399.00</span>
                        <span className="price_old"><del>¥6399.00</del></span>
                    </div>
                </div>
            </div>
        </div>
      </>
    )
  }
}
export default ProductDisplay