/*
    用户首页
    作者:chenpinzhong
    开发备注:主要实现网站首页
*/
import './css/index.css'
import React, {useEffect,useState} from 'react';
import Slide from '../../components/common/Slide' //幻灯片组件
import ProductDisplay from '../../components/common/ProductDisplay'
import axios from "axios";
import {message} from "antd";
import {nanoid} from "nanoid"; //产品显示组件

//渲染产品列表
function ProductList(props){
    let product_list=props.product_list;
    //数组切片
    const chunk_array = (arr,size) =>{
        if(arr.length === 0)return [];
        const tempArr = [];
        const chunkLen = Math.ceil(arr.length / size);
        let last = 0;
        for(let i = 0;i<chunkLen;i++){
            if(size * i >= arr.length){
                last = arr.length;
            }else{
                last = size * i + size;
            }
            tempArr.push(arr.slice(size * i,last));
        }
        return tempArr;
    }
    let chunk_product_list=chunk_array(product_list, 4);
    return chunk_product_list.map(function (product_list){
        return(
            <div className="row mtn-40" key={nanoid()}>
                {
                    product_list.map(function (product){
                        return <ProductDisplay key={nanoid()} product={product}/>
                    })
                }
            </div>
        )
    })
}
//用户首页
function Index(){
    const [home_poster, set_home_poster] = useState(0);
    const [product_list, set_product_list] = useState(0);

    useEffect(()=>{
        //第一次渲染时 需要进行菜单列表的请求
        let server_url = process.env.REACT_APP_SERVER_URL;
        axios.get(server_url + "/index/index/get_home_data").then(
            response => {
                //set_home_poster(home_poster)
                let response_data=response.data
                if(response_data['code']===200){
                    //首页海报
                    let home_poster=response_data['data']['home_poster'];
                    set_home_poster(home_poster);
                    //首页推荐产品
                    let product_list=response_data['data']['product_list'];
                    console.log(product_list)
                    set_product_list(product_list);
                }else{
                    message.info('获取首页信息存在错误!').then(r => console.log('获取首页信息存在错误'))
                }
            },
            error => {
                message.info('获取首页信息存在错误error ='+JSON.stringify(error)).then(r => console.log('获取首页信息存在错误'+JSON.stringify(error)))
                console.log('获取用户数据失败', error);
            }
        );
    },[])
	
    //拉取产品列表
    return (

        <>
            <main>
                {/*轮播图*/}
                <section className='slider_area'>
                    <div className='slide_frame'>
                        <Slide width='1200' height='500' slide_list={home_poster} />
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
                            <ProductList  product_list={product_list}/>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
export default Index
