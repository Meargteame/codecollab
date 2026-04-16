import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  author: string;
  likes: number;
  views: number;
  category: string;
}

export default function ProjectCard({
  title,
  description,
  image,
  tags,
  author,
  likes,
  views,
  category
}: ProjectCardProps) {
  return (
    <div className="group bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10">
      {/* Image */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-white font-bold text-[12px] tracking-wide uppercase leading-tight group-hover:text-[#ef4444] transition-colors">
            {title}
          </h3>
          <span className="text-[8px] text-gray-700 bg-[#0f0f0f] px-2.5 py-1 tracking-[0.2em] font-bold border border-[#1a1a1a]">
            {category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-[11px] leading-[1.7] mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[8px] text-gray-600 bg-[#0f0f0f] px-2.5 py-1.5 hover:bg-[#151515] hover:text-gray-400 hover:border-[#2a2a2a] transition-all tracking-[0.15em] font-bold border border-[#1a1a1a] cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ring-1 ring-white/10" />
            <span className="text-[10px] text-gray-700 font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-800">
            <span className="flex items-center gap-1.5 hover:text-[#ef4444] transition-colors cursor-pointer">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likes}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
