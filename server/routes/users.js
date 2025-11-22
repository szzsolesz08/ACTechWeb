import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    })

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

    const [numRows, [user]] = await User.update(updateData, {
      where: { id: req.user.userId },
      returning: true,
      validate: true
    })

    const updatedUser = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        zipCode: updatedUser.zipCode,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: 'Server error updating profile' })
  }
})

router.get('/technicians', async (req, res) => {
  try {
    const technicians = await User.findAll({
      where: { role: 'technician' },
      attributes: ['id', 'firstName', 'lastName', 'email']
    })

    res.json({ technicians })
  } catch (error) {
    console.error('Error fetching technicians:', error)
    res.status(500).json({ error: 'Server error fetching technicians' })
  }
})

export default router;
