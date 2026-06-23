import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG } from "@kwim/config";
import { apiClient } from "@kwim/api-client";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@kwim/shared-ui";
import { JOURS } from "../../../domain/transport.constants";
import { CrudTable } from "@kwim/core";

const TRANSPORT_BASE = API_CONFIG.transport.baseUrl;

async function fetchSchedules(dayWeek: string) {
  const url = dayWeek
    ? `${TRANSPORT_BASE}/timetables?dayOfWeek=${dayWeek}`
    : `${TRANSPORT_BASE}/timetables/company/67bc9002f682d26a7f7a9200`;
  const response = await apiClient.get(url);
  const data = response.data as { data?: { content?: unknown[] }; content?: unknown[] };
  return { data: data?.data?.content ?? data?.content ?? [] };
}

export default function SchedulesPage() {
  const [dayWeek, setDayWeek] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["schedules", dayWeek],
    queryFn: () => fetchSchedules(dayWeek),
  });

  const columns = [
    { accessorKey: "dayOfWeek", header: "Jour" },
    { accessorKey: "departureTime", header: "Départ" },
    { accessorKey: "arrivalTime", header: "Arrivée" },
    { accessorKey: "status", header: "Statut" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={dayWeek || "all"} onValueChange={(v) => setDayWeek(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par jour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les jours</SelectItem>
            {JOURS.map((j) => (
              <SelectItem key={j.value} value={j.value}>{j.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => setDayWeek("")}>
          Réinitialiser
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <CrudTable
          data={(data?.data ?? []) as Record<string, unknown>[]}
          columns={columns}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
