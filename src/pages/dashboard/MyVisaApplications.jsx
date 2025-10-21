import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyVisaApplications() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard/under-construction");
  });

  return (
    <div>
      <h1>My Visa Applications</h1>
      <p>This is the My Visa Applications page.</p>
    </div>
  );
}
