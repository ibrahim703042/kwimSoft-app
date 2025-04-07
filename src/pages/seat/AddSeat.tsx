import { CirclePlus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReusableDialogSteps from "../../component/utilitie/ReusableDialogSteps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { pleaseSeat, classSeat, placement } from "../../../constants";
import { API_ROUTE } from "../../../config";
import Swal from "sweetalert2";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";

// Schéma de validation avec Yup
const seatSchema = Yup.object({
    seatNumber: Yup.string().required("Seat number is required"),
    row: Yup.number().min(1).required("Row is required"),
    column: Yup.number().min(1).required("Column is required"),
    type: Yup.string().oneOf(["standard", "premium", "vip"]).required("Type is required"),
    available: Yup.boolean().required("Availability is required"),
    x: Yup.number().required("Position X is required"),
    y: Yup.number().required("Position Y is required"),
    bus: Yup.string().required("Bus ID is required"),
    placement: Yup.string().required("Placement is required"),
    features: Yup.array().of(Yup.string()).required("At least one feature is required"),
});

const fetchBus = async () => {
    const { data } = await axios.get(`${API_ROUTE}/buses`);
    return data;
};

const createSeat = async (values) => {
    const response = await axios.post(
        `${API_ROUTE}/seats`,
        values
    );
    return response.data;
};

export default function AddSeat() {

    const [openDialog, setOpenDialog] = useState(false);
    const queryClient = useQueryClient();

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["buses"],
        queryFn: fetchBus,
    });

    const bus = responseData?.data?.content || [];
    console.log("+++++++++++++++++++++", bus);

    const toggleSelection = (value) => {
        const newFeatures = formik.values.features.includes(value)
            ? formik.values.features.filter((feature) => feature !== value) // Retirer l'option
            : [...formik.values.features, value]; // Ajouter l'option

        formik.setFieldValue("features", newFeatures); // Mettre à jour le champ features de Formik
    };


    // Mutation React Query pour envoyer les données
    const mutation = useMutation({
        mutationFn: createSeat,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Le siège a été enregistré avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            setOpenDialog(false);
        },
        onError: () => {
            Swal.fire({
                title: "Erreur!",
                text: "Une erreur est survenue. Veuillez réessayer.",
                icon: "error",
                confirmButtonText: "OK",
            });
            setOpenDialog(false)
        },
    });

    // Initialisation de Formik
    const formik = useFormik({
        initialValues: {
            seatNumber: "",
            row: "",
            column: "",
            type: "",
            position: {
                x: "",
                y: ""
            },
            bus: "",
            features: [],
            placement: "",
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

    const { values } = formik;
    console.log("INIT::::::", values);

    return (
        <div>
            <ReusableDialogSteps
                triggerText={<><CirclePlus className="mr-2" /> Ajouter un siège</>}
                dialogTitle="Ajouter un siège"
                buttonDescr="Sauvegarder"
                onSubmit={formik.handleSubmit}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            >
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-12 gap-4">

                        <div className="col-span-6">
                            <Label className="block text-sm font-medium">Bus</Label>
                            <Select
                                onValueChange={(value) => formik.setFieldValue("bus", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un bus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {bus.map((countryItem) => (
                                            <SelectItem key={countryItem._id} value={countryItem._id}>
                                                {countryItem.modele}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {formik.touched.bus && formik.errors.bus && (
                                <div className="text-red-500 text-sm">{formik.errors.bus}</div>
                            )}
                        </div>

                        {/* Seat Number */}
                        <div className="col-span-6">
                            <Label className="block text-sm font-medium">Numéro de siège</Label>
                            <Input
                                type="text"
                                className="w-full border p-2 rounded"
                                {...formik.getFieldProps("seatNumber")}
                            />
                            {formik.touched.seatNumber && formik.errors.seatNumber && (
                                <div className="text-red-500 text-sm">{formik.errors.seatNumber}</div>
                            )}
                        </div>

                        <div className="col-span-4">
                            <Label className="block text-sm font-medium">Ligne</Label>
                            <Input
                                type="number"
                                className="w-full border p-2 rounded"
                                {...formik.getFieldProps("row")}
                            />
                            {formik.touched.row && formik.errors.row && (
                                <div className="text-red-500 text-sm">{formik.errors.row}</div>
                            )}
                        </div>
                        <div className="col-span-4">
                            <Label className="block text-sm font-medium">Colonne </Label>
                            <Input
                                type="number"
                                className="w-full border p-2 rounded"
                                {...formik.getFieldProps("column")}
                            />
                            {formik.touched.column && formik.errors.column && (
                                <div className="text-red-500 text-sm">{formik.errors.column}</div>
                            )}
                        </div>

                        {/* Type */}
                        <div className="col-span-4">
                            <Label className="block text-sm font-medium">Type de siège</Label>
                            <Select
                                onValueChange={(value) => formik.setFieldValue("type", value)}
                                value={formik.values.type}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {classSeat.map((countryItem) => (
                                            <SelectItem key={countryItem.value} value={countryItem.value}>
                                                {countryItem.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {formik.touched.type && formik.errors.type && (
                                <div className="text-red-500 text-sm">{formik.errors.type}</div>
                            )}
                        </div>

                        <div className="col-span-6">
                            <Label className="block text-sm font-medium">Position X</Label>
                            <Input
                                type="number"
                                className="w-full border p-2 rounded"
                                {...formik.getFieldProps("position.x")}
                            />
                            {formik.touched.position?.x && formik.errors.position?.x && (
                                <div className="text-red-500 text-sm">{formik.errors.position.x}</div>
                            )}
                        </div>
                        <div className="col-span-6">
                            <Label className="block text-sm font-medium">Position Y</Label>
                            <Input
                                type="number"
                                className="w-full border p-2 rounded"
                                {...formik.getFieldProps("position.y")}
                            />
                            {formik.touched.position?.y && formik.errors.position?.y && (
                                <div className="text-red-500 text-sm">{formik.errors.position.y}</div>
                            )}
                        </div>

                        {/* Features */}
                        <div className="col-span-6">
                            <Label className="block text-sm font-medium">Caractéristiques</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {formik.values.features.length > 0 ? formik.values.features.join(", ") : "Sélectionnez..."}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-2">
                                    {pleaseSeat.map((option) => (
                                        <div
                                            key={option.value}
                                            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                                            onClick={() => toggleSelection(option.value)} // Cette fonction gère la sélection/désélection des options
                                        >
                                            <Checkbox
                                                checked={formik.values.features.includes(option.value)} // Vérifie si l'option est dans la sélection
                                            />
                                            {option.label}
                                        </div>
                                    ))}
                                </PopoverContent>
                            </Popover>
                            {formik.touched.features && formik.errors.features && (
                                <div className="text-red-500 text-sm">{formik.errors.features}</div>
                            )}
                        </div>


                        <div className="col-span-6">
                            <Label className="block text-sm font-medium">Placement</Label>
                            <Select
                                onValueChange={(value) => formik.setFieldValue("placement", value)}
                                value={formik.values.placement}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {placement.map((countryItem) => (
                                            <SelectItem key={countryItem.value} value={countryItem.value}>
                                                {countryItem.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {formik.touched.placement && formik.errors.placement && (
                                <div className="text-red-500 text-sm">{formik.errors.placement}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="col-span-12 flex justify-end">
                            <Button type="submit" disabled={mutation.isLoading}>
                                {mutation.isLoading ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </div>
                    </div>
                </form>
            </ReusableDialogSteps>
        </div>
    );
}
