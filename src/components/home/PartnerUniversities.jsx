import { motion } from "motion/react";

const universityLogos = [
  { name: "University of Toronto", src: "/UOT.png" },
  { name: "University of Windsor", src: "/UOW.png" },
  {
    name: "Trinity Western University",
    src: "/Trinity Western University.png",
  },
  {
    name: "University of British Columbia",
    src: "/University of British colombia.png",
  },
  { name: "McGill University", src: "/mcGill.png" },
  { name: "Lakehead University", src: "/lakehead University.png" },
  { name: "University of Waterloo", src: "/Waterloo University.png" },
  { name: "Queens University", src: "/Queens University.png" },
  { name: "University of Manitoba", src: "/University of Manitoba.png" },
];

const LOGO_WIDTH_PLUS_MARGIN_PX = 230; // Approx width (150px) + margin (40px*2) = 230px. Adjust as needed!
const ANIMATION_DURATION_SECONDS = 30; // Adjust speed as needed

const PartnerUniversities = () => {
  const duplicatedLogos = [...universityLogos, ...universityLogos];

  const originalWidth = universityLogos.length * LOGO_WIDTH_PLUS_MARGIN_PX;

  const marqueeVariants = {
    animate: {
      x: [-originalWidth, 0], // Animate from shifted position back to start
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: ANIMATION_DURATION_SECONDS,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div
      id="partner-universities"
      className="py-2 md:py-4 max-w-full rounded-xs"
    >
      <h2 className="text-center mb-8 text-2xl md:text-3xl font-semibold">
        Our Partner Universities
      </h2>
      <div className="w-full overflow-hidden relative">
        <motion.div
          className="flex"
          style={{ width: `${originalWidth * 2}px` }}
          variants={marqueeVariants}
          animate="animate"
        >
          {duplicatedLogos.map((uni, index) => (
            <div
              key={`${uni.name}-${index}`}
              style={{ width: `${LOGO_WIDTH_PLUS_MARGIN_PX}px` }} // Ensure consistent spacing
            >
              <img
                src={uni.src}
                alt={`${uni.name} Logo`}
                title={uni.name} // Tooltip on hover
                className="h-12 md:h-16 max-w-[130px] md:max-w-[150px] object-contain mx-auto filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerUniversities;
