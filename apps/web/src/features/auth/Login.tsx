import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth.store";
import { API_CONFIG } from "@/config/index";
import { jwtDecode } from "jwt-decode";
import { showErrorAlert } from "@/components/utilitie/AlertPopup";
import { motion } from "framer-motion";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, 
  Building2, Sparkles, AlertCircle, Loader2 
} from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      username: "kwim274651",
      password: "KwimSoft@2026",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Le nom d'utilisateur est requis"),
      password: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le mot de passe est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        // Call the backend authentication API
        const loginUrl = `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}/login`;
        const response = await axios.post(loginUrl, values);
        
        if (!response?.data) {
          throw new Error("Données de réponse invalides.");
        }

        const { accessToken, refreshToken, user: userData } = response.data;

        // Verify we have a valid access token
        if (!accessToken || typeof accessToken !== "string") {
          throw new Error("Token non valide ou absent.");
        }

        // Decode the JWT token
        let decodedToken: any = null;
        try {
          decodedToken = jwtDecode(accessToken);
        } catch {
          throw new Error("Échec du décodage du token.");
        }

        // Create user object with full data from backend
        const user = {
          id: userData._id || decodedToken.sub,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          tenantId: userData.tenantId,
          tenantCode: userData.tenantCode,
          roles: userData.roles || [],
          permissions: userData.permissions || [],
          avatar: userData.avatar,
          isEmailVerified: userData.isEmailVerified,
          status: userData.status,
          accessToken,
          refreshToken,
        };

        // Store tokens separately
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        // Store user in auth store and localStorage
        setUser(user);

        // Check if this is first login (welcome not completed)
        const welcomeCompleted = localStorage.getItem("welcome_completed");
        
        // Navigate to welcome page for first-time users, otherwise dashboard
        if (!welcomeCompleted && userData.status !== "active_returning") {
          navigate("/welcome");
        } else {
          navigate("/dashboard");
        }
      } catch (err: any) {
        const isNetworkError = err.message === "Network Error" || err.code === "ERR_NETWORK";
        const errorMessage = isNetworkError
          ? "Erreur réseau. Vérifiez votre connexion et réessayez."
          : err.response?.data?.message || err.message || "Échec de connexion. Vérifiez vos informations.";
        setError(errorMessage);
        showErrorAlert(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10 blur-3xl"
            style={{
              width: `${400 + i * 100}px`,
              height: `${400 + i * 100}px`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? "#6366f1" : "#8b5cf6"}, transparent)`,
              left: `${-10 + i * 40}%`,
              top: `${-20 + i * 30}%`,
            }}
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
        {/* Left Side - Branding & Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-white hidden lg:block"
        >
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold">KwimSoft</h1>
            </div>

            {/* Tagline */}
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Gérez votre
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                entreprise
              </span>
              <br />
              en toute simplicité
            </h2>

            <p className="text-lg text-gray-300 max-w-md">
              Solution ERP complète pour le transport et la logistique. 
              Optimisez vos opérations et gagnez en efficacité.
            </p>

            {/* Features */}
            <div className="space-y-3 pt-4">
              {[
                "Gestion de flotte en temps réel",
                "Suivi des expéditions",
                "Facturation automatisée",
                "Analyses et rapports avancés",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">KwimSoft</h1>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Se connecter</h2>
              <p className="text-gray-500">
                Bienvenue ! Connectez-vous à votre compte
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur ou Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    placeholder="Entrez votre nom d'utilisateur"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.username && formik.errors.username
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    {...formik.getFieldProps("username")}
                  />
                </div>
                {formik.touched.username && formik.errors.username && (
                  <p className="mt-1.5 text-sm text-red-600">{formik.errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    {...formik.getFieldProps("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">{formik.errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Nouveau sur KwimSoft ?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Créer une organisation →
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>© 2026 KwimSoft Inc.</span>
              <div className="flex items-center gap-4">
                <button className="hover:text-gray-700 transition-colors">Contact</button>
                <button className="hover:text-gray-700 transition-colors">Aide</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
