import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        {/* Note: Pour charger FK Grotesk Trial, ajouter: <link href="[URL_FONT]" rel="stylesheet"> */}
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Load icons as module script */}
        <script type="module" src="/js/icons.js" async></script>
        {/* app.js is not needed in Next.js - React handles routing */}
        {/* Only load app.js in legacy HTML context (frontend/index.html) */}
      </body>
    </Html>
  );
}
