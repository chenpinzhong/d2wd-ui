/*
    根目录
    作者:chenpinzhong
    开发备注:加载路由
*/
import React from 'react';
import { BrowserRouter } from "react-router-dom"
import ReactDOM from 'react-dom/client'
import MainRoutes from './main_route'
import { Provider } from 'react-redux'
import store from './store/store' //全局变量
const root = ReactDOM.createRoot(document.getElementById('root'))

//渲染根组件
root.render(
    <>
        <Provider store={store}>
            <BrowserRouter>
                <MainRoutes />
            </BrowserRouter>
        </Provider>
    </>
);