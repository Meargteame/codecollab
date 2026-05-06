"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, tokens, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("You must agree to the Terms of Service."); return; }
    setError("");
    setLoading(true);
    try {
      const data = await auth.register(email, password, fullName || undefined);
      tokens.set(data.access_token, data.refresh_token);
      await refreshUser();
      router.push("/workspace");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-black to-black">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
          <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`, backgroundSize: "100px 100px" }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 py-24">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 bg-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">CODE<span className="text-blue-500">COLLAB</span></span>
          </Link>
          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
            START<br />BUILDING<br /><span className="text-blue-500">IN SECONDS</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Join thousands of developers already shipping faster with CodeCollab.
          </p>
          <div className="space-y-6">
            {["Free forever for personal projects", "No credit card required to start", "Unlimited collaborators on all plans", "Access to all core features instantly"].map((t, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        <Link href="/" className="lg:hidden absolute top-8 left-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-white font-bold">CODE<span className="text-blue-500">COLLAB</span></span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">CREATE ACCOUNT</h2>
            <p className="text-gray-400 text-sm">Get started with your free account today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Alex Developer" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="alex@codecollab.io" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••" />
              <p className="text-gray-600 text-xs mt-2">Must be at least 8 characters</p>
            </div>
            <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 bg-white/5 border border-white/10" />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-blue-500 hover:text-blue-400">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-blue-500 hover:text-blue-400">Privacy Policy</Link>
              </span>
            </label>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group">
              <span className="relative z-10">{loading ? "Creating account..." : "Create Account"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
