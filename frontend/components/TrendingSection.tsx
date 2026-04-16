import ProjectCard from "./ProjectCard";

const projects = [
  {
    id: 1,
    title: "YSCROLL EXTENSION",
    description: "Stop the endless scrolling, get your work done. Limit your time on distractive content with YScroll. Take control of your...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    tags: ["JAVASCRIPT", "CSS", "HTML"],
    author: "@taml",
    likes: 28,
    views: 514,
    category: "CORE"
  },
  {
    id: 2,
    title: "AURORA",
    description: "Title: AURORA Strategic AI Design Systems. The Problem: AI design tools often suffer from 'hallucination of logic.' They...",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
    tags: ["REACT", "NEXT.JS", "TAILWIND", "AI"],
    author: "@luc",
    likes: 21,
    views: 228,
    category: "EXEC"
  },
  {
    id: 3,
    title: "FLOWLY",
    description: "Flowly is a personal finance tracker where you can track your expenses, income, and debt, set monthly budgets, and get...",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    tags: ["TYPESCRIPT", "NEXT.JS", "TAILWIND"],
    author: "@aces",
    likes: 3,
    views: 525,
    category: "CORE"
  },
  {
    id: 4,
    title: "GOFIT.ET",
    description: "Get in control of your finances. One site at a time.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    tags: ["SVELTE"],
    author: "@rob",
    likes: 21,
    views: 343,
    category: "CORE"
  },
  {
    id: 5,
    title: "OPPTICK",
    description: "OpTick: Ticking each tick! For those you never miss deadlines for opportunities: internships, scholarships, events...",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop",
    tags: ["PYTHON"],
    author: "@emperor7",
    likes: 13,
    views: 135,
    category: "CORE"
  },
  {
    id: 6,
    title: "ETHIO HEALTH",
    description: "EthioHealth: EthioHealth is a modern health information website built using React, TypeScript, and Vite. The project...",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    tags: ["TYPESCRIPT", "REACT", "VITE", "AI"],
    author: "@yohanna253",
    likes: 3,
    views: 89,
    category: "CORE"
  }
];

export default function TrendingSection() {
  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="text-[#ef4444] text-[10px] font-mono mb-3 tracking-[0.25em] uppercase">
              ⟨⟨ REAL-WORLD BUILDS ⟩⟩
            </p>
            <h2 className="text-[56px] font-black leading-none tracking-tight mb-4">
              TRENDING <span className="text-[#ef4444]">NOW</span>
            </h2>
            <p className="text-gray-600 text-[13px] leading-relaxed max-w-xl">
              High-velocity projects gaining the most traction across the network today.
            </p>
          </div>
          <button className="text-[#ef4444] hover:text-[#f87171] text-[10px] font-bold tracking-[0.2em] transition-colors mt-12 uppercase flex items-center gap-2">
            <span>SEE ALL BUILDS</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <button className="text-gray-800 hover:text-gray-600 text-[10px] font-mono tracking-[0.15em] transition-colors">
            EXPLORE_GLOBAL_TRAFFIC()
          </button>
        </div>
      </div>
    </section>
  );
}
