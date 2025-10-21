import { useAuth } from "../../contexts/AuthContext";
import Communities_StudentView from "../../components/communities/Communities_StudentView";
import Communities_EmployeeView from "../../components/communities/Communities_EmployeeView";

export default function Communities() {
  const { getRole } = useAuth();
  const role = getRole();

  switch (role) {
    case "Student":
      return <Communities_StudentView />;
    case "ImmigrationClient":
      return <Communities_StudentView />;
    case "Employee":
      return <Communities_EmployeeView />;
    case "Admin":
      return <Communities_EmployeeView />;
    default:
      break;
  }

  return (
    <div>
      <h1>Communities</h1>
      <p>This is the Communities page.</p>
    </div>
  );
}
