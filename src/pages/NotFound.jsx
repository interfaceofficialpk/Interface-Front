import { useNavigate } from "react-router-dom";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-base-content/70">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline rounded-sm gap-2"
          >
            <ArrowLeftIcon size={20} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-primary btn-outline rounded-sm gap-2"
          >
            <HomeIcon size={20} />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
