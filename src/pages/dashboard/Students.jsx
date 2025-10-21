import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateStudentModal from "../../components/students/CreateStudentModal";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL search params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [pageNumber, setPageNumber] = useState(
    Number(searchParams.get("pageNumber")) || 1
  );
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("pageSize")) || 10
  );
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isActive, setIsActive] = useState(
    searchParams.get("isActive") === "true"
      ? true
      : searchParams.get("isActive") === "false"
      ? false
      : null
  );
  const [registeredById, setRegisteredById] = useState(
    searchParams.get("registeredById") || null
  );
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  // Sync state → URL
  useEffect(() => {
    const params = {};

    if (searchTerm) params.searchTerm = searchTerm;
    if (pageNumber > 1) params.pageNumber = pageNumber;
    if (pageSize !== 10) params.pageSize = pageSize;
    if (isActive !== null) params.isActive = isActive;
    if (registeredById) params.registeredById = registeredById;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    setSearchParams(params);
  }, [
    searchTerm,
    pageNumber,
    pageSize,
    isActive,
    registeredById,
    startDate,
    endDate,
    setSearchParams,
  ]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/employees/all`);
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        searchTerm: debouncedSearchTerm,
        pageNumber,
        pageSize,
      };

      if (isActive !== null) {
        params.isActive = isActive;
      }
      if (registeredById !== null) {
        params.registeredById = registeredById;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const response = await api.get(`${GlobalConfig.apiUrl}/v1/students`, {
        params: params,
      });

      setStudents(response.data.students);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("An error occurred while fetching students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [
    debouncedSearchTerm,
    pageNumber,
    pageSize,
    isActive,
    registeredById,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const showCreateStudentModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateStudentModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchStudents();
    }
  };

  const navigateToStudentDetails = (studentId) => {
    navigate(`${studentId}`);
  };

  const handleIsActiveChange = (e) => {
    const value = e.target.value;
    let newIsActive = null;
    if (value === "True") {
      newIsActive = true;
    } else if (value === "False") {
      newIsActive = false;
    }
    setPageNumber(1);
    setIsActive(newIsActive);
  };

  const handleRegisteredByChange = (e) => {
    const value = e.target.value;
    const newRegisteredById = value === "All" ? null : value;
    setPageNumber(1);
    setRegisteredById(newRegisteredById);
  };

  const handleStartDateChange = (e) => {
    setPageNumber(1);
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setPageNumber(1);
    setEndDate(e.target.value);
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="Students">
      <h1 className="text-2xl font-bold">Manage Students</h1>

      <div className="flex items-center justify-between py-2 gap-2">
        <input
          type="text"
          placeholder="Search students by name or email..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <select
          className="select"
          value={
            isActive === null ? "All" : isActive === true ? "True" : "False"
          }
          onChange={handleIsActiveChange}
        >
          <option value="All">All</option>
          <option value="True">Active</option>
          <option value="False">Inactive</option>
        </select>

        <select
          className="select"
          value={registeredById || "All"}
          onChange={handleRegisteredByChange}
        >
          <option value="All">All Registered By</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.firstName} {employee.lastName} ({employee.email})
            </option>
          ))}
        </select>
        <input
          type="date"
          className="input"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          className="input"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateStudentModal}
        >
          Add Student
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead className="bg-base-200">
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
              <th>Active</th>
              <th>Registered By</th>
              <th>Registration Date</th>
              <th>Admission Associate Name</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan="10">
                  <div className="loading loading-spinner"></div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="10">No students found.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <motion.tr
                    className="cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    key={student.id}
                    onClick={() => navigateToStudentDetails(student.id)}
                  >
                    <td>{student.email}</td>
                    <td>{student.firstName}</td>
                    <td>{student.middleName || "-"}</td>
                    <td>{student.lastName}</td>
                    <td>{student.phoneNumber || "-"}</td>
                    <td>{student.isActive ? "Yes" : "No"}</td>
                    <td>{student.registeredByName || "-"}</td>
                    <td>
                      {student.registrationDate
                        ? new Date(
                            student.registrationDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{student.admissionAssociateName || "-"}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

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

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateStudentModal onClose={closeCreateStudentModal} />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
