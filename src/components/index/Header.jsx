import React from "react"
import {Button} from 'antd'
import 'antd/dist/antd.min.css';
import header from  './css/header.css'
class Header extends React.Component{
  render(){
    return(
      <>
        <div className='header_area'>
          <div className="main_header">
            <div className="header_top">
              <div className="container">
                <div className="row align-items-center">
                <div className="col_lg_6"><div className="welcome_message"><p>Welcome to BIGTREETECH online store</p></div></div>
                {/*<!--右边区域-->*/}
                <div className="text_right">
                  <div className="header_top_settings">
                    <ul className="nav">
                    </ul>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Header
