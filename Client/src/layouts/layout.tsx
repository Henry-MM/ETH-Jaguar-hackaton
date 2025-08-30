import { InternalNavbar } from "@/components/internal-navbar";
import { TabKey } from "@/types";

export default function Layout({
  children,
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <InternalNavbar active={active} onChange={onChange} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </div>
  );
}
