import mongoose from "mongoose";

export interface ProductContentLean {
  _id: mongoose.Types.ObjectId;
  slug: string;
  payload: unknown;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "product_contents",
  },
);

export function getProductContentModel(): mongoose.Model<ProductContentLean> {
  return (
    (mongoose.models.ProductContent as mongoose.Model<ProductContentLean>) ??
    mongoose.model<ProductContentLean>("ProductContent", schema)
  );
}
