import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface ReusableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  value?: string;
}

export default function ReusableSelect({
  options,
  placeholder = "Sélectionner",
  onChange,
  value,
}: Readonly<ReusableSelectProps>) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
