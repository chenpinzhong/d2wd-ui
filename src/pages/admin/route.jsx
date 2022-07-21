import { useRoutes } from "react-router-dom";
import { lazy } from 'react';
import IndexLayout from '../../layout/admin/IndexLayout'
const Index = lazy(() => import('./index'))
const AdminUser = lazy(() => import('./admin_user/index'))
function AdminRoutes() {
    return useRoutes([
        //后台管理页面
        {
            path: '',
            element: <IndexLayout />,
            children: [
                { path: '/', element: <Index /> },
                { path: '/admin_user/index', element: <AdminUser/> },
            ]
        },
        //404
        {
            path: '*',
            element: <div>后台404</div>,
        }
    ]);
}
export default AdminRoutes