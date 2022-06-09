import {useRoutes,} from "react-router-dom";
import {lazy} from 'react';
import IndexLayout from '../../layout/index/IndexLayout'
const Index = lazy(()=>import('./index'))

function IndexRoutes() {
    return  useRoutes([
        //主页
        {
          path:'/',
          element: <IndexLayout />,
          children: [
            {path: '/',element: <Index/>},
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