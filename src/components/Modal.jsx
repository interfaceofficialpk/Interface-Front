// components/ModalWrapper.jsx
import { motion } from "motion/react";

export default function Modal({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="modal modal-open"
    >
      {children}
      <div className="modal-backdrop" onClick={() => onClose(false)}></div>
    </motion.div>
  );
}
