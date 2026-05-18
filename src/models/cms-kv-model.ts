import mongoose from "mongoose";

export const CMS_KEYS = {
  homepageSections: "homepage_sections",
  collectionsBundle: "collections_bundle",
} as const;

export type CmsKvKey = (typeof CMS_KEYS)[keyof typeof CMS_KEYS];

export interface CmsKvLean {
  _id: mongoose.Types.ObjectId;
  key: string;
  payload: unknown;
  updatedAt?: Date;
}

const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    collection: "cms_kv",
  },
);

export function getCmsKvModel(): mongoose.Model<CmsKvLean> {
  return (
    (mongoose.models.CmsKv as mongoose.Model<CmsKvLean>) ??
    mongoose.model<CmsKvLean>("CmsKv", schema)
  );
}
