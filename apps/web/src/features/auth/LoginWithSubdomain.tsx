import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FilledInput, FormControl, InputLabel } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../auth.store";
import bgImg from "@/assets/img/auth/expressway.png";
import { API_CONFIG } from "@/config/index";
import { jwtDecode } from "jwt-decode";
import { showErrorAlert, showSuccessAlert } from "@/components/utilitie/AlertPopup";
import { getSubdomainInfo, getEnterpriseInfo } from "@/utils/subdomain";
import { Building2 } from "lucide-react";
import "@/styles/modules/login.css";

export default function LoginWithSubdomain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enterpriseName, setEnterpriseName] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const isNewEnterprise = searchParams.get('new') === 'true';

  // Get subdomain info
  const { subdomain } = getSubdomainInfo();

  useEffect(() => {
    // Fetch enterprise info based on subdomain
    const fetchEnterpriseInfo = async () => {
      if (!subdomain) return;

      try {
        const response = await axios.get(
          `${API_CONFIG.userManagement.baseUrl}/api/enterprises/by-subdomain/${subdomain}`
        );
        setEnterpriseName(response.data.name);
      } catch (error) {
        console.error('Error fetching enterprise info:', error);
      }
    };

    fetchEnterpriseInfo();

    // Show welcome message for new enterprises
    if (isNewEnterprise) {
      showSuccessAlert('Enterprise created successfully! Please log in with your admin credentials.');
    }
  }, [subdomain, isNewEnterprise]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Le nom d'utilisateur est requis"),
      password: Yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Le mot de passe est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        // Call the backend authentication API with subdomain context
        const loginUrl = `${API_CONFIG.userManagement.baseUrl}${API_CONFIG.userManagement.endpoints.auth}/login`;
        const response = await axios.post(loginUrl, {
          ...values,
          subdomain, // Include subdomain in login request
        });
        
        if (!response?.data) {
          throw new Error("Données de réponse invalides.");
        }

        const { accessToken, refreshToken, user: userData, enterprise } = response.data;

        // Verify we have a valid access token
        if (!accessToken || typeof accessToken !== "string") {
          throw new Error("Token non valide ou absent.");
        }

        // Decode the JWT token
        let decodedToken: any = null;
        try {
          decodedToken = jwtDecode(accessToken);
        } catch {
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
          enterprise: enterprise || { subdomain, name: enterpriseName },
        };

        // Store tokens separately
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        // Store enterprise info
        if (enterprise) {
          localStorage.setItem("enterprise", JSON.stringify(enterprise));
        }

        // Store user in auth store and localStorage
        setUser(user);

        // Navigate to home
        navigate("/");
      } catch (err: any) {
        const isNetworkError = err.message === "Network Error" || err.code === "ERR_NETWORK";
        const errorMessage = isNetworkError
          ? "Erreur réseau. Vérifiez votre connexion et réessayez."
          : err.response?.data?.message || err.message || "Échec de connexion. Vérifiez vos informations.";
        setError(errorMessage);
        showErrorAlert(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "cover", backgroundPosition: "center", height: "auto" }}>
      <div className="flex justify-center items-center h-screen">
        <div className="w-[37%] 2xl:w-[30%] 2xl:py-14 py-10 mx-auto bg-[#19181832] rounded-md border border-[#ffffff3d]">
          {/* Enterprise Info Header */}
          {enterpriseName && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-white" />
              <span className="text-white text-lg font-semibold">{enterpriseName}</span>
            </div>
          )}
          
          <div className="flex justify-center mx-auto py-4">
            <h1 className="font-bold text-[#ffffff] text-2xl tracking-wide uppercase">Kwim Trans</h1>
          </div>
          <p className="font-bold text-center text-[#ffffff] text-[1.5rem] m-0 p-0">Se connecter</p>
          
          {/* Subdomain indicator */}
          {subdomain && (
            <p className="text-center text-gray-300 text-sm mt-2">
              {subdomain}.yourapp.com
            </p>
          )}

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
                className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
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
              <p className="text-[0.75rem] text-gray-400 mt-2">
                Contactez votre administrateur pour obtenir un accès
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
