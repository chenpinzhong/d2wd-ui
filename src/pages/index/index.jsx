import index_css from  './css/index.css'
import Slide from '../../components/Slide'
  //默认渲染组件
function slide_list(){
    return (<>
        <div className="element" style={{backgroundColor:'#DF6CCF'}}>
            <img src={process.env.PUBLIC_URL + '/images/s3.jpg'} />
        </div>
        <div className="element" style={{backgroundColor:'#f44336'}}>
            <img src={process.env.PUBLIC_URL + '/images/s1.png'} />
        </div>
        <div className="element" style={{backgroundColor:'#1CDCCF'}}>
            <img src={process.env.PUBLIC_URL + '/images/s2.jpg'} />
        </div>
    </>)
}

function Index(){
    return (
        <>
            <main>
                <section className="slider_area">
                    <div className="slide_frame">
                        <Slide width="1200" height="600" slide_list={slide_list} />
                    </div>
                </section>
            </main>
        </>
    )
}
export default Index