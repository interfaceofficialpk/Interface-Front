import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import ParallaxBg from "../components/ParallaxBg";
import ReverseProtectedRoute from "../components/ReverseProtectedRoute";

export default function AuthLayout() {
  return (
    <ReverseProtectedRoute>
      <ParallaxBg imageUrl="/parallax-bg.png" />
      <Header />
      <Outlet />
    </ReverseProtectedRoute>
  );
}
