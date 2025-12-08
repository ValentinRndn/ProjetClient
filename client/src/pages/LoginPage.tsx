import { LoginForm } from "@/components/features/LoginForm";
import LoggedOutRoute from "@/components/LoggedOutRoute";

export default function LoginPage() {
  return (
    <LoggedOutRoute redirectTo="/">
      <LoginForm />
    </LoggedOutRoute>
  );
}
