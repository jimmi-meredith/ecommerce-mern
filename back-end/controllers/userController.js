import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// POST - /api/users/login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  user && (await user.matchPassword(password))
    ? res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    : res.status(401)
  throw new Error('Invalid email or password')
})

// GET - /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  res.send('Success')
})

export { authUser, getUserProfile }
