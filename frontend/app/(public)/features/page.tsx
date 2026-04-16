import PageLayout from "@/components/PageLayout";
import FeatureSection from "@/components/FeatureSection";

export default function Features() {
  const features = [
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "REAL-TIME COLLABORATION",
      description: "Code together with your team in real-time with zero latency. See cursors, edits, and changes as they happen. Built on cutting-edge WebRTC technology for instant synchronization.",
      details: [
        "Instant cursor tracking and presence indicators",
        "Live code edits with conflict resolution",
        "Real-time terminal sharing",
        "Voice and video chat integration",
        "Collaborative debugging sessions"
      ]
    },
    {
      icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      title: "LIVE TERMINAL ACCESS",
      description: "Execute commands directly in your browser with a fully-featured terminal. Share terminal sessions with your team and collaborate on DevOps tasks in real-time.",
      details: [
        "Full bash/zsh terminal support",
        "Shared terminal sessions",
        "Command history and autocomplete",
        "Multiple terminal tabs",
        "Secure SSH key management"
      ]
    },
    {
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      title: "INTELLIGENT CODE EDITOR",
      description: "Powered by Monaco Editor with advanced IntelliSense, syntax highlighting, and code completion. Support for 50+ programming languages out of the box.",
      details: [
        "Advanced syntax highlighting",
        "IntelliSense and autocomplete",
        "Multi-cursor editing",
        "Code folding and minimap",
        "Vim/Emacs keybindings support"
      ]
    },
    {
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "PROJECT MANAGEMENT",
      description: "Organize your codebase with intuitive file management. Create, rename, and move files with ease. Full Git integration for version control.",
      details: [
        "Visual file tree navigation",
        "Drag-and-drop file organization",
        "Built-in Git integration",
        "Branch management and merging",
        "Commit history visualization"
      ]
    },
    {
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      title: "ADVANCED ANALYTICS",
      description: "Track your team's productivity with detailed analytics. Monitor code contributions, review cycles, and deployment frequency to optimize your workflow.",
      details: [
        "Code contribution metrics",
        "Team activity dashboards",
        "Performance insights",
        "Custom report generation",
        "Integration with CI/CD pipelines"
      ]
    },
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      title: "ENTERPRISE SECURITY",
      description: "Bank-level security with end-to-end encryption. SOC 2 Type II certified with GDPR compliance. Your code is always protected.",
      details: [
        "End-to-end encryption",
        "SOC 2 Type II certified",
        "GDPR compliant",
        "Two-factor authentication",
        "Role-based access control",
        "Audit logs and compliance reports"
      ]
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tight">
            POWERFUL FEATURES
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need for modern collaborative development
          </p>
        </div>

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <FeatureSection 
            key={index} 
            {...feature} 
            reverse={index % 2 === 1} 
          />
        ))}

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="p-12 bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">
              READY TO GET STARTED?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers already using CodeCollab to build better software together.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group">
                <span className="relative z-10">START FREE TRIAL</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all border border-white/10">
                VIEW PRICING
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
