import { RegisterForm } from "@/components/features/RegisterForm";
import { SEO } from "@/components/shared/SEO";

export default function RegisterPage() {
  return (
    <>
      <SEO
        title="Inscription"
        description="Créez votre compte Vizion Academy."
        noIndex={true}
      />
      <RegisterForm />
    </>
  );
}
