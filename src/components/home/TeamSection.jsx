import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Linkedin } from "lucide-react"; // Added Linkedin Icon

const teamMembers = [
  {
    name: "Umer Farooq",
    role: "Chief Executive Officer & Co-founder",
    image: "/Umer Farooq.jpg",
    linkedin: "",
  },
  {
    name: "Waqas Mukhtar",
    role: "Immigration Director",
    image: "/Waqas Mukhtar.jpg",
    linkedin: "https://www.linkedin.com/in/waqasmukhtar",
  },
  {
    name: "Amna Yasser",
    role: "Chief Operating Officer",
    image: "/Amna Yasser.jpg",
    linkedin: "https://www.linkedin.com/in/amna-yasser-83ab554b/",
  },
  {
    name: "Maira Khan",
    role: "Manager, Client Relations & Lead Generation",
    image: "/Maira Khan.jpg",
    linkedin: "https://www.linkedin.com/in/maira-khan45/",
  },
  {
    name: "Abdullah Khan",
    role: "Manager, Student Advisory, and Financial Services",
    image: "/Abdullah Khan.jpg",
    linkedin: "https://www.linkedin.com/in/abdullah-khan-aaa2a121a/",
  },
  {
    name: "Wajiha Farooq",
    role: "Associate, Admissions",
    image: "/Wajiha Farooq.jpg",
    linkedin: "http://www.linkedin.com/in/wajiha-farooq-297a3635a/",
  },
  {
    name: "Furqan Ali",
    role: "Manager, Career Services, and Global Placements",
    image: "/Furqan Ali.jpg",
    linkedin: "https://www.linkedin.com/in/furqan-ali-231865253/",
  },
  {
    name: "Hamza Ahmed",
    role: "Manager, Admissions and Student Services",
    image: "/Hamza Ahmed.jpg",
    linkedin: "https://www.linkedin.com/in/i-hamza-ahmed/",
  },
  {
    name: "Zeeshan Ali Raza",
    role: "Digital Merketing Strategist & IT Consultant",
    image: "/Zeeshan Ali.png",
    linkedin: "https://www.linkedin.com/in/xishanaliraza/",
  },
  {
    name: "Muhammad Mehmood Ahmed",
    role: "Creative Director & Lead Graphic Designer",
    image: "/Muhammad Mehmood.jpg",
    linkedin: "https://www.linkedin.com/in/muhammad-mehmood-ahmed-049284335/",
  },
  {
    name: "Iqra Rajput",
    role: "Associate, Lead Management",
    image: "/Iqra Rajput.jpg",
    linkedin: "https://www.linkedin.com/in/iqra-rajput/",
  },
  {
    name: "Abdul Manan",
    role: "Regional Operations Manager",
    image: "/Abdul Manan.jpg",
    linkedin:
      "https://linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=abdul-manan-8a9b30130", // Replace
  },
  {
    name: "Sohail Khan",
    role: "Content Strategist & Copywriter",
    image: "/sohail-khan.jpg",
    linkedin: "https://www.linkedin.com/in/muhammad-sohail-28a1b7384/",
  },
  {
    name: "Kashmala Chaudhry",
    role: "RCIC – Director of Immigration Solutions",
    image: "/Kashmala.png",
    linkedin: "https://www.linkedin.com/in/kashmalachaudhry/",
  },
];

