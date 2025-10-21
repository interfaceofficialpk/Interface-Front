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

export default function CounselorLoadChart() {
  const [combinedCounselorData, setCombinedCounselorData] = useState([]);
  const [loading, setLoading] = useState(false);

  const mergeCounselorData = (students, clients) => {
    const mergedMap = new Map();
    students.forEach((item) => {
      mergedMap.set(item.counselorId || item.counselorName, {
        counselorId: item.counselorId,
        counselorName: item.counselorName,
        studentCount: item.studentCount,
        clientCount: 0,
      });
    });
    clients.forEach((item) => {
      const key = item.counselorId || item.counselorName;
      if (mergedMap.has(key)) {
        mergedMap.get(key).clientCount = item.clientCount;
      } else {
        mergedMap.set(key, {
          counselorId: item.counselorId,
          counselorName: item.counselorName,
          studentCount: 0,
          clientCount: item.clientCount,
        });
      }
    });
    return Array.from(mergedMap.values()).sort((a, b) =>
      a.counselorName.localeCompare(b.counselorName)
    );
  };

  const fetchCounselorData = async () => {
    try {
      setLoading(true);
      const [studentsByCounselorRes, clientsByCounselorRes] = await Promise.all(
        [
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/students-by-counselor`
          ),
          api.get(
            `${GlobalConfig.apiUrl}/v1/dashboard/users/immigration-clients-by-counselor`
          ),
        ]
      );

      const mergedCounselor = mergeCounselorData(
        studentsByCounselorRes.data.data,
        clientsByCounselorRes.data.data
      );
      setCombinedCounselorData(mergedCounselor);
    } catch (error) {
      console.error("Error fetching counselor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselorData();
  }, []);

  return (
    <div className="card border border-base-300 bg-base-100/50">
      <div className="card-body">
        <h2 className="card-title">Counselor Load</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={combinedCounselorData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="counselorName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#f97316" name="Students" />
              <Bar
                dataKey="clientCount"
                fill="#fdba74"
                name="Immigration Clients"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
