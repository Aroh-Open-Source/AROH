import { z } from "zod";

export const MembershipTierSchema = z.enum(["basic", "pro", "enterprise"]);
export type MembershipTier = z.infer<typeof MembershipTierSchema>;

export const ProductStatusSchema = z.enum([

  "online",
  "development",
  "offline",
  "internal"
]);
export type ProductStatus = z.infer<typeof ProductStatusSchema>;

export const CapabilityItemSchema = z.object({
  title: z.string().min(1, "Capability title is required"),
  description: z.string().min(1, "Capability description is required")
});
export type CapabilityItem = z.infer<typeof CapabilityItemSchema>;

export const ProductShowcaseSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  category: z.string().min(1, "Category is required"),
  badge: z.string().min(1, "Badge is required"),
  status: ProductStatusSchema,
  requiredTier: MembershipTierSchema,
  price: z.number().nonnegative(),

  version: z.string().min(1, "Version is required"),
  author: z.string().min(1, "Author is required"),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().or(z.string().regex(/^\/[a-zA-Z0-9_/-]*$/)).optional(),
  docsUrl: z.string().url().or(z.string().regex(/^\/[a-zA-Z0-9_/-]*$/)).optional(),
  showcaseUrl: z.string().url().or(z.string().regex(/^\/[a-zA-Z0-9_/-]*$/)).optional(),

  primaryCapabilities: z.array(CapabilityItemSchema).min(1, "At least one capability is required"),
  technologySummary: z.string().min(1, "Technology summary is required"),
  internalOnly: z.boolean().optional(),
  sourceOfTruth: z.string().min(1, "Source of truth reference is required"),
  lastVerified: z.string().min(1, "Last verified timestamp is required"),
  metadataVersion: z.string().min(1, "Metadata version is required")
});
export type ProductShowcase = z.infer<typeof ProductShowcaseSchema>;
