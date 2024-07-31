import { Inter } from "next/font/google";
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Reharsher Quizz",
  description: "A quizz to learn with space repetition",
};

export default function RootLayout({ children }) {
  return (
    <html classlang="en">
      <body className={`min-w-full ${inter.className}`}>{children}</body>
    </html>
  );
}
