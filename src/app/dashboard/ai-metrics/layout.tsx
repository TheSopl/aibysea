import Header from '@/components/dashboard/Header';
import Navigation from '@/components/dashboard/Navigation';

export default function AIMetricsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy">
      <Navigation />
      <div className="ml-20 lg:ml-20">
        <Header />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
