import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
      <Header />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
