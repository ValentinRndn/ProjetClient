import { LoginForm } from "@/components/features/LoginForm";
import { SEO } from "@/components/shared/SEO";

export default function LoginPage() {
  return (
    <>
      <SEO
        title="Connexion"
        description="Connectez-vous à votre espace Vizion Academy."
        noIndex={true}
      />
      <LoginForm />
    </>
  );
}
