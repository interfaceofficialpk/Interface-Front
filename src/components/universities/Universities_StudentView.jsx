import DashboardPage from "../../components/dashboard/DashboardPage";
import { GlobalConfig } from "../../GlobalConfig";
import api from "../../utils/service-base";
import { useState, useEffect } from "react";

export default function Universities_StudentView() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchUniversities() {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/universities`);
      setUniversities(response.data.universities || []);
    } catch {
      setError("Failed to load universities. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUniversities();
  }, []);

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="Universities">
      <h1 className="text-3xl font-bold text-primary">Explore Universities</h1>
      <p className="text-base-content/70">
        Discover universities that match your interests
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="loading loading-spinner"></div>
        </div>
      ) : universities.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <span>No universities found.</span>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {universities.map((university) => (
            <div
              className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
              key={university.id}
            >
              <input type="checkbox" />
              <div className="collapse-title flex justify-between">
                <span>{university.name}</span>
                <span>{university.locationName}</span>
              </div>
              <div className="collapse-content">
                <p className="mb-2">
                  {university.description || "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardPage>
  );
}
