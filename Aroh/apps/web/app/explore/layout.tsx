import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Ecosystem Products",
  description:
    "Discover verified autonomous applications connected through the AROH open source platform foundation: media streaming, planetary telemetry, logistics, and developer education.",
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    title: "Explore Ecosystem Products | AROH Platform",
    description:
      "Discover verified autonomous applications connected through the AROH open source platform foundation.",
    url: "https://aroh-os.vercel.app/explore",
    type: "website",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
