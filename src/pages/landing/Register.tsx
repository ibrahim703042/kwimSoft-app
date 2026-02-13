import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Building2, User, Mail, Lock, ChevronRight, ChevronLeft,
  Layers, Check, Loader2, Eye, EyeOff, Globe, Phone,
  MapPin, Briefcase, CheckCircle2, ArrowLeft, Sparkles,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_CONFIG } from "@/config";

/* ─────────────── Validation Schemas ─────────────── */
const orgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  code: z.string().min(2, "Organization code must be at least 2 characters").max(20, "Code must be 20 characters or less").regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens and underscores"),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
});

const adminSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must contain at least one uppercase letter").regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type OrgFormData = z.infer<typeof orgSchema>;
type AdminFormData = z.infer<typeof adminSchema>;

/* ─────────────── Step Indicator ─────────────── */
function StepIndicator({ currentStep, steps }: { currentStep: number; steps: { label: string; icon: React.ElementType }[] }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center relative">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isDone ? "#4f46e5" : isActive ? "#4f46e5" : "#e5e7eb",
                }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all z-10",
                  isDone || isActive ? "shadow-lg shadow-indigo-200" : ""
                )}
              >
                {isDone ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")} />
                )}
              </motion.div>
              <span className={cn(
                "text-xs mt-2 font-medium absolute -bottom-6 whitespace-nowrap",
                isActive ? "text-indigo-600" : isDone ? "text-indigo-500" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-16 sm:w-24 h-0.5 mx-2">
                <motion.div
                  className="h-full rounded-full"
                  animate={{
                    backgroundColor: isDone ? "#4f46e5" : "#e5e7eb",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────── Form Field Component ─────────────── */
function FormField({
  label,
  icon: Icon,
  error,
  children,
  optional,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 text-gray-400" />
        {label}
        {optional && <span className="text-gray-400 text-xs font-normal">(optional)</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── Input Component ─────────────── */
function Input({
  className,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(
        "w-full h-11 px-4 rounded-xl border bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200",
        "focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
        error ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200",
        className
      )}
      {...props}
    />
  );
}

/* ─────────────── Password Input ─────────────── */
function PasswordInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} error={error} className="pr-10" {...props} />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

/* ─────────────── Industries ─────────────── */
const industries = [
  "Transport & Logistics",
  "Manufacturing",
  "Retail & E-commerce",
  "Healthcare",
  "Education",
  "Financial Services",
  "Real Estate",
  "Technology",
  "Agriculture",
  "Other",
];

/* ─────────────── Main Register Page ─────────────── */
export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orgData, setOrgData] = useState<OrgFormData | null>(null);
  
  // Get selected modules from location state
  const selectedModules = (location.state as any)?.selectedModules || [];

  const steps = [
    { label: "Organization", icon: Building2 },
    { label: "Admin Account", icon: User },
    { label: "Confirmation", icon: CheckCircle2 },
  ];

  // Organization form
  const orgForm = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      website: "",
      industry: "",
    },
  });

  // Admin form
  const adminForm = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Auto-generate code from org name
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    orgForm.setValue("name", e.target.value);
    const code = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 20);
    if (!orgForm.getValues("code") || orgForm.getValues("code") === orgData?.code) {
      orgForm.setValue("code", code);
    }
  };

  const handleStepOrgSubmit = orgForm.handleSubmit((data) => {
    setOrgData(data);
    setStep(1);
  });

  const handleStepAdminSubmit = adminForm.handleSubmit(() => {
    setStep(2);
  });

  const handleFinalSubmit = async () => {
    if (!orgData) return;
    const adminData = adminForm.getValues();

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        name: orgData.name,
        code: orgData.code,
        address: orgData.address || undefined,
        city: orgData.city || undefined,
        country: orgData.country || undefined,
        phone: orgData.phone || undefined,
        website: orgData.website || undefined,
        industry: orgData.industry || undefined,
        selectedModules, // Include selected modules
        admin: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          username: adminData.username,
          password: adminData.password,
        },
      };

      await axios.post(
        `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.tenant}`,
        payload
      );

      // Success! Redirect to thank you page
      navigate("/thanks/trial", { state: { organization: orgData, selectedModules } });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="regGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#regGrid)" />
          </svg>
        </div>

        {/* Floating orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20 blur-3xl"
            style={{
              width: `${150 + i * 60}px`,
              height: `${150 + i * 60}px`,
              background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent)",
              left: `${10 + i * 20}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, 20 * (i % 2 === 0 ? 1 : -1), 0],
              x: [0, 15 * (i % 2 === 0 ? -1 : 1), 0],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Layers className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">KwimSoft</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start your digital<br />transformation today
          </h1>
          <p className="text-indigo-200 text-lg mb-12 leading-relaxed max-w-md">
            Create your organization and unlock the full power of a modular ERP 
            designed for modern businesses.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              "Free 14-day trial, no credit card required",
              `Access to ${selectedModules.length || "all"} selected modules`,
              "Dedicated onboarding support",
              "Data import assistance included",
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-indigo-100 text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => selectedModules.length > 0 ? navigate("/trial") : navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-medium hover:text-indigo-700"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-lg">
            {step < 3 && <StepIndicator currentStep={step} steps={steps} />}

            <AnimatePresence mode="wait" custom={step}>
              {/* ─── Step 0: Organization ─── */}
              {step === 0 && (
                <motion.div
                  key="org"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="text-center mb-8 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create your organization</h2>
                    <p className="text-sm text-gray-500 mt-2">Tell us about your company</p>
                  </div>

                  <form onSubmit={handleStepOrgSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <FormField label="Organization Name" icon={Building2} error={orgForm.formState.errors.name?.message}>
                          <Input
                            placeholder="e.g. Acme Corporation"
                            error={!!orgForm.formState.errors.name}
                            {...orgForm.register("name")}
                            onChange={handleOrgNameChange}
                          />
                        </FormField>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <FormField label="Organization Code" icon={Briefcase} error={orgForm.formState.errors.code?.message}>
                          <Input
                            placeholder="e.g. acme-corp"
                            error={!!orgForm.formState.errors.code}
                            {...orgForm.register("code")}
                          />
                        </FormField>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <FormField label="Industry" icon={Briefcase} optional>
                          <select
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            {...orgForm.register("industry")}
                          >
                            <option value="">Select industry</option>
                            {industries.map((ind) => (
                              <option key={ind} value={ind}>{ind}</option>
                            ))}
                          </select>
                        </FormField>
                      </div>
                      <div className="col-span-2">
                        <FormField label="Address" icon={MapPin} optional>
                          <Input placeholder="Street address" {...orgForm.register("address")} />
                        </FormField>
                      </div>
                      <FormField label="City" icon={MapPin} optional>
                        <Input placeholder="City" {...orgForm.register("city")} />
                      </FormField>
                      <FormField label="Country" icon={Globe} optional>
                        <Input placeholder="Country" {...orgForm.register("country")} />
                      </FormField>
                      <FormField label="Phone" icon={Phone} optional>
                        <Input placeholder="+243 ..." {...orgForm.register("phone")} />
                      </FormField>
                      <FormField label="Website" icon={Globe} optional>
                        <Input placeholder="https://..." {...orgForm.register("website")} />
                      </FormField>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ─── Step 1: Admin Account ─── */}
              {step === 1 && (
                <motion.div
                  key="admin"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="text-center mb-8 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create admin account</h2>
                    <p className="text-sm text-gray-500 mt-2">
                      This will be the administrator for <strong>{orgData?.name}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleStepAdminSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="First Name" icon={User} error={adminForm.formState.errors.firstName?.message}>
                        <Input
                          placeholder="John"
                          error={!!adminForm.formState.errors.firstName}
                          {...adminForm.register("firstName")}
                        />
                      </FormField>
                      <FormField label="Last Name" icon={User} error={adminForm.formState.errors.lastName?.message}>
                        <Input
                          placeholder="Doe"
                          error={!!adminForm.formState.errors.lastName}
                          {...adminForm.register("lastName")}
                        />
                      </FormField>
                      <div className="col-span-2">
                        <FormField label="Email" icon={Mail} error={adminForm.formState.errors.email?.message}>
                          <Input
                            type="email"
                            placeholder="john@acme.com"
                            error={!!adminForm.formState.errors.email}
                            {...adminForm.register("email")}
                          />
                        </FormField>
                      </div>
                      <div className="col-span-2">
                        <FormField label="Username" icon={User} error={adminForm.formState.errors.username?.message}>
                          <Input
                            placeholder="johndoe"
                            error={!!adminForm.formState.errors.username}
                            {...adminForm.register("username")}
                          />
                        </FormField>
                      </div>
                      <div className="col-span-2">
                        <FormField label="Password" icon={Lock} error={adminForm.formState.errors.password?.message}>
                          <PasswordInput
                            placeholder="Min. 8 characters"
                            error={!!adminForm.formState.errors.password}
                            {...adminForm.register("password")}
                          />
                        </FormField>
                      </div>
                      <div className="col-span-2">
                        <FormField label="Confirm Password" icon={Lock} error={adminForm.formState.errors.confirmPassword?.message}>
                          <PasswordInput
                            placeholder="Re-enter password"
                            error={!!adminForm.formState.errors.confirmPassword}
                            {...adminForm.register("confirmPassword")}
                          />
                        </FormField>
                      </div>
                    </div>

                    {/* Password strength hints */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "8+ chars", test: (p: string) => p.length >= 8 },
                        { label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
                        { label: "Number", test: (p: string) => /[0-9]/.test(p) },
                      ].map((hint) => {
                        const pass = hint.test(adminForm.watch("password") || "");
                        return (
                          <span
                            key={hint.label}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full border transition-all",
                              pass ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-gray-50 border-gray-200 text-gray-400"
                            )}
                          >
                            {pass && <Check className="w-3 h-3 inline mr-1" />}
                            {hint.label}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="h-12 px-6 border border-gray-200 rounded-xl text-gray-600 font-medium flex items-center gap-2 hover:bg-gray-50 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
                      >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ─── Step 2: Confirmation ─── */}
              {step === 2 && (
                <motion.div
                  key="confirm"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="text-center mb-8 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900">Review & confirm</h2>
                    <p className="text-sm text-gray-500 mt-2">Make sure everything looks correct</p>
                  </div>

                  <div className="space-y-6">
                    {/* Org summary */}
                    <div className="rounded-xl border border-gray-200 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        Organization
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-400">Name:</span> <span className="text-gray-700 font-medium">{orgData?.name}</span></div>
                        <div><span className="text-gray-400">Code:</span> <span className="text-gray-700 font-medium">{orgData?.code}</span></div>
                        {orgData?.industry && <div><span className="text-gray-400">Industry:</span> <span className="text-gray-700">{orgData.industry}</span></div>}
                        {orgData?.city && <div><span className="text-gray-400">City:</span> <span className="text-gray-700">{orgData.city}</span></div>}
                        {orgData?.country && <div><span className="text-gray-400">Country:</span> <span className="text-gray-700">{orgData.country}</span></div>}
                        {orgData?.phone && <div><span className="text-gray-400">Phone:</span> <span className="text-gray-700">{orgData.phone}</span></div>}
                      </div>
                    </div>

                    {/* Admin summary */}
                    <div className="rounded-xl border border-gray-200 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <User className="w-4 h-4 text-indigo-500" />
                        Admin Account
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-400">Name:</span> <span className="text-gray-700 font-medium">{adminForm.getValues("firstName")} {adminForm.getValues("lastName")}</span></div>
                        <div><span className="text-gray-400">Username:</span> <span className="text-gray-700 font-medium">{adminForm.getValues("username")}</span></div>
                        <div className="col-span-2"><span className="text-gray-400">Email:</span> <span className="text-gray-700">{adminForm.getValues("email")}</span></div>
                      </div>
                    </div>

                    {/* Selected modules */}
                    {selectedModules.length > 0 && (
                      <div className="rounded-xl border border-gray-200 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <Layers className="w-4 h-4 text-indigo-500" />
                          Selected Modules ({selectedModules.length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedModules.map((modId: string) => (
                            <span key={modId} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full capitalize">
                              {modId}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Plan info */}
                    <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-indigo-700">Free Trial - 14 Days</span>
                      </div>
                      <p className="text-xs text-indigo-500">
                        Full access to all modules. No credit card required. Cancel anytime.
                      </p>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-400 text-center">
                      By creating an account, you agree to our{" "}
                      <button className="text-indigo-600 hover:underline">Terms of Service</button>{" "}
                      and{" "}
                      <button className="text-indigo-600 hover:underline">Privacy Policy</button>.
                    </p>

                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-700">Registration failed</p>
                          <p className="text-xs text-red-500 mt-1">{submitError}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="h-12 px-6 border border-gray-200 rounded-xl text-gray-600 font-medium flex items-center gap-2 hover:bg-gray-50 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                        className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            Create Organization
                            <ChevronRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
