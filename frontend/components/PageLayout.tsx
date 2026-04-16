import Header from "./Header";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export default function PageLayout({ 
  children, 
  className = "",
  includeHeader = true,
  includeFooter = true
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-black ${className}`}>
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-0">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>
      
      {includeHeader && <Header />}
      <main className="relative z-10">{children}</main>
      {includeFooter && <Footer />}
    </div>
  );
}
