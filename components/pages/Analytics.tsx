import Script from "next/script";
import { FC } from "react";

export const Analytics: FC = () => {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-3NETR5XRJL"
        async
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-3NETR5XRJL');
        `}
      </Script>
    </>
  );
};
