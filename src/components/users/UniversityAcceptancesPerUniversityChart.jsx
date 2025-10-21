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

export default function UniversityAcceptancesPerUniversityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `${GlobalConfig.apiUrl}/v1/dashboard/users/university-acceptances-per-university`
      );
      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching university acceptance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">Accepted Applications by University</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="universityName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="acceptedApplications"
                fill="#1d3557"
                name="Accepted Applications"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
