const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const Contact = require('../models/Contact')
const auth = require('../middleware/auth')

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject')
      .isIn(['quote', 'service', 'support', 'feedback', 'other'])
      .withMessage('Valid subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, phone, subject, message } = req.body

      const contact = new Contact({
        name,
        email,
        phone: phone || '',
        subject,
        message,
      })

      await contact.save()

      res.status(201).json({
        message: 'Contact message received successfully',
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          createdAt: contact.createdAt,
        },
      })
    } catch (error) {
      console.error('Contact creation error:', error)
      res.status(500).json({
        error: 'Server error while submitting contact message',
        details: error.message,
      })
    }
  }
)

router.get('/', auth, async (req, res) => {
  try {
    const { status, subject } = req.query
    const filter = {}

    if (status) filter.status = status
    if (subject) filter.subject = subject

    const contacts = await Contact.find(filter)
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.json({ contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ error: 'Server error fetching contact messages' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      'assignedTo',
      'firstName lastName email'
    )

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' })
    }

    res.json({ contact })
  } catch (error) {
    console.error('Error fetching contact:', error)
    res.status(500).json({ error: 'Server error fetching contact message' })
  }
})

router.patch(
  '/:id/status',
  auth,
  [
    body('status')
      .isIn(['new', 'read', 'in-progress', 'resolved', 'closed'])
      .withMessage('Invalid status'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, updatedAt: Date.now() },
        { new: true }
      )

      if (!contact) {
        return res.status(404).json({ error: 'Contact message not found' })
      }

      res.json({ message: 'Contact status updated', contact })
    } catch (error) {
      console.error('Error updating contact:', error)
      res.status(500).json({ error: 'Server error updating contact message' })
    }
  }
)

router.patch(
  '/:id/assign',
  auth,
  [body('userId').notEmpty().withMessage('User ID is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { assignedTo: req.body.userId, updatedAt: Date.now() },
        { new: true }
      ).populate('assignedTo', 'firstName lastName email')

      if (!contact) {
        return res.status(404).json({ error: 'Contact message not found' })
      }

      res.json({ message: 'Contact assigned successfully', contact })
    } catch (error) {
      console.error('Error assigning contact:', error)
      res.status(500).json({ error: 'Server error assigning contact' })
    }
  }
)

router.patch(
  '/:id/notes',
  auth,
  [body('notes').isString().withMessage('Notes must be a string')],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { notes: req.body.notes, updatedAt: Date.now() },
        { new: true }
      )

      if (!contact) {
        return res.status(404).json({ error: 'Contact message not found' })
      }

      res.json({ message: 'Contact notes updated', contact })
    } catch (error) {
      console.error('Error updating contact notes:', error)
      res.status(500).json({ error: 'Server error updating notes' })
    }
  }
)

router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' })
    }

    res.json({ message: 'Contact message deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({ error: 'Server error deleting contact message' })
  }
})

module.exports = router
