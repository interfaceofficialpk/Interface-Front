import { createContext, useContext, useState, useEffect } from "react";
const SidebarContext = createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const storedSidebarState = localStorage.getItem("sidebarOpen");
      if (storedSidebarState) {
        setIsOpen(storedSidebarState === "true");
      }
    } catch (error) {
      console.error("Error retrieving sidebar state from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    localStorage.setItem("sidebarOpen", isOpen ? "false" : "true");
  };

  const value = {
    loading,
    isOpen,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
