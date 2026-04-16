"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            SECURE<br />
            ACCOUNT<br />
            <span className="text-blue-500">RECOVERY</span>
          </h1>

          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Don't worry, it happens to the best of us. We'll help you get back into your account quickly and securely.
          </p>

          {/* Security Features */}
          <div className="space-y-6">
            {[
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Secure password reset process" },
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "Reset link sent to your email" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", text: "Link expires in 1 hour for security" }
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

          {/* Help Section */}
          <div className="mt-16 p-6 bg-blue-500/10 border border-blue-500/30">
            <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wider">
              Need Help?
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              If you're having trouble accessing your account, our support team is here to help.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors"
            >
              Contact Support
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
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
          {!submitted ? (
            <>
              <div className="mb-10">
                <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">
                  RESET PASSWORD
                </h2>
                <p className="text-gray-400 text-sm">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="alex@codecollab.io"
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Send Reset Link</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </form>

              {/* Back to sign in */}
              <div className="mt-8">
                <Link 
                  href="/signin" 
                  className="text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                {/* Success icon */}
                <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
                  CHECK YOUR EMAIL
                </h2>
                
                <p className="text-gray-400 text-sm mb-2">
                  We've sent a password reset link to
                </p>
                <p className="text-blue-500 text-sm font-bold mb-8">
                  {email}
                </p>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 mb-8">
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Click the link in the email to reset your password. The link will expire in 1 hour for security reasons.
                  </p>
                </div>

                <p className="text-gray-500 text-xs mb-8">
                  Didn't receive the email? Check your spam folder or try again with a different email address.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all"
                  >
                    Try Another Email
                  </button>
                  <Link
                    href="/signin"
                    className="block w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all text-center"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
