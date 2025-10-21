// src/pages/ImmigrationClientDetails.jsx
import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base"; // Assuming this is your axios instance
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DocumentsTab from "../../components/common/DocumentsTab.jsx"; // Reusing generic DocumentsTab if applicable
import VisaApplicationsTab from "../../components/common/VisaApplicationsTab.jsx"; // Reusing generic VisaApplicationsTab if applicable
import EntityInformationTab from "../../components/common/EntityInformationTab.jsx";

export default function ImmigrationClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [immigrationClient, setImmigrationClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("information");

  const fetchData = async () => {
    try {
      setLoading(true);
      const clientResponse = await api.get(
        `${GlobalConfig.apiUrl}/v1/immigration-clients/${id}`
      );
      setImmigrationClient(clientResponse.data);
    } catch (err) {
      setError("Failed to load immigration client details. Please try again.");
      if (err.response?.status === 404) {
        alert("Immigration Client not found!");
        navigate("/dashboard/users/immigration-clients");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <DashboardPage title="Loading Immigration Client...">
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
            onClick={() => navigate("/dashboard/users/immigration-clients")}
          >
            Back to Immigration Clients List
          </button>
        </div>
      </DashboardPage>
    );
  }

  if (!immigrationClient) {
    return (
      <DashboardPage title="Immigration Client Not Found">
        <p className="text-center">
          Immigration client not found or an error occurred.
        </p>
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-secondary btn-outline"
            onClick={() => navigate("/dashboard/users/immigration-clients")}
          >
            Back to Immigration Clients List
          </button>
        </div>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      title={`Immigration Client Details: ${immigrationClient.firstName} ${immigrationClient.lastName}`}
    >
      <h1 className="text-2xl font-bold mb-2">
        Immigration Client Details: {immigrationClient.firstName}{" "}
        {immigrationClient.lastName}
      </h1>
      <p className="text-sm text-gray-500 mb-4">
        Email: {immigrationClient.email}
      </p>

      {/* Tab Buttons */}
      <div className="tabs tabs-border mb-4">
        <button
          className={`tab tab-bordered ${
            activeTab === "information" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("information")}
          aria-label="Information"
        >
          Information
        </button>
        <button
          className={`tab tab-bordered ${
            activeTab === "documents" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("documents")}
          aria-label="Documents"
        >
          Documents
        </button>
        <button
          className={`tab tab-bordered ${
            activeTab === "visaApplications" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("visaApplications")}
          aria-label="Visa Applications"
        >
          Visa Applications
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "information" && (
        <EntityInformationTab
          entity={immigrationClient}
          entityType="immigration-client"
          fetchData={fetchData}
        />
      )}
      {activeTab === "documents" && (
        <DocumentsTab student={immigrationClient} />
      )}
      {activeTab === "visaApplications" && (
        <VisaApplicationsTab entityId={immigrationClient.id} />
      )}
    </DashboardPage>
  );
}
