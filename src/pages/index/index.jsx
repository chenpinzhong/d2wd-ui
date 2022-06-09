import index_css from  './css/index.css'
import Slide from '../../components/Slide'

function Index(){
    return (
        <>
            <main>
                <section className="slider_area">
                    <div className="slide_frame">
                        <Slide width="1200" height="600"/>
                    </div>
                </section>
            </main>
        </>
    )
}
export default Index