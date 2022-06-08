import {Outlet} from "react-router-dom";
import Header from "../components/Header";
import End from "../components/End";
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