import { Masthead } from "@/components/layout/Masthead";
import { Footer } from "@/components/layout/Footer";
import { AdSlot } from "@/components/layout/AdSlot";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Masthead />
      <div className="border-b border-neutral-100 bg-white py-3">
        <AdSlot variant="leaderboard" />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
