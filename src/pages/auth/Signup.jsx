import SignupForm from "../../components/signup/SignupForm";
import { GlobalConfig } from "../../GlobalConfig";

export default function Signup() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Signup`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <title>{title}</title>
      <SignupForm />
    </div>
  );
}
