import { useEffect } from "react";
import { GlobalConfig } from "../../GlobalConfig";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Dashboard`;

  const { getRole } = useAuth();
  const role = getRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      console.log("no role detected in dashboard page");
      navigate("/auth/login");
    }

    switch (role) {
      case "Admin":
        navigate("/dashboard/finances");
        break;
      case "Employee":
        navigate("/dashboard/users/my-students");
        break;
      case "Student":
        navigate("/dashboard/documents");
        break;
    }
  }, [role, navigate]);

  return (
    <div>
      <title>{title}</title>
      <h1>Dashboard Page</h1>
      <p>This is the dashboard page of our application.</p>
    </div>
  );
}
