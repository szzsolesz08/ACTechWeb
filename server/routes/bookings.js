import express from 'express'
import { body, validationResult } from 'express-validator'
import { Op } from 'sequelize'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/availability/timeslots', async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    const dateObj = new Date(date)
    const searchDate = dateObj.toISOString().split('T')[0]

    const allTimeSlots = [
      '8:00 - 10:00',
      '10:00 - 12:00',
      '12:00 - 14:00',
      '14:00 - 16:00',
      '16:00 - 18:00',
    ]

    const totalTechnicians = await User.count({ where: { role: 'technician' } })

    const bookingsOnDate = await Booking.findAll({
      where: {
        date: searchDate,
      },
    })

    const timeSlotCounts = {}
    allTimeSlots.forEach((slot) => {
      const bookingsInSlot = bookingsOnDate.filter(
        (b) => b.timeSlot === slot && b.status !== 'cancelled'
      )
      timeSlotCounts[slot] = bookingsInSlot.length
    })

    const availableTimeSlots = allTimeSlots.filter((slot) => {
      const isAvailable = timeSlotCounts[slot] < totalTechnicians
      return isAvailable
    })

    res.json({
      availableTimeSlots,
      totalTechnicians,
      bookingsPerSlot: timeSlotCounts,
    })
  } catch (error) {
    console.error('Error checking time slot availability:', error)
    res.status(500).json({ error: 'Server error checking availability' })
  }
})

router.get('/availability/technicians', async (req, res) => {
  try {
    const { date, timeSlot } = req.query

    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Date and time slot are required' })
    }

    const searchDate = new Date(date).toISOString().split('T')[0]

    const totalTechnicians = await User.count({ where: { role: 'technician' } })

    const allTechnicians = await User.findAll({
      where: { role: 'technician' },
      attributes: ['id', 'firstName', 'lastName', 'email'],
    })

    const bookedTechnicians = await Booking.findAll({
      where: {
        date: searchDate,
        timeSlot: timeSlot,
        status: {
          [Op.ne]: 'cancelled',
        },
        assignedTechnicianId: {
          [Op.not]: null,
        },
      },
      attributes: ['assignedTechnicianId'],
      include: [
        {
          model: User,
          as: 'assignedTechnician',
          attributes: ['firstName', 'lastName'],
        },
      ],
    })

    const bookedTechnicianIds = bookedTechnicians.map(
      (b) => b.assignedTechnicianId
    )

    const availableTechnicians = allTechnicians.filter(
      (tech) => !bookedTechnicianIds.includes(tech.id)
    )

    res.json({
      availableTechnicians,
      totalTechnicians: allTechnicians.length,
      bookedCount: bookedTechnicianIds.length,
    })
  } catch (error) {
    console.error('Error checking technician availability:', error)
    res.status(500).json({ error: 'Server error checking availability' })
  }
})

