import React from 'react';
import { useNavigate } from 'react-router-dom';

function Users(){
    const Navigate =useNavigate();
    function goLogin(){
        Navigate('/user/login/?id=100');
    }
    return (
        <div>
          <a href='/user/login?id=ccc'>用户登陆?id=cc</a><br/>
          <a href='/user/login/ccc'>用户登陆/ccc方式</a><br/>
          <button onClick={goLogin}>登陆跳转</button>
        </div>
    ); 
}
export default Users;
