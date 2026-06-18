import axios from "axios";
import { API_ROUTE_PASSWORD } from "../../../config";
import { useUserData } from "../../hooks/useUserData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./role.css";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { useFormik } from "formik";
import { notifyError, notifySuccess } from "@/lib/notify";
import OrderTable from "./OrderTable";

const fetchGroup = async (id: string) => {
    const { data } = await axios.get(`${API_ROUTE_PASSWORD}/group/subgroup?groupId=${id}`);
    return data;
};

const createGroup = async (values: { name: string }, idGroup: string) => {
    const response = await axios.post(
        `${API_ROUTE_PASSWORD}/group/create-subgroup/${idGroup}`,
        values
    );
    return response.data;
};


export default function Groupe() {
    const { data } = useUserData();
    const queryClient = useQueryClient();

    useQuery({
        queryKey: ["group", data?.companyId?.keycloakGroupId],
        queryFn: () => fetchGroup(data!.companyId!.keycloakGroupId as string),
        enabled: !!data?.companyId?.keycloakGroupId,
    });

    const idGroup = data?.companyId?.keycloakGroupId;

    const mutation = useMutation({
        mutationFn: (values: { name: string }) => createGroup(values, idGroup as string),
        onSuccess: () => {
            notifySuccess("Le groupe a été enregistré avec succès.");
            queryClient.invalidateQueries({ queryKey: ["group"] });
        },
        onError: () => {
            notifyError("Une erreur est survenue. Veuillez réessayer.");
        },
    });

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        onSubmit: async (values) => {
            try {
                await mutation.mutateAsync(values);
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });


    const orders = [
        { code: "PG234RUJM", priority: "Premium delivery", amount: 5, destination: "Siemoa, DIY", status: "Shipped" },
        { code: "F5234ERTM", priority: "Free Shipping", amount: 1, destination: "Kloten, Joburg", status: "Delivered" },
        { code: "PG299RUSX", priority: "Premium delivery", amount: 5, destination: "Bonrui, DIY", status: "Paid" },
    ];

    return (
        <div>
            <div className="bg-white py-2 px-3 h-full border rounded-md">
                <div>
                    <div className="bg-slate-100 p-1 rounded px-2 py-1">
                        <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">
                            Group
                        </p>
                    </div>
                </div>

                <div className="rounded-md my-4 p-2">
                    <div className="flex justify-end mb-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="small">
                                    <Plus color="white" />
                                    Add Group
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader />
                                <form onSubmit={formik.handleSubmit} className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <Label>Group</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex sm:justify-end">
                                        <Button type="submit" disabled={mutation.isPending} size="small" className="bg-[#0F123F] py-2 text-sm px-4 text-white">
                                            Enregistrer
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <OrderTable orders={orders} />
                </div>
            </div>
        </div>
    );
}
