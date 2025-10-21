import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const navLinks = [
  { to: "", label: "Home" },
  { to: "about", label: "Mission" },
  { to: "services", label: "Services" },
  { to: "team", label: "Team" },
  { to: "communities", label: "Communities" },
  { to: "testimonials", label: "Testimonials" },
  { to: "contact", label: "Contact Us" },
];

export default function Navbar() {
  useEffect(() => {
    const handleLinkClick = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, []);

  return (
    <div className="drawer">
      <input id="nav-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Navbar */}
      <div className="drawer-content">
        <motion.nav
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          className="navbar px-4"
        >
          {/* Mobile menu button */}
          <div className="navbar-start lg:hidden">
            <label
              htmlFor="nav-drawer"
              className="btn btn-ghost"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </label>
          </div>

          {/* Logo */}
          <div className="navbar-start hidden lg:block">
            <Link to="/" className="text-xl">
              <img src="/Logo.svg" alt="Logo" className="w-30" />
            </Link>
          </div>

          {/* Navigation links */}
          <div className="navbar-center hidden lg:block">
            <ul className="flex gap-4">
              {navLinks.map(({ to, label }) => (
                <motion.li
                  whileHover={{
                    scale: 1.05,
                    color: "orange",
                    textShadow: "0 0 10px var(--color-primary)",
                  }}
                  key={to}
                >
                  <a href={`#${to}`}>{label}</a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Call to action */}
          <div className="navbar-end">
            <Link to="/dashboard" className="btn btn-outline btn-primary">
              Get Started
            </Link>
          </div>
        </motion.nav>
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="nav-drawer"
          className="drawer-overlay"
          aria-label="Close sidebar"
        />

        <ul className="flex flex-col gap-4 bg-base-100/70 min-h-screen w-1/2 p-4">
          <li>
            <Link to="/" className="text-xl">
              <img src="/Logo.svg" alt="Logo" className="w-30" />
            </Link>
          </li>
          {navLinks.map(({ to, label }) => (
            <motion.li
              whileHover={{
                scale: 1.05,
                color: "orange",
                textShadow: "0 0 10px var(--color-primary)",
              }}
              key={to}
            >
              {/* <Link to={to}>{label}</Link> */}
              <a href={`#${to}`}>{label}</a>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
