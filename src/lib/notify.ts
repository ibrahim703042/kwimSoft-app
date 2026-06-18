import { toast } from "@/hooks/use-toast";

export function notifySuccess(message: string, title = "Succès") {
  toast({ title, description: message });
}

export function notifyError(message: string, title = "Erreur") {
  toast({ title, description: message, variant: "destructive" });
}
