// Root layout - passthrough only
// The [locale]/layout.tsx handles html, body, fonts, and providers

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
