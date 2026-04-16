import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-black">
      {/* Simple clean grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center w-full relative z-10">
        {/* YC Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 mb-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {/* YC Logo */}
          <div className="w-4 h-4 bg-orange-500 flex items-center justify-center relative z-10">
            <span className="text-white font-black text-[10px]">Y</span>
          </div>
          <span className="text-xs text-orange-400 font-bold uppercase tracking-wider relative z-10">
            NOT BACKED BY YC
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[140px] leading-[0.9] font-black mb-10 tracking-tighter">
          <span className="text-white">
            COLLAB
          </span>
          <br />
          <span className="text-blue-500">
            INSTANTLY.
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-[13px] text-gray-400 leading-[1.8] max-w-3xl mx-auto mb-14 uppercase tracking-[0.15em] font-medium">
          THE NO-LATENCY DEVELOPMENT HUB. HIGH-PERFORMANCE<br />
          PEER ROUTING MEETS <span className="text-white font-bold">DIRECT TERMINAL EXECUTION</span>. BUILT<br />
          FOR THE MODERN FORGE.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link 
            href="/signup"
            className="relative px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-all uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 overflow-hidden group"
          >
            <span className="relative z-10">START CODING NOW</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
          <Link 
            href="/ide"
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all uppercase tracking-wider border border-white/10"
          >
            VIEW DEMO
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "INSTANT SYNC", desc: "Real-time collaboration with zero latency" },
            { icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "LIVE TERMINAL", desc: "Execute commands directly in browser" },
            { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", title: "TEAM READY", desc: "Built for distributed development teams" }
          ].map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wide">{feature.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
