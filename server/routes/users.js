const express = require('express')
const router = express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Server error fetching profile' })
  }
})

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, zipCode } = req.body

    const updateData = {
      firstName,
      lastName,
      phone,
      address,
      city,
      zipCode,
      updatedAt: Date.now(),
    }

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zipCode: user.zipCode,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: 'Server error updating profile' })
  }
})

router.get('/technicians', async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' }).select(
      'firstName lastName email'
    )

    res.json({ technicians })
  } catch (error) {
    console.error('Error fetching technicians:', error)
    res.status(500).json({ error: 'Server error fetching technicians' })
  }
})

module.exports = router
