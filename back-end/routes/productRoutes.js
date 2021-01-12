import express from 'express'
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel'

const router = express.Router()

// GET - /api/products
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
  })
)

// GET - /api/products/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    product
      ? res.json(product)
      : res.status(404).json({ message: 'Product not found' })
  })
)

export default router
