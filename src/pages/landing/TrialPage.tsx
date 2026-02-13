import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Users, Package, BarChart3, ShoppingCart, ClipboardList,
  Factory, Car, Wrench, Boxes, UserCog, TrendingUp,
  Layers, CheckCircle2, ArrowRight, Sparkles, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthHeader, AuthFooter } from "@/components/layout";

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
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-0.5">{module.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{module.desc}</p>
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
    navigate("/register", { state: { selectedModules } });
  };

  const displayedCategories = showAllCategories ? moduleCategories : moduleCategories.slice(0, 3);

  // Get selected module details
  const getSelectedModuleDetails = () => {
    return moduleCategories.flatMap(cat => cat.modules)
      .filter(mod => selectedModules.includes(mod.id));
  };

  const selectedModulesList = getSelectedModuleDetails();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <AuthHeader showSignIn />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">14-day free trial</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Choose Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Apps
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Select the modules you need to get started. You can always add more later.
            </motion.p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Module Selection (2 columns) */}
            <div className="lg:col-span-2 space-y-8">
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
                  <div className="grid sm:grid-cols-2 gap-4">
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

              {/* Show More/Less */}
              {moduleCategories.length > 3 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-2 mx-auto"
                  >
                    {showAllCategories ? "Show Less" : "Show More Categories"}
                    <ArrowRight className={cn("w-4 h-4 transition-transform", showAllCategories && "rotate-90")} />
                  </button>
                </div>
              )}
            </div>

            {/* Right: Selected Modules Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Selected Modules</h3>
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      {selectedModules.length}
                    </div>
                  </div>

                  {selectedModulesList.length === 0 ? (
                    <div className="text-center py-8">
                      <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        No modules selected yet
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Select from the left to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-6">
                      <AnimatePresence mode="popLayout">
                        {selectedModulesList.map((module, i) => (
                          <motion.div
                            key={module.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                              <module.icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="flex-1 text-sm font-medium text-gray-900">
                              {module.name}
                            </span>
                            <button
                              onClick={() => toggleModule(module.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-200 rounded"
                            >
                              <X className="w-4 h-4 text-indigo-700" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  <button
                    onClick={handleContinue}
                    disabled={selectedModules.length === 0}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {selectedModules.length === 0 && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Select at least one module to continue
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
}
