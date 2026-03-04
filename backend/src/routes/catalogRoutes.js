import { Router } from 'express';
import ProductClassification from '../models/ProductClassification.js';
import { classifyProduct } from '../services/catalogClassifier.js';

const router = Router();

router.post('/classify', async (req, res) => {
  try {
    const { name, description } = req.body || {};
    if (!name || !description) {
      return res.status(400).json({
        error: 'name and description are required',
      });
    }

    const result = classifyProduct(req.body || {});

    const record = await ProductClassification.create({
      productId: req.body.productId,
      name: req.body.name,
      description: req.body.description,
      materials: Array.isArray(req.body.materials) ? req.body.materials : [],
      price: typeof req.body.price === 'number' ? req.body.price : undefined,
      currency: req.body.currency || 'INR',
      primaryCategory: result.primaryCategory,
      subCategory: result.subCategory,
      seoTags: result.seoTags,
      sustainabilityFilters: result.sustainabilityFilters,
      engine: result.engine,
      rawAiPayload: result.rawAiPayload,
    });

    return res.json({
      id: record._id,
      primaryCategory: record.primaryCategory,
      subCategory: record.subCategory,
      seoTags: record.seoTags,
      sustainabilityFilters: record.sustainabilityFilters,
      engine: record.engine,
      createdAt: record.createdAt,
    });
  } catch (err) {
    console.error('Error in /api/catalog/classify', err);
    return res.status(500).json({
      error: 'Failed to classify product',
    });
  }
});

export default router;

