import { Outlet } from "react-router-dom";
import Header from "../../components/admin/Header";
import End from "../../components/admin/End";
function IndexLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <End />
    </>
  );
}
export default IndexLayout