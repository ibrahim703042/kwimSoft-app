import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useState } from "react";


export default function Stepthree({ formik }) {

    const [selected, setSelected] = useState([]);


    return (
        <div>
            <h1 className="text-md font-medium mt-0">Contact de la compagnie</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Email <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="email"
                        placeholder="Exemple@gmail.com"
                        className="mt-1"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.email}</p>
                    )}
                </div>
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Téléphone <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="+ *** *** ***"
                        className="mt-1"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.phone}</p>
                    )}
                </div>
                <div className="col-span-12">
                    <Label htmlFor="terms" className="font-normal">
                        Web site
                    </Label>
                    <Input
                        type="text"
                        placeholder="www.exemple.com"
                        className="mt-1"
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.website && formik.errors.website && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.website}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
