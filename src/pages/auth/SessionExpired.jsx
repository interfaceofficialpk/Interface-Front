import React from "react";
import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="card border bg-base-100/50 border-primary">
        <div>
          <div className="card-body gap-4">
            <h2 className="card-title text-xl">Session Expired</h2>
            <p>Your session has expired. Please log in again to continue.</p>
            <button
              onClick={handleRedirectToLogin}
              className="btn btn-primary btn-outline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
