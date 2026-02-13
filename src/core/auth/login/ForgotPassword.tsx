import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ROUTE_PASSWORD } from "@/config/index";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, ArrowRight, ArrowLeft, Building2,
  CheckCircle2, AlertCircle, Loader2, KeyRound, RefreshCw
} from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Step 1: Request OTP
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email invalide")
        .required("L'email est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await axios.post(
          `${API_ROUTE_PASSWORD}/forgot-password`,
          { email: values.email }
        );

        Swal.fire({
          title: "Succès!",
          text: "Un code OTP a été envoyé à votre email.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6366f1",
        });

        setEmail(values.email);
        setStep("otp");
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erreur lors de l'envoi du code OTP.";
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
    },
  });

  // Step 2: Verify OTP
  const otpFormik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "Le code OTP doit contenir 6 chiffres")
        .required("Le code OTP est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await axios.post(
          `${API_ROUTE_PASSWORD}/verify-otp`,
          {
            email: email,
            otp: values.otp
          }
        );

        Swal.fire({
          title: "Succès!",
          text: "Code OTP vérifié. Vous pouvez maintenant réinitialiser votre mot de passe.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6366f1",
        });

        setStep("reset");
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Code OTP invalide ou expiré.";
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
    },
  });

  // Step 3: Reset Password
  const resetFormik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le nouveau mot de passe est requis"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
        .required("Veuillez confirmer le mot de passe"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await axios.post(
          `${API_ROUTE_PASSWORD}/reset-password`,
          {
            email: email,
            newPassword: values.newPassword,
          }
        );

        Swal.fire({
          title: "Succès!",
          text: "Votre mot de passe a été réinitialisé avec succès.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6366f1",
        }).then(() => {
          navigate("/login");
        });
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.";
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
    },
  });

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${API_ROUTE_PASSWORD}/forgot-password`,
        { email: email }
      );

      Swal.fire({
        title: "Succès!",
        text: "Un nouveau code OTP a été envoyé à votre email.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur lors de l'envoi du code OTP.";
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
  };

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
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">KwimSoft</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["email", "otp", "reset"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step === s
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : ["email", "otp", "reset"].indexOf(step) > i
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {["email", "otp", "reset"].indexOf(step) > i ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded-full transition-all ${
                      ["email", "otp", "reset"].indexOf(step) > i ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {step === "email" && "Mot de passe oublié"}
              {step === "otp" && "Vérification OTP"}
              {step === "reset" && "Nouveau mot de passe"}
            </h2>
            <p className="text-gray-500 text-sm">
              {step === "email" && "Entrez votre adresse email pour recevoir un code"}
              {step === "otp" && `Code envoyé à ${email}`}
              {step === "reset" && "Créez un nouveau mot de passe sécurisé"}
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

          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {step === "email" && (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={emailFormik.handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        emailFormik.touched.email && emailFormik.errors.email
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                      {...emailFormik.getFieldProps("email")}
                    />
                  </div>
                  {emailFormik.touched.email && emailFormik.errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{emailFormik.errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer le code
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </button>
              </motion.form>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={otpFormik.handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Code de vérification
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <KeyRound className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all text-center text-2xl font-mono tracking-widest ${
                        otpFormik.touched.otp && otpFormik.errors.otp
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                      {...otpFormik.getFieldProps("otp")}
                    />
                  </div>
                  {otpFormik.touched.otp && otpFormik.errors.otp && (
                    <p className="mt-1.5 text-sm text-red-600">{otpFormik.errors.otp}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      Vérifier le code
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full py-2.5 text-indigo-600 hover:text-indigo-700 font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Renvoyer le code
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Changer l'email
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset" && (
              <motion.form
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={resetFormik.handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="Min. 6 caractères"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        resetFormik.touched.newPassword && resetFormik.errors.newPassword
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                      {...resetFormik.getFieldProps("newPassword")}
                    />
                  </div>
                  {resetFormik.touched.newPassword && resetFormik.errors.newPassword && (
                    <p className="mt-1.5 text-sm text-red-600">{resetFormik.errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ressaisissez le mot de passe"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200 focus:ring-indigo-500"
                      }`}
                      {...resetFormik.getFieldProps("confirmPassword")}
                    />
                  </div>
                  {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600">{resetFormik.errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    <>
                      Réinitialiser
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            © 2026 KwimSoft Inc.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
