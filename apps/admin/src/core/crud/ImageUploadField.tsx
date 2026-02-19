/**
 * ImageUploadField — Reusable image upload for forms
 *
 * Supports:
 * - Single or multiple image upload
 * - Preview with remove
 * - Drag & drop
 * - Integrates with react-hook-form
 *
 * Stores as base64 or URL string(s) in the form value.
 */
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ImagePlus, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  /** Allow multiple images */
  multiple?: boolean;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Accepted file types */
  accept?: string;
  /** Required field */
  required?: boolean;
  /** Custom class for the preview area */
  className?: string;
}

export function ImageUploadField({
  form,
  name,
  label,
  multiple = false,
  maxSizeMB = 5,
  accept = "image/*",
  required = false,
  className,
}: ImageUploadFieldProps) {
  const currentValue = form.watch(name);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const processFile = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          if (file.size > maxSizeMB * 1024 * 1024) {
            reject(new Error(`Le fichier dépasse ${maxSizeMB}MB`));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

      if (multiple) {
        Promise.all(Array.from(files).map(processFile)).then((results) => {
          const existing = Array.isArray(currentValue) ? currentValue : [];
          form.setValue(name, [...existing, ...results], {
            shouldValidate: true,
          });
        });
      } else {
        processFile(files[0]).then((result) => {
          form.setValue(name, result, { shouldValidate: true });
        });
      }
    },
    [form, name, multiple, currentValue, maxSizeMB]
  );

  const removeImage = (index?: number) => {
    if (multiple && typeof index === "number") {
      const arr = Array.isArray(currentValue) ? [...currentValue] : [];
      arr.splice(index, 1);
      form.setValue(name, arr, { shouldValidate: true });
    } else {
      form.setValue(name, "", { shouldValidate: true });
    }
  };

  const images = multiple
    ? Array.isArray(currentValue)
      ? currentValue
      : []
    : currentValue
      ? [currentValue]
      : [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={cn("sm:col-span-2", className)}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="space-y-3">
              {/* Preview grid */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative group w-24 h-24 rounded-lg border overflow-hidden bg-muted"
                    >
                      <img
                        src={img}
                        alt={`${label} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(multiple ? idx : undefined)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload area */}
              {(multiple || images.length === 0) && (
                <label
                  className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFiles(e.dataTransfer.files);
                  }}
                >
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    {images.length === 0 ? (
                      <ImagePlus size={24} />
                    ) : (
                      <Upload size={20} />
                    )}
                    <span className="text-xs">
                      Glisser-déposer ou{" "}
                      <span className="text-primary underline">parcourir</span>
                    </span>
                    <span className="text-[10px]">
                      Max {maxSizeMB}MB • {accept}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
