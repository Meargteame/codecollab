import Link from "next/link";

export default function SignIn() {
  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-black to-black">
        {/* Grid background */}
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

        <div className="relative z-10 flex flex-col justify-center px-16 py-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 bg-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">
              CODE<span className="text-blue-500">COLLAB</span>
            </span>
          </Link>

          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
            WELCOME<br />
            BACK TO<br />
            <span className="text-blue-500">YOUR WORKSPACE</span>
          </h1>

          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Continue building amazing projects with your team. Real-time collaboration, instant sync, and zero latency.
          </p>

          {/* Features */}
          <div className="space-y-6">
            {[
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant synchronization across all devices" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", text: "Collaborate with unlimited team members" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Enterprise-grade security and encryption" }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pt-3">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10">
            <div>
              <div className="text-3xl font-black text-white mb-1">50K+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Developers</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">99.9%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">24/7</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        {/* Mobile Logo */}
        <Link href="/" className="lg:hidden absolute top-8 left-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-white font-bold">
            CODE<span className="text-blue-500">COLLAB</span>
          </span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">
              SIGN IN
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access your workspace
            </p>
          </div>

          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="alex@codecollab.io"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 bg-white/5 border border-white/10" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs uppercase tracking-wider">Or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
            <button className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
