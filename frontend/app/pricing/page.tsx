"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import PricingCard from "@/components/PricingCard";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "STARTER",
      price: billingPeriod === "monthly" ? "$0" : "$0",
      period: billingPeriod === "monthly" ? "/month" : "/year",
      features: [
        "1 Project",
        "2 Collaborators",
        "Basic Support",
        "5GB Storage",
        "Community Access"
      ],
      cta: "GET STARTED",
      recommended: false
    },
    {
      name: "PRO",
      price: billingPeriod === "monthly" ? "$29" : "$290",
      period: billingPeriod === "monthly" ? "/month" : "/year",
      features: [
        "Unlimited Projects",
        "10 Collaborators",
        "Priority Support",
        "50GB Storage",
        "Advanced Analytics",
        "Custom Integrations",
        "API Access"
      ],
      cta: "START FREE TRIAL",
      recommended: true
    },
    {
      name: "ENTERPRISE",
      price: "Custom",
      period: "",
      features: [
        "Unlimited Everything",
        "Unlimited Collaborators",
        "Dedicated Support",
        "Unlimited Storage",
        "Advanced Security",
        "Custom Integrations",
        "SLA Guarantee",
        "On-Premise Option"
      ],
      cta: "CONTACT SALES",
      recommended: false
    }
  ];

  const comparisonFeatures = [
    { name: "Projects", starter: "1", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Collaborators", starter: "2", pro: "10", enterprise: "Unlimited" },
    { name: "Storage", starter: "5GB", pro: "50GB", enterprise: "Unlimited" },
    { name: "Support", starter: "Community", pro: "Priority", enterprise: "Dedicated" },
    { name: "Analytics", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
    { name: "API Access", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "Custom Integrations", starter: "—", pro: "✓", enterprise: "✓" },
    { name: "SLA", starter: "—", pro: "—", enterprise: "99.99%" },
    { name: "On-Premise", starter: "—", pro: "—", enterprise: "✓" }
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via invoice."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Pro plan comes with a 14-day free trial. No credit card required to start."
    },
    {
      question: "What happens when I hit my limits?",
      answer: "We'll notify you when you're approaching your limits. You can upgrade anytime to increase your capacity."
    },
    {
      question: "Do you offer discounts for nonprofits or education?",
      answer: "Yes! We offer special pricing for nonprofits, educational institutions, and open-source projects. Contact our sales team for details."
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tight">
            SIMPLE PRICING
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Choose the plan that fits your team
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-white/5 border border-white/10">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                billingPeriod === "monthly"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                billingPeriod === "annual"
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ANNUAL
              <span className="ml-2 text-xs text-green-400">(Save 17%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map(plan => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-24">
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tight text-center">
            FEATURE COMPARISON
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-white/10">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    Starter
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 bg-blue-500/10">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 text-center">
                      {feature.starter}
                    </td>
                    <td className="px-6 py-4 text-sm text-white text-center bg-blue-500/5">
                      {feature.pro}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 text-center">
                      {feature.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tight text-center">
            FREQUENTLY ASKED
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-bold text-sm uppercase tracking-wide">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-blue-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-white/10 bg-black">
          <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
