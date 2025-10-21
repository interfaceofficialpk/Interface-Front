import React, { useState, useEffect } from "react";
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

export default function UsersByClientSourceChart() {
  const [combinedClientSourceData, setCombinedClientSourceData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to merge student and client data by client source
  const mergeClientSourceData = (students, clients) => {
    const mergedMap = new Map();

    // First, populate the map with student data
    students.forEach((item) => {
      mergedMap.set(item.clientSourceId || item.clientSourceName, {
        clientSourceId: item.clientSourceId,
        clientSourceName: item.clientSourceName,
        studentCount: item.count, // 'count' from student data becomes 'studentCount'
        clientCount: 0,
      });
    });

    // Then, merge in client data
    clients.forEach((item) => {
      const key = item.clientSourceId || item.clientSourceName;
      if (mergedMap.has(key)) {
        mergedMap.get(key).clientCount = item.clientCount;
      } else {
        mergedMap.set(key, {
          clientSourceId: item.clientSourceId,
          clientSourceName: item.clientSourceName,
          studentCount: 0,
          clientCount: item.clientCount,
        });
      }
    });

    // Convert the map values back to a sorted array
    return Array.from(mergedMap.values()).sort((a, b) =>
      a.clientSourceName.localeCompare(b.clientSourceName)
    );
  };

  const fetchClientSourceData = async () => {
    try {
      setLoading(true);
      const [studentsByClientSourceRes, clientsByClientSourceRes] =
        await Promise.all([
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/students-by-client-source`
          ),
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/immigration-clients-by-client-source`
          ),
        ]);

      const mergedData = mergeClientSourceData(
        studentsByClientSourceRes.data.data,
        clientsByClientSourceRes.data.data
      );
      
      setCombinedClientSourceData(mergedData);
    } catch (error) {
      console.error("Error fetching client source data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientSourceData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">Users by Client Source</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combinedClientSourceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="clientSourceName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#38a3a5" name="Students" />
              <Bar
                dataKey="clientCount"
                fill="#57cc99"
                name="Immigration Clients"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
