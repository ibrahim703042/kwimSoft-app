/**
 * HR Dashboard - Overview of HR metrics
 */
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  CalendarOff,
  Clock,
  Wallet,
  UserPlus,
  GraduationCap,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  href?: string;
}

function StatCard({ label, value, icon: Icon, color, href }: StatCardProps) {
  const content = (
    <div
      className="bg-white dark:bg-[#1a1f3b] rounded-xl border border-border/40 p-4 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={24} color={color} />
        </div>
      </div>
      {href && (
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center text-xs text-muted-foreground hover:text-foreground">
          Voir détails <ArrowRight size={12} className="ml-1" />
        </div>
      )}
    </div>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}

const stats = [
  { label: "Employés", icon: Users, color: "#0F123F", href: "/employees" },
  { label: "Départements", icon: Building2, color: "#3b82f6", href: "/organization" },
  { label: "Postes", icon: Briefcase, color: "#8b5cf6", href: "/organization?tab=positions" },
  { label: "Contrats actifs", icon: FileText, color: "#0F123F", href: "/employees?tab=contracts" },
  { label: "Congés en attente", icon: CalendarOff, color: "#f59e0b", href: "/attendance?tab=leave" },
  { label: "Présences aujourd'hui", icon: Clock, color: "#10b981", href: "/attendance" },
  { label: "Fiches de paie", icon: Wallet, color: "#06b6d4", href: "/payroll" },
  { label: "Notes de frais", icon: Receipt, color: "#f97316", href: "/payroll?tab=expenses" },
  { label: "Recrutements ouverts", icon: UserPlus, color: "#ec4899", href: "/recruitment" },
  { label: "Formations planifiées", icon: GraduationCap, color: "#6366f1", href: "/training" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tableau de bord RH</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vue d'ensemble des ressources humaines
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value="--"
            icon={stat.icon}
            color={stat.color}
            href={stat.href}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1a1f3b] rounded-xl border border-border/40 p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/employees"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
            >
              <Users size={16} className="text-primary" />
              Ajouter un employé
            </Link>
            <Link
              to="/attendance?tab=leave"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
            >
              <CalendarOff size={16} className="text-orange-500" />
              Gérer les congés
            </Link>
            <Link
              to="/payroll"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
            >
              <Wallet size={16} className="text-cyan-500" />
              Traiter la paie
            </Link>
            <Link
              to="/recruitment"
              className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
            >
              <UserPlus size={16} className="text-pink-500" />
              Nouveau recrutement
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1f3b] rounded-xl border border-border/40 p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Activité récente</h3>
          <div className="text-sm text-muted-foreground text-center py-8">
            Aucune activité récente à afficher
          </div>
        </div>
      </div>
    </div>
  );
}
