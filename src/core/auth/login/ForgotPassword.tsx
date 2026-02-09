import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FilledInput, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import bgImg from "@/assets/img/auth/expressway.png";
import { API_ROUTE_PASSWORD } from "@/config/index";
import "../../../styles/modules/login.css";
import Swal from "sweetalert2";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState<"email" | "otp" | "reset">("email");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // Step 1: Request OTP
    const emailFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Email invalide")
                .required("L'email est requis"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            try {
                await axios.post(
                    `${API_ROUTE_PASSWORD}/forgot-password`,
                    { email: values.email }
                );

                Swal.fire({
                    title: "Succès!",
                    text: "Un code OTP a été envoyé à votre email.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                setEmail(values.email);
                setStep("otp");
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Erreur lors de l'envoi du code OTP.";
                setError(errorMessage);
                Swal.fire({
                    title: "Erreur!",
                    text: errorMessage,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } finally {
                setLoading(false);
            }
        },
    });

    // Step 2: Verify OTP
    const otpFormik = useFormik({
        initialValues: {
            otp: "",
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .length(6, "Le code OTP doit contenir 6 chiffres")
                .required("Le code OTP est requis"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            try {
                await axios.post(
                    `${API_ROUTE_PASSWORD}/verify-otp`,
                    {
                        email: email,
                        otp: values.otp
                    }
                );

                Swal.fire({
                    title: "Succès!",
                    text: "Code OTP vérifié. Vous pouvez maintenant réinitialiser votre mot de passe.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                setStep("reset");
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Code OTP invalide ou expiré.";
                setError(errorMessage);
                Swal.fire({
                    title: "Erreur!",
                    text: errorMessage,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } finally {
                setLoading(false);
            }
        },
    });

    // Step 3: Reset Password
    const resetFormik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(6, "Le mot de passe doit contenir au moins 6 caractères")
                .required("Le nouveau mot de passe est requis"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
                .required("Veuillez confirmer le mot de passe"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError("");
            try {
                await axios.post(
                    `${API_ROUTE_PASSWORD}/reset-password`,
                    {
                        email: email,
                        newPassword: values.newPassword,
                    }
                );

                Swal.fire({
                    title: "Succès!",
                    text: "Votre mot de passe a été réinitialisé avec succès.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/login");
                });
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe.";
                setError(errorMessage);
                Swal.fire({
                    title: "Erreur!",
                    text: errorMessage,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            } finally {
                setLoading(false);
            }
        },
    });

    const handleResendOTP = async () => {
        setLoading(true);
        setError("");
        try {
            await axios.post(
                `${API_ROUTE_PASSWORD}/forgot-password`,
                { email: email }
            );

            Swal.fire({
                title: "Succès!",
                text: "Un nouveau code OTP a été envoyé à votre email.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Erreur lors de l'envoi du code OTP.";
            setError(errorMessage);
            Swal.fire({
                title: "Erreur!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={bgImg} alt="Background" className="login-bg" />
            </div>
            <div className="login-right">
                <div className="login-form-container">
                    <div className="login-logo">
                        <h1 className="font-bold text-[#ffffff] text-2xl tracking-wide uppercase">Kwim Trans</h1>
                    </div>

                    <h2 className="login-title">
                        {step === "email" && "Mot de passe oublié"}
                        {step === "otp" && "Vérification OTP"}
                        {step === "reset" && "Réinitialiser le mot de passe"}
                    </h2>

                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Step 1: Email Input */}
                    {step === "email" && (
                        <form onSubmit={emailFormik.handleSubmit} className="login-form">
                            <p className="text-sm text-gray-600 mb-4">
                                Entrez votre adresse email pour recevoir un code de vérification.
                            </p>
                            <FormControl fullWidth variant="filled" className="mb-4">
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <FilledInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={emailFormik.values.email}
                                    onChange={emailFormik.handleChange}
                                    onBlur={emailFormik.handleBlur}
                                />
                                {emailFormik.touched.email && emailFormik.errors.email && (
                                    <p className="error-text">{emailFormik.errors.email}</p>
                                )}
                            </FormControl>

                            <Button
                                type="submit"
                                className="login-button w-full"
                                disabled={loading}
                            >
                                {loading ? "Envoi en cours..." : "Envoyer le code"}
                            </Button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Retour à la connexion
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === "otp" && (
                        <form onSubmit={otpFormik.handleSubmit} className="login-form">
                            <p className="text-sm text-gray-600 mb-4">
                                Un code de vérification a été envoyé à <strong>{email}</strong>
                            </p>
                            <FormControl fullWidth variant="filled" className="mb-4">
                                <InputLabel htmlFor="otp">Code OTP (6 chiffres)</InputLabel>
                                <FilledInput
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    inputProps={{ maxLength: 6 }}
                                    value={otpFormik.values.otp}
                                    onChange={otpFormik.handleChange}
                                    onBlur={otpFormik.handleBlur}
                                />
                                {otpFormik.touched.otp && otpFormik.errors.otp && (
                                    <p className="error-text">{otpFormik.errors.otp}</p>
                                )}
                            </FormControl>

                            <Button
                                type="submit"
                                className="login-button w-full"
                                disabled={loading}
                            >
                                {loading ? "Vérification..." : "Vérifier le code"}
                            </Button>

                            <div className="text-center mt-4 space-y-2">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-blue-600 hover:underline text-sm block w-full"
                                    disabled={loading}
                                >
                                    Renvoyer le code
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep("email")}
                                    className="text-gray-600 hover:underline text-sm"
                                >
                                    Changer l'email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === "reset" && (
                        <form onSubmit={resetFormik.handleSubmit} className="login-form">
                            <p className="text-sm text-gray-600 mb-4">
                                Créez un nouveau mot de passe pour votre compte.
                            </p>
                            <FormControl fullWidth variant="filled" className="mb-4">
                                <InputLabel htmlFor="newPassword">Nouveau mot de passe</InputLabel>
                                <FilledInput
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={resetFormik.values.newPassword}
                                    onChange={resetFormik.handleChange}
                                    onBlur={resetFormik.handleBlur}
                                />
                                {resetFormik.touched.newPassword && resetFormik.errors.newPassword && (
                                    <p className="error-text">{resetFormik.errors.newPassword}</p>
                                )}
                            </FormControl>

                            <FormControl fullWidth variant="filled" className="mb-4">
                                <InputLabel htmlFor="confirmPassword">Confirmer le mot de passe</InputLabel>
                                <FilledInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={resetFormik.values.confirmPassword}
                                    onChange={resetFormik.handleChange}
                                    onBlur={resetFormik.handleBlur}
                                />
                                {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
                                    <p className="error-text">{resetFormik.errors.confirmPassword}</p>
                                )}
                            </FormControl>

                            <Button
                                type="submit"
                                className="login-button w-full"
                                disabled={loading}
                            >
                                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