router.post(
  '/',
  [
    body('serviceType').notEmpty().withMessage('Service type is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const {
        serviceType,
        maintenancePlan,
        date,
        timeSlot,
        name,
        email,
        phone,
        address,
        description,
        preferredTechnician,
      } = req.body

      const bookingDate = new Date(date).toISOString().split('T')[0]

      let assignedTechnician = undefined

      if (preferredTechnician && preferredTechnician !== 'any') {
        const technician = await User.findOne({
          where: {
            id: preferredTechnician,
            role: 'technician'
          }
        })

        if (!technician) {
          return res.status(400).json({
            error: 'The selected technician is no longer available. Please choose another technician or select "Any Available".',
          })
        }

        const existingBooking = await Booking.findOne({
          where: {
            date: bookingDate,
            timeSlot: timeSlot,
            assignedTechnicianId: preferredTechnician,
            status: {
              [Op.ne]: 'cancelled',
            },
          },
        })

        if (existingBooking) {
          return res.status(400).json({
            error:
              'The selected technician is not available for this time slot. Please choose another technician or select "Any Available".',
          })
        }

        assignedTechnician = preferredTechnician
      } else {
        const allTechnicians = await User.findAll({
          where: { role: 'technician' },
          attributes: ['id'],
        })

        const bookedTechnicians = await Booking.findAll({
          where: {
            date: bookingDate,
            timeSlot: timeSlot,
            status: {
              [Op.ne]: 'cancelled',
            },
            assignedTechnicianId: {
              [Op.not]: null,
            },
          },
          attributes: ['assignedTechnicianId'],
        })

        const bookedTechnicianIds = bookedTechnicians.map(
          (b) => b.assignedTechnicianId
        )

        const availableTechnicians = allTechnicians.filter(
          (tech) => !bookedTechnicianIds.includes(tech.id)
        )

        if (availableTechnicians.length === 0) {
          return res.status(400).json({
            error: 'No technicians are available for this time slot. Please select a different time or date.',
          })
        }

        const randomIndex = Math.floor(Math.random() * availableTechnicians.length)
        assignedTechnician = availableTechnicians[randomIndex].id
      }

      const booking = await Booking.create({
        serviceType,
        maintenancePlan: maintenancePlan || '',
        date: bookingDate,
        timeSlot,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        description: description || 'No description provided',
        assignedTechnicianId: assignedTechnician,
        price: Number(req.body.price) || 0,
      })

      res.status(201).json({
        message: 'Booking created successfully',
        booking: {
          referenceNumber: booking.referenceNumber,
          serviceType: booking.serviceType,
          date: booking.date,
          timeSlot: booking.timeSlot,
          status: booking.status,
        },
      })
    } catch (error) {
      console.error('Booking creation error:', error)
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      res.status(500).json({
        error: 'Server error during booking creation',
        details: error.message,
      })
    }
  }
)

router.get('/', auth, async (req, res) => {
  try {
    const { status, date, serviceType } = req.query
    const filter = {}

    if (status) filter.status = status
    if (date) filter.date = { $gte: new Date(date) }
    if (serviceType) filter.serviceType = serviceType

    const whereClause = {}
    if (status) whereClause.status = status
    if (date) whereClause.date = new Date(date).toISOString().split('T')[0]
    if (serviceType) whereClause.serviceType = serviceType

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'assignedTechnician',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
      order: [['date', 'ASC']],
    })

    res.json({ bookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ error: 'Server error fetching bookings' })
  }
})

router.get('/:referenceNumber', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        referenceNumber: req.params.referenceNumber,
      },
      include: [
        {
          model: User,
          as: 'assignedTechnician',
          attributes: ['firstName', 'lastName', 'email', 'phone'],
        },
      ],
    })

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json({ booking })
  } catch (error) {
    console.error('Error fetching booking:', error)
    res.status(500).json({ error: 'Server error fetching booking' })
  }
})

router.patch(
  '/:id/status',
  auth,
  [
    body('status')
      .isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const numRows = await Booking.update(
        { status: req.body.status, updatedAt: Date.now() },
        {
          where: { id: req.params.id }
        }
      )

      if (numRows === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      const booking = await Booking.findByPk(req.params.id)

      res.json({ message: 'Booking status updated', booking })
    } catch (error) {
      console.error('Error updating booking:', error)
      res.status(500).json({ error: 'Server error updating booking' })
    }
  }
)

router.patch(
  '/:id/assign',
  auth,
  [body('technicianId').notEmpty().withMessage('Technician ID is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const numRows = await Booking.update(
        { assignedTechnicianId: req.body.technicianId, updatedAt: Date.now() },
        {
          where: { id: req.params.id }
        }
      )

      if (numRows === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      const booking = await Booking.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'assignedTechnician',
            attributes: ['firstName', 'lastName', 'email'],
          },
        ],
      })

      res.json({ message: 'Technician assigned successfully', booking })
    } catch (error) {
      console.error('Error assigning technician:', error)
      res.status(500).json({ error: 'Server error assigning technician' })
    }
  }
)

export default router
