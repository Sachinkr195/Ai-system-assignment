import mongoose from 'mongoose';

const proposalLineItemSchema = new mongoose.Schema(
  {
    productName: String,
    category: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    sustainabilityNotes: String,
  },
  { _id: false }
);

const budgetAllocationSchema = new mongoose.Schema(
  {
    bucket: String,
    amount: Number,
    percentage: Number,
  },
  { _id: false }
);

const proposalSchema = new mongoose.Schema(
  {
    clientName: String,
    industry: String,
    useCase: String,
    priorities: [String],
    locations: [String],
    headcount: Number,
    budgetLimit: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    constraints: [String],

    suggestedMix: [proposalLineItemSchema],
    budgetAllocation: [budgetAllocationSchema],
    estimatedCostBreakdown: {
      perUnit: Number,
      perPerson: Number,
      total: Number,
      currency: String,
    },
    impactSummary: String,

    engine: { type: String, default: 'rules-v1' },
    rawAiPayload: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;

