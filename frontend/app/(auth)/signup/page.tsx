import Link from "next/link";

export default function SignUp() {
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
            START<br />
            BUILDING<br />
            <span className="text-blue-500">IN SECONDS</span>
          </h1>

          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Join thousands of developers who are already shipping faster with CodeCollab's real-time collaboration platform.
          </p>

          {/* Benefits */}
          <div className="space-y-6">
            {[
              { icon: "M5 13l4 4L19 7", text: "Free forever for personal projects" },
              { icon: "M5 13l4 4L19 7", text: "No credit card required to start" },
              { icon: "M5 13l4 4L19 7", text: "Unlimited collaborators on all plans" },
              { icon: "M5 13l4 4L19 7", text: "Access to all core features instantly" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-6 h-6 bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-16 p-6 bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <p className="text-gray-300 text-sm mb-4 italic">
              "CodeCollab transformed how our team works. We went from hours of setup to coding in minutes. The real-time sync is flawless."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="text-white text-sm font-bold">Sarah Chen</div>
                <div className="text-gray-500 text-xs">Lead Developer at TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
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
              CREATE ACCOUNT
            </h2>
            <p className="text-gray-400 text-sm">
              Get started with your free account today
            </p>
          </div>

          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Alex Developer"
              />
            </div>

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
              <p className="text-gray-600 text-xs mt-2">
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 bg-white/5 border border-white/10" />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-blue-500 hover:text-blue-400">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-500 hover:text-blue-400">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Create Account</span>
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

          {/* Sign in link */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
