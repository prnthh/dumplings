import "@/styles/globals.css";
import { CeloProvider } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";
// pages/_app.js
import { JetBrains_Mono } from "next/font/google";
const jetBrains = JetBrains_Mono({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <div className={jetBrains.className}>
      <CeloProvider
        dapp={{
          name: "My awesome dApp",
          description: "My awesome description",
          url: "https://example.com",
        }}
      >
        <Component {...pageProps} />
      </CeloProvider>
    </div>
  );
}
