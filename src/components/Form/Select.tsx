import { SelectHTMLAttributes } from "react";
import { SelectElement } from "./styles/select";
import { useFormContext } from "react-hook-form";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: { value: string; label: string }[];
}

export function Select({ name, options, ...props }: SelectProps) {
  const { register } = useFormContext();

  return (
    <SelectElement {...props} {...register(name)} id={name}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectElement>
  );
}
