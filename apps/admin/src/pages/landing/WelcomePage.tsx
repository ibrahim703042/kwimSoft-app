import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/auth";
import {
  Rocket, CheckCircle2, ArrowRight, Sparkles, Users, Building2,
  Settings, Layers, Upload, UserPlus, Palette, Globe, Zap,
  Target, TrendingUp, Shield, Play, X, ChevronRight, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────── Quick Action Card ─────────────── */
function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  index,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  index: number;
  gradient: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-gray-100 p-6 text-left hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </motion.button>
  );
}

/* ─────────────── Progress Step ─────────────── */
function ProgressStep({
  step,
  title,
  description,
  completed,
  index,
}: {
  step: string;
  title: string;
  description: string;
  completed: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="flex items-start gap-4"
    >
      <motion.div
        animate={{
          scale: completed ? 1 : [1, 1.1, 1],
          backgroundColor: completed ? "#10b981" : "#e5e7eb",
        }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
      >
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-white" />
        ) : (
          <span className="text-sm font-bold text-gray-600">{step}</span>
        )}
      </motion.div>
      <div className="flex-1 pt-1">
        <h4 className={cn("font-medium mb-1", completed ? "text-gray-500 line-through" : "text-gray-900")}>
          {title}
        </h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────── Main Welcome Page ─────────────── */
export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showVideo, setShowVideo] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const firstName = user?.firstName || user?.username || "there";
  const organizationName = user?.tenantCode || "KwimSoft";

  useEffect(() => {
    // Show confetti animation on mount
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const quickActions = [
    {
      icon: Users,
      title: "Invite Your Team",
      description: "Add team members and assign roles to get everyone on board",
      onClick: () => navigate("/settings/users"),
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Building2,
      title: "Complete Company Profile",
      description: "Add your company details, logo, and contact information",
      onClick: () => navigate("/settings/organization"),
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Upload,
      title: "Import Your Data",
      description: "Upload existing data from spreadsheets or other systems",
      onClick: () => navigate("/settings/import"),
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Palette,
      title: "Customize Appearance",
      description: "Set up your branding, theme colors, and preferences",
      onClick: () => navigate("/settings/appearance"),
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: Settings,
      title: "Configure Modules",
      description: "Set up workflows, permissions, and module-specific settings",
      onClick: () => navigate("/settings/modules"),
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: Globe,
      title: "Explore Dashboard",
      description: "Get familiar with your new workspace and tools",
      onClick: () => navigate("/console"),
      gradient: "from-cyan-500 to-teal-600",
    },
  ];

  const setupSteps = [
    { title: "Create organization", description: "Set up your company workspace", completed: true },
    { title: "Add company details", description: "Complete your business profile", completed: false },
    { title: "Invite team members", description: "Get your team on board", completed: false },
    { title: "Configure modules", description: "Set up your first workflows", completed: false },
    { title: "Import data", description: "Bring in your existing data", completed: false },
  ];

  const handleSkip = () => {
    // Mark welcome as complete and go to dashboard
    localStorage.setItem("welcome_completed", "true");
    navigate("/console");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10 blur-3xl"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? "#6366f1" : "#8b5cf6"}, transparent)`,
              left: `${10 + i * 20}%`,
              top: `${-10 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, 30, 0],
              x: [0, 20 * (i % 2 === 0 ? 1 : -1), 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                scale: [0, 1, 1, 0.8],
                rotate: Math.random() * 720 - 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: "easeIn",
              }}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                background: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 hover:border-gray-300 transition-all"
        >
          Skip tour
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-300 mb-6"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
          >
            Welcome, {firstName}! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 mb-2"
          >
            Your organization <span className="font-semibold text-indigo-600">{organizationName}</span> is ready
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700 mt-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>14-day free trial active</span>
          </motion.div>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Quick Actions (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-indigo-600" />
                  Quick Start
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                  <QuickActionCard key={action.title} {...action} index={i} />
                ))}
              </div>
            </motion.div>

            {/* Video & Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative"
            >
              {/* Floating orbs */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full blur-2xl"
                    style={{
                      width: `${150 + i * 50}px`,
                      height: `${150 + i * 50}px`,
                      background: "radial-gradient(circle, rgba(255,255,255,0.5), transparent)",
                      left: `${i * 30}%`,
                      top: `${i * 20}%`,
                    }}
                    animate={{
                      y: [0, 20, 0],
                      x: [0, 15, 0],
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 flex items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Play className="w-6 h-6" />
                    Get Started in 5 Minutes
                  </h3>
                  <p className="text-indigo-200 mb-6">
                    Watch our quick tour to discover the key features and get the most out of KwimSoft
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowVideo(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-indigo-50 transition-all shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                      Watch Video Tour
                    </button>
                    <button
                      onClick={() => navigate("/help/documentation")}
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 hover:border-white/60 text-white font-medium rounded-full transition-all"
                    >
                      Read Documentation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Setup Progress */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Setup Progress</h3>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.round((completedSteps.length / setupSteps.length) * 100)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedSteps.length / setupSteps.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                />
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {setupSteps.map((step, i) => (
                  <ProgressStep
                    key={i}
                    step={(i + 1).toString()}
                    {...step}
                    completed={step.completed || completedSteps.includes(i)}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>

            {/* Help Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Our team is here to help you succeed
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/help/support")}
                  className="w-full text-left px-4 py-2.5 bg-white hover:bg-gray-50 rounded-lg text-sm text-gray-700 font-medium transition-colors border border-gray-200"
                >
                  💬 Chat with Support
                </button>
                <button
                  onClick={() => navigate("/help/schedule-demo")}
                  className="w-full text-left px-4 py-2.5 bg-white hover:bg-gray-50 rounded-lg text-sm text-gray-700 font-medium transition-colors border border-gray-200"
                >
                  📅 Schedule Onboarding Call
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            What You Can Do With KwimSoft
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "Track Performance", desc: "Real-time analytics and insights" },
              { icon: Users, title: "Collaborate", desc: "Work together seamlessly" },
              { icon: Shield, title: "Stay Secure", desc: "Enterprise-grade security" },
              { icon: Layers, title: "Scale Easily", desc: "Grow without limitations" },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate("/console")}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all"
          >
            Go to Dashboard
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                {/* Replace with actual video embed */}
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Video tour coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">Add your video embed URL here</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
