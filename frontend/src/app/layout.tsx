import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Javino | Absolute Authenticity",
  description: "Enterprise AI detection and forensic analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased min-h-screen bg-black text-[#f5f5f7] selection:bg-white selection:text-black">
        
        {/* Javino Minimalist Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-full border-[1.5px] border-white flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-black transition-colors duration-500" />
              </div>
              <span className="font-bold text-xl tracking-tighter uppercase text-white">Javino</span>
            </a>

            {/* Links */}
            <div className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
              <a href="#" className="hover:text-white transition-colors duration-300">Engine</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Forensics</a>
              <a href="#" className="hover:text-white transition-colors duration-300">API</a>
            </div>

            {/* CTA */}
            <div>
              <button className="text-xs font-semibold tracking-[0.2em] uppercase text-white hover:opacity-70 transition-opacity">
                Login
              </button>
            </div>
          </div>
        </nav>

        <main className="w-full bg-black">
          {children}
        </main>
      </body>
    </html>
  );
}
