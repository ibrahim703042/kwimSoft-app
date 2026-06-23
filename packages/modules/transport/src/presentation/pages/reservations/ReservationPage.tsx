import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare } from "lucide-react";
import { cn } from "@kwim/shared-ui";
import { CrudTable } from "@kwim/core";
import { reservationApi } from "../../../application/transport.api";

const tabs = [
  { key: "effectuer", label: "Effectuer" },
  { key: "attente", label: "En attente" },
  { key: "annuler", label: "Annuler" },
] as const;

export default function ReservationPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("effectuer");

  const { data, isLoading } = useQuery({
    queryKey: ["reservations", activeTab],
    queryFn: () => reservationApi.list({ search: activeTab }),
  });

  const columns = [
    { accessorKey: "passengerName", header: "Passager" },
    { accessorKey: "tripNumber", header: "Voyage" },
    { accessorKey: "seatNumber", header: "Siège" },
    { accessorKey: "status", header: "Statut" },
  ];

  const rows = (data?.data ?? []) as Record<string, unknown>[];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Effectuer", count: 2, color: "text-green-600" },
          { label: "En attente", count: 5, color: "text-yellow-600" },
          { label: "Annuler", count: 10, color: "text-destructive" },
        ].map((card) => (
          <div key={card.label} className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
            <div className="bg-muted rounded-full p-2">
              <CheckSquare className={card.color} />
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">{card.count}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm rounded-md",
              activeTab === tab.key ? "bg-card border border-border font-medium" : "text-muted-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <CrudTable data={rows} columns={columns} isLoading={isLoading} />
      </div>
    </div>
  );
}
