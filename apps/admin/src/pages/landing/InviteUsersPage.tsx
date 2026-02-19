import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Layers, User, Lock, Eye, EyeOff, Loader2, CheckCircle2,
  AlertCircle, Mail, Shield, ArrowRight, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_CONFIG } from "@/config";

/* ─────────────── Validation Schema ─────────────── */
const activationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ActivationFormData = z.infer<typeof activationSchema>;

/* ─────────────── Password Input ─────────────── */
function PasswordInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={cn(
          "w-full h-12 px-4 pr-12 rounded-xl border bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200",
          "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
          error ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200"
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
}

/* ─────────────── Main Invite Users Page ─────────────── */
export default function InviteUsersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [inviteData, setInviteData] = useState<{
    email: string;
    organizationName: string;
    organizationId: string;
    role?: string;
  } | null>(null);

  // Get params from URL
  const dbUuid = searchParams.get("db_uuid");
  const login = searchParams.get("login");
  const userSignature = searchParams.get("user_signature");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivationFormData>({
    resolver: zodResolver(activationSchema),
  });

  // Verify invitation token on mount
  useEffect(() => {
    const verifyInvitation = async () => {
      if (!dbUuid || !login || !userSignature) {
        setVerificationError("Invalid invitation link. Required parameters are missing.");
        setIsVerifying(false);
        return;
      }

      try {
        // Call API to verify the invitation
        const response = await axios.get(
          `${API_CONFIG.userManagement.baseUrl}/invite/verify`,
          {
            params: {
              db_uuid: dbUuid,
              login: decodeURIComponent(login),
              user_signature: userSignature,
            },
          }
        );

        if (response.data.valid) {
          setInviteData({
            email: decodeURIComponent(login),
            organizationName: response.data.organizationName || "Your Organization",
            organizationId: dbUuid,
            role: response.data.role,
          });
        } else {
          setVerificationError(response.data.message || "Invalid or expired invitation link.");
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Failed to verify invitation. The link may be invalid or expired.";
        setVerificationError(errorMsg);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyInvitation();
  }, [dbUuid, login, userSignature]);

  const onSubmit = async (data: ActivationFormData) => {
    if (!inviteData) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await axios.post(
        `${API_CONFIG.userManagement.baseUrl}/invite/activate`,
        {
          db_uuid: dbUuid,
          login: inviteData.email,
          user_signature: userSignature,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
        }
      );

      // Success! Store token and redirect to the organization's domain
      if (response.data.accessToken) {
        localStorage.setItem("access_token", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Mark as first login (show welcome page)
        localStorage.removeItem("welcome_completed");
        
        // Get the organization subdomain
        const orgSubdomain = response.data.subdomain || inviteData.organizationId;
        
        // Redirect to organization domain
        const protocol = window.location.protocol;
        const host = window.location.host;
        
        // If subdomain structure exists, redirect to it
        if (orgSubdomain && host.includes('.')) {
          const baseDomain = host.split('.').slice(-2).join('.');
          window.location.href = `${protocol}//${orgSubdomain}.${baseDomain}/welcome`;
        } else {
          // Otherwise just go to welcome page
          navigate("/welcome");
        }
      } else {
        throw new Error("Activation successful but no access token received");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to activate account. Please try again.";
      setSubmitError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicators
  const password = watch("password") || "";
  const passwordChecks = [
    { label: "8+ characters", test: password.length >= 8 },
    { label: "Uppercase letter", test: /[A-Z]/.test(password) },
    { label: "Number", test: /[0-9]/.test(password) },
    { label: "Special character", test: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Loading State */}
          {isVerifying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying invitation...</h2>
              <p className="text-sm text-gray-500">Please wait while we verify your invitation link</p>
            </motion.div>
          )}

          {/* Error State */}
          {!isVerifying && verificationError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid Invitation</h2>
              <p className="text-gray-600 mb-6">{verificationError}</p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Go to Home
              </button>
            </motion.div>
          )}

          {/* Success State - Show Activation Form */}
          {!isVerifying && !verificationError && inviteData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {inviteData.organizationName}
                  </span>
                </h1>
                <p className="text-gray-600">Complete your account setup to get started</p>
              </div>

              {/* Email Display */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{inviteData.email}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>
                {inviteData.role && (
                  <div className="mt-3 pt-3 border-t border-indigo-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-600">
                        Role: <span className="font-semibold text-indigo-700">{inviteData.role}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Activation Form */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className={cn(
                          "w-full h-12 px-4 rounded-xl border bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition-all",
                          "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                          errors.firstName ? "border-red-300" : "border-gray-200"
                        )}
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className={cn(
                          "w-full h-12 px-4 rounded-xl border bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition-all",
                          "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                          errors.lastName ? "border-red-300" : "border-gray-200"
                        )}
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      Create Password
                    </label>
                    <PasswordInput
                      placeholder="Create a strong password"
                      error={!!errors.password}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password.message}
                      </p>
                    )}
                    
                    {/* Password Strength Indicators */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {passwordChecks.map((check, i) => (
                        <span
                          key={i}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-full border transition-all",
                            check.test
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                              : "bg-gray-50 border-gray-200 text-gray-400"
                          )}
                        >
                          {check.test && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {check.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      Confirm Password
                    </label>
                    <PasswordInput
                      placeholder="Re-enter your password"
                      error={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-700">Activation failed</p>
                        <p className="text-xs text-red-600 mt-1">{submitError}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Activating Account...
                      </>
                    ) : (
                      <>
                        Activate Account & Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Terms */}
                  <p className="text-xs text-gray-400 text-center">
                    By activating your account, you agree to our{" "}
                    <button type="button" className="text-indigo-600 hover:underline">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button type="button" className="text-indigo-600 hover:underline">
                      Privacy Policy
                    </button>
                  </p>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} KwimSoft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
