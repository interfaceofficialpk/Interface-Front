import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2a9d8f", "#e76f51"]; // Approved, Rejected

export default function UniversityApplicationSuccessRateChart() {
  const [successRateData, setSuccessRateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `${GlobalConfig.apiUrl}/v1/dashboard/users/university-application-success-rate`
      );
      setSuccessRateData(res.data);
    } catch (error) {
      console.error("Error fetching success rate data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = successRateData
    ? [
        { name: "Approved", value: successRateData.approvedCount },
        { name: "Rejected", value: successRateData.rejectedCount },
      ]
    : [];

  // Custom label to display the success rate in the center of the pie chart
  const renderCustomLabel = ({ cx, cy }) => {
    if (successRateData && successRateData.successRate !== null) {
      const percentage = (successRateData.successRate * 100).toFixed(1);
      return (
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill="#1d3557"
          className="text-lg font-bold"
        >
          {`${percentage}% Success`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">University Application Success Rate</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : successRateData?.successRate !== null ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64 text-lg text-gray-500">
            No decided applications yet.
          </div>
        )}
      </div>
    </div>
  );
}
