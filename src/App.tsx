
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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

// Initialize localStorage with demo data
initializeApp();

function App() {
  // Global auto-refresh mechanism - only for serious failures
  useEffect(() => {
    // Track if page is fully loaded
    let pageLoaded = false;
    
    // Set a longer timer (10 seconds) to check if page has loaded
    const loadTimeout = setTimeout(() => {
      if (!pageLoaded) {
        console.log("Page failed to load completely after extended wait, triggering refresh");
        // Store current route before refresh to return to it
        const currentPath = window.location.pathname;
        localStorage.setItem("lastRoute", currentPath);
        window.location.reload();
      }
    }, 10000); // Increased from 5000 to 10000ms
    
    // Mark as loaded when window load event fires
    window.addEventListener('load', () => {
      pageLoaded = true;
      clearTimeout(loadTimeout);
      
      // Check if we're returning from a refresh and need to navigate
      const lastRoute = localStorage.getItem("lastRoute");
      if (lastRoute && window.location.pathname !== lastRoute) {
        console.log("Restoring previous route:", lastRoute);
        window.history.pushState(null, "", lastRoute);
        localStorage.removeItem("lastRoute");
      }
    });
    
    return () => {
      clearTimeout(loadTimeout);
      pageLoaded = true; // Prevent refresh when component unmounts
    };
  }, []);

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
