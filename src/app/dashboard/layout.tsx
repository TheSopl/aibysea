import Header from '@/components/dashboard/Header';
import Navigation from '@/components/dashboard/Navigation';

export default function AIMetricsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-light-bg">
      <Navigation />
      <div className="ml-20 lg:ml-20">
        <Header />
        <main className="p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
