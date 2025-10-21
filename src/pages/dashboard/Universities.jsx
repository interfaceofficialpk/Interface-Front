import { useAuth } from "../../contexts/AuthContext";
import Universities_StudentView from "../../components/universities/Universities_StudentView";
import Universities_EmployeeView from "../../components/universities/Universities_EmployeeView";

export default function Universitites() {
  const { getRole } = useAuth();
  const role = getRole();

  switch (role) {
    case "Student":
      return <Universities_StudentView />;
    case "ImmigrationClient":
      return <Universities_StudentView />;
    case "Employee":
      return <Universities_EmployeeView />;
    case "Admin":
      return <Universities_EmployeeView />;
    default:
      return <Universities_StudentView />;
  }
}
