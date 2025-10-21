import { GlobalConfig } from "../../GlobalConfig.jsx";
import api from "../../utils/service-base";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardPage from "../../components/dashboard/DashboardPage";
import DocumentsTab from "../../components/common/DocumentsTab.jsx";
import UniversityApplicationsTab from "../../components/studentDetails/UniversityApplicationsTab.jsx";
import VisaApplicationsTab from "../../components/common/VisaApplicationsTab.jsx";
import EntityInformationTab from "../../components/common/EntityInformationTab.jsx";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("information");

  const fetchData = async () => {
    try {
      setLoading(true);

      const studentResponse = await api.get(
        `${GlobalConfig.apiUrl}/v1/students/${id}`
      );
      const fetchedStudent = studentResponse.data;
      setStudent(fetchedStudent);
    } catch (err) {
      setError("Failed to load student details. Please try again.");
      if (err.response?.status === 404) {
        alert("Student not found!");
        navigate("/dashboard/users/students");
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
      <DashboardPage title="Loading Student...">
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
            onClick={() => navigate("/dashboard/users/students")}
          >
            Back to Students List
          </button>
        </div>
      </DashboardPage>
    );
  }

  if (!student) {
    return (
      <DashboardPage title="Student Not Found">
        <p className="text-center">Student not found or an error occurred.</p>
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-secondary btn-outline"
            onClick={() => navigate("/dashboard/users/students")}
          >
            Back to Students List
          </button>
        </div>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      title={`Student Details: ${student.firstName} ${student.lastName}`}
    >
      <h1 className="text-2xl font-bold">
        Student Details: {student.firstName} {student.lastName}
      </h1>
      <p className="text-sm text-gray-500 mb-4">Email: {student.email}</p>

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
            activeTab === "universityApplications" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("universityApplications")}
          aria-label="University Applications"
        >
          University Applications
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
          entity={student}
          entityType="student"
          fetchData={fetchData}
        />
      )}
      {activeTab === "documents" && <DocumentsTab student={student} />}
      {activeTab === "universityApplications" && (
        <UniversityApplicationsTab student={student} />
      )}
      {activeTab === "visaApplications" && (
        <VisaApplicationsTab entityId={student.id} />
      )}
    </DashboardPage>
  );
}
