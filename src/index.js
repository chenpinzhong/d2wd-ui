/*
    根目录
    作者:chenpinzhong
    开发备注:加载路由
*/
import React from 'react';
import {BrowserRouter} from "react-router-dom"
import ReactDOM from 'react-dom/client'
import MainRoutes from './main_route'
const root = ReactDOM.createRoot(document.getElementById('root'))
//渲染根组件
root.render(
    <>
        <BrowserRouter>
            <MainRoutes/>
        </BrowserRouter>
    </>
);