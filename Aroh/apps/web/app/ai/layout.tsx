import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer AI Studio",
  description:
    "Stateless AI prompt workspace and multi-provider abstraction layer for ecosystem developer workflows and documentation discovery.",
  alternates: {
    canonical: "/ai",
  },
  openGraph: {
    title: "Developer AI Studio | AROH Platform",
    description:
      "Stateless AI prompt workspace and multi-provider abstraction layer for ecosystem developer workflows.",
    url: "https://aroh-os.vercel.app/ai",
    type: "website",
  },
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
