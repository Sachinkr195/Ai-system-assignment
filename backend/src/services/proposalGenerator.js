function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildDefaultCatalog(currency) {
  return [
    {
      productName: 'Recycled Paper Notebook',
      category: 'Office Supplies',
      unitPrice: 120,
      sustainabilityNotes: 'Made from 100% recycled paper, FSC-certified.',
    },
    {
      productName: 'Bamboo Pen',
      category: 'Office Supplies',
      unitPrice: 60,
      sustainabilityNotes: 'Bamboo body with minimal plastic components.',
    },
    {
      productName: 'Organic Cotton Tote Bag',
      category: 'Textiles',
      unitPrice: 180,
      sustainabilityNotes: 'Reusable bag replacing single-use plastic.',
    },
    {
      productName: 'Steel Water Bottle',
      category: 'Household',
      unitPrice: 450,
      sustainabilityNotes: 'Reusable bottle replacing PET bottles.',
    },
    {
      productName: 'Seed Paper Thank-You Card',
      category: 'Gifting',
      unitPrice: 40,
      sustainabilityNotes: 'Plantable card that grows into herbs.',
    },
  ].map((item) => ({ ...item, currency }));
}

export function generateProposal(input) {
  const {
    clientName,
    industry,
    useCase,
    priorities = [],
    locations = [],
    headcount,
    budgetLimit,
    currency = 'INR',
    constraints = [],
  } = input;

  if (!budgetLimit || Number.isNaN(Number(budgetLimit))) {
    throw new Error('budgetLimit is required and must be a number');
  }

  const budget = Number(budgetLimit);
  const people = headcount && !Number.isNaN(Number(headcount)) ? Number(headcount) : 1;
  const perPersonBudget = budget / people;

  const catalog = buildDefaultCatalog(currency);

  // Very simple heuristic: try to build a 3–4 line-item kit within budget.
  const lineItems = [];
  let remaining = budget;

  for (const item of catalog) {
    if (remaining <= 0) break;

    // Prioritise lower-priced, high-impact items first.
    const maxQty = Math.floor(remaining / item.unitPrice);
    if (maxQty <= 0) continue;

    // Aim for 1 unit per person but clamp to budget.
    const targetQty = clamp(people, 1, maxQty);
    const quantity = targetQty;
    const totalPrice = quantity * item.unitPrice;

    if (totalPrice <= 0) continue;

    lineItems.push({
      productName: item.productName,
      category: item.category,
      quantity,
      unitPrice: item.unitPrice,
      totalPrice,
      sustainabilityNotes: item.sustainabilityNotes,
    });

    remaining -= totalPrice;
    if (lineItems.length >= 4) break;
  }

  const totalSpend = lineItems.reduce((sum, li) => sum + li.totalPrice, 0);
  const effectivePerPerson = totalSpend / people;

  const buckets = {
    'Core kit value': 0,
    'Sustainability premium': 0,
    'Logistics & buffer': 0,
  };

  buckets['Core kit value'] = totalSpend * 0.78;
  buckets['Sustainability premium'] = totalSpend * 0.12;
  buckets['Logistics & buffer'] = totalSpend * 0.1;

  const budgetAllocation = Object.entries(buckets).map(([bucket, amount]) => ({
    bucket,
    amount: Math.round(amount),
    percentage: Math.round((amount / totalSpend) * 100),
  }));

  const prioritiesText = priorities.join(', ') || 'sustainability, user delight, and brand alignment';
  const constraintText = constraints.join(', ') || 'no major constraints beyond budget and sustainability';

  const impactSummary = [
    clientName ? `For ${clientName}, this proposal focuses on ${prioritiesText}.` : `This proposal focuses on ${prioritiesText}.`,
    useCase
      ? `The mix is optimised for the described use-case: ${useCase}.`
      : 'The mix is optimised for a typical employee and client-facing gifting context.',
    `Each recipient gets an estimated value of ~${Math.round(
      effectivePerPerson
    )} ${currency} in useful, long-life items designed to replace common single-use or high-footprint alternatives.`,
    locations.length
      ? `The plan assumes distribution across ${locations.join(', ')} with standard India-wide logistics.`
      : 'The plan assumes standard domestic logistics within India.',
    `Constraints considered: ${constraintText}.`,
  ].join(' ');

  return {
    suggestedMix: lineItems,
    budgetAllocation,
    estimatedCostBreakdown: {
      perUnit: Math.round(effectivePerPerson),
      perPerson: Math.round(effectivePerPerson),
      total: Math.round(totalSpend),
      currency,
    },
    impactSummary,
    engine: 'rules-v1',
    rawAiPayload: {
      headcount: people,
      budgetLimit: budget,
      currency,
    },
  };
}

