import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import './models/associations.js';

dotenv.config();

import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';
import contactRoutes from './routes/contacts.js';

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/contacts', contactRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AC Tech Web Server is running',
    timestamp: new Date().toISOString(),
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
    },
  })
})

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('MySQL connected successfully')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
  })
})

export default app;
