import { ReactNode } from "react";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  validation?: {
    required?: string | boolean;
    minLength?: {
      value: number;
      message: string;
    };
    pattern?: {
      value: RegExp;
      message: string;
    };
    validate?: (value: any, formValues?: any) => boolean | string;
  };
  autoComplete?: string;
  icon?: ReactNode;
  condition?: (values: any) => boolean;
  group?: string;
}
