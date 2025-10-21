import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  const fetchMyStudents = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: pageNumber,
        pageSize: pageSize,
      };

      const response = await api.get(`${GlobalConfig.apiUrl}/v1/students/my`, {
        params: params,
      });

      setStudents(response.data.students);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(
        "An error occurred while fetching your students: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStudents();
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

  const navigateToStudentDetails = (studentId) => {
    navigate(`/dashboard/users/students/${studentId}`);
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="My Students">
      <h1 className="text-2xl font-bold">My Assigned Students</h1>

      {/* Simplified UI: No search bar or filters */}
      <div className="flex items-center justify-between py-2">
        {/* Intentionally left empty to provide spacing like the other component */}
      </div>

      <table className="table text-center">
        <thead className="bg-base-200">
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Assigned As</th> {/* This is the new column header */}
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
            {students.length === 0 ? (
              <tr>
                <td colSpan="4">No students assigned to you.</td>
              </tr>
            ) : (
              students.map((student) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={student.id}
                  // onClick handler is commented out because we don't have a details page for this view
                  onClick={() => navigateToStudentDetails(student.id)}
                >
                  <td>{student.email}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.assignmentType}</td>{" "}
                  {/* This is the new data cell */}
                </motion.tr>
              ))
            )}
          </tbody>
        )}
      </table>

      {/* Pagination Controls */}
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
