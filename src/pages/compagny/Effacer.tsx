private async uploadImages(images: any[]): Promise<string[]> {
    // console.log("Images to send: ", images); // Journaliser les images envoyées pour le téléchargement

    // Retourne une promesse qui se résout avec un tableau d'URLs
    return await new Promise<string[]>((resolve, reject) => {
      const urls: string[] = []; // Tableau pour stocker les URLs des images téléchargées

      // Boucle à travers chaque image et l'upload
      for (let i = 0; i < images.length; i++) {
        const image = images[i]; // Image actuelle dans la boucle
        const formData = new FormData(); // Crée un objet FormData pour contenir les données de l'image

        // Ajoute les données de l'image à l'objet FormData
        // @ts-ignore
        formData.append("files", {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });

        // Définir les en-têtes pour la requête
        const headers = {
          "Content-Type": "multipart/form-data", // Définit le type de contenu pour gérer les uploads de fichiers
          Accept: "application/json", // Accepte les réponses au format JSON
        };

        // Crée les options de la requête fetch
        const requestOptions = {
          method: "POST",
          headers: headers,
          body: formData,
        };

        // Effectue la requête POST pour télécharger l'image
        fetch(
          "https://waangu-backend.asystresources.com/api/upload/upload-files/images",
          requestOptions
        )
          .then((response) => response.json()) // Analyse la réponse en JSON
          .then((responseData) => {
            console.log("Image " + i + " - " + JSON.stringify(responseData)); // Journaliser les données de réponse

            // Si la réponse contient l'URL de l'image téléchargée, l'ajouter au tableau des URLs
            if (responseData.images) {
              urls.push(
                "https://waangu-backend.asystresources.com/api/upload/" +
                  responseData.images[0].url
              );
            }

            // Une fois que toutes les images ont été téléchargées, résoudre la promesse avec le tableau des URLs
            if (images.length === urls.length) {
              resolve(urls);
            }
          })
          .catch((error) => {
            reject(error); // Rejeter la promesse en cas d'erreur
          });
      }
    });
  }













































  const validationSchemas = [
          Yup.object({
              name: Yup.string().required("Le nom de la compagnie est obligatoire"),
              country: Yup.string().required("Le pays est obligatoire"),
              siret: Yup.string()
                  .required("Le NIF de la compagnie est obligatoire")
                  .matches(/^\d+$/, "Le NIF doit contenir uniquement des chiffres")
                  .length(14, "Le NIF doit contenir exactement 14 caractères"),
              vatNumber: Yup.string().required("Le Numéro TVA de la compagnie est obligatoire"),
              rcsNumber: Yup.string().required("Le numéro de RC de la compagnie est obligatoire"),
              email: Yup.string()
                  .required("L'adresse e-mail est obligatoire")
                  .email("Veuillez entrer une adresse e-mail valide"),
              phone: Yup.string()
                  .required("Le numéro de téléphone est obligatoire")
                  .matches(/^\+\d{6,15}$/, "Le numéro de téléphone doit être au format international (+25762250948)"),
              website: Yup.string()
                  .trim()
                  .url("L'URL du site web n'est pas valide. Exemple : https://exemple.fr")
                  .nullable(),
              transportLicenseNumber: Yup.string().required("Le numéro de licence est obligatoire"),
              transportLicenseExpiry: Yup.string().required("La date d'expiration est obligatoire"),
              address: Yup.object().shape({
                  street: Yup.string().required("La rue est obligatoire"),
                  complement: Yup.string().nullable(), 
                  city: Yup.string().required("La ville est obligatoire"),
                  postalCode: Yup.string()
                      .required("Le code postal est obligatoire")
                      .matches(/^\d+$/, "Le code postal doit contenir uniquement des chiffres")
                      .length(5, "Le code postal doit contenir exactement 5 chiffres"),
              }),
              location: Yup.object().shape({
                  latitude: Yup.string()
                      .required("La latitude est obligatoire")
                      .matches(/^-?\d+(\.\d+)?$/, "Format de latitude invalide"),
                  longitude: Yup.string()
                      .required("La longitude est obligatoire")
                      .matches(/^-?\d+(\.\d+)?$/, "Format de longitude invalide"),
              }),
              transportScope: Yup.array().of(
                  Yup.string().required("Chaque élément du champ transportScope doit être une chaîne valide")
              ).min(1, "Au moins un élément est requis dans le transportScope"),
              insurance: Yup.object().shape({
                  provider: Yup.string().required("Le fournisseur de l'assurance est requis"),
                  policyNumber: Yup.string().required("Le numéro de police d'assurance est requis"),
                  coverage: Yup.string().required("Le type de couverture est requis"),
                  expiryDate: Yup.string().required("La date d'expiration de l'assurance est requise"),
                  documents: Yup.array()
                      .of(Yup.string().url("L'URL du document doit être valide"))
                      .nullable(),
              }),
          })
      ];









































































































































      import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { transportScope } from "../../../constants"
