import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res
        .status(401)
        .json({ error: 'No authentication token, access denied' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Token is not valid' })
  }
}

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' })
  }
  next()
}

const technicianAuth = (req, res, next) => {
  if (req.user.role !== 'technician' && req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ error: 'Access denied. Technician or admin only.' })
  }
  next()
}

export { auth as default, adminAuth, technicianAuth };
