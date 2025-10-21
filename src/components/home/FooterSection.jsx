import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// Added/Updated Icons based on document: Instagram, Facebook, Linkedin, Youtube, Mail, Phone, MapPin
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Send,
  Phone,
  MapPin,
} from "lucide-react"; // Removed Send icon as it's no longer used here

const FooterSection = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- IMPORTANT --- Replace # with your actual social media URLs
  const socialLinks = {
    instagram: "https://www.instagram.com/theinterfaceofficial", // Replace
    facebook: "https://facebook.com/interfaceofficialcom", // Replace
    linkedIn: "https://www.linkedin.com/company/theinterfaceofficial", // Replace
    youtube: "https://www.youtube.com/@TheinterfaceLearning", // Replace
  };
  // --- END OF DATA TO UPDATE ---

  // --- IMPORTANT --- Replace placeholders with actual office addresses
  const officeLocations = [
    {
      name: "Calgary, Canada",
      address: "55 Westwinds Crescent NE Unit 240, Calgary, Alberta, Canada",
      mapLink: "https://maps.app.goo.gl/QhtMJviEyAN1Wg3G9",
    }, // Replace
    {
      name: "Lahore, Pakistan",
      address: "DHA Phase 5, Lahore",
      mapLink: "https://maps.app.goo.gl/JZYbf5B17nDz3cBD6",
    }, // Replace
    {
      name: "Islamabad, Pakistan",
      address: "I-8 Markaz, Islamabad",
      mapLink: "https://maps.app.goo.gl/YqTwvLRBzDiu4GMz6",
    }, // Replace
    {
      name: "Gujrat, Pakistan",
      address: "BEST Institute, Bhimber Road, Gujrat",
      mapLink: "https://maps.app.goo.gl/6AwzKJvL82sRaA2h9",
    }, // Replace
  ];

  return (
    <motion.footer // Changed to footer semantic tag
      id="footer"
      className="py-16 md:py-20 w-full px-4 border-t border-white/10 bg-black/20" // Added bg color
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mb-12">
          {/* Column 1: Find Our Offices */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4 opacity-90 border-b border-white/10 pb-2">
              {/* Styled heading */}
              Find Our Offices
            </h3>
            <p className="text-sm text-white/70 mb-4">
              {" "}
              {/* Added descriptive text */}
              Visit us at one of our branches for personalized assistance.
            </p>
            <div className="space-y-3 text-sm text-white/70">
              {officeLocations.map((office) => (
                <div key={office.name}>
                  <p className="font-medium text-white/80">{office.name}</p>
                  <p className="flex items-start gap-1.5 mt-1">
                    <MapPin
                      size={14}
                      className="mt-0.5 flex-shrink-0 text-[#FF6B00]"
                    />
                    <span>{office.address}</span>
                  </p>
                  {/* Optional Map Link */}
                  <a
                    href={office.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFAB7A] hover:text-[#FF6B00] text-xs inline-flex items-center gap-1 mt-1"
                  >
                    View on Map <Send size={10} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4 opacity-90 border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <div className="space-y-2.5 text-sm text-white/70">
              {" "}
              {/* Increased spacing */}
              {/* Use buttons for same-page scroll */}
              <button
                onClick={() => scrollToSection("hero")}
                className="link link-hover block text-left hover:text-[#FF6B00]"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="link link-hover block text-left hover:text-[#FF6B00]"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="link link-hover block text-left hover:text-[#FF6B00]"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="link link-hover block text-left hover:text-[#FF6B00]"
              >
                Team
              </button>
              {/* Link to external pages */}
              <Link
                to="/consultation"
                className="link link-hover block hover:text-[#FF6B00]"
              >
                Consultation
              </Link>
              {/* <Link to="/faqs" className="link link-hover block hover:text-[#FF6B00]">FAQs</Link> */}
            </div>
          </div>

          {/* Column 3: Follow Us, Legal & Contact Info */}
          <div className="space-y-8">
            {" "}
            {/* Added more space */}
            {/* Follow Us */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg mb-4 opacity-90 border-b border-white/10 pb-2">
                Follow Us
              </h3>
              <div className="flex items-center gap-5">
                {" "}
                {/* Increased gap */}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-white/70 hover:text-[#FF6B00] transition-colors"
                  >
                    <Instagram size={22} />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-white/70 hover:text-[#FF6B00] transition-colors"
                  >
                    <Facebook size={22} />
                  </a>
                )}
                {socialLinks.linkedIn && (
                  <a
                    href={socialLinks.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-white/70 hover:text-[#FF6B00] transition-colors"
                  >
                    <Linkedin size={22} />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="text-white/70 hover:text-[#FF6B00] transition-colors"
                  >
                    <Youtube size={22} />
                  </a>
                )}
              </div>
            </div>
            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg mb-4 opacity-90 border-b border-white/10 pb-2">
                Legal
              </h3>
              <div className="space-y-2.5 text-sm text-white/70">
                <Link
                  to="/privacy-policy"
                  className="link link-hover block hover:text-[#FF6B00]"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-of-service"
                  className="link link-hover block hover:text-[#FF6B00]"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg mb-4 opacity-90 border-b border-white/10 pb-2">
                Get in Touch
              </h3>
              <div className="space-y-2 text-sm text-white/70">
                <a
                  href="mailto:info@interface.com"
                  className="link link-hover flex items-center gap-1.5 hover:text-[#FF6B00]"
                >
                  {" "}
                  {/* Replace email */}
                  <Mail size={14} /> info@interfaceofficial.com
                </a>
                <a
                  href="tel:+1234567890"
                  className="link link-hover flex items-center gap-1.5 hover:text-[#FF6B00]"
                >
                  {" "}
                  {/* Replace phone */}
                  <Phone size={14} /> +92 310 0445549
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Copyright Section */}
        <div className="pt-8 mt-8 border-t border-white/10 text-center text-xs text-white/50">
          <p>© {new Date().getFullYear()} Interface. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default FooterSection;
