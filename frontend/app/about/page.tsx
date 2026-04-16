import PageLayout from "@/components/PageLayout";

export default function About() {
  const stats = [
    { value: "2020", label: "Founded" },
    { value: "50K+", label: "Developers" },
    { value: "120+", label: "Countries" },
    { value: "99.99%", label: "Uptime" }
  ];

  const values = [
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "SPEED",
      description: "We believe in moving fast and shipping quality code. Our platform is built for velocity without compromising on reliability."
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      title: "COLLABORATION",
      description: "Great software is built by great teams. We're obsessed with making collaboration seamless and enjoyable."
    },
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      title: "SECURITY",
      description: "Your code is your most valuable asset. We take security seriously with enterprise-grade encryption and compliance."
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "RELIABILITY",
      description: "Downtime is not an option. Our infrastructure is built for 99.99% uptime with automatic failover and redundancy."
    }
  ];

  const milestones = [
    { year: "2020", event: "CodeCollab founded with a vision to revolutionize remote collaboration" },
    { year: "2021", event: "Reached 10,000 developers and launched real-time terminal sharing" },
    { year: "2022", event: "Series A funding and expansion to 50+ countries" },
    { year: "2023", event: "Launched Enterprise plan and achieved SOC 2 Type II certification" },
    { year: "2024", event: "50,000+ developers and partnerships with major tech companies" }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black text-white mb-6 uppercase tracking-tight">
            BUILDING THE FUTURE
            <br />
            <span className="text-blue-500">OF COLLABORATION</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            CodeCollab was born from a simple idea: developers should be able to code together
            as easily as they code alone. We're on a mission to make remote collaboration feel local.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/[0.02] border border-white/10">
              <div className="text-4xl font-black text-blue-500 mb-2">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-24">
          <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tight">
            OUR STORY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-400 leading-relaxed mb-6">
                In 2020, as the world shifted to remote work, we noticed something: while video calls
                and chat tools were everywhere, there wasn't a great way for developers to actually
                code together in real-time.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Screen sharing was laggy. Sending code snippets back and forth was tedious. Pair
                programming felt broken. We knew there had to be a better way.
              </p>
              <p className="text-gray-400 leading-relaxed">
                So we built CodeCollab - a platform where developers can code together with zero
                latency, share terminals, and collaborate as if they were sitting side by side.
              </p>
            </div>
            <div>
              <p className="text-gray-400 leading-relaxed mb-6">
                What started as a weekend project quickly grew into something bigger. Developers
                loved the instant sync, the live terminal sharing, and the feeling of truly coding
                together.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Today, over 50,000 developers across 120+ countries use CodeCollab to build software
                together. From solo developers to Fortune 500 companies, we're proud to power
                collaboration for teams of all sizes.
              </p>
              <p className="text-gray-400 leading-relaxed">
                But we're just getting started. Our vision is to make CodeCollab the default way
                developers work together, anywhere in the world.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tight text-center">
            OUR VALUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wide">
                  {value.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tight text-center">
            OUR JOURNEY
          </h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-8 mb-8 last:mb-0">
                <div className="flex-shrink-0 w-20">
                  <div className="text-2xl font-black text-blue-500">{milestone.year}</div>
                </div>
                <div className="flex-1 pb-8 border-l-2 border-white/10 pl-8 relative">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-500 -translate-x-[7px]" />
                  <p className="text-gray-400 leading-relaxed">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">
            JOIN US ON OUR MISSION
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people who share our passion for building great developer tools.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group">
              <span className="relative z-10">VIEW CAREERS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all border border-white/10">
              CONTACT US
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
