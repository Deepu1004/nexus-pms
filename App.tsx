import React from "react";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Pages
import Dashboard from "./Dashboard";
import Rooms from "./Rooms";
import Bookings from "./Bookings";
import Guests from "./Guests";
import Revenue from "./Revenue";
import Login from "./Login";

// Hooks
import { useAuth } from "./hooks/useAuth";

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-primary-500">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/revenue" element={<Revenue />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
