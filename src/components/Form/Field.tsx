import { HTMLAttributes } from "react";
import { FieldElement } from "./styles/field";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FieldProps extends HTMLAttributes<HTMLDivElement> {}

export function Field(props: FieldProps) {
  return <FieldElement {...props} />;
}
