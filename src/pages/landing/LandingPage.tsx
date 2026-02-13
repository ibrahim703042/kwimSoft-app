import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Truck, Users, Package, BarChart3, Shield, Globe, Zap, ChevronRight,
  CheckCircle2, ArrowRight, Star, Menu, X, Play, Sparkles,
  Building2, Wrench, ShoppingCart, Factory, DollarSign, ClipboardList,
  Car, Boxes, UserCog, TrendingUp, Layers, MousePointerClick
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────── Animated Counter ─────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─────────────── Floating Orbs Background ─────────────── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: `${200 + i * 80}px`,
            height: `${200 + i * 80}px`,
            background: i % 2 === 0
              ? "radial-gradient(circle, #6366f1, transparent)"
              : "radial-gradient(circle, #06b6d4, transparent)",
            left: `${10 + i * 15}%`,
            top: `${5 + (i % 3) * 30}%`,
          }}
          animate={{
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 20 * (i % 2 === 0 ? -1 : 1), 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────── Grid Pattern Background ─────────────── */
function GridPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

/* ─────────────── Module Data ─────────────── */
const modules = [
  { icon: Truck, name: "Transport", desc: "Fleet management, routes, trips, ticketing & reservations", color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
  { icon: Users, name: "HR & People", desc: "Employee management, payroll, attendance & recruitment", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
  { icon: Package, name: "Inventory", desc: "Warehouse, stock movements, transfers & lot tracking", color: "from-amber-500 to-amber-600", bg: "bg-amber-50", text: "text-amber-600" },
  { icon: BarChart3, name: "Finance", desc: "Accounting, invoicing, payments & financial reports", color: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
  { icon: ShoppingCart, name: "Sales", desc: "Sales orders, quotations, customer management", color: "from-rose-500 to-rose-600", bg: "bg-rose-50", text: "text-rose-600" },
  { icon: ClipboardList, name: "Procurement", desc: "Purchase orders, vendor management & approvals", color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50", text: "text-cyan-600" },
  { icon: Factory, name: "Manufacturing", desc: "Production planning, BOM, work orders & quality", color: "from-orange-500 to-orange-600", bg: "bg-orange-50", text: "text-orange-600" },
  { icon: Car, name: "Carwash", desc: "Wash bay management, service orders & scheduling", color: "from-teal-500 to-teal-600", bg: "bg-teal-50", text: "text-teal-600" },
  { icon: Wrench, name: "Maintenance", desc: "Fleet maintenance, inspections & repair tracking", color: "from-red-500 to-red-600", bg: "bg-red-50", text: "text-red-600" },
  { icon: Boxes, name: "Products", desc: "Product catalog, categories, pricing & attributes", color: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50", text: "text-indigo-600" },
  { icon: UserCog, name: "CRM", desc: "Leads, pipeline, opportunities & customer insights", color: "from-pink-500 to-pink-600", bg: "bg-pink-50", text: "text-pink-600" },
  { icon: TrendingUp, name: "Reports", desc: "Business intelligence, dashboards & analytics", color: "from-violet-500 to-violet-600", bg: "bg-violet-50", text: "text-violet-600" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For small teams getting started",
    features: ["Up to 5 users", "2 modules included", "Basic reporting", "Email support", "1 GB storage"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing businesses",
    features: ["Up to 50 users", "All modules included", "Advanced analytics", "Priority support", "50 GB storage", "API access", "Custom roles"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: ["Unlimited users", "All modules + custom", "Dedicated support", "Unlimited storage", "On-premise option", "SLA guarantee", "White-label"],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Jean-Pierre Mukendi",
    role: "CEO, TransAfrica Logistics",
    content: "KwimSoft transformed our operations. We went from spreadsheets to a fully integrated system in weeks. Our efficiency increased by 40%.",
    rating: 5,
  },
  {
    name: "Marie Lukusa",
    role: "Operations Manager, Congo Express",
    content: "The transport module is incredible. Real-time tracking, automated scheduling, and the reporting gives us insights we never had before.",
    rating: 5,
  },
  {
    name: "David Kabongo",
    role: "CFO, Kinshasa Fleet Services",
    content: "Finally an ERP that understands African business. Multi-currency, multi-language, and the support team is outstanding.",
    rating: 5,
  },
];

/* ─────────────── Section Wrapper ─────────────── */
function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("relative py-24 px-4 sm:px-6 lg:px-8", className)}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

/* ─────────────── Puzzle Piece Card ─────────────── */
function ModuleCard({ mod, index }: { mod: typeof modules[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Puzzle connector visual - top */}
      {index < 4 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <div className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden h-full">
        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mod.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Icon */}
        <div className={`${mod.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <mod.icon className={`w-7 h-7 ${mod.text}`} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{mod.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{mod.desc}</p>

        {/* Arrow */}
        <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────── Main Landing Page ─────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);

  // Parallax values
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Progress Bar ─── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/80 border-b border-gray-100/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  KwimSoft
                </span>
              </div>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Desktop CTAs */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/trial")}
                  className="text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-5 py-2.5 rounded-full shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
                >
                  Start Free Trial
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 shadow-lg"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="block w-full text-left text-sm font-medium text-gray-600 py-2"
                  >
                    {link.label}
                  </button>
                ))}
                <hr className="my-2" />
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-left text-sm font-medium text-gray-700 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/trial")}
                  className="block w-full text-center text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 rounded-full"
                >
                  Start Free Trial
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero Section ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <FloatingOrbs />
        <GridPattern />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">New: AI-Powered Analytics</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <span className="text-gray-900">The ERP that</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  moves your
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  business forward
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-gray-500 max-w-lg leading-relaxed"
              >
                All-in-one modular ERP for transport, logistics, and enterprise management. 
                Connect every department in one beautiful, intelligent platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate("/trial")}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all text-base"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 text-gray-700 font-semibold rounded-full transition-all text-base">
                  <Play className="w-5 h-5 text-indigo-600" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">4.9/5 rating</span>
                </div>
                <div className="text-sm text-gray-400">|</div>
                <div className="text-sm text-gray-500">Trusted by 500+ companies</div>
              </motion.div>
            </div>

            {/* Right: Floating Module Cards */}
            <div className="relative hidden lg:block h-[600px]">
              {/* Central hub */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-300 flex items-center justify-center z-10"
              >
                <Layers className="w-12 h-12 text-white" />
              </motion.div>

              {/* Orbiting modules */}
              {[
                { icon: Truck, label: "Transport", x: 0, y: -180, color: "bg-blue-500", delay: 0.5 },
                { icon: Users, label: "HR", x: 170, y: -90, color: "bg-emerald-500", delay: 0.6 },
                { icon: Package, label: "Inventory", x: 170, y: 90, color: "bg-amber-500", delay: 0.7 },
                { icon: BarChart3, label: "Finance", x: 0, y: 180, color: "bg-purple-500", delay: 0.8 },
                { icon: ShoppingCart, label: "Sales", x: -170, y: 90, color: "bg-rose-500", delay: 0.9 },
                { icon: Factory, label: "Production", x: -170, y: -90, color: "bg-orange-500", delay: 1.0 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, x: item.x, y: item.y }}
                  transition={{ duration: 0.6, delay: item.delay, type: "spring", stiffness: 100 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-3 hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 pr-2">{item.label}</span>
                  </motion.div>
                </motion.div>
              ))}

              {/* Connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const cx = 300, cy = 300, r = 170;
                  const rad = (angle * Math.PI) / 180;
                  const x = cx + r * Math.sin(rad);
                  const y = cy - r * Math.cos(rad);
                  return (
                    <motion.line
                      key={i}
                      x1={cx} y1={cy} x2={x} y2={y}
                      stroke="url(#lineGrad)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs font-medium">Scroll to explore</span>
            <MousePointerClick className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="relative -mt-12 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: 500, suffix: "+", label: "Companies" },
              { value: 12, suffix: "", label: "Modules" },
              { value: 50, suffix: "K+", label: "Users" },
              { value: 99, suffix: "%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features Overview ─── */}
      <Section id="features" className="bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Why KwimSoft</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Everything you need,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              nothing you don't
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500"
          >
            A complete suite of business tools that work together seamlessly. 
            Pick what you need, add more as you grow.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Enterprise Security",
              desc: "Role-based access control, multi-tenant isolation, JWT authentication, and audit trails. Your data is always safe.",
              gradient: "from-indigo-500 to-blue-600",
            },
            {
              icon: Globe,
              title: "Multi-language & Currency",
              desc: "Built for global businesses. Support for multiple languages, currencies, and regional standards out of the box.",
              gradient: "from-purple-500 to-pink-600",
            },
            {
              icon: Zap,
              title: "Modular Architecture",
              desc: "Like puzzle pieces that fit perfectly together. Start with what you need, seamlessly add modules as you grow.",
              gradient: "from-cyan-500 to-teal-600",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── Modules (Puzzle Grid) ─── */}
      <Section id="modules" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-6"
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Modular Ecosystem</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            12 modules,{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              one platform
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500"
          >
            Every piece of the puzzle connects seamlessly. Choose your modules and build 
            the perfect system for your business.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.name} mod={mod} index={i} />
          ))}
        </div>
      </Section>

      {/* ─── How It Works ─── */}
      <Section className="bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Get started in{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-cyan-200" />

          {[
            {
              step: "01",
              title: "Create Organization",
              desc: "Sign up and register your organization in seconds. Set up your company profile and invite your team.",
              icon: Building2,
            },
            {
              step: "02",
              title: "Choose Modules",
              desc: "Select the modules your business needs. Start with essentials and expand anytime — it's your puzzle.",
              icon: Layers,
            },
            {
              step: "03",
              title: "Go Live",
              desc: "Import your data, configure workflows, and you're ready. Our onboarding team guides every step.",
              icon: Zap,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center relative"
            >
              {/* Step circle */}
              <div className="mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 flex items-center justify-center mb-8 relative z-10">
                <item.icon className="w-12 h-12 text-indigo-600" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── Pricing ─── */}
      <Section id="pricing" className="bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Simple Pricing</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Plans that{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              scale with you
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={cn(
                "relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg",
                plan.popular
                  ? "bg-gradient-to-b from-indigo-600 to-purple-700 border-indigo-500 text-white shadow-xl scale-105"
                  : "bg-white border-gray-200 hover:border-indigo-200"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-black text-xs font-bold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className={cn("text-lg font-semibold mb-2", plan.popular ? "text-white" : "text-gray-900")}>
                  {plan.name}
                </h3>
                <p className={cn("text-sm", plan.popular ? "text-indigo-200" : "text-gray-500")}>
                  {plan.description}
                </p>
              </div>
              <div className="mb-8">
                <span className={cn("text-4xl font-bold", plan.popular ? "text-white" : "text-gray-900")}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={cn("text-sm", plan.popular ? "text-indigo-200" : "text-gray-500")}>
                    {plan.period}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className={cn("w-5 h-5 shrink-0", plan.popular ? "text-indigo-200" : "text-indigo-500")} />
                    <span className={plan.popular ? "text-indigo-100" : "text-gray-600"}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/trial")}
                className={cn(
                  "w-full py-3 rounded-full font-semibold text-sm transition-all",
                  plan.popular
                    ? "bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-100"
                )}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── Testimonials ─── */}
      <Section id="testimonials" className="bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Loved by{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              businesses everywhere
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── CTA Section ─── */}
      <Section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <FloatingOrbs />
        <div className="relative text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-6"
          >
            Ready to transform your business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-indigo-200 mb-10 max-w-xl mx-auto"
          >
            Join 500+ companies already using KwimSoft. Start your free trial today —
            no credit card required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => navigate("/trial")}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-full shadow-xl hover:bg-indigo-50 transition-all text-base"
            >
              Start Free Trial
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-semibold rounded-full transition-all text-base">
              Talk to Sales
            </button>
          </motion.div>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">KwimSoft</span>
              </div>
              <p className="text-sm leading-relaxed">
                The modular ERP platform built for transport, logistics, and modern enterprises.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                {["Features", "Modules", "Pricing", "Integrations", "API Docs"].map((link) => (
                  <li key={link}>
                    <button className="hover:text-white transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                {["About Us", "Careers", "Blog", "Press Kit", "Contact"].map((link) => (
                  <li key={link}>
                    <button className="hover:text-white transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                {["Help Center", "Documentation", "Community", "Status Page", "Terms & Privacy"].map((link) => (
                  <li key={link}>
                    <button className="hover:text-white transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} KwimSoft. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
