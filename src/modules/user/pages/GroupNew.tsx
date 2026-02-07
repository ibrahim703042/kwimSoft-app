import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { groupApi } from "@/core/api";
import EnhancedTable from "./EnhancedTable";

interface GroupFormValues {
    name: string;
    description?: string;
}

interface GroupItem {
    _id: string;
    name: string;
    description?: string;
    memberCount?: number;
    createdAt: string;
}

const groupSchema = Yup.object({
    name: Yup.string().required("Le nom du groupe est requis"),
    description: Yup.string(),
});

export default function GroupNew() {
    const [open, setOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<GroupItem | null>(null);
    const queryClient = useQueryClient();

    // Fetch groups
    const { data: groupsData, isLoading: loadingGroups } = useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const response = await groupApi.getAll();
            return response.data;
        },
    });

    const groups = groupsData?.data || [];

    // Create/Update group mutation
    const mutation = useMutation({
        mutationFn: async (values: GroupFormValues) => {
            if (editingGroup) {
                return await groupApi.update(editingGroup._id, values);
            } else {
                return await groupApi.create(values);
            }
        },
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: `Le groupe a été ${editingGroup ? "modifié" : "créé"} avec succès.`,
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            setOpen(false);
            setEditingGroup(null);
            formik.resetForm();
        },
        onError: (error: any) => {
            Swal.fire({
                title: "Erreur!",
                text: error.response?.data?.message || "Une erreur est survenue.",
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });

    // Delete group mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await groupApi.delete(id);
        },
        onSuccess: () => {
            Swal.fire({
                title: "Supprimé!",
                text: "Le groupe a été supprimé avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Impossible de supprimer le groupe.",
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });

    const formik = useFormik<GroupFormValues>({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: groupSchema,
        onSubmit: async (values) => {
            await mutation.mutateAsync(values);
        },
    });

    useEffect(() => {
        if (editingGroup) {
            formik.setValues({
                name: editingGroup.name,
                description: editingGroup.description || "",
            });
        } else {
            formik.resetForm();
        }
    }, [editingGroup]);

    const handleEdit = (group: GroupItem) => {
        setEditingGroup(group);
        setOpen(true);
    };

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Cette action est irréversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, supprimer!",
            cancelButtonText: "Annuler",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditingGroup(null);
        formik.resetForm();
    };

    const columns = [
        { id: "name", label: "Nom" },
        { id: "description", label: "Description" },
        {
            id: "memberCount",
            label: "Membres",
            render: (row: GroupItem) => <span>{row.memberCount || 0}</span>,
        },
        {
            id: "actions",
            label: "Actions",
            render: (row: GroupItem) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(row)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(row._id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="bg-white py-2 px-3 h-full border rounded-md">
                <div>
                    <div className="bg-slate-100 p-1 rounded px-2 py-1">
                        <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Groupes</p>
                    </div>
                </div>

                <div className="rounded-md my-4 p-2">
                    <div className="flex justify-end mb-3">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditingGroup(null)}>
                                    <Plus color="white" />
                                    Ajouter un groupe
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <form onSubmit={formik.handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>{editingGroup ? "Modifier le groupe" : "Nouveau groupe"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div>
                                            <Label>Nom</Label>
                                            <Input
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <p className="text-red-500 text-sm">{formik.errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Description</Label>
                                            <Input
                                                name="description"
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                            Annuler
                                        </Button>
                                        <Button type="submit" className="bg-[#0F123F]" disabled={mutation.isPending}>
                                            {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {loadingGroups ? (
                        <div className="text-center py-4">Chargement...</div>
                    ) : (
                        <EnhancedTable columns={columns} data={groups} />
                    )}
                </div>
            </div>
        </div>
    );
}
