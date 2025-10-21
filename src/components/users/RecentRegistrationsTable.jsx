import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import { useNavigate } from "react-router-dom";

export default function RecentRegistrationsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, clientsRes] = await Promise.all([
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/recent-student-registrations`
        ),
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/recent-immigration-client-registrations`
        ),
      ]);

      const combinedData = [...studentsRes.data.data, ...clientsRes.data.data];

      const sortedData = combinedData.sort(
        (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
      );

      setData(sortedData.slice(0, 5)); // Take only the top 5 most recent registrations
    } catch (error) {
      console.error("Error fetching recent registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (userId, role) => {
    if (role === "Student") {
      navigate(`/dashboard/users/students/${userId}`);
    } else if (role === "ImmigrationClient") {
      navigate(`/dashboard/users/immigration-clients/${userId}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title mb-4">Recent Registrations</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Registered By</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleRowClick(user.id, user.role)}
                      className="cursor-pointer hover:scale-101 transition-all"
                    >
                      <td>
                        {user.firstName} {user.middleName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {new Date(user.registrationDate).toLocaleDateString()}
                      </td>
                      <td>{user.registeredByName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-500">
                      No recent registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
