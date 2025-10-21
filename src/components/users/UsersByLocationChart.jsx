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

export default function UsersByLocationChart() {
  const [combinedLocationData, setCombinedLocationData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to merge student and client data by location
  const mergeLocationData = (students, clients) => {
    const mergedMap = new Map();

    // First, populate the map with student data
    students.forEach((item) => {
      mergedMap.set(item.locationId || item.locationName, {
        locationId: item.locationId,
        locationName: item.locationName,
        studentCount: item.count, // 'count' from student data becomes 'studentCount'
        clientCount: 0,
      });
    });

    // Then, merge in client data
    clients.forEach((item) => {
      const key = item.locationId || item.locationName;
      if (mergedMap.has(key)) {
        mergedMap.get(key).clientCount = item.clientCount;
      } else {
        mergedMap.set(key, {
          locationId: item.locationId,
          locationName: item.locationName,
          studentCount: 0,
          clientCount: item.clientCount,
        });
      }
    });

    // Convert the map values back to a sorted array
    return Array.from(mergedMap.values()).sort((a, b) =>
      a.locationName.localeCompare(b.locationName)
    );
  };

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      const [studentsByLocationRes, clientsByLocationRes] = await Promise.all([
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/students-by-location`
        ),
        api.get(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/immigration-clients-by-location`
        ),
      ]);

      const mergedLocation = mergeLocationData(
        studentsByLocationRes.data.data,
        clientsByLocationRes.data.data
      );
      setCombinedLocationData(mergedLocation);
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">Users by Location</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combinedLocationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="locationName" />
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
