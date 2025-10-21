import React from "react"; // Added React import
import { motion } from "framer-motion";
// import ScrollToTop from "../components/scrollToTop"; // Keep if MainLayout doesn't handle it

const TermsOfService = () => {
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
        className="container mx-auto px-4 py-16 md:py-20 max-w-3xl" // Adjusted max-width for readability
      >
        {/* Page Header */}
        <div className="mb-8 md:mb-10 border-b border-white/10 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-white/60 mt-2">
            Last updated: {lastUpdatedDate}
          </p>
        </div>

        {/* Content Area using Tailwind Typography */}
        <div
          className="prose prose-sm sm:prose-base prose-invert max-w-none space-y-6
                        prose-headings:text-white prose-headings:font-semibold
                        prose-p:text-white/80 prose-ul:text-white/80 prose-li:marker:text-primary
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white/90"
        >
          {/* Section 1: Introduction */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">1. Acceptance of Terms</h2>
            <p>
              Welcome to Interface ("we", "our", or "us"). These Terms of
              Service ("Terms") govern your access to and use of our website,
              platform, and related educational consulting services
              (collectively, the "Service").
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, then you do not
              have permission to access the Service. These Terms apply to all
              visitors, users, and others who wish to access or use the Service.
            </p>
          </section>

          {/* Section 2: License to Use */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">2. License to Use</h2>
            <p>
              Subject to your compliance with these Terms, Interface grants you
              a limited, non-exclusive, non-transferable, non-sublicensable
              license to access and use the Service for your personal,
              non-commercial educational purposes.
            </p>
            <p>You must not:</p>
            <ul>
              <li>
                Reproduce, duplicate, copy, sell, resell, or exploit any portion
                of the Service without express written permission from us.
              </li>
              <li>Use the Service for any illegal or unauthorized purpose.</li>
              <li>
                Attempt to gain unauthorized access to the Service or its
                related systems or networks.
              </li>
              <li>
                Modify, adapt, translate, or reverse engineer any portion of the
                Service.
              </li>
            </ul>
            <p>
              All intellectual property rights related to the Service, including
              its content, features, and functionality, are and will remain the
              exclusive property of Interface and its licensors.
            </p>
          </section>

          {/* Section 3: User Accounts */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">3. User Accounts</h2>
            <p>
              To access certain features of the Service, you may be required to
              create an account. You agree to provide accurate, current, and
              complete information during the registration process and to update
              such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your account password and for
              any activities or actions under your account. You agree not to
              disclose your password to any third party and must notify us
              immediately upon becoming aware of any breach of security or
              unauthorized use of your account. Interface cannot and will not be
              liable for any loss or damage arising from your failure to comply
              with this security obligation.
            </p>
          </section>

          {/* Section 4: Educational Services & Disclaimers */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">
              4. Educational Services & Disclaimers
            </h2>
            <p>
              Interface provides educational consulting services, including
              university application assistance, counseling, document
              management, and visa guidance. Our services are advisory and
              supportive in nature.
            </p>
            <p>
              We explicitly{" "}
              <strong className="font-semibold">do not guarantee</strong>:
            </p>
            <ul>
              <li>
                Admission or acceptance into any specific educational
                institution or program.
              </li>
              <li>The award of any scholarships, grants, or financial aid.</li>
              <li>Approval of visa applications by government authorities.</li>
              <li>
                Any specific academic outcome or future employment result.
              </li>
            </ul>
            <p>
              Admission, visa, and scholarship decisions are made solely by the
              respective institutions and authorities based on their own
              criteria and processes. Our role is to assist you in presenting
              your application to the best of your ability based on the
              information you provide. You are ultimately responsible for the
              accuracy and completeness of all information submitted.
            </p>
          </section>

          {/* Section 5: Payments and Refunds */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">5. Payments and Refunds</h2>
            <p>
              Fees for certain Services are described on our website or provided
              to you directly. You agree to pay all applicable fees for the
              Services you purchase. All payments are processed through secure
              third-party payment gateways.
            </p>
            <p>
              Our refund policy depends on the specific service purchased and
              will be outlined in your service agreement or at the point of
              purchase. Generally, fees for services rendered (such as
              consultations held or applications processed) are non-refundable.
              Please review the specific terms associated with your purchase.
            </p>
          </section>

          {/* Section 6: User Content & Conduct */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">6. User Content & Conduct</h2>
            <p>
              Our Service may allow you to upload documents, post comments, or
              share other information ("User Content"). You retain ownership of
              your User Content, but by providing it to the Service, you grant
              Interface a worldwide, non-exclusive, royalty-free license to use,
              reproduce, modify (for formatting), and display such content
              solely for the purpose of providing the Service to you.
            </p>
            <p>
              You agree not to use the Service to post or transmit any User
              Content that is unlawful, harmful, threatening, abusive,
              harassing, defamatory, vulgar, obscene, libelous, invasive of
              another's privacy, hateful, or racially, ethnically, or otherwise
              objectionable. You are solely responsible for your User Content
              and your conduct while using the Service.
            </p>
          </section>

          {/* Section 7: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, in no event
              shall Interface, its affiliates, directors, employees, agents, or
              licensors be liable for any indirect, punitive, incidental,
              special, consequential, or exemplary damages, including without
              limitation damages for loss of profits, goodwill, use, data, or
              other intangible losses, arising out of or relating to the use of,
              or inability to use, the Service.
            </p>
            <p>
              Our total liability to you for any damages arising from or related
              to these Terms or the Service is limited to the amount you paid
              us, if any, in the past six months for the Services giving rise to
              the claim.
            </p>
          </section>

          {/* Section 8: Governing Law */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of [Your Jurisdiction, e.g., the State of California, USA or
              Punjab, Pakistan], without regard to its conflict of law
              provisions.
            </p>
            <p>
              Any disputes arising from or relating to these Terms or the
              Service shall be subject to the exclusive jurisdiction of the
              courts located in [Your City, Your Jurisdiction].
            </p>
          </section>

          {/* Section 9: Changes to Terms */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">9. Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide reasonable notice (e.g., via email or a notice on the
              Service) prior to any new terms taking effect. What constitutes a
              material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you are no longer authorized to
              use the Service.
            </p>
          </section>

          {/* Section 10: Contact Us */}
          <section className="space-y-3">
            <h2 className="!text-2xl !mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <ul>
              <li>
                By email:{" "}
                <a href="mailto:legal@interface.com">legal@interface.com</a>
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

export default TermsOfService;
