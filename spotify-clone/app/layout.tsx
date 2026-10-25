import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Web Music Player Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}