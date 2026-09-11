import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy & Preferences",
  description:
    "Cookie policy, itemized cookie inventory, and granular affirmative consent preferences for the AROH platform under DPDP Act 2023.",
  alternates: {
    canonical: "/cookies",
  },
  openGraph: {
    title: "Cookie Policy & Preferences | AROH Platform",
    description:
      "Cookie policy, itemized cookie inventory, and granular affirmative consent preferences for the AROH platform.",
    url: "https://aroh-os.vercel.app/cookies",
    type: "website",
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
