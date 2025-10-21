import { motion, animate, useInView } from "framer-motion"; // Import animate and useInView
import { useEffect, useRef } from "react"; // Import useEffect and useRef

// Helper component for animating numbers
function AnimatedNumber({ value, suffix = "", className = "" }) {
  const ref = useRef(null);
  // Use useInView to trigger animation only when the element is visible
  const isInView = useInView(ref, { once: true, margin: "-50px" }); // Trigger slightly before fully in view, run once

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, value, {
        duration: 1.5, // Duration of the count-up animation (in seconds)
        ease: "easeOut", // Easing function
        onUpdate(latest) {
          // Check if the ref is still mounted before updating
          if (ref.current) {
            // Format the number (e.g., add commas for thousands if needed)
            ref.current.textContent = latest.toFixed(0); // Display integer part
          }
        },
      });

      // Optional: Return cleanup function to stop animation if component unmounts
      return () => controls.stop();
    }
  }, [isInView, value]); // Rerun effect if value or isInView changes

  // Render the span and the suffix
  return (
    <h3 className={`text-3xl font-bold text-[#FF6B00] ${className}`}>
      <span ref={ref}>0</span>
      {/* Initial value */}
      {suffix}
    </h3>
  );
}

const AboutSection = () => {
  // Data for the statistics section
  const stats = [
    { value: 500, suffix: "+", label: "Universities Partnered" },
    { value: 10, suffix: "k+", label: "Students Supported" }, // Use 10 for 10k
    { value: 95, suffix: "%", label: "Visa Success Rate" },
    { value: 50, suffix: "+", label: "Countries Served" },
  ];

  return (
    <motion.section
      id="about"
      className="flex flex-col items-center justify-center min-h-screen py-20 px-4"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.h1
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }} // Added transition
        >
          Our Mission
        </motion.h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }} // Added transition
          >
            {/* Text content remains the same */}
            <h2 className="text-2xl font-semibold text-[#FF6B00]">
              Empowering Individuals and Families Worldwide
            </h2>
            <p className="text-white/70 text-lg">
              At Interface, our mission is to empower individuals and families
              by providing expert immigration and education services that open
              doors to new opportunities worldwide. We believe that everyone
              deserves access to the best education, career, and living
              opportunities abroad, and we are committed to guiding you every
              step of the way.
            </p>
            <p className="text-white/70 text-lg">
              Our goal is to make the entire process simple, seamless, and
              effective. Whether you’re seeking a new life in Canada, furthering
              your education in the UK, or growing your business across borders,
              we ensure that you have the right knowledge, support, and
              resources to succeed.
            </p>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            // Use whileInView on the parent to trigger animations within
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} // Trigger animation only once
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }} // Parent container animation
            className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  // Optional: add stagger effect to individual items
                  // initial={{ opacity: 0, y: 10 }}
                  // whileInView={{ opacity: 1, y: 0 }}
                  // viewport={{ once: true }}
                  // transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }} // Stagger delay based on parent's delay
                  className="p-4 bg-black/30 rounded-lg border border-white/10 text-center"
                >
                  {/* Use the AnimatedNumber component */}
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  <p className="text-white/70 mt-1 text-sm">
                    {stat.label}
                  </p>{" "}
                  {/* Adjusted margin/size */}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
