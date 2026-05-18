import { Schema, model, models } from "mongoose";

const productDetailsSchema = new Schema(
  {
    fit: { type: String },
    fabric: { type: String },
    washCare: { type: String },
    styleNotes: { type: String },
    deliveryNotes: { type: String },
  },
  { _id: false },
);

const productDiscoverySchema = new Schema(
  {
    categorySlug: { type: String, index: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    fits: [{ type: String }],
    collections: [{ type: String, index: true }],
    tags: [{ type: String }],
    featuredRank: { type: Number },
    trendingRank: { type: Number },
    releasedAtMs: { type: Number },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    details: { type: productDetailsSchema },
    discovery: { type: productDiscoverySchema },
    priceCents: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    images: [{ type: String }],
    cloudinaryPublicIds: [{ type: String }],
    collectionSlugs: [{ type: String, index: true }],
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    inventory: {
      sku: String,
      quantity: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export const Product =
  models.Product ?? model("Product", productSchema);
