import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Layout from "@/components/Layout";
import YouTube from "./pages/YouTube";
import Planner from "./pages/Planner";
import Chat from "./pages/Chat";
import PDF from "./pages/PDF";
import PPT from "./pages/PPT";
import Notes from "./pages/Notes";
import Flashcards from "./pages/Flashcards";
import Community from "./pages/Community";
import ChromeExtension from "./pages/ChromeExtension";

const queryClient = new QueryClient();

const AppComponent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route path="/youtube" element={<Layout><YouTube /></Layout>} />
          <Route path="/planner" element={<Layout><Planner /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
          <Route path="/pdf" element={<Layout><PDF /></Layout>} />
          <Route path="/ppt" element={<Layout><PPT /></Layout>} />
          <Route path="/notes" element={<Layout><Notes /></Layout>} />
          <Route path="/flashcards" element={<Layout><Flashcards /></Layout>} />
          <Route path="/community" element={<Layout><Community /></Layout>} />
          <Route path="/chrome-extension" element={<Layout><ChromeExtension /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (container) {
  document.documentElement.classList.add('dark');

  const globalWindow = window as any;
  if (!globalWindow.__reactRoot) {
    globalWindow.__reactRoot = createRoot(container);
  }
  globalWindow.__reactRoot.render(<AppComponent />);
}
