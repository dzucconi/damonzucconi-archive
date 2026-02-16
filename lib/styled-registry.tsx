"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import {
  ServerStyleSheet,
  StyleSheetManager,
  ThemeProvider,
} from "styled-components";
import { THEME, SCHEMES } from "@auspices/eos/theme";
import { GlobalStyles } from "@auspices/eos/client";

export default function StyledRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  const theme = { ...THEME, colors: SCHEMES.light };

  if (typeof window !== "undefined") {
    return (
      <ThemeProvider theme={theme}>
        {children}
        <GlobalStyles />
      </ThemeProvider>
    );
  }

  return (
    <StyleSheetManager sheet={sheet.instance}>
      <ThemeProvider theme={theme}>
        {children}
        <GlobalStyles />
      </ThemeProvider>
    </StyleSheetManager>
  );
}
