import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-light-bg">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
