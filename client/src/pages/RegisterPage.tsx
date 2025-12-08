import { RegisterForm } from "@/components/features/RegisterForm";
import LoggedOutRoute from "@/components/LoggedOutRoute";

export default function RegisterPage() {
  return (
    <LoggedOutRoute>
      <RegisterForm />
    </LoggedOutRoute>
  );
}
