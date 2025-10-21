import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Globe,
  GraduationCap,
  BookOpen,
  FileText,
  TrendingDown,
  TrendingUp,
  Plane,
  Banknote,
  Users,
} from "lucide-react";
import { GlobalConfig } from "../../GlobalConfig";
import api from "../../utils/service-base";
import DashboardPage from "../../components/dashboard/DashboardPage";

const CARD_ICONS = {
  locationsCount: <MapPin className="w-8 h-8" />,
  nationalitiesCount: <Globe className="w-8 h-8" />,
  universityTypesCount: <GraduationCap className="w-8 h-8" />,
  programTypesCount: <BookOpen className="w-8 h-8" />,
  documentTypesCount: <FileText className="w-8 h-8" />,
  expenseTypesCount: <TrendingDown className="w-8 h-8" />,
  incomeTypesCount: <TrendingUp className="w-8 h-8" />,
  visaApplicationTypesCount: <Plane className="w-8 h-8" />,
  currenciesCount: <Banknote className="w-8 h-8" />,
  clientSourcesCount: <Users className="w-8 h-8" />,
};

const getCardIcon = (type) =>
  CARD_ICONS[type] || <FileText className="w-8 h-8" />;

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace("Count", "");

export default function Portal() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/dashboard/portal/types-count`
      );
      console.log(response.data);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData is now a stable dependency

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg">{error}</p>
          <button onClick={fetchData} className="mt-4 btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardPage title="Portal Overview">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="mb-12" variants={cardVariants}>
          <h1 className="text-3xl font-semibold">Portal Overview</h1>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {data &&
            Object.entries(data).map(([key, value]) => (
              <motion.div key={key} variants={cardVariants}>
                <div className={`card border bg-base-100/50 border-primary`}>
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{getCardIcon(key)}</div>
                      <div className="text-right">
                        <motion.div
                          className="text-3xl font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {value}
                        </motion.div>
                      </div>
                    </div>
                    <h2 className="card-title text-lg">{formatLabel(key)}</h2>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </DashboardPage>
  );
}
