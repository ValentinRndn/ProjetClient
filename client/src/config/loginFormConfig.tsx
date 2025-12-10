import { FormFieldConfig } from "@/types/form";
import { Mail, Lock } from "lucide-react";

export const loginFormFields: FormFieldConfig[] = [
  {
    name: "email",
    label: "Adresse email",
    type: "email",
    placeholder: "votre@email.com",
    required: true,
    validation: {
      required: "L'adresse email est requise",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Adresse email invalide",
      },
    },
    autoComplete: "email",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "••••••••",
    required: true,
    validation: {
      required: "Le mot de passe est requis",
    },
    autoComplete: "current-password",
    icon: <Lock className="w-5 h-5" />,
  },
];
