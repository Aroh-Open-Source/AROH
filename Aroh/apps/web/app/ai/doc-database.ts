export interface MockDoc {
  keyword: string;
  title: string;
  content: string;
}

export const mockDocDatabase: MockDoc[] = [
  {
    keyword: "wallet",
    title: "AROS Wallet",
    content: "Your AROS wallet holds your platform credits. Credits can be earned through platform activity and used to access premium features and services within the AROH ecosystem."
  },
  {
    keyword: "products",
    title: "Ecosystem Products",
    content: "AROH hosts a curated suite of digital products and services. Visit the Explore section to discover available products and their access requirements."
  },
  {
    keyword: "membership",
    title: "Membership Tiers",
    content: "AROH offers tiered membership plans. Higher tiers unlock additional products, higher wallet limits, and priority support. Upgrade from your Dashboard."
  },
  {
    keyword: "announcements",
    title: "Platform Announcements",
    content: "Stay up to date with the latest platform news, product launches, and maintenance notifications on your home feed."
  },
  {
    keyword: "dashboard",
    title: "Your Dashboard",
    content: "The Dashboard gives you a complete view of your account — wallet balance, membership tier, transaction history, and active product access."
  }
];
