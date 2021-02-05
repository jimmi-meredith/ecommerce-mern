import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// GET - /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 2
  const page = req.query.pageNumber || 1
  const keyword = Number(req.query.keyword)
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {}
  const count = await Product.count({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// GET - /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// DELETE - /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// POST - /api/products/
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: 'Sample name',
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    description: 'Sample description',
    numReviews: 0,
    price: 0,
    countInStock: 0,
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// PUT - /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    countInStock,
    category,
    description,
  } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.countInStock = countInStock
    product.category = category
    product.description = description
    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// POST - /api/products/:id/reviews
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    }
    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length
    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
}
