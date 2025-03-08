import express from 'express';
import protect from "../middleware/authMiddleware.js";
import Product from '../models/product.js';
import  admin  from '../middleware/adminMiddleware.js'

const router = express.Router();

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post('/products', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collection, 
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight
    } = req.body;

    // Correct model name
    const product = new Product({
      name,
      description,
      price,
      disCountPrice,
      countInStock,
      sku,
      category,
      brand,
      sizes,
      colors,
      collection,  
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      user: req.user._id, // Reference to the admin user who created it
    });

    // Save product to DB
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
