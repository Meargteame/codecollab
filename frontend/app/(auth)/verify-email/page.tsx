"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { users, ApiError } from "@/lib/api";

type Status = "verifying" | "success" | "error" | "no-token";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    users.verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err instanceof ApiError ? err.message : "This verification link is invalid or has expired.");
      });
  }, [token]);

  return (
    <div className="w-full max-w-md">
      {/* Verifying state */}
      {status === "verifying" && (
        <div className="text-center">
          <div className="w-20 h-20 border-2 border-blue-500/30 border-t-blue-500 mx-auto mb-8 animate-spin" />
          <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">
            VERIFYING
          </h2>
          <p className="text-gray-400 text-sm">
            Confirming your email address...
          </p>
        </div>
      )}

      {/* Success state */}
      {status === "success" && (
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
            EMAIL VERIFIED
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Your email address has been successfully verified. Your account is now fully active.
          </p>

          <div className="p-4 bg-green-500/10 border border-green-500/30 mb-8">
            <p className="text-green-400 text-xs font-bold uppercase tracking-wider">
              ✓ Verification complete
            </p>
          </div>

          <Link
            href="/workspace"
            className="block w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all text-center relative overflow-hidden group"
          >
            <span className="relative z-10">Go to Workspace</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
            VERIFICATION FAILED
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            {errorMessage}
          </p>

          <div className="p-4 bg-red-500/10 border border-red-500/30 mb-8">
            <p className="text-red-400 text-xs leading-relaxed">
              Verification links expire after 24 hours. Request a new one from your account settings.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/settings?section=security"
              className="block w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all text-center"
            >
              Resend Verification Email
            </Link>
            <Link
              href="/workspace"
              className="block w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all text-center"
            >
              Back to Workspace
            </Link>
          </div>
        </div>
      )}

      {/* No token state */}
      {status === "no-token" && (
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">
            INVALID LINK
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            This verification link is missing a token. Please use the link from your verification email.
          </p>

          <Link
            href="/settings?section=security"
            className="block w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all text-center"
          >
            Request New Verification Email
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-black to-black">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, #3b82f6 1px, transparent 1px),
                linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
              `,
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
            <span className="text-white font-bold text-lg">
              CODE<span className="text-blue-500">COLLAB</span>
            </span>
          </Link>

          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
            CONFIRM<br />
            YOUR<br />
            <span className="text-blue-500">IDENTITY</span>
          </h1>

          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Email verification keeps your account secure and ensures you receive important notifications.
          </p>

          <div className="space-y-6">
            {[
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Secure your account with verified email" },
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "Receive important account notifications" },
              { icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z", text: "Enable password recovery options" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pt-3">{item.text}</p>
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
          <span className="text-white font-bold">
            CODE<span className="text-blue-500">COLLAB</span>
          </span>
        </Link>

        <Suspense
          fallback={
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-blue-500/30 border-t-blue-500 mx-auto mb-8 animate-spin" />
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
