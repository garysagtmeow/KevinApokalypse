import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#E65100" />
        <meta name="description" content="Hilf Emi, Kevins Chaos in der Wohnung zu beseitigen!" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Kevin" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/apple-touch-icon-512.png" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                width: 100%;
                height: 100dvh;
                overflow: hidden;
                background-color: #F2E4C8;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
              }
              [role="button"], button, a {
                -webkit-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
