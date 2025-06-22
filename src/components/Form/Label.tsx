import { LabelHTMLAttributes } from "react";
import { LabelElement } from "./styles/label";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export function Label(props: LabelProps) {
  return <LabelElement {...props} />;
}
