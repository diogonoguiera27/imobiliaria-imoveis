
import { useContext } from "react";
import { ContactContext } from "./ContactContext";

export function useContactContext() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContactContext deve ser usado dentro de ContactProvider");
  }
  return ctx;
}
