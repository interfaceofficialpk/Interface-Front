import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ParallaxBg from "../components/ParallaxBg";
import Header from "../components/Header";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HomeLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      <ParallaxBg imageUrl="/parallax-bg.png" />
      {location.pathname === "/" ? <Navbar /> : <Header />}
      <Outlet />
    </div>
  );
}
