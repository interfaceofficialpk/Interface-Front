import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ContactSection = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      id="contact" // Changed ID to avoid conflict if there's another #contact
      className="flex flex-col items-center justify-center w-full min-h-[40vh] md:min-h-[50vh] py-16 md:py-20 px-4 bg-gradient-to-t from-black via-orange-900 to-black" // Added gradient
    >
      <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white" // White text for better contrast
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to Start Your Journey? {/* Kept similar, but check document */}
        </motion.h1>
        <motion.p // Added motion to paragraph
          className="text-white/70 text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Updated text - You can choose based on emphasis */}
          Join our global community or contact us directly to discuss your
          education and immigration goals. Let's build your future together.
          {/* Alt: Join thousands of students and professionals who have successfully navigated their global journey with Interface. */}
        </motion.p>
        <motion.button
          onClick={() => navigate("/signup")} // Navigate to signup/community page
          className="btn btn-primary btn-lg rounded-full px-8 shadow-lg" // Added padding and shadow
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "#FF8533", // Lighter orange on hover
            boxShadow: "0 0 20px rgba(255, 107, 0, 0.3)", // Add glow on hover
          }}
          whileTap={{ scale: 0.95 }} // Add tap effect
        >
          Join Our Community {/* Updated Button Text */}
          {/* Alt: Sign Up Now */}
          {/* Alt: Get Started */}
        </motion.button>
      </div>
    </motion.section>
  );
};

export default ContactSection;