import { Textarea } from "../../components/ui/textarea";

export default function StepOne({ formik, uploadImages }) {

    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploading(true);
            await uploadImages([file], formik.setFieldValue);
            setUploading(false);
        }
    };

    const toggleSelection = (value) => {
        // Vérifie si la valeur est déjà dans le tableau, et si oui, la retire
        if (formik.values.transportScope.includes(value)) {
            formik.setFieldValue(
                "transportScope",
                formik.values.transportScope.filter((item) => item !== value)
            );
        } else {
            // Sinon, ajoute la valeur à la sélection
            formik.setFieldValue("transportScope", [...formik.values.transportScope, value]);
        }
    };

    return (
        <div>
            <h1 className="text-md font-medium mt-2">Information sur la compagnie</h1>
            <hr className="my-3" />
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Designation de la compagnie <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="name"
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.name}</p>
                    )}
                </div>

                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        NIF  <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="Doit contenir au moins 14 caracteres"
                        className="mt-1"
                        name="siret"
                        value={formik.values.siret}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.siret && formik.errors.siret && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.siret}</p>
                    )}
                </div>
                <div className="col-span-3">
                    <Label htmlFor="terms" className="font-normal">
                        Numéro de TVA <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="vatNumber"
                        value={formik.values.vatNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.vatNumber && formik.errors.vatNumber && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.vatNumber}</p>
                    )}
                </div>
                <div className="col-span-3">
                    <Label htmlFor="terms" className="font-normal">
                        RC <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="rcsNumber"
                        value={formik.values.rcsNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.rcsNumber && formik.errors.rcsNumber && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.rcsNumber}</p>
                    )}
                </div>
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Numéro de licence de transport <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder=""
                        className="mt-1"
                        name="transportLicenseNumber"
                        value={formik.values.transportLicenseNumber}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.transportLicenseNumber && formik.errors.transportLicenseNumber && (
                        <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.transportLicenseNumber}</p>
                    )}

                </div>
                <div className="col-span-6">
                    <Label htmlFor="terms" className="font-normal">
                        Zone de transport <span className="text-red-500 text-[0.7rem]">*</span>
                    </Label>

                    <div className="mt-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {formik.values.transportScope.length > 0 ? formik.values.transportScope.join(", ") : "Sélectionnez..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-2">
                                {transportScope.map((option) => (
                                    <div
                                        key={option.value}
                                        className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                                        onClick={() => toggleSelection(option.value)}
                                    >
                                        <Checkbox
                                            checked={formik.values.transportScope.includes(option.value)} // Vérifie si l'option est dans la sélection
                                        />
                                        {option.label}
                                    </div>
                                ))}
                            </PopoverContent>
                        </Popover>

                        {formik.touched.transportScope && formik.errors.transportScope && (
                            <p className="text-red-500 text-[0.7rem] mt-1">{formik.errors.transportScope}</p>
                        )}

                    </div>
                </div>

                <div className="col-span-6 mt-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Logo</Label>
                        <Input
                            id="logo"
                            type="file"
                            name="logo"
                            accept="image/*"
                            onChange={handleFileUpload}
                        />
                        {uploading && <p className="text-sm text-gray-500">Upload en cours...</p>}
                    </div>
                </div>


            </div>
        </div>
    )
}

