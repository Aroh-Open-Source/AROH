import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consent Preferences & Withdrawal",
  description:
    "Review, adjust, or withdraw affirmative consent for platform processing activities under Section 6 of the DPDP Act 2023.",
  alternates: {
    canonical: "/privacy/consent",
  },
  openGraph: {
    title: "Consent Preferences & Withdrawal | AROH Platform",
    description:
      "Review, adjust, or withdraw affirmative consent for platform processing activities under Section 6 of the DPDP Act 2023.",
    url: "https://aroh-os.vercel.app/privacy/consent",
    type: "website",
  },
};

export default function PrivacyConsentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
