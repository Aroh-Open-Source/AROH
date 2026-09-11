import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Principal Rights Portal",
  description:
    "Exercise your statutory rights under Chapter III of the Digital Personal Data Protection Act, 2023: Access, Correction, Erasure, and Nomination.",
  alternates: {
    canonical: "/privacy/rights",
  },
  openGraph: {
    title: "Data Principal Rights Portal | AROH Platform",
    description:
      "Exercise your statutory rights under Chapter III of the Digital Personal Data Protection Act, 2023.",
    url: "https://aroh-os.vercel.app/privacy/rights",
    type: "website",
  },
};

export default function PrivacyRightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
