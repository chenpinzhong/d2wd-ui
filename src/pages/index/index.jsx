import './css/index.css'
import Slide from '../../components/Slide' //引入幻灯片组件

//幻灯片
function slide_list(){
    return (<>
        <div className='element'>
            <img src={process.env.PUBLIC_URL + '/images/s3.jpg'} alt=""/>
        </div>
        <div className='element'>
            <img src={process.env.PUBLIC_URL + '/images/s2.jpg'} alt=""/>
        </div>
    </>)
}
//用户首页
function Index(){
    return (
        <>
            <main>
                {/*轮播图*/}
                <section className='slider_area'>
                    <div className='slide_frame'>
                        <Slide width='1200' height='600' slide_list={slide_list} />
                    </div>
                </section>
                <section className='section_space'>
			        <div className='container'>
                        <div className='slide_frame'>
                            <div className="section_title">
                                <h2>猜你喜欢</h2>
                                <p>大家喜欢的好物</p>
                            </div>
                            {/*产品展示模块*/}
                            <div className='row mtn-40'>
                                <div className="product_display">
                                    <div className="product_item mt_40">
                                        <figure className="product_thumb">
                                            <a href="/shop/product/show/id/1">
                                                <img className="pri-img" src={process.env.PUBLIC_URL + '/images/product/iphone13 black.jpg'} width="270" height="270" alt="product"/>
                                            </a>
                                            <div className="product_badge">
                                                <div className="product_label discount">
                                                    <span>0%</span>
                                                </div>
                                            </div>
                                            <div className="button_group" style={{display:'none'}}>
                                                {/*<!--加入商品收藏夹-->*/}
                                                <a href="/" title="加入商品收藏夹">
                                                    <i className="lnr lnr_heart"></i>
                                                </a>
                                                {/*<!--快速查看-->*/}
                                                <a href="/" title="快速查看">
                                                    <i className="lnr lnr_magnifier"></i>
                                                </a>
                                                {/*<!--加入购物车-->*/}
                                                <a href="/" title="加入购物车">
                                                    <i className="lnr lnr_cart"></i>
                                                </a>
                                            </div>
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
export default Index