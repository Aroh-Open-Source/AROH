import React from "react";
import { CANONICAL_PRODUCT_REGISTRY } from "@aroh/asdk";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AROH Open Source",
    alternateName: "AROH Ecosystem Platform",
    url: "https://aroh-os.vercel.app",
    logo: "https://aroh-os.vercel.app/aroh-logo.png",
    sameAs: ["https://github.com/Aroh-Open-Source/AROH"],
    description:
      "A premium, unified digital platform containing multiple interconnected products sharing a centralized foundation, design tokens, developer AI, and DPDP data protection.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AROH Ecosystem Platform",
    url: "https://aroh-os.vercel.app",
    description:
      "Unified open-source digital platform connecting media streaming, logistics, telemetry, and developer tools.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://aroh-os.vercel.app/explore?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const softwareProductsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AROH Ecosystem Showcase Applications",
    description: "Verified applications and tools connected to the AROH platform foundation.",
    itemListElement: CANONICAL_PRODUCT_REGISTRY.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: product.name,
        applicationCategory: product.category,
        operatingSystem: "Web Browser",
        url: `https://aroh-os.vercel.app/explore/${product.productId}`,
        description: product.shortDescription,
        softwareVersion: product.version,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareProductsSchema) }}
      />
    </>
  );
}
