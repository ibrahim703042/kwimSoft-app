/**
 * Employee Card Template — Create ID card templates with QR/Barcode, biometric/WiFi tracking
 *
 * Orientation, template name, colors, front/back content, QR or Barcode, logos.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, CreditCard } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@kwim/shared-ui";

const ORIENTATION_OPTIONS = [
  { value: "landscape", label: "Paysage (85.6 x 54 mm)" },
  { value: "portrait", label: "Portrait (54 x 85.6 mm)" },
];

const QR_BARCODE_OPTIONS = [
  { value: "qr", label: "QR Code" },
  { value: "barcode", label: "Code-barres" },
  { value: "none", label: "Aucun" },
];

const EXTRA_FIELD_OPTIONS = [
  { value: "", label: "—" },
  { value: "employeeCode", label: "Code employé" },
  { value: "department", label: "Département" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Téléphone" },
  { value: "biometricId", label: "ID biométrique" },
  { value: "wifiMac", label: "MAC WiFi" },
  { value: "deviceId", label: "ID appareil" },
  { value: "branch", label: "Agence" },
  { value: "hireDate", label: "Date d'embauche" },
];

const schema = z.object({
  templateName: z.string().min(1, "Le nom du modèle est requis"),
  orientation: z.enum(["landscape", "portrait"]),
  backgroundColor: z.string().optional(),
  frontExtra1: z.string().optional(),
  frontExtra2: z.string().optional(),
  frontExtra3: z.string().optional(),
  frontExtra4: z.string().optional(),
  qrOrBarcode: z.enum(["qr", "barcode", "none"]),
  backTitle: z.string().optional(),
  backContent: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  templateName: "",
  orientation: "landscape",
  backgroundColor: "#ffffff",
  frontExtra1: "",
  frontExtra2: "",
  frontExtra3: "",
  frontExtra4: "",
  qrOrBarcode: "none",
  backTitle: "",
  backContent: "",
};

export default function EmployeeCardTemplatePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FormValues | null>(null);
  const [templates, setTemplates] = useState<(FormValues & { id: string })[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const handleSubmit = (data: FormValues) => {
    if (editing) {
      setTemplates((prev) =>
        prev.map((t) => (t.templateName === editing.templateName ? { ...data, id: t.id } : t))
      );
    } else {
      setTemplates((prev) => [...prev, { ...data, id: Date.now().toString() }]);
    }
    closeDialog();
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Modèles de carte employé</h2>
          <p className="text-sm text-muted-foreground">
            Créez des modèles de cartes avec QR, code-barres ou suivi WiFi / biométrique
          </p>
        </div>
        <Button
          className="bg-[#0F123F]"
          size="default"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.length === 0 ? (
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            Aucun modèle. Cliquez sur &quot;Add&quot; pour créer un modèle de carte.
          </div>
        ) : (
          templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between border rounded-lg p-4 bg-card"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{t.templateName}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.orientation === "portrait" ? "Portrait" : "Paysage"} •{" "}
                    {t.qrOrBarcode === "qr" ? "QR Code" : t.qrOrBarcode === "barcode" ? "Code-barres" : "Sans QR"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(t);
                    form.reset(t);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier le modèle" : "Create ID Card Template"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <RadioGroup
              value={form.watch("orientation")}
              onValueChange={(v: string) => form.setValue("orientation", v as "landscape" | "portrait")}
              className="flex gap-4"
            >
              {ORIENTATION_OPTIONS.map((o) => (
                <div key={o.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={o.value} id={o.value} />
                  <Label htmlFor={o.value}>{o.label}</Label>
                </div>
              ))}
            </RadioGroup>

            <div>
              <Label>Nom du modèle *</Label>
              <Input
                placeholder="ex: Carte employé standard 2025"
                {...form.register("templateName")}
                className="mt-1"
              />
              {form.formState.errors.templateName && (
                <p className="text-destructive text-xs mt-1">
                  {form.formState.errors.templateName.message}
                </p>
              )}
            </div>

            <div>
              <Label>Couleur de fond (recto et verso)</Label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="color"
                  value={form.watch("backgroundColor") || "#ffffff"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue("backgroundColor", e.target.value)}
                  className="h-10 w-14 rounded border cursor-pointer"
                />
                <Input
                  value={form.watch("backgroundColor") || "#ffffff"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue("backgroundColor", e.target.value)}
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Recto</p>
              <p className="text-xs text-muted-foreground mb-2">
                Toujours affichés : Photo • Nom complet • Poste
              </p>
              <Label className="text-xs">Champs supplémentaires (ordre souhaité)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                {([1, 2, 3, 4] as const).map((i) => {
                  const fieldName = `frontExtra${i}` as keyof FormValues;
                  return (
                    <Select
                      key={i}
                      value={(form.watch(fieldName) as string) || ""}
                      onValueChange={(v: string) => form.setValue(fieldName, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Position ${i}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {EXTRA_FIELD_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value || "empty"} value={opt.value || " "}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>QR Code / Code-barres</Label>
              <RadioGroup
                value={form.watch("qrOrBarcode")}
                onValueChange={(v: string) => form.setValue("qrOrBarcode", v as "qr" | "barcode" | "none")}
                className="flex gap-4 mt-1"
              >
                {QR_BARCODE_OPTIONS.map((o) => (
                  <div key={o.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={o.value} id={`qb-${o.value}`} />
                    <Label htmlFor={`qb-${o.value}`}>{o.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-1">
                Encode l'identifiant employé (biométrique, WiFi MAC ou ID appareil si renseignés)
              </p>
            </div>

            <div>
              <Label>Logo recto</Label>
              <Input type="file" accept="image/*" className="mt-1" />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Verso</p>
              <div className="space-y-2">
                <div>
                  <Label>Titre verso</Label>
                  <Input
                    placeholder="ex: Conditions d'utilisation"
                    {...form.register("backTitle")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Contenu verso</Label>
                  <Textarea
                    placeholder="Politique entreprise, contacts d'urgence, instructions pour le journal des présences (attendance log)..."
                    {...form.register("backContent")}
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Idéal pour rappeler comment pointer (QR, WiFi, biométrique) et consulter l'attendance log.
                  </p>
                </div>
                <div>
                  <Label>Logo verso</Label>
                  <Input type="file" accept="image/*" className="mt-1" />
                </div>
                <div>
                  <Label>Signature autorisée (optionnel)</Label>
                  <Input type="file" accept="image/*" className="mt-1" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Annuler
              </Button>
              <Button type="submit" className="bg-[#0F123F]">
                {editing ? "Enregistrer" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
