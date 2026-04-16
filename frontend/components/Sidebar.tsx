import Link from "next/link";

interface SidebarItem {
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  className?: string;
}

export default function Sidebar({ items, title, className = "" }: SidebarProps) {
  return (
    <aside className={`w-64 flex-shrink-0 ${className}`}>
      <div className="sticky top-24">
        {title && (
          <h2 className="text-xs font-bold text-white mb-6 uppercase tracking-wider">
            {title}
          </h2>
        )}
        <nav className="space-y-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`block px-4 py-3 text-sm font-medium transition-all border-l-2 ${
                item.active
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
