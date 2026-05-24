export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Player usa layout fullscreen sem sidebar/header padrão
  return (
    <div className="min-h-screen bg-[#050505]">
      {children}
    </div>
  );
}
