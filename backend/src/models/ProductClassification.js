import mongoose from 'mongoose';

const classificationSchema = new mongoose.Schema(
  {
    productId: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    materials: [{ type: String }],
    price: { type: Number },
    currency: { type: String, default: 'INR' },

    primaryCategory: { type: String, required: true },
    subCategory: { type: String },
    seoTags: [{ type: String }],
    sustainabilityFilters: [{ type: String }],

    // For observability / debugging
    engine: { type: String, default: 'rules-v1' },
    rawAiPayload: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const ProductClassification = mongoose.model(
  'ProductClassification',
  classificationSchema
);

export default ProductClassification;

