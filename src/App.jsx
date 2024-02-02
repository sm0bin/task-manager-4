import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const noFooter = location.pathname.includes('login') || location.pathname.includes('signup') || location.pathname.includes('dashboard');
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet></Outlet>
      </div>
      {noFooter || <Footer />}
    </>
  );
};

export default App;