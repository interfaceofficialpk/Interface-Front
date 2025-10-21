import { motion } from "motion/react";
import { GlobalConfig } from "../../GlobalConfig";

export default function DashboardPage({ children, title }) {
  const { appName } = GlobalConfig;
  const finalTitle = title ? `${appName} - ${title}` : appName;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen flex flex-col gap-2 p-2"
    >
      <title>{finalTitle}</title>
      {children}
    </motion.div>
  );
}
