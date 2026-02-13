import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2, ArrowRight, Sparkles, Mail, Key, Layers,
  Building2, Users, BookOpen, Headphones, Star, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = (location.state as any) || {};
  const organization = state.organization;
  const selectedModules = state.selectedModules || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-200">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            {/* Confetti animation */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 80,
                  y: Math.sin((i * Math.PI * 2) / 8) * 80,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                style={{
                  background: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][i % 4],
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              KwimSoft!
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your organization <strong className="text-indigo-600">{organization?.name || "has been"}</strong> successfully created.
          </p>
          <p className="text-sm text-gray-500">
            Check your email for login credentials and next steps.
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We've sent a confirmation email with your login credentials and activation link.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sign In</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Use your credentials to access your dashboard and start configuring your workspace.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Trial</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enjoy 14 days of full access to all features. No credit card required.
            </p>
          </motion.div>
        </div>

        {/* Selected Modules */}
        {selectedModules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-8 mb-12"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                  Your Selected Modules ({selectedModules.length})
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  These modules are already activated and ready to use in your workspace.
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModules.map((modId: string) => (
                    <span
                      key={modId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-700 text-sm font-medium rounded-full border border-indigo-200 shadow-sm capitalize"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {modId.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 mb-12"
        >
          <h3 className="font-semibold text-gray-900 mb-6 text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            What's Next?
          </h3>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Activate Your Account",
                desc: "Click the activation link in your email to verify your account.",
                icon: Mail,
              },
              {
                step: "2",
                title: "Complete Your Profile",
                desc: "Add your company details, upload logo, and customize settings.",
                icon: Building2,
              },
              {
                step: "3",
                title: "Invite Your Team",
                desc: "Add team members and assign roles and permissions.",
                icon: Users,
              },
              {
                step: "4",
                title: "Explore & Learn",
                desc: "Watch our tutorials and read documentation to get started.",
                icon: BookOpen,
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <item.icon className="w-5 h-5 text-gray-400 shrink-0" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all"
          >
            Sign In to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 text-gray-700 font-semibold rounded-full transition-all"
          >
            Back to Home
          </button>
        </motion.div>

        {/* Support Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-gray-600">
            <Headphones className="w-4 h-4 text-indigo-600" />
            Need help?{" "}
            <button className="text-indigo-600 font-medium hover:underline">
              Contact our support team
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} KwimSoft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
