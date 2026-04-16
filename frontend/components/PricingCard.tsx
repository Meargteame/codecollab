interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  onCtaClick?: () => void;
}

export default function PricingCard({ 
  name, 
  price, 
  period = "/month",
  features, 
  cta,
  recommended = false,
  onCtaClick
}: PricingCardProps) {
  return (
    <div 
      className={`relative p-8 bg-white/[0.02] backdrop-blur-sm transition-all overflow-hidden ${
        recommended 
          ? "border-2 border-blue-500" 
          : "border border-white/10 hover:border-white/20"
      }`}
    >
      {/* Top beam for recommended */}
      {recommended && (
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      )}

      {/* Recommended badge */}
      {recommended && (
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider">
            RECOMMENDED
          </span>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
        {name}
      </h3>

      {/* Price */}
      <div className="mb-8">
        <span className="text-5xl font-black text-white">{price}</span>
        {price !== "Custom" && (
          <span className="text-gray-400 text-sm ml-2">{period}</span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <span className="text-gray-400 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onCtaClick}
        className={`w-full py-3 text-sm font-bold uppercase tracking-wider transition-all relative overflow-hidden group ${
          recommended
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        }`}
      >
        <span className="relative z-10">{cta}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    </div>
  );
}
