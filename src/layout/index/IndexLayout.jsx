import {Outlet} from "react-router-dom";
import Header from "../../components/index/Header";
import End from "../../components/index/End";
function IndexLayout() {
  return (
    <>
      <Header/>
        <Outlet/>
      <End/>
    </>
  );
}
export default IndexLayout