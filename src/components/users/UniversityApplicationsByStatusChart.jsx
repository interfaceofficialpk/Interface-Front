import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  UnderReview: "#f4a261",
  ReviewSuccessful: "#e9c46a",
  Submitted: "#264653",
  Approved: "#2a9d8f",
  Rejected: "#e76f51",
};

export default function UniversityApplicationsByStatusChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `${GlobalConfig.apiUrl}/v1/dashboard/users/university-applications-by-status`
      );

      console.log(res.data.data);
      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching application status data:", error);
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
        <h2 className="card-title">Applications by Status</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="applicationCount"
                nameKey="applicationStatus"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.applicationStatus]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
