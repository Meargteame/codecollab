import Link from "next/link";

interface DashboardProjectCardProps {
  id: number;
  name: string;
  lastModified: string;
  collaborators: number;
  language?: string;
  status?: "active" | "archived";
}

export default function DashboardProjectCard({
  id,
  name,
  lastModified,
  collaborators,
  language = "TypeScript",
  status = "active"
}: DashboardProjectCardProps) {
  return (
    <Link href={`/project/${id}`}>
      <div className="group relative p-6 bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden">
        {/* Hover beam effects */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Status indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${status === "active" ? "bg-green-500" : "bg-gray-600"}`} />
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              {status}
            </span>
          </div>
          <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">
            {language}
          </span>
        </div>

        {/* Project icon */}
        <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>

        {/* Project name */}
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors">
          {name}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{lastModified}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{collaborators} {collaborators === 1 ? 'member' : 'members'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
