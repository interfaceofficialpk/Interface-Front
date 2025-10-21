import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardPage from "../../components/dashboard/DashboardPage";
import UniversityInformationTab from "../../components/universityDetails/UniversityInformationTab.jsx";
import ProgramsTab from "../../components/universityDetails/ProgramsTab.jsx";

export default function UniversityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUniversityData = async () => {
    try {
      setLoading(true);

      const universityResponse = await api.get(
        `${GlobalConfig.apiUrl}/v1/universities/${id}`
      );
      const fetchedUniversity = universityResponse.data;
      setUniversity(fetchedUniversity);
    } catch (err) {
      setError("Failed to load university details. Please try again.");
      if (err.response?.status === 404) {
        alert("University not found!");
        navigate("/dashboard/universities"); // Redirect if not found
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUniversityData();
    }
  }, [id, navigate]); // navigate added to dependency array as per eslint recommendation, though fetchData is stable.

  if (loading) {
    return (
      <DashboardPage title="Loading University...">
        <div className="flex justify-center items-center h-48">
          <div className="loading loading-spinner"></div>
        </div>
      </DashboardPage>
    );
  }

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-secondary btn-outline"
            onClick={() => navigate("/dashboard/universities")}
          >
            Back to Universities List
          </button>
        </div>
      </DashboardPage>
    );
  }

  if (!university) {
    return (
      <DashboardPage title="University Not Found">
        <p className="text-center">
          University not found or an error occurred.
        </p>
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-secondary btn-outline"
            onClick={() => navigate("/dashboard/universities")}
          >
            Back to Universities List
          </button>
        </div>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title={`University Details: ${university.name}`}>
      <h1 className="text-2xl font-bold">
        University Details: {university.name}
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        {university.locationId
          ? `${university.locationName}`
          : "Location not specified"}
      </p>

      <div className="tabs tabs-border">
        <input
          type="radio"
          name="university_details_tabs"
          className="tab"
          aria-label="Information"
          defaultChecked
        />
        <UniversityInformationTab
          university={university}
          fetchUniversityData={fetchUniversityData}
        />

        <input
          type="radio"
          name="university_details_tabs"
          className="tab"
          aria-label="Programs"
        />
        <ProgramsTab university={university} />
      </div>
    </DashboardPage>
  );
}
