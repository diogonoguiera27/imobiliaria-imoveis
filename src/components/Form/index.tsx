import { ErrorMessage } from "./ErrorMessage";
import { Field } from "./Field";
import { Input } from "./Input";
import { Label } from "./Label";
import { Button } from "./Button";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";

import { FormHTMLAttributes } from "react";
import { FormElement } from "./styles/form";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  customProp?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
function Form(props: FormProps) {
  return <FormElement {...props} />;
}

export default {
  Form,
  ErrorMessage,
  Field,
  Input,
  Label,
  Button,
  Select,
  Checkbox,
};
