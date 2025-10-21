import { GlobalConfig } from "../../GlobalConfig";
import ResetPasswordForm from "../../components/resetPassword/ResetPasswordForm";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Reset Password`;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <title>{title}</title>
      <ResetPasswordForm token={token} />
    </div>
  );
}
