import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface AuthHeaderProps {
  showBackButton?: boolean;
  backTo?: string;
  showSignIn?: boolean;
}

export default function AuthHeader({ showBackButton = false, backTo = "/", showSignIn = false }: AuthHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              KwimSoft
            </span>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(backTo)}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Retour
              </button>
            )}
            {showSignIn && (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
