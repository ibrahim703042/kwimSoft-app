import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { inventoryModuleConfig } from "@/config/module.config";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Warehouse, Package, ClipboardList, Truck, BarChart3 } from "lucide-react";
import Dashboard from "./pages/Dashboard";

function App() {
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft Inventory",
    menus: inventoryModuleConfig.menu,
    user: {
      fullName: "Inventory User",
      email: "inventory@kwimsoft.com",
      role: "Inventory Manager",
    },
    quickActions: [
      {
        icon: Package,
        label: "Add Product",
        description: "Add new product to inventory",
        shortcut: "⌘P",
        onClick: () => navigate("/products/new"),
      },
      {
        icon: ClipboardList,
        label: "Stock Count",
        description: "Perform stock count",
        onClick: () => navigate("/stock-count"),
      },
      {
        icon: Truck,
        label: "New Receipt",
        description: "Record goods receipt",
        onClick: () => navigate("/receipts/new"),
      },
      {
        icon: BarChart3,
        label: "Inventory Report",
        description: "Generate inventory report",
        onClick: () => navigate("/reports"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Low stock alert",
        message: "Product XYZ is running low on stock",
        type: "warning",
        time: "5 min ago",
        read: false,
      },
    ],
    onLogout: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
