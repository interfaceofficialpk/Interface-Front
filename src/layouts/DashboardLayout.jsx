import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";
import { AnimatePresence } from "framer-motion";
import ParallaxBg from "../components/ParallaxBg";

export default function DashboardLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <LayoutWithSidebar />
      </SidebarProvider>
    </ProtectedRoute>
  );
}

function LayoutWithSidebar() {
  const { isOpen } = useSidebar();

  return (
    <div className="flex">
      <AnimatePresence>{isOpen && <Sidebar />}</AnimatePresence>

      <div className="flex flex-col flex-1 min-w-0">
        <ParallaxBg imageUrl="/parallax-bg.png" />
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}
