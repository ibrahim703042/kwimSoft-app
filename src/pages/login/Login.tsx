import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button, FilledInput, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_ROUTE_PASSWORD } from "../../../config";
import { jwtDecode } from "jwt-decode";
import "./login.css";
import useUserStore from "@/store/useUserStore";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      pswd: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email invalide").required("L'email est requis"),
      pswd: Yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Le mot de passe est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(`${API_ROUTE_PASSWORD}/user/login`, values);
        console.log("response.data", response.data);
        if (!response?.data) throw new Error("Données de réponse invalides.");

        const { requiresPasswordReset, userid, accessToken } = response.data;

        // Convertir requiresPasswordReset en booléen si c'est une chaîne
        const needsReset = requiresPasswordReset === true || requiresPasswordReset === "true";

        // Si une mise à jour du mot de passe est requise, on stocke l'utilisateur sans décoder le token
        if (needsReset) {
          console.log("CONDITION VERIFIE AVEC SUCCEESS");
          const user = {
            tokenDecode: null,
            token: typeof accessToken === "string" ? accessToken : "",
            requiresPasswordReset: true,
            userID: response?.data?.userId,
          };

          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          navigate("/update-password");
          return;
        }

        // Pour le cas normal, vérifier que accessToken est bien une chaîne
        if (!accessToken || typeof accessToken !== "string") {
          throw new Error("Token non valide ou absent.");
        }

        let decodedToken = null;
        try {
          decodedToken = jwtDecode(accessToken);
        } catch (decodeError) {
          console.error("Erreur lors du décodage du token:", decodeError);
          throw new Error("Échec du décodage du token.");
        }

        // Création de l'objet utilisateur
        const user = {
          tokenDecode: decodedToken?.sub || null,
          token: accessToken,
          requiresPasswordReset: false,
          userID: userid,
        };

        console.log("User avant stockage :", user);

        // Stockage dans le localStorage et dans le store Zustand
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        navigate("/");
      } catch (err: any) {
        console.error("Erreur de connexion :", err);
        setError(err.message || "Échec de connexion. Vérifiez vos informations.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    // style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "cover", backgroundPosition: "center", height: "auto" }}
    <div >
      <div className="flex justify-center items-center h-screen">
        <div className="w-[37%] 2xl:w-[30%] 2xl:py-14 py-10 mx-auto bg-[#19181832] rounded-md border border-[#ffffff3d]">
          <div className="flex justify-center mx-auto">
            <div className="w-56 mx-auto">
              {/* <img src={waangulogo} alt="Logo" className="" /> */}
              Logo
            </div>
          </div>
          <p className="font-bold text-center text-[#ffffff] text-[1.5rem] m-0 p-0">Se connecter</p>
          <form onSubmit={formik.handleSubmit} className="px-10 py-5">
            <FormControl variant="filled" sx={{ width: "100%", color: "#ffffff" }}>
              <InputLabel htmlFor="email" sx={{ color: "#ffffff", fontSize: "0.9rem" }}>Adresse Email</InputLabel>
              <FilledInput
                id="email"
                type="email"
                placeholder="Entrez votre email"
                sx={{ color: "#ffffff" }}
                {...formik.getFieldProps("email")}
              />
            </FormControl>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
            <div className="pt-5">
              <FormControl variant="filled" sx={{ width: "100%", color: "#ffffff" }}>
                <InputLabel htmlFor="password" sx={{ color: "#ffffff", fontSize: "0.9rem" }}>Mot de passe</InputLabel>
                <FilledInput
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  sx={{ color: "#ffffff" }}
                  {...formik.getFieldProps("pswd")}
                />
              </FormControl>
              {formik.touched.pswd && formik.errors.pswd && (
                <p className="text-red-500 text-sm">{formik.errors.pswd}</p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
