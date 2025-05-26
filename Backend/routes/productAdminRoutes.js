import express from 'express'
import product from '../models/product.js'
import protect from '../middleware/authMiddleware.js'
import admin from '../middleware/adminMiddleware.js'


const router = express.Router()

// @route GET /api/admin/products
// @des Get all products (Admin only)
// @access Private/Admin


router.get('/',protect, admin, async(req, res) => {
  try {
    const products = await product.find({});
    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"})
  }
})

// @route GET /api/admin/products/:id
// @desc Get single product by ID (Admin only)
// @access Private/Admin
router.get('/:id', protect, admin, async(req, res) => {
  try {
    const singleProduct = await product.findById(req.params.id);
    if (!singleProduct) {
      return res.status(404).json({message: "Product not found"});
    }
    res.json(singleProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
})

// @route POST /api/admin/products
// @desc Create a new product (Admin only)
// @access Private/Admin
router.post('/', protect, admin, async(req, res) => {
  try {
    const newProduct = new product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
})

// @route PUT /api/admin/products/:id
// @desc Update a product (Admin only)
// @access Private/Admin
router.put('/:id', protect, admin, async(req, res) => {
  try {
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({message: "Product not found"});
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
})

// @route DELETE /api/admin/products/:id
// @desc Delete a product (Admin only)
// @access Private/Admin
router.delete('/:id', protect, admin, async(req, res) => {
  try {
    const deletedProduct = await product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({message: "Product not found"});
    }
    res.json({message: "Product deleted successfully", _id: req.params.id});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
})

export default router;