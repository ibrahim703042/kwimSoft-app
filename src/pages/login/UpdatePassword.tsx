import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { identityApi } from "@/domains/identity/api";

export default function UpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const formik = useFormik({
    initialValues: {
      newPswd: "",
      confirmPswd: "",
      userId: user?.userID ?? "",
    },
    validationSchema: Yup.object({
      newPswd: Yup.string().min(6, "Minimum 6 caractères").required("Requis"),
      confirmPswd: Yup.string()
        .oneOf([Yup.ref("newPswd")], "Les mots de passe ne correspondent pas")
        .required("Requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        await identityApi.updatePassword({
          newPswd: values.newPswd,
          confirmPswd: values.confirmPswd,
          userId: user?.userID ?? "",
        });
        localStorage.removeItem("user");
        setUser({
          tokenDecode: null,
          token: "",
          requiresPasswordReset: false,
          userID: "",
        });
        navigate("/login");
      } catch {
        setError("Erreur lors de la mise à jour du mot de passe.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Changer le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPswd">Nouveau mot de passe</Label>
              <Input id="newPswd" type="password" {...formik.getFieldProps("newPswd")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPswd">Confirmer le mot de passe</Label>
              <Input id="confirmPswd" type="password" {...formik.getFieldProps("confirmPswd")} />
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
