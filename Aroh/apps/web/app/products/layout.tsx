import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Directory",
  description:
    "Interactive product workspace launcher and verified ecosystem directory for the AROH open source platform.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Products Directory | AROH Platform",
    description:
      "Interactive product workspace launcher and verified ecosystem directory for the AROH open source platform.",
    url: "https://aroh-os.vercel.app/products",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
