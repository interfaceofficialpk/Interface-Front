import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyUniversityApplications() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/under-construction");
  }, []);

  return (
    <div>
      <h1>My University Applications</h1>
      <p>This is the My University Applications page.</p>
    </div>
  );
}
