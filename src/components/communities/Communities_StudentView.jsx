import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Communities_StudentView() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/under-construction");
  }, []);

  return (
    <div>
      <h1>Communities - Student View</h1>
      <p>This is the Communities page for Students.</p>
    </div>
  );
}
