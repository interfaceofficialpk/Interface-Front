import { motion } from "framer-motion";
// Import Link from react-router-dom
import { Link } from "react-router-dom";
// Or if using Next.js: import Link from 'next/link';

// Using relevant icons for each main category
import {
  Plane, // For Immigration
  GraduationCap, // For Education
  BrainCircuit, // For AI Solutions
  ShieldCheck, // For RCIC Consultation (Regulation/Trust)
  Cog,
} from "lucide-react";

// Define the main service categories as cards
const serviceCategories = [
  {
    id: "immigration",
    icon: <Plane size={32} className="text-[#FF6B00]" />,
    title: "Immigration Services",
    description:
      "Specialized support for professionals, entrepreneurs, and families seeking to immigrate to Canada, the USA, and beyond. Includes work permits and permanent residency assistance.",
  },
  {
    id: "education",
    icon: <GraduationCap size={32} className="text-[#FF6B00]" />,
    title: "Global Education Services",
    description:
      "Expert guidance for university admissions across Canada, Germany, USA, UK, and Europe. Includes visa assistance, program selection, and post-graduation support.",
  },
  {
    id: "ai-solutions",
    icon: <Cog size={32} className="text-[#FF6B00]" />,
    title: "AI Powered Solutions",
    description:
      "Leveraging cutting-edge AI to streamline your education and immigration journey, from application processing to eligibility checks, ensuring efficiency and accuracy.",
  },
  {
    id: "rcic-consultation",
    icon: <ShieldCheck size={32} className="text-[#FF6B00]" />,
    title: "RCIC Consultation",
    description:
      "Professional advice and representation from Registered Canadian Immigration Consultants (RCICs) to navigate the complexities of Canadian immigration law and procedures effectively.",
  },
];

const ServicesSection = () => {
  return (
    <motion.section
      id="services"
      className="flex flex-col items-center justify-center min-h-screen py-20 px-4"
    >
      <div className="max-w-6xl mx-auto space-y-12 w-full">
        {" "}
        {/* Container for title, grid, and button */}
        <motion.h1
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Services
        </motion.h1>
        {/* Grid of Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={`service-card-${category.id}`}
              className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6 flex flex-col items-center text-center space-y-4 h-full transform transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{
                scale: 1.03,
                y: -5,
                borderColor: "rgba(255, 107, 0, 0.7)",
              }}
            >
              <div className="w-16 h-16 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mb-3">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">
                {category.title}
              </h3>
              <p className="text-white/70 text-sm flex-grow">
                {category.description}
              </p>
              {/* Button removed from here */}
            </motion.div>
          ))}
        </div>{" "}
        {/* End of grid */}
        {/* Centered "Learn More" Button for the whole section */}
        <motion.div
          className="text-center pt-12" // Add padding top for spacing
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }} // Delay slightly after cards animate in
        >
          <Link
            to="/services" // Destination path for react-router-dom
            // For Next.js use: href="/services" passHref
            className="inline-block px-8 py-3 bg-[#FF6B00] text-white text-base font-semibold rounded-lg hover:bg-[#FF8533] transition-colors duration-200 ease-in-out shadow-lg hover:shadow-xl" // Slightly larger button styling
          >
            Learn More About Our Services
          </Link>
          {/* If using Next.js Link with a non-<a> child, you might need passHref and an <a> tag inside:
           <Link href="/services" passHref>
             <a className="...">Learn More About Our Services</a>
           </Link>
          */}
        </motion.div>
      </div>{" "}
      {/* End of max-w-6xl container */}
    </motion.section>
  );
};

export default ServicesSection;
