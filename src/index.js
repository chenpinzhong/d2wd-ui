import React, { lazy, Suspense } from 'react';
import { BrowserRouter, useRoutes, Route, Routes } from "react-router-dom"
import ReactDOM from 'react-dom/client';
import MainRoutes from './main_route'
const root = ReactDOM.createRoot(document.getElementById('root'));
//渲染根组件
root.render(
    <>
        <BrowserRouter>
            <MainRoutes />
        </BrowserRouter>
    </>
);