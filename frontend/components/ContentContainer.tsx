interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "7xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "7xl": "max-w-7xl"
};

export default function ContentContainer({ 
  children, 
  className = "",
  maxWidth = "7xl"
}: ContentContainerProps) {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
}
