import ForgotPasswordForm from "../../components/forgot-password/ForgotPasswordForm"; // Adjust path as needed
import { GlobalConfig } from "../../GlobalConfig"; // Assuming GlobalConfig is in a parent directory

export default function ForgotPassword() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Forgot Password`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <title>{title}</title>
      <ForgotPasswordForm />
    </div>
  );
}
