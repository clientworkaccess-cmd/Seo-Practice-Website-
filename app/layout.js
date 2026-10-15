import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX !== "0";

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: "SEO Loop Testbed", template: "%s — SEO Loop Testbed" },
  description: "Throwaway blog for testing the automated SEO content loop.",
  robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <header className="site">
            <a className="brand" href="/">SEO Loop Testbed</a>
            <span className="tag">prototype</span>
          </header>
          {NOINDEX && (
            <div className="banner">
              NOINDEX is on — this site is hidden from search engines. Set
              NEXT_PUBLIC_NOINDEX=0 when you move to the measurement phase.
            </div>
          )}
          {children}
          <footer className="site">
            Dummy site for the content-loop prototype. Not a real product.
          </footer>
        </div>
      </body>
    </html>
  );
}
