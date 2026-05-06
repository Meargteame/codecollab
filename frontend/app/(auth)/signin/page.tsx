"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, tokens, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await auth.login(email, password);
      tokens.set(data.access_token, data.refresh_token);
      await refreshUser();
      router.push("/workspace");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-black to-black">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
              backgroundSize: "100px 100px",
            }}
          />
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
            WELCOME<br />BACK TO<br /><span className="text-blue-500">YOUR WORKSPACE</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Continue building amazing projects with your team. Real-time collaboration, instant sync, and zero latency.
          </p>
          <div className="space-y-6">
            {[
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant synchronization across all devices" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", text: "Collaborate with unlimited team members" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Enterprise-grade security and encryption" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pt-3">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10">
            {[["50K+", "Developers"], ["99.9%", "Uptime"], ["24/7", "Support"]].map(([v, l]) => (
              <div key={l}>
                <div className="text-3xl font-black text-white mb-1">{v}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{l}</div>
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
            <h2 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">SIGN IN</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access your workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="alex@codecollab.io"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 bg-white/5 border border-white/10" />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? "Signing in..." : "Sign In"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
