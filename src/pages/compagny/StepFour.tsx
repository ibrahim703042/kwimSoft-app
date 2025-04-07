import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { API_ROUTE_UPLOAD } from "../../../config";
import { useState } from "react";


export default function StepFour({ formik, uploadPDF }) {

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setUploading(true);
            await uploadPDF(files, formik.setFieldValue, formik.values);
            setUploading(false);
        }
    };

    return (
        <div>
            <h1 className="text-md font-medium mt-0">Assurance et conformité</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Fournisseur d'assurance
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="insurance.provider"
                        value={formik.values.insurance.provider}
                        onChange={formik.handleChange}
                    />
                </div>
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Numéro de police d'assurance
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="insurance.policyNumber"
                        value={formik.values.insurance.policyNumber}
                        onChange={formik.handleChange}
                    />
                </div>
                <div className="col-span-4">
                    <Label htmlFor="terms" className="font-normal">
                        Couverture d'assurance
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="insurance.coverage"
                        value={formik.values.insurance.coverage}
                        onChange={formik.handleChange}
                    />
                </div>
                <div className="col-span-4">
                    <Label htmlFor="terms" className="font-normal">
                        Période
                    </Label>
                    <Input
                        type="date"
                        placeholder="ExpiryDate"
                        className="mt-1"
                        name="insurance.expiryDate"
                        value={formik.values.insurance.expiryDate ? new Date(formik.values.insurance.expiryDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            const dateValue = e.target.value;
                            const isoDate = new Date(dateValue).toISOString();
                            formik.setFieldValue('insurance.expiryDate', isoDate);
                        }}
                    />

                </div>
                <div className="col-span-4">
                    <Label htmlFor="picture" >Document</Label>
                    <div className="mt-1">
                        <Input
                            id="picture"
                            type="file"
                            name="insurance.documents"
                            accept=".pdf"
                            multiple
                            onChange={handleFileUpload} 
                        />

                        {uploading && <p className="text-sm text-gray-500">Upload en cours...</p>}

                    </div>
                    <ul className="mt-2 flex items-center gap-2">
                        {formik.values.documents?.map((file, index) => (
                            <li key={index} className="text-sm text-gray-600">
                                {file.name || file}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
