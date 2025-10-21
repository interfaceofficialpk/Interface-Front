import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function StaticNavSection({ icon: Icon, title, to }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="rounded-box border border-primary"
    >
      <Link
        to={to}
        className="collapse-title flex items-center gap-3 font-semibold text-primary"
      >
        <Icon size={20} />
        <span>{title}</span>
      </Link>
    </motion.div>
  );
}
