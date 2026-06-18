import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useUserStore from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { identityApi } from "@/domains/identity/api";
import { createGuestUser } from "@/core/auth/guestSession";
import { UserRound } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleGuestLogin = () => {
    const guest = createGuestUser();
    localStorage.setItem("user", JSON.stringify(guest));
    setUser(guest);
    navigate("/");
  };

  const formik = useFormik({
    initialValues: { email: "", pswd: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Email invalide").required("L'email est requis"),
      pswd: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le mot de passe est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        const response = await identityApi.login(values);
        if (!response?.data) throw new Error("Données de réponse invalides.");

        const { requiresPasswordReset, userid, accessToken } = response.data;
        const needsReset =
          requiresPasswordReset === true || requiresPasswordReset === "true";

        if (needsReset) {
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

        if (!accessToken || typeof accessToken !== "string") {
          throw new Error("Token non valide ou absent.");
        }

        const decodedToken = jwtDecode<{ sub?: string }>(accessToken);
        const user = {
          tokenDecode: decodedToken?.sub || null,
          token: accessToken,
          requiresPasswordReset: false,
          userID: userid,
        };

        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Échec de connexion. Vérifiez vos informations.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Se connecter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
                aria-describedby={formik.errors.email ? "email-error" : undefined}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                aria-invalid={Boolean(formik.touched.pswd && formik.errors.pswd)}
                aria-describedby={formik.errors.pswd ? "password-error" : undefined}
                {...formik.getFieldProps("pswd")}
              />
              {formik.touched.pswd && formik.errors.pswd && (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {formik.errors.pswd}
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={handleGuestLogin}
          >
            <UserRound className="mr-2 h-4 w-4" />
            Continuer en invité
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Explorez l&apos;application sans compte. Les données API peuvent être limitées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
