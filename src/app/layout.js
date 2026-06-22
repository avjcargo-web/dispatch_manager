import { Outfit } from "next/font/google";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Dispatch Manager",
    template: "%s | Dispatch Manager",
  },
  description: "Total Dispatch Management System frontend built with Next.js App Router.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} min-h-screen bg-slate-100 text-slate-900 antialiased`}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
