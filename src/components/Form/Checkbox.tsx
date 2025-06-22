import { InputHTMLAttributes } from "react";
import { CheckboxElement } from "./styles/checkbox";
import { useFormContext } from "react-hook-form";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Checkbox({ name, ...props }: CheckboxProps) {
  const { register } = useFormContext();

  return <CheckboxElement type="checkbox" {...register(name)} {...props} />;
}
