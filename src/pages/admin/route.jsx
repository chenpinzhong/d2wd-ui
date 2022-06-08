import {useRoutes} from "react-router-dom";
import {lazy} from 'react';
const Index = lazy(()=>import('./index'))
function AdminRoutes() {
    return  useRoutes([
        //主页
        {
          path:'',
          element: <Index />,
          children: [
            {path: '',element: <div>后台首页</div>},
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