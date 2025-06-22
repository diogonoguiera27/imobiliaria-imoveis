import { ButtonHTMLAttributes } from "react";
import { ButtonElement } from "./styles/button";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  customProp?: string;
  isActive?: boolean; // Added to handle the prop properly
}

export function Button({ isActive, ...props }: ButtonProps) {
  // Filter out the isActive prop before passing to the DOM element
  return <ButtonElement data-active={isActive} {...props} />;
}
