import React from "react";
import { BarChart3, Users, LineChart, LogOut } from "lucide-react";
import { useDashboardStore } from "../store/dashboardStore";
import { useAuthStore } from "../store/authStore";

export const Sidebar = () => {
  const { activeSection, setActiveSection } = useDashboardStore();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { id: "sales", label: "Sales Data", icon: BarChart3 },
    { id: "users", label: "User Analytics", icon: Users },
    { id: "traffic", label: "Traffic Reports", icon: LineChart },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Data Dashboard</h2>
        <p className="text-gray-400 text-sm mt-2">Welcome, {user?.name}</p>
      </div>

      <nav className="flex-1">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 ${
              activeSection === id
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};
