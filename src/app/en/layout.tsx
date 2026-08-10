import { Footer } from "@/components/layout/Footer";

export default function EnglishSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">{children}</main>
      <Footer locale="en" />
    </div>
  );
}
