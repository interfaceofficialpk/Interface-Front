import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// Added icons for benefits (adjust icons if needed for new context)
import { Users, GraduationCap, Globe } from "lucide-react"; // Updated icons

// Updated community benefits based on the provided context
const communityBenefits = [
  {
    icon: <Users size={18} />, // Icon representing students/community
    title: "PCAS Community", // Added title
    text: "Join the Pakistan-Canada Association of Students (PCAS) Facebook group. A dedicated space for students navigating their journey from Pakistan to Canada for higher education, sharing information, asking questions, and gaining insights since 2015.",
  },
  {
    icon: <GraduationCap size={18} />, // Icon representing mentorship/education
    title: "GradLab Project", // Added title
    text: "Receive expert mentorship for pursuing higher education abroad with fully funded opportunities. Our accomplished mentors guide you through applications, scholarships (like Fulbright, Chevening), and interviews for top global institutions.",
  },
  {
    icon: <Globe size={18} />, // Icon representing a broader network
    title: "Interface Community", // Added title
    text: "Become part of a prestigious global network of students, professionals, and entrepreneurs pursuing studies, careers abroad, or business opportunities. Connect, access resources, and attend exclusive events.",
  },
];

const CommunitiesSection = () => (
  <motion.section
    id="communities"
    className="relative flex flex-col items-center justify-center min-h-screen w-full py-20 px-4 bg-cover"
    // style={{ /* Background image styling removed, assuming handled by CSS or parent */ }}
  >
    {/* Background Image Overlay */}
    <div
      className="absolute inset-0 bg-black/60 bg-cover bg-center z-0 opacity-40 rounded-xl" // Increased darkness slightly
      style={{
        backgroundImage: "url('/community-bg.png')", // Ensure this path is correct
      }}
    />

    {/* Content */}
    <div className="relative z-20 max-w-6xl mx-auto text-white space-y-12 text-center">
      <motion.h1
        className="text-3xl md:text-5xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Join the Interface Community Network {/* Updated Title slightly */}
      </motion.h1>
      <motion.p
        className="text-lg text-white/80 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
      >
        Connect with our vibrant communities: PCAS for Canada-bound students,
        GradLab for expert mentorship on funded opportunities abroad, and the
        wider Interface network for global connections.
      </motion.p>

      {/* Community Benefits List - Updated structure */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        viewport={{ once: true }}
      >
        {communityBenefits.map((benefit, i) => (
          <motion.div
            key={i}
            className="flex flex-col gap-3 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10" // Changed layout to flex-col
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }} // Stagger animation
          >
            <div className="flex items-center gap-3">
              {" "}
              {/* Icon and Title row */}
              <div className="text-[#FF6B00] flex-shrink-0">{benefit.icon}</div>
              <h3 className="text-lg font-semibold text-white">
                {benefit.title}
              </h3>{" "}
              {/* Added Title Display */}
            </div>
            <p className="text-white/80 text-sm">{benefit.text}</p>{" "}
            {/* Description below */}
          </motion.div>
        ))}
      </motion.div>

      {/* Statistics Section - Commented out as per original code */}
      {/* <div className="grid md:grid-cols-3 gap-6 pt-8"> ... </div> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }} // Adjust delay
        viewport={{ once: true }}
      >
        <Link
          to="/communities" // Link remains the same
          className="inline-block px-8 py-3 bg-[#FF6B00] text-white font-semibold rounded-full shadow-lg hover:bg-orange-500 hover:scale-105 transition-all duration-300" // Enhanced styling
        >
          Explore Communities {/* Updated Button Text */}
        </Link>
      </motion.div>
    </div>
  </motion.section>
);

export default CommunitiesSection;
