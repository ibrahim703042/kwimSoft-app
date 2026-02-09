import { UseFormReturn } from "react-hook-form";
import { Box } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import type { ProductFormValues } from "./product.schema";

export function ProductFormHeader({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const imageVal = form.watch("image");

  return (
    <div className="flex gap-4 items-start">
      {/* Left side: Name + Booleans */}
      <div className="flex-1 space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Nom du produit"
                  className="text-lg font-semibold h-12 border-0 border-b rounded-none focus-visible:ring-0 px-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <FormField control={form.control} name="canBeSold" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="canBeSold" checked={field.value} onCheckedChange={field.onChange} />
              <Label htmlFor="canBeSold" className="text-sm font-medium cursor-pointer">Peut être vendu</Label>
            </div>
          )} />
          <FormField control={form.control} name="canBePurchased" render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox id="canBePurchased" checked={field.value} onCheckedChange={field.onChange} />
              <Label htmlFor="canBePurchased" className="text-sm font-medium cursor-pointer">Peut être acheté</Label>
            </div>
          )} />
        </div>
      </div>

      {/* Right side: Product image */}
      <div className="shrink-0">
        {imageVal ? (
          <div className="relative group">
            <img src={imageVal} alt="Produit" className="w-28 h-28 rounded-lg object-cover border" />
            <button
              type="button"
              className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs"
              onClick={() => form.setValue("image", "")}
            >
              Changer
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <Box size={24} className="text-muted-foreground mb-1" />
            <span className="text-[10px] text-muted-foreground">Image</span>
            <input
              type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => form.setValue("image", reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}
