import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../store/useUserStore.tsx";
import { API_ROUTE_PASSWORD } from "@/config/index";
import { motion } from "framer-motion";
import {
  Lock, Eye, EyeOff, Building2, AlertCircle,
  Loader2, CheckCircle2, Shield
} from "lucide-react";
import Swal from "sweetalert2";

export default function UpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUserStore();

  const formik = useFormik({
    initialValues: {
      newPswd: "",
      confirmPswd: "",
      userId: user?.userID
    },
    validationSchema: Yup.object({
      newPswd: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le nouveau mot de passe est requis"),
      confirmPswd: Yup.string()
        .oneOf([Yup.ref("newPswd")], "Les mots de passe ne correspondent pas")
        .required("Veuillez confirmer le mot de passe"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await axios.post(`${API_ROUTE_PASSWORD}/user/update-pswd`, {
          newPswd: values.newPswd,
          confirmPswd: values.confirmPswd,
          userId: user?.userID
        });

        Swal.fire({
          title: "Succès!",
          text: "Votre mot de passe a été mis à jour. Veuillez vous reconnecter.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6366f1",
        }).then(() => {
          logout();
          navigate("/login");
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erreur lors de la mise à jour du mot de passe.";
        setError(errorMessage);
        Swal.fire({
          title: "Erreur!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    }
  });

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 25, label: "Faible", color: "bg-red-500" };
    if (password.length < 8) return { strength: 50, label: "Moyen", color: "bg-yellow-500" };
    if (password.length < 12) return { strength: 75, label: "Bon", color: "bg-blue-500" };
    return { strength: 100, label: "Excellent", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formik.values.newPswd);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">KwimSoft</h1>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">Mise à jour sécurisée</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Changer le mot de passe
            </h2>
            <p className="text-gray-500 text-sm">
              Créez un nouveau mot de passe pour votre compte
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
            {/* New Password Field */}
            <div>
              <label htmlFor="newPswd" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="newPswd"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Minimum 6 caractères"
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.newPswd && formik.errors.newPswd
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-indigo-500"
                  }`}
                  {...formik.getFieldProps("newPswd")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formik.values.newPswd && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Force du mot de passe</span>
                    <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength.strength}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${passwordStrength.color} rounded-full`}
                    />
                  </div>
                </div>
              )}

              {formik.touched.newPswd && formik.errors.newPswd && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.newPswd}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPswd" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="confirmPswd"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ressaisissez le mot de passe"
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.confirmPswd && formik.errors.confirmPswd
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 focus:ring-indigo-500"
                  }`}
                  {...formik.getFieldProps("confirmPswd")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Match Indicator */}
              {formik.values.confirmPswd && !formik.errors.confirmPswd && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 flex items-center gap-2 text-sm text-green-600"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Les mots de passe correspondent</span>
                </motion.div>
              )}

              {formik.touched.confirmPswd && formik.errors.confirmPswd && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.confirmPswd}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700">
                💡 <strong>Conseil:</strong> Utilisez un mot de passe fort avec au moins 8 caractères, 
                incluant des lettres, des chiffres et des symboles.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  Mettre à jour le mot de passe
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Annuler
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">Note de sécurité</p>
                <p>
                  Après la mise à jour, vous serez déconnecté et devrez vous reconnecter 
                  avec votre nouveau mot de passe.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            © 2026 KwimSoft Inc.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
