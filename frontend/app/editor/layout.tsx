export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {children}
    </div>
  );
}
