
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeApp } from "./utils/localStorage";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EventTypes, onEvent } from "./utils/eventBus";

// Initialize localStorage with demo data
initializeApp();

function App() {
  const [appReady, setAppReady] = useState(false);

  // Global state check and recovery mechanism
  useEffect(() => {
    // Mark app as ready after a short delay to allow initialization
    const readyTimer = setTimeout(() => {
      setAppReady(true);
      console.log("App marked as ready");
    }, 500);
    
    // Handle authentication failures
    const cleanupAuthListener = onEvent(
      EventTypes.AUTH_STATUS_CHANGED,
      (data) => {
        console.log("Auth status change detected:", data);
      },
      []
    );
    
    // Handle page load failures - only trigger after app is ready
    let pageLoadTimeout: number | null = null;
    
    const startPageLoadCheck = () => {
      // Clear any existing timeout
      if (pageLoadTimeout) {
        window.clearTimeout(pageLoadTimeout);
      }
      
      // Set a new timeout (8 seconds)
      pageLoadTimeout = window.setTimeout(() => {
        // Check if we still need to reload (page might have loaded in the meantime)
        const pageLoadIndicator = document.querySelector('[data-page-loaded="true"]');
        if (!pageLoadIndicator && appReady) {
          console.log("Page failed to fully load after timeout, refreshing...");
          // Store current route before refresh
          const currentPath = window.location.pathname;
          localStorage.setItem("lastRoute", currentPath);
          
          // Reload the page, but don't force an immediate reload to avoid constant refresh loops
          window.location.reload();
        }
      }, 8000) as unknown as number;
    };
    
    // Start the initial page load check
    startPageLoadCheck();
    
    // Listen for route changes to reset the page load check
    const handleRouteChange = () => {
      startPageLoadCheck();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for the custom pageLoaded event from pages
    window.addEventListener('pageLoaded', () => {
      if (pageLoadTimeout) {
        window.clearTimeout(pageLoadTimeout);
        pageLoadTimeout = null;
      }
    });
    
    return () => {
      clearTimeout(readyTimer);
      if (pageLoadTimeout) {
        window.clearTimeout(pageLoadTimeout);
      }
      cleanupAuthListener();
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('pageLoaded', () => {});
    };
  }, [appReady]);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave"
              element={
                <ProtectedRoute>
                  <Leave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute>
                  <Payroll />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <ActivityLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/:section"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
