import { Card, CardContent } from "../ui/card";

export interface ModuleDashboardStat {
  readonly title: string;
  readonly value: string | number;
}

export interface ModuleDashboardProps {
  readonly title: string;
  readonly description?: string;
  readonly welcomeTitle?: string;
  readonly welcomeMessage?: string;
  readonly stats?: ModuleDashboardStat[];
}

function StatCard({ title, value }: Readonly<ModuleDashboardStat>) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

const DEFAULT_STATS: ModuleDashboardStat[] = [
  { title: "Total", value: "0" },
  { title: "Actifs", value: "0" },
  { title: "En attente", value: "0" },
  { title: "Terminés", value: "0" },
];

export function ModuleDashboard({
  title,
  description,
  welcomeTitle,
  welcomeMessage,
  stats = DEFAULT_STATS,
}: ModuleDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {welcomeTitle ?? title}
          </h2>
          <p className="text-muted-foreground">
            {welcomeMessage ?? "Commencez à gérer vos données ici."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
