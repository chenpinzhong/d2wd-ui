/*
    主路由
    作者:chenpinzhong
    开发备注:实现网站所有路由
*/
import {useRoutes} from "react-router-dom" //用户路由
import IndexRoute from './pages/index/route'//网站路由
import ShopRoute from './pages/shop/route'//网站路由
import AdminRoute from './pages/admin/route'//后台路由
const MainRoutes = () => {
  const routes = useRoutes([
    //网站首页
    {path: '/*',element: <IndexRoute />,},
    //商店首页
    {path: '/shop/*',element: <ShopRoute />,},
    //管理员页面
    {path: '/admin/*',element: <AdminRoute />,},
    //所有路径不匹配 404
    {path: '*',element: <div>404</div>,}
  ])
  return routes;
}
export default MainRoutes