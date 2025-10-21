import LoginForm from "../../components/login/LoginForm";
import { GlobalConfig } from "../../GlobalConfig";

export default function Login() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Login`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <title>{title}</title>
      <LoginForm />
    </div>
  );
}
