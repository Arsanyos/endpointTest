import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resturant QR",
  description: "Virtual Menu system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="py-4 px-4">
          {children}
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white py-4 text-center z-10 f w-[100%] ">
          <div className="flex flex-row justify-between items-center w-[80%] mx-auto">
            <Image alt="sorting-icon" src="/icons/homeIcon.svg" height={24} width={24} />
            <Image alt="sorting-icon" src="/icons/search.svg" height={24} width={24} />
            <Image alt="sorting-icon" src="/icons/cart.svg" height={24} width={24} />
          </div>
        </div>
      </body>
    </html>
  );
}
