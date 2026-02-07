import { Trash2, Monitor, Smartphone } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { userSessionApi } from "@/core/api";
import EnhancedTable from "./EnhancedTable";
import { format } from "date-fns";

interface SessionItem {
    _id: string;
    user: any;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
    lastActivityAt?: string;
}

export default function UserSessionNew() {
    const queryClient = useQueryClient();

    // Fetch sessions
    const { data: sessionsData, isLoading: loadingSessions } = useQuery({
        queryKey: ["user-sessions"],
        queryFn: async () => {
            const response = await userSessionApi.getAll();
            return response.data;
        },
    });

    const sessions = sessionsData?.data || [];

    // Invalidate session mutation
    const invalidateMutation = useMutation({
        mutationFn: async (id: string) => {
            return await userSessionApi.invalidate(id);
        },
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "La session a été invalidée avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries({ queryKey: ["user-sessions"] });
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Impossible d'invalider la session.",
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });

    const handleInvalidate = (id: string) => {
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Cette action déconnectera l'utilisateur!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, invalider!",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                invalidateMutation.mutate(id);
            }
        });
    };

    const getDeviceIcon = (userAgent?: string) => {
        if (!userAgent) return <Monitor className="h-4 w-4" />;
        const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
        return isMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />;
    };

    const columns = [
        {
            id: "user",
            label: "Utilisateur",
            render: (row: SessionItem) => (
                <div>
                    <p className="font-medium">{row.user?.username || "N/A"}</p>
                    <p className="text-xs text-gray-500">{row.user?.email || ""}</p>
                </div>
            ),
        },
        {
            id: "device",
            label: "Appareil",
            render: (row: SessionItem) => (
                <div className="flex items-center gap-2">
                    {getDeviceIcon(row.userAgent)}
                    <span className="text-sm">{row.ipAddress || "N/A"}</span>
                </div>
            ),
        },
        {
            id: "status",
            label: "Statut",
            render: (row: SessionItem) => (
                <span
                    className={`px-2 py-1 rounded text-xs ${
                        row.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {row.isActive ? "Active" : "Expirée"}
                </span>
            ),
        },
        {
            id: "lastActivity",
            label: "Dernière activité",
            render: (row: SessionItem) => (
                <span className="text-sm">
                    {row.lastActivityAt
                        ? format(new Date(row.lastActivityAt), "dd/MM/yyyy HH:mm")
                        : format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")}
                </span>
            ),
        },
        {
            id: "expiresAt",
            label: "Expire le",
            render: (row: SessionItem) => (
                <span className="text-sm">{format(new Date(row.expiresAt), "dd/MM/yyyy HH:mm")}</span>
            ),
        },
        {
            id: "actions",
            label: "Actions",
            render: (row: SessionItem) => (
                <div className="flex gap-2">
                    {row.isActive && (
                        <Button size="sm" variant="destructive" onClick={() => handleInvalidate(row._id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="bg-white py-2 px-3 h-full border rounded-md">
                <div>
                    <div className="bg-slate-100 p-1 rounded px-2 py-1">
                        <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Sessions utilisateur</p>
                    </div>
                </div>

                <div className="rounded-md my-4 p-2">
                    {loadingSessions ? (
                        <div className="text-center py-4">Chargement...</div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">Aucune session active</div>
                    ) : (
                        <EnhancedTable columns={columns} data={sessions} />
                    )}
                </div>
            </div>
        </div>
    );
}
