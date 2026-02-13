import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Users, Package, BarChart3, ShoppingCart, ClipboardList,
  Factory, Car, Wrench, Boxes, UserCog, TrendingUp, Globe,
  Layers, CheckCircle2, ArrowRight, Sparkles, X
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────── Module Categories ─────────────── */
const moduleCategories = [
  {
    name: "Transport & Logistics",
    modules: [
      { id: "transport", icon: Truck, name: "Transport", desc: "Fleet management, routes, trips & ticketing" },
      { id: "carwash", icon: Car, name: "Carwash", desc: "Wash bay management & scheduling" },
      { id: "maintenance", icon: Wrench, name: "Maintenance", desc: "Fleet maintenance & inspections" },
    ],
  },
  {
    name: "Sales & CRM",
    modules: [
      { id: "crm", icon: UserCog, name: "CRM", desc: "Leads, pipeline & opportunities" },
      { id: "sales", icon: ShoppingCart, name: "Sales", desc: "Sales orders & quotations" },
    ],
  },
  {
    name: "Finance",
    modules: [
      { id: "finance", icon: BarChart3, name: "Accounting", desc: "Invoicing, payments & reports" },
    ],
  },
  {
    name: "Supply Chain",
    modules: [
      { id: "inventory", icon: Package, name: "Inventory", desc: "Warehouse & stock management" },
      { id: "procurement", icon: ClipboardList, name: "Procurement", desc: "Purchase orders & vendors" },
      { id: "manufacturing", icon: Factory, name: "Manufacturing", desc: "Production planning & BOM" },
    ],
  },
  {
    name: "Human Resources",
    modules: [
      { id: "hr", icon: Users, name: "HR & People", desc: "Employees, payroll & recruitment" },
    ],
  },
  {
    name: "Products & Reports",
    modules: [
      { id: "products", icon: Boxes, name: "Products", desc: "Product catalog & pricing" },
      { id: "reports", icon: TrendingUp, name: "Reports", desc: "Business intelligence & analytics" },
    ],
  },
];

/* ─────────────── Module Card ─────────────── */
function ModuleCard({
  module,
  isSelected,
  onToggle,
}: {
  module: typeof moduleCategories[0]["modules"][0];
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-200 text-left w-full",
        isSelected
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
          : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50"
      )}
    >
      {/* Checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            isSelected ? "bg-indigo-600" : "bg-gray-100"
          )}
        >
          <module.icon className={cn("w-6 h-6", isSelected ? "text-white" : "text-gray-600")} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold text-sm mb-1", isSelected ? "text-indigo-900" : "text-gray-900")}>
            {module.name}
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed">{module.desc}</p>
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────── Main Trial Page ─────────────── */
export default function TrialPage() {
  const navigate = useNavigate();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleContinue = () => {
    if (selectedModules.length === 0) {
      alert("Please select at least one module to continue");
      return;
    }
    // Navigate to register with selected modules
    navigate("/register", { state: { selectedModules } });
  };

  const displayedCategories = showAllCategories ? moduleCategories : moduleCategories.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                KwimSoft
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-4 py-2"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Free 14-Day Trial</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Apps
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Free instant access. No credit card required.
            <br />
            <span className="font-semibold text-indigo-600">
              {selectedModules.length} {selectedModules.length === 1 ? "app" : "apps"} selected
            </span>
          </p>
        </motion.div>

        {/* Module Categories */}
        <div className="space-y-8 mb-12">
          {displayedCategories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                {category.name}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isSelected={selectedModules.includes(module.id)}
                    onToggle={() => toggleModule(module.id)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {moduleCategories.length > 3 && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-full transition-colors"
            >
              {showAllCategories ? (
                <>
                  <X className="w-4 h-4" />
                  Show Less Categories
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  Show All Categories ({moduleCategories.length - 3} more)
                </>
              )}
            </button>
          </div>
        )}

        {/* Selected Modules Summary */}
        <AnimatePresence>
          {selectedModules.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Selected Modules ({selectedModules.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedModules.map((moduleId) => {
                      const module = moduleCategories
                        .flatMap((cat) => cat.modules)
                        .find((m) => m.id === moduleId);
                      if (!module) return null;
                      return (
                        <span
                          key={moduleId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                        >
                          <module.icon className="w-3.5 h-3.5" />
                          {module.name}
                          <button
                            onClick={() => toggleModule(moduleId)}
                            className="ml-1 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            disabled={selectedModules.length === 0}
            className={cn(
              "group inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-full shadow-lg transition-all text-base",
              selectedModules.length > 0
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200 hover:shadow-indigo-300"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Continue
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <p className="text-xs text-gray-500">
            You can always add or remove apps later
          </p>
        </div>

        {/* Features Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: CheckCircle2, text: "14 days free trial" },
            { icon: X, text: "No credit card required" },
            { icon: Globe, text: "Cancel anytime" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <item.icon className="w-4 h-4 text-emerald-500" />
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              By clicking on <strong>Continue</strong>, you accept our{" "}
              <button className="text-indigo-600 hover:underline">Terms of Service</button> and{" "}
              <button className="text-indigo-600 hover:underline">Privacy Policy</button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
