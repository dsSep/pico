import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pico 智能体交互体验",
  description: "通过交互回放探索 Pico 编程智能体的执行循环、工具调用、权限边界与运行记录。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
