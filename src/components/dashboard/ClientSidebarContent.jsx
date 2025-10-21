import { Link } from "react-router-dom";

export default function ClientSidebarContent() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        to="/dashboard/assignments"
        className="text-blue-500 hover:underline"
      >
        View Assignments
      </Link>
      <Link to="/dashboard/grades" className="text-blue-500 hover:underline">
        Check Grades
      </Link>
    </div>
  );
}
