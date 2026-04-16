import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Perfect for solo developers",
      features: [
        "5 active sessions",
        "2GB storage",
        "Community support",
        "Basic analytics",
        "Public repositories"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "29",
      description: "For professional teams",
      features: [
        "Unlimited sessions",
        "100GB storage",
        "Priority support",
        "Advanced analytics",
        "Private repositories",
        "Custom domains",
        "AI copilot access"
      ],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "24/7 dedicated support",
        "SSO & SAML",
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
            <span className="text-xs text-blue-400 font-mono uppercase tracking-wider">
              TRANSPARENT_PRICING
            </span>
          </div>
          <h2 className="text-6xl font-black text-white mb-6 uppercase tracking-tight">
            Simple <span className="text-blue-500">Pricing</span>
          </h2>
          <p className="text-gray-500 text-sm uppercase tracking-wider">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 transition-all duration-300 overflow-hidden ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-500/20 to-blue-500/5 border-2 border-blue-500 scale-105'
                  : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Animated beam for popular plan */}
              {plan.popular && (
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-beam" />
              )}
              
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500">
                  <span className="text-xs text-white font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-white font-bold text-2xl mb-2 uppercase tracking-wide">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  {plan.price === "Custom" ? (
                    <span className="text-5xl font-black text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-5xl font-black text-white">${plan.price}</span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.cta === "Contact Sales" ? "/contact" : "/signup"}
                className={`block w-full py-3 font-bold text-sm uppercase tracking-wider transition-all overflow-hidden group relative text-center ${
                  plan.popular
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                <span className="relative z-10">{plan.cta}</span>
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
