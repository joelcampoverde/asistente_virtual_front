import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Sidebar from "@/components/sidebar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asistente Virtual",
  description: "Asistente Vitual para Docentes de UNEMI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`flex font-segoe-ui antialiased ${inter.className}`}>
        <Sidebar />
        <main className="flex-1 p-4">

          {children}

        </main>
      </body>
    </html>
  );
}
