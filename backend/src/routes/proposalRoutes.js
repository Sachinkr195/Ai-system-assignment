import { Router } from 'express';
import Proposal from '../models/Proposal.js';
import { generateProposal } from '../services/proposalGenerator.js';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { budgetLimit } = req.body || {};
    if (!budgetLimit || Number.isNaN(Number(budgetLimit))) {
      return res.status(400).json({
        error: 'budgetLimit is required and must be numeric',
      });
    }

    const result = generateProposal(req.body || {});

    const record = await Proposal.create({
      clientName: req.body.clientName,
      industry: req.body.industry,
      useCase: req.body.useCase,
      priorities: Array.isArray(req.body.priorities) ? req.body.priorities : [],
      locations: Array.isArray(req.body.locations) ? req.body.locations : [],
      headcount:
        typeof req.body.headcount === 'number' || !Number.isNaN(Number(req.body.headcount))
          ? Number(req.body.headcount)
          : undefined,
      budgetLimit: Number(req.body.budgetLimit),
      currency: req.body.currency || 'INR',
      constraints: Array.isArray(req.body.constraints) ? req.body.constraints : [],

      suggestedMix: result.suggestedMix,
      budgetAllocation: result.budgetAllocation,
      estimatedCostBreakdown: result.estimatedCostBreakdown,
      impactSummary: result.impactSummary,
      engine: result.engine,
      rawAiPayload: result.rawAiPayload,
    });

    return res.json({
      id: record._id,
      suggestedMix: record.suggestedMix,
      budgetAllocation: record.budgetAllocation,
      estimatedCostBreakdown: record.estimatedCostBreakdown,
      impactSummary: record.impactSummary,
      engine: record.engine,
      createdAt: record.createdAt,
    });
  } catch (err) {
    console.error('Error in /api/proposals/generate', err);
    return res.status(500).json({
      error: 'Failed to generate proposal',
    });
  }
});

export default router;

