/*
    首页路由
    作者:chenpinzhong
    开发备注:主要实现页面路由功能
*/
import { useRoutes, } from "react-router-dom";
import { lazy } from 'react';
import IndexLayout from '../../layout/index/IndexLayout'
const Index = lazy(() => import('./index'))
const Help = lazy(() => import('./help'))

function IndexRoutes() {
    return useRoutes([
        //主页
        {
            path: '/',
            element: <IndexLayout />,
            children: [
                { path: '/', element: <Index /> },
                { path: '/help', element: <Help /> },
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