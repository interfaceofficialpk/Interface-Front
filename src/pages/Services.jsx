import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FooterSection from "../components/home/FooterSection";
import {
  Briefcase,
  GraduationCap,
  Lightbulb,
  ShieldCheck,
  Users,
  School,
  Search,
  FileText,
  Bell,
} from "lucide-react";
// import CursorGlow from "../components/cursor-glow";
import { Link } from "react-router-dom"; // Add this line if not already present

// Animation Variants for Bento Items and nested cards
const bentoItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Keep nested card variants as they were (or simplify if no longer needed)
const cardContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ServicesPage = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768); // Tablet breakpoint
    };
    checkScreenSize(); // Check initially
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup listener
  }, []);

  // Service data remains the same
  const immigrationServices = [
    { title: "Healthcare Immigration", icon: Briefcase },
    { title: "Educationalist's Immigration", icon: GraduationCap },
    { title: "Entrepreneur & Investor", icon: Lightbulb },
    { title: "Study & Work Permits", icon: FileText },
  ];
  const educationServices = [
    { title: "Admissions Guidance", icon: School },
    { title: "Program Selection", icon: Search },
    { title: "Visa Application", icon: FileText },
    { title: "Post-Graduation Support", icon: Briefcase },
  ];
  const aiServices = [
    { title: "Profile Matching", icon: Users },
    { title: "Document Review", icon: FileText },
    { title: "Eligibility Assessment", icon: Search },
    { title: "Real-Time Updates", icon: Bell },
  ];
  const rcicServices = [
    { title: "Authorized Representation", icon: ShieldCheck },
    { title: "Expert Legal Advice", icon: GraduationCap },
    { title: "Application Accuracy", icon: FileText },
    { title: "Authority Communication", icon: Users },
  ];

  // --- REVISED: Helper for nested service cards (Reverted to original styling) ---
  // No hover effects needed here now
  const renderNestedServiceCard = (service, index) => {
    const IconComponent = service.icon;
    return (
      <motion.div
        key={index}
        className="card bg-base-100 shadow-md border border-base-300/30" // Reverted class
        variants={cardVariants} // Still use variants for entrance animation
        // No whileHover needed here anymore
      >
        <div className="card-body flex flex-row items-center space-x-3 p-3">
          {IconComponent && (
            <IconComponent className="w-5 h-5 text-primary flex-shrink-0" />
          )}
          <h4 className="text-sm font-medium">{service.title}</h4>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* {isLargeScreen && <CursorGlow />} */}
      <div className="container mx-auto px-4 py-8 min-h-screen overflow-x-hidden">
        <motion.h1
          className="text-4xl lg:text-5xl font-bold text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Comprehensive Services
        </motion.h1>

        {/* --- Bento Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Immigration Services (Spanning 2 columns) */}
          <motion.div
            id="immigration-services"
            // --- UPDATED classes and added whileHover ---
            className="card md:col-span-2 bg-base-200/60 dark:bg-base-200/30 shadow-xl p-6 md:p-8 backdrop-blur-md border border-base-300/30 hover:border-primary hover:border-2 transition-all duration-300 ease-out"
            variants={bentoItemVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.02 }} // Subtle scale for larger card
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="card-body p-0">
              <h2 className="card-title text-2xl lg:text-3xl font-semibold mb-4 text-primary">
                Immigration Services
              </h2>
              <p className="text-base-content/80 leading-relaxed mb-6">
                We specialize in providing expert immigration support for
                individuals and families looking to move to Canada, the USA, and
                other global destinations. Our dedicated team guides you through
                every step of the process.
              </p>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {immigrationServices.map(renderNestedServiceCard)}
              </motion.div>
            </div>
          </motion.div>

          {/* Global Education Services (Spanning 1 column) */}
          <motion.div
            id="global-education-services"
            // --- UPDATED classes and added whileHover ---
            className="card md:col-span-1 bg-base-200/60 dark:bg-base-200/30 shadow-xl p-6 md:p-8 backdrop-blur-md border border-base-300/30 hover:border-primary hover:border-2 transition-all duration-300 ease-out"
            variants={bentoItemVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.02 }} // Subtle scale for larger card
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="card-body p-0">
              <h2 className="card-title text-2xl lg:text-3xl font-semibold mb-4 text-primary">
                Global Education
              </h2>
              <p className="text-base-content/80 leading-relaxed mb-6">
                Interface offers personalized support to students aiming for
                higher education globally. We help you find the right path and
                institution.
              </p>
              <motion.div
                className="grid grid-cols-1 gap-4"
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {educationServices.map(renderNestedServiceCard)}
              </motion.div>
            </div>
          </motion.div>

          {/* AI-Powered Services (Spanning 1 column) */}
          <motion.div
            id="ai-powered-services"
            // --- UPDATED classes and added whileHover ---
            className="card md:col-span-1 bg-base-200/60 dark:bg-base-200/30 shadow-xl p-6 md:p-8 backdrop-blur-md border border-base-300/30 hover:border-primary hover:border-2 transition-all duration-300 ease-out"
            variants={bentoItemVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.02 }} // Subtle scale for larger card
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="card-body p-0">
              <h2 className="card-title text-2xl lg:text-3xl font-semibold mb-4 text-primary">
                AI Solutions
              </h2>
              <p className="text-base-content/80 leading-relaxed mb-6">
                Leveraging cutting-edge AI for smarter, faster, and more
                accurate education and immigration solutions.
              </p>
              <motion.div
                className="grid grid-cols-1 gap-4"
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {aiServices.map(renderNestedServiceCard)}
              </motion.div>
            </div>
          </motion.div>

          {/* RCIC Services (Spanning 2 columns) */}
          <motion.div
            id="rcic-services"
            // --- UPDATED classes and added whileHover ---
            className="card md:col-span-2 bg-base-200/60 dark:bg-base-200/30 shadow-xl p-6 md:p-8 backdrop-blur-md border border-base-300/30 hover:border-primary hover:border-2 transition-all duration-300 ease-out"
            variants={bentoItemVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.02 }} // Subtle scale for larger card
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="card-body p-0">
              <h2 className="card-title text-2xl lg:text-3xl font-semibold mb-4 text-primary">
                RCIC-Certified Services
              </h2>
              <p className="text-base-content/80 leading-relaxed mb-6">
                Trust our Regulated Canadian Immigration Consultants (RCICs) for
                authorized, expert advice and representation for Canadian
                immigration matters, ensuring professional and ethical handling
                according to law.
              </p>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {rcicServices.map(renderNestedServiceCard)}
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* --- End of Bento Grid Layout --- */}

        <motion.div
          className="text-center mt-16 mb-12 md:mt-24" // Add margin top/bottom for spacing
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }} // Added a slight delay
        >
          <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-base-content/80 max-w-xl mx-auto mb-8">
            Let our experts guide you. Book a personalized consultation today to
            discuss your specific needs and goals.
          </p>
          <Link to="/consultation">
            {" "}
            {/* Ensure this path matches your consultation page route */}
            <motion.button
              className="btn btn-primary btn-lg shadow-lg" // Style the button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
              }} // Hover effect
              whileTap={{ scale: 0.95 }} // Tap effect
              transition={{ duration: 0.2 }}
            >
              Book a Consultation
            </motion.button>
          </Link>
        </motion.div>
      </div>{" "}
      {/* End of container */}
      <FooterSection />
    </>
  );
};

export default ServicesPage;
