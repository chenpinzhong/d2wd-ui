/*
    用户首页
    作者:chenpinzhong
    开发备注:主要实现网站首页
*/
import './css/index.css'
import Slide from '../../components/common/Slide' //幻灯片组件
import ProductDisplay from '../../components/common/ProductDisplay' //产品显示组件
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
    //拉取产品列表
    return (
        <>
            <main>
                {/*轮播图*/}
                <section className='slider_area'>
                    <div className='slide_frame'>
                        <Slide width='1200' height='500' slide_list={slide_list} />
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
                                <ProductDisplay/>
                                <ProductDisplay/>
                                <ProductDisplay/>
                                <ProductDisplay/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
export default Index