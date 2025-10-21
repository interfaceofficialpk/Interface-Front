import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import { Link } from "react-router-dom";

export default function UserOverviewCards() {
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [activeClients, setActiveClients] = useState(0);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      const [studentsRes, clientsRes] = await Promise.all([
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/total-and-active-students`
        ),
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/total-and-active-immigration-clients`
        ),
      ]);

      setTotalStudents(studentsRes.data.totalStudents);
      setActiveStudents(studentsRes.data.activeStudents);
      setTotalClients(clientsRes.data.totalImmigrationClients);
      setActiveClients(clientsRes.data.activeImmigrationClients);
    } catch (error) {
      console.error("Error fetching dashboard summary data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="card border border-primary bg-base-100/50">
        <div className="card-body">
          <Link to="/dashboard/users/students" className="card-title">
            Students
          </Link>
          <p className="text-lg">
            Total: <span className="font-bold">{totalStudents}</span>
          </p>
          <Link to="/dashboard/users/students?isActive=true" className="text-lg">
            Active:{" "}
            <span className="font-bold text-success">{activeStudents}</span>
          </Link>
        </div>
      </div>

      <div className="card border border-primary bg-base-100/50">
        <div className="card-body">
          <Link
            to="/dashboard/users/immigration-clients"
            className="card-title"
          >
            Immigration Clients
          </Link>
          <p className="text-lg">
            Total: <span className="font-bold">{totalClients}</span>
          </p>
          <Link to="/dashboard/users/immigration-clients?isActive=true" className="text-lg">
            Active:{" "}
            <span className="font-bold text-success">{activeClients}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
