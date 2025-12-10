import { FormFieldConfig } from "@/types/form";
import {
  Mail,
  Lock,
  Building2,
  MapPin,
  Phone,
  FileText,
  Hash,
  User,
} from "lucide-react";

export const registerFormFields: FormFieldConfig[] = [
  {
    name: "intervenantData.firstName",
    label: "Prénom",
    type: "text",
    placeholder: "Jean",
    condition: (values) => values.role === "INTERVENANT",
    icon: <User className="w-5 h-5" />,
    group: "intervenant",
  },
  {
    name: "intervenantData.lastName",
    label: "Nom",
    type: "text",
    placeholder: "Dupont",
    condition: (values) => values.role === "INTERVENANT",
    icon: <User className="w-5 h-5" />,
    group: "intervenant",
  },
  {
    name: "email",
    label: "Email",
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
    group: "base",
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    placeholder: "Minimum 8 caractères",
    required: true,
    validation: {
      required: "Le mot de passe est requis",
      minLength: {
        value: 8,
        message: "Le mot de passe doit contenir au moins 8 caractères",
      },
    },
    autoComplete: "new-password",
    icon: <Lock className="w-5 h-5" />,
    group: "base",
  },
  {
    name: "confirmPassword",
    label: "Confirmer le mot de passe",
    type: "password",
    placeholder: "Répétez le mot de passe",
    required: true,
    validation: {
      required: "La confirmation du mot de passe est requise",
      validate: (value, formValues) =>
        value === formValues.password ||
        "Les mots de passe ne correspondent pas",
    },
    autoComplete: "new-password",
    icon: <Lock className="w-5 h-5" />,
    group: "base",
  },
  // Champs conditionnels pour ECOLE
  {
    name: "ecoleData.name",
    label: "Nom de l'école",
    type: "text",
    placeholder: "Nom de votre établissement",
    required: true,
    validation: {
      validate: (value: string, formValues: any) => {
        if (formValues.role === "ECOLE" && !value) {
          return "Le nom de l'école est requis";
        }
        return true;
      },
    },
    condition: (values) => values.role === "ECOLE",
    icon: <Building2 className="w-5 h-5" />,
    group: "ecole",
  },
  {
    name: "ecoleData.address",
    label: "Adresse",
    type: "text",
    placeholder: "123 Rue de Paris, 75001 Paris",
    icon: <MapPin className="w-5 h-5" />,
    condition: (values) => values.role === "ECOLE",
    group: "ecole",
  },
  {
    name: "ecoleData.phone",
    label: "Numéro de téléphone",
    type: "tel",
    placeholder: "01 23 45 67 89",
    icon: <Phone className="w-5 h-5" />,
    condition: (values) => values.role === "ECOLE",
    group: "ecole",
  },
  // Champs conditionnels pour INTERVENANT

  {
    name: "intervenantData.bio",
    label: "Biographie",
    type: "textarea",
    placeholder: "Décrivez votre parcours et votre expertise...",
    condition: (values) => values.role === "INTERVENANT",
    icon: <FileText className="w-5 h-5" />,
    group: "intervenant",
  },
  {
    name: "intervenantData.siret",
    label: "Numéro SIRET",
    type: "text",
    placeholder: "12345678901234",
    condition: (values) => values.role === "INTERVENANT",
    icon: <Hash className="w-5 h-5" />,
    group: "intervenant",
  },
];
