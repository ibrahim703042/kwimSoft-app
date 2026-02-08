import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FilledInput, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth.store";
import waangulogo from "@/assets/img/img/waangulogo.png";
import bgImg from "@/assets/img/img/busbge.jpg";
import { API_CONFIG } from "@/config/index";
import { jwtDecode } from "jwt-decode";
import "@/styles/modules/login.css";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      username: "kwim274651",
      password: "KwimSoft@2026",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Le nom d'utilisateur est requis"),
      password: Yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Le mot de passe est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        // Call the backend authentication API
        const loginUrl = `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}/login`;
        console.log("Calling login API:", loginUrl);
        
        const response = await axios.post(loginUrl, values);
        console.log("Login response:", response.data);
        
        if (!response?.data) {
          throw new Error("Données de réponse invalides.");
        }

        const { accessToken, refreshToken, user: userData } = response.data;

        // Verify we have a valid access token
        if (!accessToken || typeof accessToken !== "string") {
          throw new Error("Token non valide ou absent.");
        }

        // Decode the JWT token
        let decodedToken: any = null;
        try {
          decodedToken = jwtDecode(accessToken);
        } catch (decodeError) {
          console.error("Erreur lors du décodage du token:", decodeError);
          throw new Error("Échec du décodage du token.");
        }

        // Create user object with full data from backend
        const user = {
          id: userData._id || decodedToken.sub,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          tenantId: userData.tenantId,
          tenantCode: userData.tenantCode,
          roles: userData.roles || [],
          permissions: userData.permissions || [],
          avatar: userData.avatar,
          isEmailVerified: userData.isEmailVerified,
          status: userData.status,
          accessToken,
          refreshToken,
        };

        console.log("User object created:", user);

        // Store tokens separately
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        // Store user in auth store and localStorage
        setUser(user);

        // Navigate to home
        navigate("/");
      } catch (err: any) {
        console.error("Erreur de connexion :", err);
        const errorMessage = err.response?.data?.message || err.message || "Échec de connexion. Vérifiez vos informations.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "cover", backgroundPosition: "center", height: "auto" }}>
      <div className="flex justify-center items-center h-screen">
        <div className="w-[37%] 2xl:w-[30%] 2xl:py-14 py-10 mx-auto bg-[#19181832] rounded-md border border-[#ffffff3d]">
          <div className="flex justify-center mx-auto">
            <div className="w-56 mx-auto">
              <img src={waangulogo} alt="Logo" className="" />
            </div>
          </div>
          <p className="font-bold text-center text-[#ffffff] text-[1.5rem] m-0 p-0">Se connecter</p>
          <form onSubmit={formik.handleSubmit} className="px-10 py-5">
            <FormControl variant="filled" sx={{ width: "100%", color: "#ffffff" }}>
              <InputLabel htmlFor="username" sx={{ color: "#ffffff", fontSize: "0.9rem" }}>Nom d'utilisateur</InputLabel>
              <FilledInput
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                sx={{ color: "#ffffff" }}
                {...formik.getFieldProps("username")}
              />
            </FormControl>
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm">{formik.errors.username}</p>
            )}
            <div className="pt-5">
              <FormControl variant="filled" sx={{ width: "100%", color: "#ffffff" }}>
                <InputLabel htmlFor="password" sx={{ color: "#ffffff", fontSize: "0.9rem" }}>Mot de passe</InputLabel>
                <FilledInput
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  sx={{ color: "#ffffff" }}
                  {...formik.getFieldProps("password")}
                />
              </FormControl>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:underline text-sm"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <div className="w-full pt-5">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
            <div className="mt-10 mx-0">
              <hr className="border border-[#d6d6d6d6]" />
            </div>

            <div className="text-center pt-5">
              <p className="text-[0.8rem] text-[#e9e9e9]">
                Vous n'avez pas de compte ?
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
