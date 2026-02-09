import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { roleApi, permissionApi } from "@/core/api";
import EnhancedTable from "../EnhancedTable";
import { Checkbox } from "@/components/ui/checkbox";

interface RoleFormValues {
    name: string;
    description?: string;
    permissions: string[];
}

interface RoleItem {
    _id: string;
    name: string;
    description?: string;
    permissions: string[];
    createdAt: string;
}

const roleSchema = Yup.object({
    name: Yup.string().required("Le nom du rôle est requis"),
    description: Yup.string(),
});

export default function RoleNew() {
    const [open, setOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
    const queryClient = useQueryClient();

    // Fetch roles
    const { data: rolesData, isLoading: loadingRoles } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const response = await roleApi.getAll();
            return response.data;
        },
    });

    // Fetch available permissions
    const { data: permissionsData } = useQuery({
        queryKey: ["permissions"],
        queryFn: async () => {
            const response = await permissionApi.getAll();
            return response.data;
        },
    });

    const roles = rolesData?.data || [];
    const availablePermissions = permissionsData?.data || [];

    // Create/Update role mutation
    const mutation = useMutation({
        mutationFn: async (values: RoleFormValues) => {
            if (editingRole) {
                return await roleApi.update(editingRole._id, values);
            } else {
                return await roleApi.create(values);
            }
        },
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: `Le rôle a été ${editingRole ? "modifié" : "créé"} avec succès.`,
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            setOpen(false);
            setEditingRole(null);
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

    // Delete role mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await roleApi.delete(id);
        },
        onSuccess: () => {
            Swal.fire({
                title: "Supprimé!",
                text: "Le rôle a été supprimé avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Impossible de supprimer le rôle.",
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });

    const formik = useFormik<RoleFormValues>({
        initialValues: {
            name: "",
            description: "",
            permissions: [],
        },
        validationSchema: roleSchema,
        onSubmit: async (values) => {
            await mutation.mutateAsync(values);
        },
    });

    useEffect(() => {
        if (editingRole) {
            formik.setValues({
                name: editingRole.name,
                description: editingRole.description || "",
                permissions: editingRole.permissions || [],
            });
        } else {
            formik.resetForm();
        }
    }, [editingRole]);

    const handleEdit = (role: RoleItem) => {
        setEditingRole(role);
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
        setEditingRole(null);
        formik.resetForm();
    };

    const togglePermission = (permission: string) => {
        const currentPermissions = formik.values.permissions;
        if (currentPermissions.includes(permission)) {
            formik.setFieldValue(
                "permissions",
                currentPermissions.filter((p) => p !== permission)
            );
        } else {
            formik.setFieldValue("permissions", [...currentPermissions, permission]);
        }
    };

    const columns = [
        { id: "name", label: "Nom" },
        { id: "description", label: "Description" },
        {
            id: "permissions",
            label: "Permissions",
            render: (row: RoleItem) => (
                <span className="text-sm">{row.permissions.length} permission(s)</span>
            ),
        },
        {
            id: "actions",
            label: "Actions",
            render: (row: RoleItem) => (
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
                        <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Rôles</p>
                    </div>
                </div>

                <div className="rounded-md my-4 p-2">
                    <div className="flex justify-end mb-3">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditingRole(null)}>
                                    <Plus color="white" />
                                    Ajouter un rôle
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                                <form onSubmit={formik.handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>{editingRole ? "Modifier le rôle" : "Nouveau rôle"}</DialogTitle>
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

                                        <div>
                                            <Label className="mb-2 block">Permissions</Label>
                                            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                                                {availablePermissions.map((permission: any) => (
                                                    <div key={permission.code} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={permission.code}
                                                            checked={formik.values.permissions.includes(permission.code)}
                                                            onCheckedChange={() => togglePermission(permission.code)}
                                                        />
                                                        <label htmlFor={permission.code} className="text-sm cursor-pointer">
                                                            {permission.name} ({permission.code})
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
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

                    {loadingRoles ? (
                        <div className="text-center py-4">Chargement...</div>
                    ) : (
                        <EnhancedTable columns={columns} data={roles} />
                    )}
                </div>
            </div>
        </div>
    );
}
