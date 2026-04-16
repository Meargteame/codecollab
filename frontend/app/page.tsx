"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IDEPreview from "@/components/IDEPreview";
import Stats from "@/components/Stats";
import FeaturesGrid from "@/components/FeaturesGrid";
import Pricing from "@/components/Pricing";
import TrustedBy from "@/components/TrustedBy";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FeatureSection from "@/components/FeatureSection";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";

export default function Home() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      {/* Hero Section */}
      <Hero />
      
      {/* Trusted By */}
      <TrustedBy />
      
      {/* IDE Preview */}
      <IDEPreview />
      
      {/* Stats */}
      <Stats />
      
      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tight">
              POWERFUL FEATURES
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to build, collaborate, and ship faster
            </p>
          </div>
          
          <FeaturesGrid />
          
          {/* Detailed Features */}
          <div className="mt-32 space-y-32">
            <FeatureSection
              icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              title="Real-Time Collaboration"
              description="Work together seamlessly with your team in real-time"
              details={[
                "See cursors and selections of all collaborators",
                "Instant synchronization across all devices",
                "Built-in voice and video chat",
                "Conflict-free collaborative editing"
              ]}
              imagePosition="right"
            />

            <FeatureSection
              icon="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              title="Integrated Terminal"
              description="Full terminal access right in your browser"
              details={[
                "Run commands without leaving the editor",
                "Multiple terminal instances",
                "Full bash/zsh support",
                "Persistent sessions across reconnects"
              ]}
              imagePosition="left"
            />

            <FeatureSection
              icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              title="Enterprise Security"
              description="Bank-level security for your code and data"
              details={[
                "End-to-end encryption",
                "SOC 2 Type II certified",
                "GDPR compliant",
                "Regular security audits"
              ]}
              imagePosition="right"
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing">
        <Pricing />
      </section>
      
      {/* About Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tight">
              ABOUT CODECOLLAB
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              We're building the future of collaborative development
            </p>
          </div>

          {/* Mission */}
          <div className="mb-24 p-12 bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">
              OUR MISSION
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
              To eliminate the friction in software development by creating a seamless, 
              collaborative environment where developers can build together in real-time, 
              regardless of location or device.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {[
              { label: "Founded", value: "2020" },
              { label: "Developers", value: "50K+" },
              { label: "Countries", value: "120+" },
              { label: "Uptime", value: "99.9%" }
            ].map((stat, index) => (
              <div key={index} className="p-8 bg-white/[0.02] border border-white/10 text-center">
                <div className="text-4xl font-black text-blue-500 mb-2">{stat.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Speed",
                description: "We obsess over performance. Every millisecond counts when you're in flow state."
              },
              {
                title: "Collaboration",
                description: "Great software is built by teams. We make working together feel natural."
              },
              {
                title: "Security",
                description: "Your code is your IP. We protect it with enterprise-grade security."
              },
              {
                title: "Reliability",
                description: "99.9% uptime guaranteed. Your development environment is always available."
              }
            ].map((value, index) => (
              <div key={index} className="p-8 bg-white/[0.02] border border-white/10">
                <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">
                  {value.title}
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tight">
              GET IN TOUCH
            </h2>
            <p className="text-gray-400 text-lg">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                title: "EMAIL",
                value: "hello@codecollab.io"
              },
              {
                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                title: "CHAT",
                value: "Available 24/7"
              },
              {
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                title: "OFFICE",
                value: "San Francisco, CA"
              }
            ].map((method, index) => (
              <div key={index} className="p-6 bg-white/[0.02] border border-white/10 text-center">
                <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                  </svg>
                </div>
                <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  {method.title}
                </h3>
                <p className="text-white text-sm">{method.value}</p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30">
                <p className="text-green-400 text-sm font-bold uppercase tracking-wider">
                  ✓ Message sent! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="NAME"
                  id="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="Your name"
                  required
                />
                <FormInput
                  label="EMAIL"
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <FormTextarea
                label="MESSAGE"
                id="message"
                value={contactForm.message}
                onChange={handleContactChange}
                placeholder="Tell us what you're thinking..."
                required
                rows={5}
              />

              <button
                type="submit"
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">SEND MESSAGE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <CTA />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
