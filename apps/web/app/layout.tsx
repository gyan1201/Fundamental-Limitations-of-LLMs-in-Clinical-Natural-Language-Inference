export const metadata = {
  title: 'Gadget Platform',
  description: 'Buy and manage gadgets',
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="max-w-5xl mx-auto p-6">
          {children}
        </div>
      </body>
    </html>
  );
}