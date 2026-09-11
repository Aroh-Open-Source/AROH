import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grievance Redressal Portal",
  description:
    "File and track data protection complaints with the AROH Grievance Redressal Officer under Section 13 of the DPDP Act 2023.",
  alternates: {
    canonical: "/privacy/grievance",
  },
  openGraph: {
    title: "Grievance Redressal Portal | AROH Platform",
    description:
      "File and track data protection complaints with the AROH Grievance Redressal Officer under Section 13 of the DPDP Act 2023.",
    url: "https://aroh-os.vercel.app/privacy/grievance",
    type: "website",
  },
};

export default function PrivacyGrievanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
