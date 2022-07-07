import { Outlet } from "react-router-dom";
import Header from "../../components/admin/Header";
import Menu from "../../components/admin/Menu";
import End from "../../components/admin/End";
import   "../../components/admin/css/base.css";
function IndexLayout() {
  return (
    <>
      <Header />
      <Menu />
      <Outlet />
      <End />
    </>
  );
}
export default IndexLayout