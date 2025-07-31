import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";

import StoreProvider from "./storeProvider";

import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Recipe Management System",
  description: "Manage your recipes efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <StoreProvider>{children}</StoreProvider>
          <Toaster theme="dark" position="top-right" />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
