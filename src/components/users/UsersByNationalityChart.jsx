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

export default function UsersByNationalityChart() {
  const [combinedNationalityData, setCombinedNationalityData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to merge student and client data by nationality
  const mergeNationalityData = (students, clients) => {
    const mergedMap = new Map();

    // First, populate the map with student data
    students.forEach((item) => {
      mergedMap.set(item.nationalityId || item.nationalityName, {
        nationalityId: item.nationalityId,
        nationalityName: item.nationalityName,
        studentCount: item.count,
        clientCount: 0,
      });
    });

    // Then, merge in client data
    clients.forEach((item) => {
      const key = item.nationalityId || item.nationalityName;
      if (mergedMap.has(key)) {
        mergedMap.get(key).clientCount = item.clientCount;
      } else {
        mergedMap.set(key, {
          nationalityId: item.nationalityId,
          nationalityName: item.nationalityName,
          studentCount: 0,
          clientCount: item.clientCount,
        });
      }
    });

    // Convert the map values back to a sorted array
    return Array.from(mergedMap.values()).sort((a, b) =>
      a.nationalityName.localeCompare(b.nationalityName)
    );
  };

  const fetchNationalityData = async () => {
    try {
      setLoading(true);
      const [studentsByNationalityRes, clientsByNationalityRes] =
        await Promise.all([
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/students-by-nationality`
          ),
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/immigration-clients-by-nationality`
          ),
        ]);

      const mergedNationality = mergeNationalityData(
        studentsByNationalityRes.data.data,
        clientsByNationalityRes.data.data
      );
      setCombinedNationalityData(mergedNationality);
    } catch (error) {
      console.error("Error fetching nationality data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNationalityData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">Users by Nationality</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combinedNationalityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nationalityName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#2a9d8f" name="Students" />
              <Bar
                dataKey="clientCount"
                fill="#e9c46a"
                name="Immigration Clients"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
