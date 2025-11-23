# ACTechWeb - Server

Backend API for AC Technician Services booking platform built with Node.js, Express, and MySQL.

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL** - Relational database
- **Sequelize** - MySQL ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (local installation)
- npm or yarn

## 🛠️ Installation

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the server root directory:

   ```env
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   ```

   **Note:** The `.env` file is gitignored for security. Never commit it to version control.

5. **Seed the database (optional but recommended):**

   ```bash
   npm run seed
   ```

   This will create sample users and bookings for testing.

6. **Start the server:**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| POST   | `/register` | Register new user | No            |
| POST   | `/login`    | Login user        | No            |

### Bookings (`/api/bookings`)

| Method | Endpoint                 | Description                         | Auth Required          |
| ------ | ------------------------ | ----------------------------------- | ---------------------- |
| POST   | `/`                      | Create new booking                  | Yes                    |
| GET    | `/my-bookings`           | Get user's bookings                 | Yes                    |
| GET    | `/available-time-slots`  | Get available time slots for a date | Yes                    |
| GET    | `/available-technicians` | Get available technicians           | Yes                    |
| GET    | `/:id`                   | Get booking by ID                   | Yes                    |
| PATCH  | `/:id/status`            | Update booking status               | Yes (Admin/Technician) |
| PATCH  | `/:id/assign`            | Assign technician to booking        | Yes (Admin)            |

### Users (`/api/users`)

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| GET    | `/profile`     | Get user profile    | Yes           |
| PUT    | `/profile`     | Update user profile | Yes           |
| GET    | `/technicians` | Get all technicians | No            |

### Health Check

| Method | Endpoint      | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | `/api/health` | Server health check | No            |

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # Sequelize database configuration
├── middleware/
│   └── auth.js              # JWT authentication & role-based middleware
├── models/
│   ├── Booking.js           # Booking model (Sequelize)
│   ├── Contact.js           # Contact/feedback model (Sequelize)
│   ├── User.js              # User model (Sequelize)
│   └── associations.js      # Model associations setup
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── bookings.js          # Booking routes
│   ├── contacts.js          # Contact routes
│   └── users.js             # User routes
├── seeders/
│   ├── README.md            # Seeding documentation
│   ├── data/                # Seed data
│   │   ├── bookings.js      # Sample booking data
│   │   ├── contacts.js      # Sample contact data
│   │   └── users.js         # Sample user data
│   ├── bookingSeeder.js     # Booking seeding script
│   ├── contactSeeder.js     # Contact seeding script
│   ├── seed.js              # Main seeding script
│   └── userSeeder.js        # User seeding script
├── .env                     # Environment variables (local, not committed)
├── .env_example             # Example env file for configuration
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── server.js                # Main Express server entry point
├── package.json             # Dependencies and scripts
└── package-lock.json        # Exact dependency lockfile
```

## 📊 Database Models

### User Model

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,          // Flat field (not nested)
  city: String,             // Flat field
  zipCode: String,          // Flat field
  role: String,             // 'customer', 'technician', 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model

```javascript
{
  user: ObjectId,           // Reference to User
  referenceNumber: String,  // Auto-generated (e.g., AC123456)
  serviceType: String,      // 'repair', 'maintenance', 'installation', etc.
  maintenancePlan: String,  // 'basic', 'premium' (if applicable)
  date: Date,
  timeSlot: String,         // e.g., '09:00-11:00'
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  description: String,
  assignedTechnician: ObjectId, // Reference to User (technician)
  status: String,           // 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - express-validator for all inputs
- **CORS** - Configured for frontend origin
- **Environment Variables** - Sensitive data in `.env`
- **Password Requirements** - Min 8 chars, number, special character
- **Role-Based Access** - Customer, Technician, Admin roles

## 🎯 Available Scripts

```bash
# Start server in production mode
npm start

# Start server in development mode (with nodemon)
npm run dev

# Seed database with sample data
npm run seed

# Seed only users
npm run seed:users

# Seed only bookings
npm run seed:bookings
```

## 🌱 Database Seeding

The project includes seeding scripts to populate the database with sample data:

### Seed All Data

```bash
npm run seed
```

This creates:

- **7 Users** (3 customers, 3 technicians, 1 admin)
- **12 Bookings** with various statuses

### Sample Credentials

**Admin:**

- Email: `admin@actechweb.com`
- Password: `Admin123!`

**Customer:**

- Email: `john.doe@example.com`
- Password: `Password123!`

**Technician:**

- Email: `mike.johnson@example.com`
- Password: `Password123!`

## 🌐 Environment Variables

| Variable     | Description               | Example                      |
| ------------ | ------------------------- | ---------------------------- |
| `PORT`       | Server port               | `5000`                       |
| `DB_HOST`    | MySQL host                | `localhost`                  |
| `DB_USER`    | MySQL username            | `your_username`              |
| `DB_PASSWORD`| MySQL password            | `your_password`              |
| `DB_NAME`    | MySQL database name       | `actechweb`                  |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key`      |
| `NODE_ENV`   | Environment mode          | `development` or `production`|

**Security Note:** The `.env` file is excluded from Git via `.gitignore`. Never commit sensitive credentials.

## 🚀 Production Deployment

1. **Set production environment variables:**

   ```env
   NODE_ENV=production
   JWT_SECRET=<strong-random-secret>
   DB_HOST=<mysql-host>
   DB_USER=<mysql-username>
   DB_PASSWORD=<mysql-password>
   DB_NAME=<mysql-database-name>
   PORT=5000
   ```

2. **Use PM2** for process management (optional but recommended):

   ```bash
   npm install -g pm2
   pm2 start server.js --name actechweb-server
   ```

3. **Set up proper logging and monitoring**
4. **Set up proper logging and monitoring**

5. **Use HTTPS** in production

6. **Configure CORS** for your production frontend URL

## 🐛 Common Issues

### Database Connection Error (MySQL)

- Ensure MySQL is running and accessible on the configured host/port.
- Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`.
- Check that the `actechweb` database (or your configured DB name) exists.
- Look at the server logs for Sequelize connection error details.

### Sequelize / Model Errors

- After changing models or associations, restart the server.
- If you change column names or types, update the seed data to match.
- Check for mismatched field names between models and seed files.

### JWT Authentication Error

- Verify `JWT_SECRET` is set correctly in `.env` (and matches any existing tokens).
- Check that the `Authorization` header is sent as `Bearer <token>`.
- Confirm the token has not expired (default is 7 days in this project).

### Port Already in Use

- Change `PORT` in `.env` to an available port.
- Or stop the process using the port (e.g. via Task Manager or `npx kill-port 5000`).

### Seeding Errors

- Ensure the database credentials in `.env` are valid and the DB exists.
- Check that the seed data files match the current model fields.
- Review console output for specific Sequelize validation or constraint errors.

## 📝 API Response Format

### Success Response

```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": [ ... ]  // Optional validation errors
}
```

## 📄 License

This project is part of ACTechWeb platform.

## 👥 Support

For issues or questions, please contact the development team.
