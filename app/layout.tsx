import type { Metadata } from "next";
import { THEME } from "@auspices/eos/server";
import StyledRegistry from "../lib/styled-registry";

export const metadata: Metadata = {
  title: "Damon Zucconi Archive",
  description: "Archive and works",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body data-root-font-size={THEME.rootFontSize}>
        <StyledRegistry>{children}</StyledRegistry>
      </body>
    </html>
  );
}
