import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function UsersByRegistererChart() {
  const [combinedRegistererData, setCombinedRegistererData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to merge student and client data by registerer
  const mergeRegistererData = (students, clients) => {
    const mergedMap = new Map();

    // First, populate the map with student data
    students.forEach((item) => {
      mergedMap.set(item.registererId || item.registererName, {
        registererId: item.registererId,
        registererName: item.registererName,
        studentCount: item.studentCount,
        clientCount: 0,
      });
    });

    // Then, merge in client data
    clients.forEach((item) => {
      const key = item.registererId || item.registererName;
      if (mergedMap.has(key)) {
        mergedMap.get(key).clientCount = item.clientCount;
      } else {
        mergedMap.set(key, {
          registererId: item.registererId,
          registererName: item.registererName,
          studentCount: 0,
          clientCount: item.clientCount,
        });
      }
    });

    // Convert the map values back to a sorted array
    return Array.from(mergedMap.values()).sort((a, b) =>
      a.registererName.localeCompare(b.registererName)
    );
  };

  const fetchRegistererData = async () => {
    try {
      setLoading(true);
      const [studentsByRegistererRes, clientsByRegistererRes] =
        await Promise.all([
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/students-by-registerer`
          ),
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/immigration-clients-by-registerer`
          ),
        ]);

      const mergedRegisterer = mergeRegistererData(
        studentsByRegistererRes.data.data,
        clientsByRegistererRes.data.data
      );
      setCombinedRegistererData(mergedRegisterer);
    } catch (error) {
      console.error("Error fetching registerer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistererData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">Users by Registerer</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combinedRegistererData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="registererName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#264653" name="Students" />
              <Bar
                dataKey="clientCount"
                fill="#2a9d8f"
                name="Immigration Clients"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
