import React from "react"; // Added React import
import { motion } from "framer-motion";
// import ScrollToTop from "../components/scrollToTop"; // Keep if MainLayout doesn't handle it

const PrivacyPolicy = () => {
  // Dynamically get the current date for "Last updated"
  const lastUpdatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // Use full month name
    day: "numeric",
  });

  return (
    <>
      {/* <ScrollToTop /> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Use container for consistent centering and padding
        className="container mx-auto px-4 py-16 md:py-20 max-w-3xl" // Adjusted max-width slightly for readability
      >
        {/* Page Header */}
        <div className="mb-8 md:mb-10 border-b border-white/10 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/60 mt-2">
            Last updated: {lastUpdatedDate}
          </p>
        </div>

        {/* Content Area using Tailwind Typography */}
        {/* Ensure prose-invert applies theme's text colors correctly */}
        <div
          className="prose prose-sm sm:prose-base prose-invert max-w-none space-y-6
                        prose-headings:text-white prose-headings:font-semibold
                        prose-p:text-white/80 prose-ul:text-white/80 prose-li:marker:text-primary
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white/90"
        >
          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">1. Introduction</h2>{" "}
            {/* Use !important if prose overrides */}
            <p>
              Interface ("we", "our", or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website and use our services (collectively, the "Service").
            </p>
            <p>
              Please read this privacy policy carefully. By using the Service,
              you agree to the collection and use of information in accordance
              with this policy. If you do not agree with the terms of this
              privacy policy, please do not access the Service.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">2. Information We Collect</h2>
            <h3 className="!text-lg !font-medium !text-white/90 !mt-4 !mb-2">
              Personal Data
            </h3>
            <p>
              While using our Service, we may ask you to provide us with certain
              personally identifiable information that can be used to contact or
              identify you ("Personal Data"). Personally identifiable
              information may include, but is not limited to:
            </p>
            <ul>
              <li>
                Contact Information (e.g., full name, email address, phone
                number)
              </li>
              <li>
                Account Information (e.g., username, password - stored securely)
              </li>
              <li>
                Demographic Information (e.g., date of birth, nationality,
                address)
              </li>
              <li>
                Educational & Professional Information (e.g., academic
                transcripts, test scores, work history - only when you provide
                them for specific services)
              </li>
              <li>
                Payment Information (processed securely via third-party payment
                processors; we do not store full card details)
              </li>
            </ul>

            <h3 className="!text-lg !font-medium !text-white/90 !mt-4 !mb-2">
              Usage Data
            </h3>
            <p>
              We may also collect information on how the Service is accessed and
              used ("Usage Data"). This Usage Data may include information such
              as your computer's Internet Protocol address (IP address), browser
              type, browser version, the pages of our Service that you visit,
              the time and date of your visit, the time spent on those pages,
              unique device identifiers, and other diagnostic data.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">3. How We Use Your Information</h2>
            <p>We use the collected data for various purposes:</p>
            <ul>
              <li>To provide, maintain, and improve our Service</li>
              <li>To manage your account and registration</li>
              <li>To process your transactions and applications</li>
              <li>To provide personalized counseling and support</li>
              <li>
                To communicate with you, including responding to inquiries and
                sending service updates
              </li>
              <li>
                To monitor the usage of our Service and prevent fraudulent
                activity
              </li>
              <li>To comply with legal obligations</li>
              <li>For other purposes with your consent</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">4. Data Security</h2>
            <p>
              The security of your data is important to us. We implement
              reasonable administrative, technical, and physical security
              measures designed to protect your personal information from
              unauthorized access, use, alteration, and disclosure. However,
              please be aware that no security measures are perfect or
              impenetrable, and no method of data transmission can be guaranteed
              against any interception or other type of misuse.
            </p>
          </section>

          {/* Data Retention */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">5. Data Retention</h2>
            <p>
              We will retain your Personal Data only for as long as is necessary
              for the purposes set out in this Privacy Policy, including for the
              purposes of satisfying any legal, accounting, or reporting
              requirements.
            </p>
          </section>

          {/* Third-Party Service Providers */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">
              6. Third-Party Service Providers
            </h2>
            <p>
              We may employ third-party companies and individuals to facilitate
              our Service ("Service Providers"), provide the Service on our
              behalf, perform Service-related services (e.g., payment
              processing, data analysis, hosting), or assist us in analyzing how
              our Service is used.
            </p>
            <p>
              These third parties have access to your Personal Data only to
              perform these tasks on our behalf and are obligated not to
              disclose or use it for any other purpose.
            </p>
          </section>

          {/* Your Data Protection Rights */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">7. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul>
              <li>
                The right to access – You have the right to request copies of
                your personal data.
              </li>
              <li>
                The right to rectification – You have the right to request that
                we correct any information you believe is inaccurate or complete
                information you believe is incomplete.
              </li>
              <li>
                The right to erasure – You have the right to request that we
                erase your personal data, under certain conditions.
              </li>
              <li>
                The right to restrict processing – You have the right to request
                that we restrict the processing of your personal data, under
                certain conditions.
              </li>
              <li>
                The right to object to processing – You have the right to object
                to our processing of your personal data, under certain
                conditions.
              </li>
              <li>
                The right to data portability – You have the right to request
                that we transfer the data that we have collected to another
                organization, or directly to you, under certain conditions.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the
              details provided below.
            </p>
          </section>

          {/* Changes to This Privacy Policy */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date. You are advised to review
              this Privacy Policy periodically for any changes. Changes are
              effective when they are posted on this page.
            </p>
          </section>

          {/* Contact Us */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <ul>
              <li>
                By email:{" "}
                <a href="mailto:privacy@interface.com">privacy@interface.com</a>
              </li>
              <li>By phone: +1 (234) 567-8900 (Replace with actual number)</li>
              <li>
                By mail: Interface, 123 Education Street, Tech City, TC 12345,
                USA (Replace with actual address)
              </li>
            </ul>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default PrivacyPolicy;
