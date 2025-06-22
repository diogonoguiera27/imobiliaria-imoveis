import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { InputElement } from "./styles/input";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  maskType?:
    | "tel"
    | "text"
    | "password"
    | "money"
    | "email"
    | "cpf"
    | "cnpj"
    | "cep";
}

export function Input({ maskType = "text", ...props }: InputProps) {
  const formContext = useFormContext();
  const { register, setValue: setFormValue } = formContext || {};
  const [showPassword, setShowPassword] = useState(true);
  const [inputValue, setInputValue] = useState("");

  // Format a phone number as the user types
  const formatPhoneNumber = (value: string): string => {
    // Keep only digits
    const digits = value.replace(/\D/g, "");

    // Apply phone mask
    if (digits.length <= 2) {
      return digits.length ? `(${digits}` : "";
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else {
      // Limit to 11 digits
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const formatCurrency = (value: string): string => {
    return (
      "R$ " +
      value
        .replace(/\D/g, "") // Remove tudo que não for número
        .replace(/(\d)(\d{2})$/, "$1,$2") // Coloca a vírgula
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    ); // Adiciona os pontos separadores a cada 3 dígitos
  };

  // Handle input change based on input type
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formattedValue = e.target.value;

    if (maskType === "tel") {
      formattedValue = formatPhoneNumber(formattedValue);
    } else if (maskType === "money") {
      formattedValue = formatCurrency(formattedValue);
    }

    setInputValue(formattedValue);

    // Update the form value if we're in a form context
    if (formContext && setFormValue) {
      setFormValue(props.name, formattedValue, {
        shouldValidate: true,
      });
    }

    // If we have an onChange handler in props, call it too
    if (props.onChange) {
      const event = {
        target: { value: formattedValue, name: props.name },
      } as React.ChangeEvent<HTMLInputElement>;
      props.onChange(event);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Register the input with react-hook-form if we're in a form context
  let ref: React.Ref<HTMLInputElement> | undefined;
  let rest = {};

  if (formContext && register) {
    const registration = register(props.name);
    ref = registration.ref;
    // Use object destructuring to omit the ref property
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ref: unused, ...restProps } = registration;
    rest = restProps;
  }

  // Create the input based on type
  const renderInput = () => {
    if (maskType === "password") {
      return (
        <div className="relative">
          <InputElement
            {...rest}
            ref={ref}
            id={props.name}
            type={showPassword ? "password" : "text"}
            {...props}
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="absolute right-3 bottom-3 z-50">
            {showPassword ? (
              <EyeOff
                className="cursor-pointer text-zinc-300 hover:text-zinc-400"
                size={16}
                onClick={togglePasswordVisibility}
              />
            ) : (
              <Eye
                className="cursor-pointer text-zinc-300 hover:text-zinc-400"
                size={16}
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
        </div>
      );
    }

    // For all other input types including masked ones
    return (
      <InputElement
        {...rest}
        ref={ref}
        id={props.name}
        type="text"
        {...props}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={maskType === "tel" ? "(00) 00000-0000" : props.placeholder}
      />
    );
  };

  return renderInput();
}
