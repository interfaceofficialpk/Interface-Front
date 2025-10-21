import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import { GlobalConfig } from "../../GlobalConfig";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RegistrationTrendChart() {
  const [trendData, setTrendData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const mergeTrendData = (students, clients) => {
    const mergedMap = new Map();
    students.forEach((item) => {
      mergedMap.set(item.period, {
        period: item.period,
        studentCount: item.studentCount,
        clientCount: 0,
      });
    });
    clients.forEach((item) => {
      if (mergedMap.has(item.period)) {
        mergedMap.get(item.period).clientCount = item.clientCount;
      } else {
        mergedMap.set(item.period, {
          period: item.period,
          studentCount: 0,
          clientCount: item.clientCount,
        });
      }
    });
    return Array.from(mergedMap.values()).sort((a, b) =>
      a.period.localeCompare(b.period)
    );
  };

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const [studentTrendRes, clientTrendRes] = await Promise.all([
        api.post(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/student-registration-trend`,
          { startDate, endDate }
        ),
        api.post(
          `${GlobalConfig.apiUrl}/v1/dashboard/users/immigration-client-registration-trend`,
          { startDate, endDate }
        ),
      ]);

      const merged = mergeTrendData(
        studentTrendRes.data.trend,
        clientTrendRes.data.trend
      );
      setTrendData(merged);
    } catch (error) {
      console.error("Error fetching registration trend data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendData();
  }, [startDate, endDate]);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title justify-between">
          Registration Trend
          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Start Date</span>
              </div>
              <input
                type="date"
                className="input input-bordered"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="form-control">
              <div className="label">
                <span className="label-text">End Date</span>
              </div>
              <input
                type="date"
                className="input input-bordered"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="studentCount"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.6}
                name="Students"
              />
              <Area
                type="monotone"
                dataKey="clientCount"
                stroke="#fdba74"
                fill="#fdba74"
                fillOpacity={0.6}
                name="Immigration Clients"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
