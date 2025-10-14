const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/availability/timeslots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const allTimeSlots = [
      '8:00 - 10:00',
      '10:00 - 12:00',
      '12:00 - 14:00',
      '14:00 - 16:00',
      '16:00 - 18:00'
    ];

    const totalTechnicians = await User.countDocuments({ role: 'technician' });

    const bookingsOnDate = await Booking.find({
      date: {
        $gte: searchDate,
        $lt: nextDay
      },
      status: { $ne: 'cancelled' }
    });

    console.log(`Found ${bookingsOnDate.length} bookings for ${searchDate.toISOString()}`);

    const timeSlotCounts = {};
    allTimeSlots.forEach(slot => {
      timeSlotCounts[slot] = bookingsOnDate.filter(b => b.timeSlot === slot).length;
    });

    console.log('Time slot counts:', timeSlotCounts);

    const availableTimeSlots = allTimeSlots.filter(slot => {
      return timeSlotCounts[slot] < totalTechnicians;
    });

    res.json({ 
      availableTimeSlots,
      totalTechnicians,
      bookingsPerSlot: timeSlotCounts
    });
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    res.status(500).json({ error: 'Server error checking availability' });
  }
});

router.get('/availability/technicians', async (req, res) => {
  try {
    const { date, timeSlot } = req.query;
    
    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Date and time slot are required' });
    }

    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    console.log('Checking availability for:', { date: searchDate, timeSlot });

    const allTechnicians = await User.find({ role: 'technician' })
      .select('_id firstName lastName email');

    const bookedTechnicians = await Booking.find({
      date: {
        $gte: searchDate,
        $lt: nextDay
      },
      timeSlot: timeSlot,
      status: { $ne: 'cancelled' },
      assignedTechnician: { $exists: true, $ne: null }
    }).select('assignedTechnician').populate('assignedTechnician', 'firstName lastName');

    console.log('Booked technicians:', bookedTechnicians.map(b => ({
      id: b.assignedTechnician._id,
      name: `${b.assignedTechnician.firstName} ${b.assignedTechnician.lastName}`
    })));

    const bookedTechnicianIds = bookedTechnicians.map(b => b.assignedTechnician._id.toString());

    const availableTechnicians = allTechnicians.filter(tech => 
      !bookedTechnicianIds.includes(tech._id.toString())
    );

    console.log('Available technicians:', availableTechnicians.map(t => `${t.firstName} ${t.lastName}`));

    res.json({ 
      availableTechnicians,
      totalTechnicians: allTechnicians.length,
      bookedCount: bookedTechnicianIds.length
    });
  } catch (error) {
    console.error('Error checking technician availability:', error);
    res.status(500).json({ error: 'Server error checking availability' });
  }
});

router.post('/', [
  body('serviceType').notEmpty().withMessage('Service type is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
      preferredTechnician
    } = req.body;

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    console.log('Creating booking for:', { date: bookingDate, timeSlot, preferredTechnician });

    let assignedTechnician = undefined;
    
    if (preferredTechnician && preferredTechnician !== 'any') {
      const existingBooking = await Booking.findOne({
        date: {
          $gte: bookingDate,
          $lt: nextDay
        },
        timeSlot: timeSlot,
        assignedTechnician: preferredTechnician,
        status: { $ne: 'cancelled' }
      });

      console.log('Existing booking check:', existingBooking ? 'FOUND - Technician not available' : 'NOT FOUND - Technician available');

      if (existingBooking) {
        return res.status(400).json({ 
          error: 'The selected technician is not available for this time slot. Please choose another technician or select "Any Available".' 
        });
      }

      assignedTechnician = preferredTechnician;
    } else {
      const allTechnicians = await User.find({ role: 'technician' }).select('_id');
      
      const bookedTechnicians = await Booking.find({
        date: {
          $gte: bookingDate,
          $lt: nextDay
        },
        timeSlot: timeSlot,
        status: { $ne: 'cancelled' },
        assignedTechnician: { $exists: true, $ne: null }
      }).select('assignedTechnician');

      const bookedTechnicianIds = bookedTechnicians.map(b => b.assignedTechnician.toString());
      
      const availableTechnician = allTechnicians.find(tech => 
        !bookedTechnicianIds.includes(tech._id.toString())
      );

      if (availableTechnician) {
        assignedTechnician = availableTechnician._id;
      }
    }

    const booking = new Booking({
      serviceType,
      maintenancePlan: maintenancePlan || '',
      date: bookingDate,
      timeSlot,
      customerInfo: {
        name,
        email,
        phone,
        address
      },
      description: description || 'No description provided',
      assignedTechnician: assignedTechnician
    });

    console.log('Saving booking with assigned technician:', assignedTechnician);

    await booking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        referenceNumber: booking.referenceNumber,
        serviceType: booking.serviceType,
        date: booking.date,
        timeSlot: booking.timeSlot,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error during booking creation',
      details: error.message 
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { status, date, serviceType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) filter.date = { $gte: new Date(date) };
    if (serviceType) filter.serviceType = serviceType;

    const bookings = await Booking.find(filter)
      .populate('assignedTechnician', 'firstName lastName email')
      .sort({ date: 1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

router.get('/:referenceNumber', async (req, res) => {
  try {
    const booking = await Booking.findOne({ referenceNumber: req.params.referenceNumber })
      .populate('assignedTechnician', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Server error fetching booking' });
  }
});

router.patch('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Server error updating booking' });
  }
});

router.patch('/:id/assign', auth, [
  body('technicianId').notEmpty().withMessage('Technician ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedTechnician: req.body.technicianId, updatedAt: Date.now() },
      { new: true }
    ).populate('assignedTechnician', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Technician assigned successfully', booking });
  } catch (error) {
    console.error('Error assigning technician:', error);
    res.status(500).json({ error: 'Server error assigning technician' });
  }
});

module.exports = router;
