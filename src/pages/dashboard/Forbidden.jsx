import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-3xl font-semibold mt-4 mb-2 text-error">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You do not have the necessary permissions to view this page and/or
          perform this action.
          <br />
          Please contact your administrator if you believe this is an error.
        </p>
        <Link
          to="/dashboard" // You can change this to your home page or dashboard route
          className="btn btn-outline btn-primary"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
