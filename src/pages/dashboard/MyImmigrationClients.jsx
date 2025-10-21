import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function MyImmigrationClients() {
  const [immigrationClients, setImmigrationClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const fetchMyImmigrationClients = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
      };

      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/immigration-clients/my`,
        {
          params: params,
        }
      );

      setImmigrationClients(response.data.immigrationClients);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(
        "An error occurred while fetching your immigration clients: " +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyImmigrationClients();
  }, [pageNumber, pageSize]);

  const handlePrevious = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const navigateToClientDetails = (clientId) => {
    navigate(`/dashboard/users/immigration-clients/${clientId}`);
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="My Immigration Clients">
      <h1 className="text-2xl font-bold">My Assigned Immigration Clients</h1>

      <div className="flex items-center justify-between py-2"></div>

      <table className="table text-center">
        <thead className="bg-base-200">
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Assigned As</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="4">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {immigrationClients.length === 0 ? (
              <tr>
                <td colSpan="4">No immigration clients assigned to you.</td>
              </tr>
            ) : (
              immigrationClients.map((client) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={client.id}
                  onClick={() => navigateToClientDetails(client.id)}
                >
                  <td>{client.email}</td>
                  <td>{client.firstName}</td>
                  <td>{client.lastName}</td>
                  <td>{client.assignmentType}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        )}
      </table>

      <div className="flex justify-between items-center py-4">
        <button
          onClick={handlePrevious}
          disabled={pageNumber === 1}
          className="btn btn-sm btn-outline"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {totalPages} ({totalCount} items)
        </span>
        <button
          onClick={handleNext}
          disabled={pageNumber === totalPages || totalPages === 0}
          className="btn btn-sm btn-outline"
        >
          Next
        </button>
      </div>
    </DashboardPage>
  );
}
