import type { Metadata } from "next";
import { getProductById } from "@aroh/asdk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product is not registered in the canonical AROH showcase.",
    };
  }

  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.shortDescription,
    alternates: {
      canonical: `/explore/${product.productId}`,
    },
    openGraph: {
      title: `${product.name} | AROH Ecosystem Showcase`,
      description: product.shortDescription,
      url: `https://aroh-os.vercel.app/explore/${product.productId}`,
      type: "website",
      images: [
        {
          url: "/aroh-logo.png",
          width: 512,
          height: 512,
          alt: `${product.name} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${product.name} — ${product.tagline}`,
      description: product.shortDescription,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
