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

export default function AdmissionAdvisorLoadChart() {
  const [combinedAdvisorData, setCombinedAdvisorData] = useState([]);
  const [loading, setLoading] = useState(false);

  const mergeAdvisorData = (students, clients) => {
    const mergedMap = new Map();

    students.forEach((item) => {
      mergedMap.set(item.advisorId || item.advisorName, {
        advisorId: item.advisorId,
        advisorName: item.advisorName,
        studentCount: item.studentCount,
        clientCount: 0,
      });
    });

    clients.forEach((item) => {
      const key = item.advisorId || item.advisorName;
      if (mergedMap.has(key)) {
        mergedMap.get(key).clientCount = item.clientCount;
      } else {
        mergedMap.set(key, {
          advisorId: item.advisorId,
          advisorName: item.advisorName,
          studentCount: 0,
          clientCount: item.clientCount,
        });
      }
    });

    return Array.from(mergedMap.values()).sort((a, b) =>
      a.advisorName.localeCompare(b.advisorName)
    );
  };

  const fetchAdvisorData = async () => {
    try {
      setLoading(true);
      const [studentsByAdvisorRes, clientsByAdvisorRes] = await Promise.all([
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/students-by-admission-advisor`
        ),
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/immigration-clients-by-admission-advisor`
        ),
      ]);

      const mergedAdvisor = mergeAdvisorData(
        studentsByAdvisorRes.data.data,
        clientsByAdvisorRes.data.data
      );
      setCombinedAdvisorData(mergedAdvisor);
    } catch (error) {
      console.error("Error fetching admission advisor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">Admission Advisor Load</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combinedAdvisorData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="advisorName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#2d6a4f" name="Students" />
              <Bar
                dataKey="clientCount"
                fill="#81b29a"
                name="Immigration Clients"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
