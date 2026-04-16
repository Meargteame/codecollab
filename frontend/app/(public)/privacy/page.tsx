import PageLayout from "@/components/PageLayout";
import ContentContainer from "@/components/ContentContainer";

export default function Privacy() {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      content: [
        "We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes your name, email address, username, and any other information you choose to provide.",
        "We automatically collect certain information about your device and how you interact with our services, including IP address, browser type, operating system, and usage data."
      ]
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: [
        "We use the information we collect to provide, maintain, and improve our services, including to process transactions, send you technical notices and support messages, and respond to your comments and questions.",
        "We may use your information to communicate with you about products, services, offers, and events, and provide news and information we think will be of interest to you.",
        "We use analytics and tracking technologies to analyze trends, administer the website, track users' movements, and gather demographic information."
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      content: [
        "We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.",
        "We may disclose information if we believe it is necessary to comply with applicable laws, regulations, legal processes, or governmental requests.",
        "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      content: [
        "We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.",
        "We implement industry-standard security measures including encryption, secure socket layer technology, and regular security audits.",
        "However, no internet or email transmission is ever fully secure or error-free. Please keep this in mind when disclosing any personal information to us."
      ]
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      content: [
        "You may update, correct, or delete your account information at any time by logging into your account settings.",
        "You may opt out of receiving promotional communications from us by following the instructions in those messages or by contacting us directly.",
        "If you are a resident of the European Economic Area, you have certain data protection rights including the right to access, correct, or delete your personal data."
      ]
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: [
        "We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier.",
        "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service."
      ]
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      content: [
        "We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the 'Last Updated' date.",
        "You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page."
      ]
    }
  ];

  return (
    <PageLayout>
      <ContentContainer>
        <div className="py-24">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tight">
              PRIVACY POLICY
            </h1>
            <p className="text-gray-400 text-lg mb-2">
              How we collect, use, and protect your information
            </p>
            <p className="text-gray-500 text-sm uppercase tracking-wider">
              Last Updated: January 15, 2024
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-xs font-bold text-white mb-6 uppercase tracking-wider">
                  TABLE OF CONTENTS
                </h2>
                <nav className="space-y-2">
                  {sections.map((section, index) => (
                    <a
                      key={index}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-400 hover:text-blue-500 transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Introduction */}
              <div className="p-6 bg-blue-500/10 border border-blue-500/30">
                <p className="text-gray-300 text-sm leading-relaxed">
                  At CodeCollab, we take your privacy seriously. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our collaborative coding platform. 
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
                  policy, please do not access the site.
                </p>
              </div>

              {/* Sections */}
              {sections.map((section, index) => (
                <section key={index} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight border-l-4 border-blue-500 pl-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-400 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              {/* Contact Section */}
              <div className="p-8 bg-white/[0.02] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                
                <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                  CONTACT US
                </h2>
                <p className="text-gray-400 mb-6">
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Email:</span>{' '}
                    <a href="mailto:privacy@codecollab.io" className="text-blue-500 hover:text-blue-400 transition-colors">
                      privacy@codecollab.io
                    </a>
                  </p>
                  <p>
                    <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Address:</span>{' '}
                    CodeCollab Inc., 123 Developer Street, San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentContainer>
    </PageLayout>
  );
}