const TeamSection = ({ isLargeScreen }) => {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const teamCarouselRef = useRef(null);

  const teamVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
      },
    }),
  };

  const nextTeam = () => {
    setDirection(1);
    setActiveTeamIndex((prev) =>
      prev === teamMembers.length - 1 ? 0 : prev + 1
    );
  };

  const prevTeam = () => {
    setDirection(-1);
    setActiveTeamIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTeam();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTeamIndex]);

  const getVisibleTeamMembers = () => {
    if (!teamMembers || teamMembers.length === 0) return [];

    let visibleMembersIndices = [activeTeamIndex];

    if (isLargeScreen && teamMembers.length > 1) {
      const nextIndex = (activeTeamIndex + 1) % teamMembers.length;
      if (teamMembers.length > 2) {
        const next2Index = (activeTeamIndex + 2) % teamMembers.length;
        visibleMembersIndices = [activeTeamIndex, nextIndex, next2Index];
      } else {
        visibleMembersIndices = [activeTeamIndex, nextIndex];
      }
    }
    return visibleMembersIndices.map((index) => teamMembers[index]);
  };

  return (
    <motion.section
      id="team"
      className="flex items-center justify-center w-full min-h-screen py-20 px-4 overflow-hidden" // Added overflow hidden
    >
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#FF6B00]/20 to-[#FF6B00]/5 blur-3xl -z-10" // Ensure background elements are behind content
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-gradient-to-l from-[#FF6B00]/20 to-[#FF6B00]/5 blur-3xl -z-10" // Ensure background elements are behind content
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="max-w-6xl mx-auto space-y-12 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <motion.h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h1>
          <motion.p
            className="text-white/70 max-w-3xl mx-auto" // Increased max-width
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our team is a diverse group of professionals with deep knowledge and
            experience in education, immigration, and business development. We
            pride ourselves on our personalized approach and commitment to
            providing tailored solutions for each individual.
          </motion.p>
        </motion.div>

        <div className="relative mt-16 px-10" ref={teamCarouselRef}>
          <div
            className={`flex justify-center items-start gap-8 h-[550px] md:h-[500px]`}
          >
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout" // Use popLayout for smoother transitions with varying content heights
            >
              {isLargeScreen
                ? getVisibleTeamMembers().map((member, index) => (
                    <motion.div
                      key={`${member.name}-${index}`} // Use a unique key
                      custom={direction}
                      variants={teamVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      layout // Enable layout animations
                      className={`bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-auto max-w-xs w-full flex flex-col
                         ${
                           index === 0
                             ? "z-20"
                             : index === 1
                             ? "z-10 opacity-80 scale-90 mt-4"
                             : "z-0 opacity-60 scale-85 mt-8"
                         }`}
                      whileHover={{
                        scale: index === 0 ? 1.03 : index === 1 ? 0.93 : 0.88, // Adjust hover scale
                        boxShadow: "0 0 20px rgba(255, 107, 0, 0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <TeamMemberCard member={member} isActive={index === 0} />
                    </motion.div>
                  ))
                : // On smaller screens, only show the active member centered
                  teamMembers.length > 0 && (
                    <motion.div
                      key={`${teamMembers[activeTeamIndex]?.name}-active`}
                      custom={direction}
                      variants={teamVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      layout
                      className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-auto max-w-xs w-full flex flex-col z-20"
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 0 20px rgba(255, 107, 0, 0.2)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <TeamMemberCard
                        member={teamMembers[activeTeamIndex]}
                        isActive={true}
                      />
                    </motion.div>
                  )}
            </AnimatePresence>
          </div>

          {teamMembers.length > 1 && ( // Only show dots if more than one member
            <div className="flex justify-center mt-8">
              {teamMembers.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2.5 h-2.5 mx-1.5 rounded-full transition-colors duration-300 ${
                    // Adjusted size/margin
                    activeTeamIndex === index
                      ? "bg-[#FF6B00] scale-125"
                      : "bg-white/40" // Scale active dot
                  }`}
                  onClick={() => {
                    if (index === activeTeamIndex) return; // Don't re-trigger for active dot
                    setDirection(index > activeTeamIndex ? 1 : -1);
                    setActiveTeamIndex(index);
                  }}
                  whileHover={{
                    scale: 1.3,
                    backgroundColor: "rgba(255, 107, 0, 0.7)",
                  }} // Hover effect
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }} // Springy tap
                />
              ))}
            </div>
          )}

          {teamMembers.length > 1 && ( // Only show arrows if more than one member
            <>
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full text-white hover:bg-[#FF6B00] transition-colors z-30 shadow-md" // Added shadow
                onClick={prevTeam}
                whileHover={{ scale: 1.1, x: -3 }} // Enhanced hover
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                aria-label="Previous team member"
              >
                <ChevronLeft size={20} /> {/* Slightly smaller icon */}
              </motion.button>
              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-2 rounded-full text-white hover:bg-[#FF6B00] transition-colors z-30 shadow-md" // Added shadow
                onClick={nextTeam}
                whileHover={{ scale: 1.1, x: 3 }} // Enhanced hover
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                aria-label="Next team member"
              >
                <ChevronRight size={20} /> {/* Slightly smaller icon */}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

const TeamMemberCard = ({ member }) => {
  if (!member) return null;

  return (
    <>
      <div className="relative mb-4 team-image-container flex-shrink-0">
        <div className="w-full pt-[100%] rounded-xl overflow-hidden relative group shadow-lg">
          <motion.img
            src={member.image || "/placeholder-avatar.png"} // Fallback image
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110" // Use CSS transition for smoother hover
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>{" "}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-center bg-gradient-to-t from-black/80 to-transparent pt-10">
          <h3 className="text-lg font-semibold text-white drop-shadow-md">
            {member.name}
          </h3>
          <p className="text-[#FFAB7A] font-medium text-sm">{member.role}</p>
        </div>
      </div>
      <div className="space-y-3 flex-grow flex flex-col justify-between mt-2">
        {/* LinkedIn Link */}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-sm text-[#FFAB7A] hover:text-[#FF6B00] transition-colors mt-3 py-1 rounded-md bg-black/20 hover:bg-black/30"
          >
            <Linkedin size={14} /> View Profile
          </a>
        )}
      </div>
    </>
  );
};

export default TeamSection;
