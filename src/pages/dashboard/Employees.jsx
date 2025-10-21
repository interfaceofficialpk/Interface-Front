import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateEmployeeModal from "../../components/employees/CreateEmployeeModal"; // Assuming this path
import EditEmployeeModal from "../../components/employees/EditEmployeeModal"; // Assuming this path
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/employees`, // Corrected endpoint
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
          },
        }
      );

      console.log(response.data.employees);
      setEmployees(response.data.employees);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("An error occurred while fetching employees: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearchTerm, pageNumber, pageSize]);

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

  const showCreateEmployeeModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateEmployeeModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchEmployees();
    }
  };

  const showEditEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const closeEditEmployeeModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null); // Clear selected employee
    if (refresh) {
      fetchEmployees();
    }
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="Employees">
      <h1 className="text-2xl font-bold">Manage Employees</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search employees by name or email..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1); // Reset page number on new search
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateEmployeeModal}
        >
          Add Employee
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Title</th>
            <th>Phone Number</th>
            <th>Active</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="7">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7">No employees found.</td>
              </tr>
            ) : (
              employees.map((employee) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={employee.id}
                  onClick={() => showEditEmployeeModal(employee)}
                >
                  <td>{employee.email}</td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.title || "-"}</td>
                  <td>{employee.phoneNumber || "-"}</td>
                  <td>{employee.isActive ? "Yes" : "No"}</td>
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

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateEmployeeModal onClose={closeCreateEmployeeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditEmployeeModal
            employee={selectedEmployee}
            onClose={closeEditEmployeeModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
