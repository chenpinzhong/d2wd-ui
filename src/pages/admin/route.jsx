import { useRoutes,useSearchParams } from "react-router-dom";
import { lazy } from 'react';
import IndexLayout from '../../layout/admin/IndexLayout'
const Index = lazy(() => import('./index'))

//特殊页面
const LoginIndex = lazy(() => import('./login/index'))
const HandleSuccess = lazy(() => import('./handle/success'))
const HandleFail = lazy(() => import('./handle/fail'))

//普通页面
const AdminUserIndex = lazy(() => import('./admin_user/index'))
const AdminUserAdd = lazy(() => import('./admin_user/add'))

function AdminRoutes() {

    const [params, set_params] = useSearchParams();
    return useRoutes([
        //后台管理页面
        {
            path: '',
            element: <IndexLayout />,
            children: [
                { path: '/', element: <Index /> },
                { path: '/index/*', element: <Index /> },
                { path: '/admin_user/index', element: <AdminUserIndex title="管理员/管理员列表" params={params} set_params={set_params}/> },
                { path: '/admin_user/add', element: <AdminUserAdd title="管理员/新增管理员" params={params} set_params={set_params}/> },
            ]
        },
        //登陆页面
        { path: '/login/index', element: <LoginIndex title="登陆页面" params={params} set_params={set_params}/> },
        //成功错误的页面展示
        { path: '/handle/success', element: <HandleSuccess title="管理员/管理员列表" params={params} set_params={set_params}/> },
        { path: '/handle/fail', element: <HandleFail title="管理员/新增管理员" params={params} set_params={set_params}/> },
        //404
        {
            path: '*',
            element: <div>前端路由 404</div>,
        }
    ]);
}
export default AdminRoutes
