
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatProvider } from "./context/ChatContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Calculator from "./pages/Calculator";
import Charts from "./pages/Charts";
import NotFound from "./pages/NotFound";
import { toast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }

    // Listen for beforeinstallprompt event to enable install button
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      // Optionally, show a toast notification that the app can be installed
      toast({
        title: "Nelson-GPT can be installed",
        description: "Click 'Add to Home Screen' in the menu to install the app",
        duration: 5000,
      });
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex w-full">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
                <Header 
                  toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                  installPrompt={installPrompt}
                />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/charts" element={<Charts />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ChatProvider>
    </QueryClientProvider>
  );
};

export default App;
