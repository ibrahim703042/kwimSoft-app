import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { transportScope } from "../../../constants"
import { Textarea } from "../../components/ui/textarea";

export default function StepOne({ formik, uploadImages }) {

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploading(true);
            await uploadImages([file], formik.setFieldValue);
            setUploading(false);
        }
    };

    const toggleSelection = (value) => {
        // Vérifie si la valeur est déjà dans le tableau, et si oui, la retire
        if (formik.values.transportScope.includes(value)) {
            formik.setFieldValue(
                "transportScope",
                formik.values.transportScope.filter((item) => item !== value)
            );
        } else {
            // Sinon, ajoute la valeur à la sélection
            formik.setFieldValue("transportScope", [...formik.values.transportScope, value]);
        }
    };

    return (
        <div>
            <h1 className="text-md font-medium mt-2">Information sur la compagnie</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Designation de la compagnie <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="name"
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.name}</p>
                    )}
                </div>

                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        NIF  <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="Doit contenir au moins 14 caracteres"
                        className="mt-1"
                        name="siret"
                        value={formik.values.siret}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.siret && formik.errors.siret && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.siret}</p>
                    )}
                </div>
                <div className="col-span-3">
                    <Label htmlFor="terms" className="font-normal">
                        Numéro de TVA <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="vatNumber"
                        value={formik.values.vatNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.vatNumber && formik.errors.vatNumber && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.vatNumber}</p>
                    )}
                </div>
                <div className="col-span-3">
                    <Label htmlFor="terms" className="font-normal">
                        RC <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="rcsNumber"
                        value={formik.values.rcsNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.rcsNumber && formik.errors.rcsNumber && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.rcsNumber}</p>
                    )}
                </div>
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Numéro de licence de transport <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="transportLicenseNumber"
                        value={formik.values.transportLicenseNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.transportLicenseNumber && formik.errors.transportLicenseNumber && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.transportLicenseNumber}</p>
                    )}

                </div>
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Zone de transport <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>

                    <div className="mt-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {formik.values.transportScope.length > 0 ? formik.values.transportScope.join(", ") : "Sélectionnez..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-2">
                                {transportScope.map((option) => (
                                    <div
                                        key={option.value}
                                        className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                                        onClick={() => toggleSelection(option.value)}
                                    >
                                        <Checkbox
                                            checked={formik.values.transportScope.includes(option.value)} 
                                        />
                                        {option.label}
                                    </div>
                                ))}
                            </PopoverContent>
                        </Popover>

                        {formik.touched.transportScope && formik.errors.transportScope && (
                            <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.transportScope}</p>
                        )}

                    </div>
                </div>

                <div className="col-span-6 mt-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Logo</Label>
                        <Input
                            id="logo"
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                        {uploading && <p className="text-sm text-gray-500">Upload en cours...</p>}
                    </div>
                </div>

                <div className="col-span-12">
                    <Label htmlFor="terms" className="font-normal">
                        Description
                    </Label>
                    <Textarea placeholder="Description."
                        style={{ height: "5px" }}
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

