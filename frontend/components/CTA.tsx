import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative p-16 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-2 border-blue-500/50 text-center overflow-hidden">
          {/* Animated beam */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-beam" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-beam" style={{ animationDelay: '1.5s' }} />
          
          <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tight">
            Ready to <span className="text-blue-500">Ship Faster?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of developers building the future with CodeCollab
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/signup"
              className="relative px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-all uppercase tracking-wider shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 overflow-hidden group"
            >
              <span className="relative z-10">Start Building Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link 
              href="/contact"
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all uppercase tracking-wider border border-white/10"
            >
              Schedule Demo
            </Link>
          </div>

          <p className="text-gray-600 text-xs mt-8 uppercase tracking-wider">
            No credit card required • Free forever
          </p>
        </div>
      </div>
    </section>
  );
}
