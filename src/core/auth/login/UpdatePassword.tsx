import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FilledInput, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../store/useUserStore.tsx";
import bgImg from "@/assets/img/auth/expressway.png";
import { API_ROUTE_PASSWORD } from "@/config/index";
import "../../../styles/modules/login.css";

export default function UpdatePassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useUserStore();

    console.log("HHHHHHHHHHHHHHHH", user);


    const formik = useFormik({
        initialValues: {
            newPswd: "",
            confirmPswd: "",
            userId: user?.userID
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            try {
                await axios.post(`${API_ROUTE_PASSWORD}/user/update-pswd`, {
                    newPswd: values.newPswd,
                    confirmPswd: values.confirmPswd,
                    userId: user?.userID
                });
                logout();
                navigate("/login");
            } catch (err) {
                setError("Erreur lors de la mise à jour du mot de passe.");
            } finally {
                setLoading(false);
            }
        }
    });

    const { values } = formik
    console.log("INITIAL POUR ::::::", values);


    return (
        <div
            style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "auto",
            }}
        >
            <div className="flex justify-center items-center h-screen">
                <div className="w-[37%] 2xl:w-[30%] 2xl:py-14 py-5 mx-32 bg-[#514d4d3b] rounded-md border border-[#ffffff3d]">
                    <div className="flex justify-center py-4">
                        <h1 className="font-bold text-[#ffffff] text-2xl tracking-wide uppercase">Kwim Trans</h1>
                    </div>
                    <p className="font-semibold text-center text-[#ffffff] text-[1.2rem] m-0 p-0">
                        Changer le mot de passe
                    </p>

                    <form onSubmit={formik.handleSubmit} className="px-10 py-5">
                        <FormControl variant="filled" sx={{ width: "100%", color: "#ffffff" }}>
                            <InputLabel htmlFor="password" sx={{ color: "#ffffff", fontSize: "0.9rem" }}>
                                Nouveau mot de passe
                            </InputLabel>
                            <FilledInput
                                id="password"
                                placeholder=""
                                sx={{ color: "#ffffff" }}
                                type="password" {...formik.getFieldProps("newPswd")}
                            />
                        </FormControl>
                        {formik.touched.newPswd && formik.errors.newPswd && (
                            <p className="text-red-500 text-sm">{formik.errors.newPswd}</p>
                        )}

                        <div className="pt-5">
                            <FormControl variant="filled" sx={{ width: "100%", color: "#ffffff" }}>
                                <InputLabel htmlFor="password" sx={{ color: "#ffffff", fontSize: "0.9rem" }}>
                                    Confirmer le mot de passe
                                </InputLabel>
                                <FilledInput
                                    id="password"
                                    placeholder=""
                                    sx={{ color: "#ffffff" }}
                                    type="password" {...formik.getFieldProps("confirmPswd")}
                                />
                            </FormControl>
                            {formik.touched.confirmPswd && formik.errors.confirmPswd && (
                                <p className="text-red-500 text-sm">{formik.errors.confirmPswd}</p>
                            )}
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        <div className="w-full pt-5">
                            <Button type="submit" className="mt-4 w-full" disabled={loading}>
                                {loading ? "Mise à jour..." : "Mettre à jour"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-7 mx-10">
                        <hr className="border border-[#d6d6d6d6]" />
                    </div>

                    <div className="text-center pt-5">
                        <p className="text-[0.8rem] text-[#e9e9e9]">
                            Vous n'avez pas de compte ?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
