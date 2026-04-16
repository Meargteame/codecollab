import PageLayout from "@/components/PageLayout";
import ContentContainer from "@/components/ContentContainer";

export default function Terms() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: [
        "By accessing and using CodeCollab, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        "We reserve the right to modify these terms at any time. Your continued use of the platform following any changes indicates your acceptance of the new terms."
      ]
    },
    {
      id: "use-license",
      title: "Use License",
      content: [
        "Permission is granted to temporarily access and use CodeCollab for personal and commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials\n• Use the materials for any commercial purpose without proper licensing\n• Attempt to decompile or reverse engineer any software contained on CodeCollab\n• Remove any copyright or other proprietary notations from the materials\n• Transfer the materials to another person or 'mirror' the materials on any other server",
        "This license shall automatically terminate if you violate any of these restrictions and may be terminated by CodeCollab at any time."
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts and Responsibilities",
      content: [
        "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
        "You must provide accurate and complete information when creating your account and keep this information up to date.",
        "You may not use another user's account without permission, impersonate another person or entity, or falsely state or misrepresent your affiliation with a person or entity."
      ]
    },
    {
      id: "content",
      title: "User Content and Conduct",
      content: [
        "You retain all rights to any content you submit, post, or display on or through the service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.",
        "You agree not to post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.",
        "We reserve the right to remove any content that violates these terms or that we find objectionable at our sole discretion."
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content: [
        "The service and its original content, features, and functionality are owned by CodeCollab and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.",
        "Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.",
        "You may not use our intellectual property without our express written permission."
      ]
    },
    {
      id: "termination",
      title: "Termination",
      content: [
        "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.",
        "If you wish to terminate your account, you may simply discontinue using the service or delete your account through the settings page.",
        "All provisions of the Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability."
      ]
    },
    {
      id: "disclaimer",
      title: "Disclaimer of Warranties",
      content: [
        "The service is provided on an 'AS IS' and 'AS AVAILABLE' basis. CodeCollab makes no warranties, expressed or implied, and hereby disclaims all warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.",
        "We do not warrant that the service will be uninterrupted, timely, secure, or error-free. We do not warrant that the results obtained from the use of the service will be accurate or reliable.",
        "Any material downloaded or obtained through the use of the service is done at your own discretion and risk."
      ]
    },
    {
      id: "limitation",
      title: "Limitation of Liability",
      content: [
        "In no event shall CodeCollab, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
        "Our liability to you for any cause whatsoever shall be limited to the amount you paid to us for the service in the twelve (12) months prior to the action giving rise to liability.",
        "Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for consequential damages. In such jurisdictions, our liability will be limited to the maximum extent permitted by law."
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
              TERMS OF SERVICE
            </h1>
            <p className="text-gray-400 text-lg mb-2">
              Legal terms and conditions for using CodeCollab
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
                  Welcome to CodeCollab. These Terms of Service govern your use of our website and services. 
                  By accessing or using CodeCollab, you agree to be bound by these Terms. If you disagree with 
                  any part of the terms, then you may not access the service.
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
                      <p key={pIndex} className="text-gray-400 leading-relaxed whitespace-pre-line">
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
                  QUESTIONS ABOUT TERMS
                </h2>
                <p className="text-gray-400 mb-6">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Email:</span>{' '}
                    <a href="mailto:legal@codecollab.io" className="text-blue-500 hover:text-blue-400 transition-colors">
                      legal@codecollab.io
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
