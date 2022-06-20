import { Outlet } from "react-router-dom";
import Header from "../../components/shop/Header";
import End from "../../components/shop/End";
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