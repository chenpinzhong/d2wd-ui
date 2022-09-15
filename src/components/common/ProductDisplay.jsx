import React from "react"
import "./css/product_display.css"

class ProductDisplay extends React.Component{

    render(){
        let product=this.props.product
        return(
            <>
                <div  className="product_display">
                    <div className="product_item mt_40">
                        <figure className="product_thumb">
                            <a href={"/shop/product/show?id="+product.id}>
                                <img className="pri-img" src={product.product_image} width="270" height="270" alt="product"/>
                            </a>
                            <div className="product_badge">
                                {product.new===true?(<div className="product_label new"><span>新品</span></div>):''}
                                <div className="product_label discount"><span>{product.discount}</span></div>
                            </div>
                        </figure>
                        <div className="product_caption">
                            <p className="product_name">
                                {/*<!--产品名称-->*/}
                                <a href={"/shop/product/show?id="+product.id}>{product.product_name}</a>
                            </p>
                            <div className="price_box">
                                <span className="price_regular">{product.sale_price}</span>
                                <span className="price_old"><del>{product.price}</del></span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default ProductDisplay
