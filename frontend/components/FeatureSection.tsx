interface FeatureSectionProps {
  icon: string;
  title: string;
  description: string;
  details: string[];
  reverse?: boolean;
  imagePosition?: 'left' | 'right';
  image?: string;
}

export default function FeatureSection({ 
  icon, 
  title, 
  description, 
  details,
  reverse = false,
  imagePosition = 'right',
  image
}: FeatureSectionProps) {
  const isReversed = imagePosition === 'left' || reverse;
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
      {/* Content */}
      <div className={isReversed ? 'lg:order-2' : ''}>
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
          {description}
        </p>

        {/* Details */}
        <ul className="space-y-3">
          {details.map((detail, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" 
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
              <span className="text-gray-300 text-sm">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Visual */}
      <div className={isReversed ? 'lg:order-1' : ''}>
        <div className="aspect-video bg-white/[0.02] border border-white/10 flex items-center justify-center relative overflow-hidden group">
          {/* Placeholder or image */}
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <svg className="w-24 h-24 text-blue-500/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
              <span className="text-gray-600 text-sm uppercase tracking-wider">
                Feature Preview
              </span>
            </div>
          )}
          
          {/* Hover beam effect */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}
