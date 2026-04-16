"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "EMAIL",
      value: "hello@codecollab.io",
      link: "mailto:hello@codecollab.io"
    },
    {
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      title: "LIVE CHAT",
      value: "Available 24/7",
      link: "#"
    },
    {
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      title: "OFFICE",
      value: "San Francisco, CA",
      link: "#"
    }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
      url: "https://github.com/codecollab"
    },
    {
      name: "Twitter",
      icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
      url: "https://twitter.com/codecollab"
    },
    {
      name: "LinkedIn",
      icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
      url: "https://linkedin.com/company/codecollab"
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tight">
            GET IN TOUCH
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
              CONTACT INFO
            </h2>
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className="block p-6 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-all">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                      {method.title}
                    </h3>
                    <p className="text-white font-medium">{method.value}</p>
                  </div>
                </div>
              </a>
            ))}

            {/* Social Links */}
            <div className="pt-6">
              <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
                FOLLOW US
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/5 hover:bg-blue-500 border border-white/10 hover:border-blue-500 flex items-center justify-center transition-all group"
                    title={social.name}
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 bg-white/[0.02] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                SEND US A MESSAGE
              </h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30">
                  <p className="text-green-400 text-sm font-bold uppercase tracking-wider">
                    ✓ Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="NAME"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  <FormInput
                    label="EMAIL"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <FormInput
                  label="SUBJECT"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />

                <FormTextarea
                  label="MESSAGE"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  required
                  rows={6}
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
        </div>

        {/* Additional Info */}
        <div className="text-center p-8 bg-white/[0.02] border border-white/10">
          <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">
            LOOKING FOR SUPPORT?
          </h3>
          <p className="text-gray-400 mb-4">
            Check out our documentation or contact our support team for technical assistance.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/docs"
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-all border border-white/10"
            >
              VIEW DOCS
            </a>
            <a
              href="#"
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold uppercase tracking-wider transition-all border border-white/10"
            >
              SUPPORT CENTER
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
