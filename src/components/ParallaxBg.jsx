import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ParallaxBg = ({ imageUrl }) => {
  const { scrollYProgress } = useScroll();

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  const yBg = useTransform(smoothScrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <motion.div
      className="fixed inset-0 bg-cover bg-center -z-10"
      style={{
        y: yBg,
        backgroundImage: `url(${imageUrl})`,
      }}
    />
  );
};

export default ParallaxBg;
