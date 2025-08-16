export const metadata = {
  title: 'Gadget Platform',
  description: 'Buy and manage gadgets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}