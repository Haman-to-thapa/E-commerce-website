import express from "express";
import protect from "../middleware/authMiddleware.js";
import Product from "../models/product.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post("/products", protect, admin, async (req, res) => {
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
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
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
      collections,
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

// @route PUT / api/products/:id
// @desc Update an existing product ID
// @access Private/Admi
router.put("/:id", protect, admin, async (req, res) => {
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
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
    } = req.body;

    // Find product by ID
    const product = await Product.findById(req.params.id);
    
    if(product) {
      //update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.disCountPrice = disCountPrice || product.disCountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.sku = sku || product.sku;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      
      // save the update product 
      const updateProduct = await product.save();
      res.json(updateProduct)
    } else {
      res.status(404).json({message :" product not found"})
    }
  } catch (error) {
    console.error(error)
    res.status(401).json({message: "Server Error"})
  }
});

// @route DELELTE /api/products/:id
//@desc Delete a proudct by ID
// @access Private/Admin 

router.delete('/:id', protect, admin, async(req, res) => {
  
  const product = await Product.findById(req.params.id);

  try {
    if(product) {
      await product.deleteOne();
      res.json({message : "Product Removed"});
    } else {
      res.status(404).json({message: "Product Not Found"})
    }
  } catch (error) {
    console.error(error)
    res.status(404).json({message:"Server Error"})
  }

})

export default router;
