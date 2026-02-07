import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { userApi, roleApi } from "@/core/api";
import EnhancedTable from "./EnhancedTable";

interface UserFormValues {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    roles: string[];
}

interface UserItem {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: any[];
    status: string;
    isActive: boolean;
    createdAt: string;
}

// Validation schema
const userSchema = Yup.object({
    username: Yup.string().required("Le nom d'utilisateur est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    firstName: Yup.string().required("Le prénom est requis"),
    lastName: Yup.string().required("Le nom est requis"),
    password: Yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export default function User() {
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const queryClient = useQueryClient();

    // Fetch users
    const { data: usersData, isLoading: loadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await userApi.getAll();
            return response.data;
        },
    });

    // Fetch roles for the dropdown
    const { data: rolesData } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
            const response = await roleApi.getAll();
            return response.data;
        },
    });

    const users = usersData?.data || [];
    const roles = rolesData?.data || [];

    // Create/Update user mutation
    const mutation = useMutation({
        mutationFn: async (values: UserFormValues) => {
            if (editingUser) {
                return await userApi.update(editingUser._id, values);
            } else {
                return await userApi.create(values);
            }
        },
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: `L'utilisateur a été ${editingUser ? "modifié" : "créé"} avec succès.`,
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setOpen(false);
            setEditingUser(null);
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

    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return await userApi.delete(id);
        },
        onSuccess: () => {
            Swal.fire({
                title: "Supprimé!",
                text: "L'utilisateur a été supprimé avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Impossible de supprimer l'utilisateur.",
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });

    const formik = useFormik<UserFormValues>({
        initialValues: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            roles: [],
        },
        validationSchema: userSchema,
        onSubmit: async (values) => {
            // If editing, don't send password if it's empty
            const submitValues = { ...values };
            if (editingUser && !submitValues.password) {
                delete submitValues.password;
            }
            await mutation.mutateAsync(submitValues);
        },
    });

    useEffect(() => {
        if (editingUser) {
            formik.setValues({
                username: editingUser.username,
                email: editingUser.email,
                firstName: editingUser.firstName || "",
                lastName: editingUser.lastName || "",
                password: "",
                roles: editingUser.roles.map((r: any) => r._id || r),
            });
        } else {
            formik.resetForm();
        }
    }, [editingUser]);

    const handleEdit = (user: UserItem) => {
        setEditingUser(user);
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
        setEditingUser(null);
        formik.resetForm();
    };

    // Table columns
    const columns = [
        { id: "username", label: "Nom d'utilisateur" },
        { id: "email", label: "Email" },
        { id: "firstName", label: "Prénom" },
        { id: "lastName", label: "Nom" },
        { id: "roles", label: "Rôles", render: (row: UserItem) => row.roles.map((r: any) => r.name || r).join(", ") },
        { id: "status", label: "Statut" },
        {
            id: "actions",
            label: "Actions",
            render: (row: UserItem) => (
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
                        <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">Utilisateurs</p>
                    </div>
                </div>

                <div className="rounded-md my-4 p-2">
                    <div className="flex justify-end mb-3">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="sm" onClick={() => setEditingUser(null)}>
                                    <Plus color="white" />
                                    Ajouter un utilisateur
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <form onSubmit={formik.handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div>
                                            <Label>Nom d'utilisateur</Label>
                                            <Input
                                                name="username"
                                                value={formik.values.username}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.username && formik.errors.username && (
                                                <p className="text-red-500 text-sm">{formik.errors.username}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Email</Label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Prénom</Label>
                                            <Input
                                                name="firstName"
                                                value={formik.values.firstName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.firstName && formik.errors.firstName && (
                                                <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Nom</Label>
                                            <Input
                                                name="lastName"
                                                value={formik.values.lastName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.lastName && formik.errors.lastName && (
                                                <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Mot de passe {editingUser && "(laisser vide pour ne pas changer)"}</Label>
                                            <Input
                                                name="password"
                                                type="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.password && formik.errors.password && (
                                                <p className="text-red-500 text-sm">{formik.errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label>Rôles</Label>
                                            <Select
                                                value={formik.values.roles[0] || ""}
                                                onValueChange={(value) => formik.setFieldValue("roles", [value])}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un rôle..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {roles.map((role: any) => (
                                                            <SelectItem key={role._id} value={role._id}>
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
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

                    {loadingUsers ? (
                        <div className="text-center py-4">Chargement...</div>
                    ) : (
                        <EnhancedTable columns={columns} data={users} />
                    )}
                </div>
            </div>
        </div>
    );
}
