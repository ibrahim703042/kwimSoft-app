import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import './role.css'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { API_ROUTE_PASSWORD } from "../../../config";
import axios from "axios";
import { useUserData } from "../../hooks/useUserData";
import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";


const fetchUser = async (id) => {
    console.log("ID compagni", id);
    try {
        const { data } = await axios.get(`${API_ROUTE_PASSWORD}/group/subgroup?groupId=${id}`);
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw new Error("Impossible de récupérer les données du groupe.");
    }
};

const createUser = async (values) => {
    console.log("Values sender", values);
    const response = await axios.patch(
        `${API_ROUTE_PASSWORD}/drivers/staff-account/${values.userId}?groupId=${values.groupId}`
    );
    return response.data;
};

const fetchDriver = async () => {
    const { data } = await axios.get(`${API_ROUTE_PASSWORD}/drivers?company/67cfe955595f541695c1b99b`);
    return data;
};

const fetchUserGroup = async () => {
    const { data } = await axios.get(`${API_ROUTE_PASSWORD}/group/subgroup-members?subGroupId=7855de84-ee97-4f7f-98a3-0de7eb4fc473`);
    return data;
};

export default function User() {
    const { data } = useUserData();
    const [rows, setRows] = useState([]);
    const queryClient = useQueryClient();


    const { data: driverData } = useQuery({
        queryKey: ["drivers"],
        queryFn: fetchDriver,
    });

    const { data: userGroup } = useQuery({
        queryKey: ["group"],
        queryFn: fetchUserGroup,
    });

    console.log("USER PAR GROUP ", userGroup?.data);



    const driver = driverData?.data?.content || [];

    console.log("Driver<<<<<<<<<<<<<<<<", driver);


    const {
        data: responseData,
        isLoading: isLoadingData,
        error: errorData,
    } = useQuery({
        queryKey: ["users", data?.companyId?.keycloakGroupId],
        queryFn: () => fetchUser(data?.companyId?.keycloakGroupId),
        enabled: !!data?.companyId?.keycloakGroupId, // exécute la query seulement si l'id existe
    });

    // Utilise useEffect pour mettre à jour rows uniquement lorsque responseData change
    useEffect(() => {
        if (responseData?.data) {
            setRows(responseData.data);
        }
    }, [responseData]);

    console.log("Rows>>>>>>>>>>>", rows);

    const columns = [
        { id: "name", label: "Nom", numeric: false },
        // { id: "path", label: "Path", numeric: false },
    ];

    const idGroup = data?.companyId?.keycloakGroupId
    console.log("ID Trip>>>>>>>>>", idGroup);

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le group a été enregistré avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            queryClient.invalidateQueries(["users"]);
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Une erreur est survenue. Veuillez réessayer.",
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });


    const formik = useFormik({
        initialValues: {
            groupId: "",
            userId: ""
        },
        // validationSchema: seatSchema,
        onSubmit: async (values) => {
            console.log("Submitted values:", values);
            try {
                await mutation.mutateAsync(values);
            } catch (error) {
                console.error("Erreur lors de la soumission :", error);
            }
        },
    });

    const { values } = formik
    console.log("INITIALE VALUES>>>>>>>>>>", values);


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
                        <p className="bg-[#0F123F] inline-block text-white px-3 py-1 rounded text-[0.7rem]">User</p>
                    </div>
                </div>

                <div className="rounded-md my-4 p-2">


                    <div className="flex justify-between mb-3">
                        <div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="User Group ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="apple">User</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#0F123F] py-2 px-2 text-[0.8rem]" size="small">
                                        <Plus color="white" />
                                        Add section
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">

                                    <form onSubmit={formik.handleSubmit}>
                                        <DialogHeader>
                                            <DialogTitle>User Role</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid grid-cols-12">
                                            <div className='col-span-12 w-full'>
                                                <div className='mb-2'>
                                                    <Label className="block text-sm font-medium">User</Label>
                                                </div>
                                                <Select
                                                    onValueChange={(value) => formik.setFieldValue("userId", value)}
                                                    value={formik.values.userId}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {driver.map((countryItem) => (
                                                                <SelectItem key={countryItem._id} value={countryItem._id}>
                                                                    {countryItem.fullName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                            <div className='col-span-12 w-full'>
                                                <div className='my-3'>
                                                    <Label className="block text-sm font-medium">Group</Label>
                                                </div>
                                                <Select
                                                    onValueChange={(value) => formik.setFieldValue("groupId", value)}
                                                    value={formik.values.groupId}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Sélectionner..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {rows.map((countryItem) => (
                                                                <SelectItem key={countryItem.id} value={countryItem.id}>
                                                                    {countryItem.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>

                                            </div>
                                        </div>

                                        <div className="flex sm:justify-end mt-5">
                                            <Button type="submit" size="small" className="bg-[#0F123F] py-2 text-sm px-4 text-white">
                                                Enregistrer
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <OrderTable orders={orders} />
                </div>
            </div>
        </div>
    )
}
