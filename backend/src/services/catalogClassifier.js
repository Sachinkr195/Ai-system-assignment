const PRIMARY_CATEGORIES = [
  'Packaging',
  'Office Supplies',
  'Gifting',
  'Household',
  'Textiles',
  'Food Service',
  'Electronics Accessories',
  'Wellness',
  'Other',
];

const SUSTAINABILITY_FILTERS = [
  'plastic-free',
  'compostable',
  'biodegradable',
  'vegan',
  'recycled',
  'recyclable',
  'reusable',
  'locally-sourced',
  'low-carbon',
  'organic',
  'renewable-materials',
];

function pickPrimaryCategory({ name, description, materials }) {
  const text = `${name} ${description} ${materials.join(' ')}`.toLowerCase();

  if (/\b(cup|plate|cutlery|straw|food|drink|takeaway|container)\b/.test(text)) {
    return 'Food Service';
  }
  if (/\b(notebook|diary|pen|stationery|office|desk|calendar)\b/.test(text)) {
    return 'Office Supplies';
  }
  if (/\b(gift|hamper|kit|welcome box|goodie|merch|swag)\b/.test(text)) {
    return 'Gifting';
  }
  if (/\b(tote|bag|backpack|t-shirt|hoodie|apparel|textile|fabric)\b/.test(text)) {
    return 'Textiles';
  }
  if (/\b(bottle|mug|cup|straw|kitchen|home|household)\b/.test(text)) {
    return 'Household';
  }
  if (/\b(charger|cable|mouse pad|tech|electronics|gadget)\b/.test(text)) {
    return 'Electronics Accessories';
  }
  if (/\b(soap|wellness|personal care|hygiene|sanitizer)\b/.test(text)) {
    return 'Wellness';
  }

  return 'Other';
}

function inferSubCategory(primaryCategory, { name, description }) {
  const text = `${name} ${description}`.toLowerCase();

  if (primaryCategory === 'Food Service') {
    if (text.includes('cup')) return 'Cups & Tumblers';
    if (text.includes('plate')) return 'Plates & Bowls';
    if (text.includes('cutlery')) return 'Cutlery';
    return 'Food Service - Other';
  }

  if (primaryCategory === 'Office Supplies') {
    if (text.includes('notebook') || text.includes('diary')) return 'Notebooks & Diaries';
    if (text.includes('pen') || text.includes('pencil')) return 'Writing Instruments';
    return 'Office Supplies - Other';
  }

  if (primaryCategory === 'Gifting') {
    if (text.includes('welcome') || text.includes('onboarding')) return 'Onboarding Kits';
    if (text.includes('festival') || text.includes('diwali')) return 'Festive Gifting';
    return 'Corporate Gifting - Other';
  }

  return null;
}

function extractKeywords({ name, description, materials }) {
  const baseText = `${name} ${description} ${materials.join(' ')}`.toLowerCase();
  const tokens = baseText
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const stopwords = new Set([
    'the',
    'and',
    'for',
    'with',
    'from',
    'that',
    'this',
    'you',
    'are',
    'our',
    'eco',
    'friendly',
    'sustainable',
    'green',
    'your',
  ]);

  const freq = new Map();
  for (const token of tokens) {
    if (stopwords.has(token)) continue;
    freq.set(token, (freq.get(token) || 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

function generateSeoTags(input) {
  const keywords = extractKeywords(input);
  const base = keywords.slice(0, 6);

  const tags = new Set();
  for (const kw of base) {
    tags.add(kw);
    tags.add(`sustainable ${kw}`);
  }

  if (input.materials.length > 0) {
    for (const m of input.materials) {
      const clean = m.toLowerCase();
      tags.add(clean);
      tags.add(`${clean} product`);
    }
  }

  return Array.from(tags).slice(0, 10);
}

function inferSustainabilityFilters({ description, materials }) {
  const text = `${description} ${materials.join(' ')}`.toLowerCase();
  const filters = new Set();

  if (text.includes('plastic-free') || text.includes('plastic free')) {
    filters.add('plastic-free');
  }
  if (text.includes('compostable')) {
    filters.add('compostable');
  }
  if (text.includes('biodegradable')) {
    filters.add('biodegradable');
  }
  if (text.includes('vegan')) {
    filters.add('vegan');
  }
  if (text.includes('recycled')) {
    filters.add('recycled');
  }
  if (text.includes('recyclable')) {
    filters.add('recyclable');
  }
  if (text.includes('reusable') || text.includes('re-usable')) {
    filters.add('reusable');
  }
  if (text.includes('local') || text.includes('locally')) {
    filters.add('locally-sourced');
  }
  if (text.includes('organic')) {
    filters.add('organic');
  }
  if (text.includes('bamboo') || text.includes('sugarcane') || text.includes('areca')) {
    filters.add('renewable-materials');
  }

  return Array.from(filters).filter((f) => SUSTAINABILITY_FILTERS.includes(f));
}

export function classifyProduct(input) {
  const normalized = {
    productId: input.productId || null,
    name: input.name?.trim() || '',
    description: input.description?.trim() || '',
    materials: Array.isArray(input.materials)
      ? input.materials.map((m) => String(m).trim()).filter(Boolean)
      : [],
    price: typeof input.price === 'number' ? input.price : null,
    currency: input.currency || 'INR',
  };

  const primaryCategory = pickPrimaryCategory(normalized);
  const subCategory = inferSubCategory(primaryCategory, normalized);
  const seoTags = generateSeoTags(normalized);
  const sustainabilityFilters = inferSustainabilityFilters(normalized);

  return {
    primaryCategory,
    subCategory,
    seoTags,
    sustainabilityFilters,
    engine: 'rules-v1',
    rawAiPayload: {
      primaryCategoriesUniverse: PRIMARY_CATEGORIES,
      sustainabilityUniverse: SUSTAINABILITY_FILTERS,
    },
  };
}

