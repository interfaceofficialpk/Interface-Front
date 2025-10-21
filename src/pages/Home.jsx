import AboutSection from "../components/home/AboutSection";
import HeroSection from "../components/home/HeroSection";
import PartnerUniversities from "../components/home/PartnerUniversities";
import ServicesSection from "../components/home/ServicesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CommunitiesSection from "../components/home/CommunitiesSection";
import ContactSection from "../components/home/ContactSection";
import FooterSection from "../components/home/FooterSection";
import { GlobalConfig } from "../GlobalConfig";
import { useEffect, useState } from "react";
import TeamSection from "../components/home/TeamSection";

export default function Home() {
  const { appName } = GlobalConfig;
  const title = `${appName} - Home`;

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768); // 768px is typical tablet breakpoint
    };

    checkScreenSize(); // Check initially
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      <title>{title}</title>
      <HeroSection />

      <AboutSection />

      <PartnerUniversities />

      <ServicesSection />

      <TeamSection isLargeScreen={isLargeScreen} />

      <CommunitiesSection />

      <TestimonialsSection />

      <ContactSection />

      <FooterSection />
    </>
  );
}
