import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="navbar"
    >
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <Link to="/" className="text-xl">
          <img src="/Logo.svg" alt="Logo" className="w-30" />
        </Link>
      </div>
      <div className="navbar-end"></div>
    </motion.header>
  );
}
