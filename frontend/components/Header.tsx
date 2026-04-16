import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center justify-between h-14 px-6 bg-black/80 backdrop-blur-xl border-2 border-blue-500/50 overflow-hidden">
          {/* Animated beam */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-beam" />
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 relative z-10">
            <div className="w-6 h-6 bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">
              CODE<span className="text-blue-500">COLLAB</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-8 relative z-10">
            <Link href="/features" className="text-xs text-gray-400 hover:text-white transition-colors font-medium uppercase tracking-wider">
              FEATURES
            </Link>
            <Link href="/pricing" className="text-xs text-gray-400 hover:text-white transition-colors font-medium uppercase tracking-wider">
              PRICING
            </Link>
            <Link href="/docs" className="text-xs text-gray-400 hover:text-white transition-colors font-medium uppercase tracking-wider">
              DOCS
            </Link>
            <Link href="/about" className="text-xs text-gray-400 hover:text-white transition-colors font-medium uppercase tracking-wider">
              ABOUT
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 relative z-10">
            <Link 
              href="/signin"
              className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wider"
            >
              SIGN IN
            </Link>
            <Link 
              href="/signup"
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors uppercase tracking-wider relative overflow-hidden group"
            >
              <span className="relative z-10">GET STARTED</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
