import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
// In App.js
import { DashboardContent } from "./components/DashboardContent"; // Named import

import { LoginForm } from "./components/LoginForm";
import { useAuthStore } from "./store/authStore";

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <DashboardContent />
      </div>
    </div>
  );
}

export default App;
