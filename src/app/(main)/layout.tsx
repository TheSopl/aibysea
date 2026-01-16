import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-light-bg scroll-smooth">
      <Sidebar />
      <div className="ml-20 min-h-screen flex flex-col scroll-smooth">
        <div className="flex-1 scroll-smooth">{children}</div>
      </div>
    </div>
  );
}
