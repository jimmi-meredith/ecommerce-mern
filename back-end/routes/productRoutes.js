import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import Product from '../models/productModel'

const router = express.Router()

router.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
  })
)

router.get('/:id', (req, res) => {
  const product = products.find((product) => product._id === req.params.id)
  res.json(product)
})

export default router
