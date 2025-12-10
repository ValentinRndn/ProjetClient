import { useFormContext, Controller } from "react-hook-form";
import { FormFieldConfig } from "@/types/form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  field: FormFieldConfig;
}

export function FormField({ field }: FormFieldProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  // Vérifier la condition si elle existe
  if (field.condition) {
    const formValues = watch();
    if (!field.condition(formValues)) {
      return null;
    }
  }

  // Récupérer l'erreur du champ (support des chemins imbriqués comme "ecoleData.name")
  const fieldName = field.name as any;

  // Fonction helper pour récupérer l'erreur depuis un chemin imbriqué
  const getNestedError = (errorObj: any, path: string): string | undefined => {
    const parts = path.split(".");
    let current = errorObj;
    for (const part of parts) {
      if (current?.[part]) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return typeof current === "string" ? current : current?.message;
  };

  const error = getNestedError(errors, field.name);

  return (
    <Controller
      name={fieldName}
      control={control}
      rules={field.validation}
      render={({ field: { onChange, value, ...rest } }) => {
        const commonProps = {
          ...rest,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
          error: error as string | undefined,
          autoComplete: field.autoComplete,
        };

        if (field.type === "textarea") {
          return (
            <div className="relative">
              {field.icon && (
                <div className="absolute left-3 top-11 text-gray-400 z-10 pointer-events-none">
                  {field.icon}
                </div>
              )}
              <Textarea
                {...commonProps}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className={cn("pl-10")}
                rows={4}
              />
            </div>
          );
        }

        return (
          <div className="relative flex items-center">
            {field.icon && (
              <div className="absolute left-3 top-[50%] text-gray-400 z-10 pointer-events-none">
                {field.icon}
              </div>
            )}
            <Input
              {...commonProps}
              type={field.type}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={cn("pl-10")}
            />
          </div>
        );
      }}
    />
  );
}
