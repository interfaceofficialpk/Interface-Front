import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CollapsibleNavSection({ icon: Icon, title, links }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="collapse collapse-arrow rounded-box border border-primary"
    >
      <input type="checkbox" className="peer" />
      <div className="collapse-title flex items-center gap-3 font-semibold text-primary">
        <Icon size={20} />
        <span>{title}</span>
      </div>
      <div className="collapse-content flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="hover:underline">
            {link.text}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
