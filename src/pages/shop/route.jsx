/*
    商店路由
    作者:chenpinzhong
    开发备注:主要商店路由功能
*/
import { useRoutes, } from "react-router-dom";
import { lazy } from 'react';
import IndexLayout from '../../layout/shop/IndexLayout'
const Index = lazy(() => import('./index')) //商店首页
const ProductIndex = lazy(() => import('./product/index')) //商店首页
const ProductShow = lazy(() => import('./product/show')) //商店首页
function IndexRoutes() {
    return useRoutes([
        //主页
        {
            path: '/',
            element: <IndexLayout />,
            children: [
                //展示商店类目
                { path: '/', element: <Index /> },
                //展示产品列表
                { path: '/product', element: <ProductIndex /> },
                //展示产品
                { path: '/product/show/*', element: <ProductShow /> },
            ]
        },
        //404
        {
            path: '*',
            element: <div>前台404</div>,
        }
    ]);
}
export default IndexRoutes