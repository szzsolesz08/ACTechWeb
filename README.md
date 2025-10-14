# ACTechWeb

Full-stack web application for AC Technician Services booking platform.

## 📋 Overview

ACTechWeb is a comprehensive booking management system for air conditioning services. It allows customers to book AC services, technicians to manage their jobs, and administrators to oversee all operations.

## 🏗️ Project Structure

```
ACTechWeb/
├── client/          # React frontend application
├── server/          # Node.js/Express backend API
└── README.md        # This file
```

## 🚀 Tech Stack

### Frontend
- React
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/szzsolesz08/ACTechWeb.git
   cd ACTechWeb
   ```

2. **Set up the server:**
   ```bash
   cd server
   npm install
   # Create .env file (see server/README.md)
   npm run seed
   npm run dev
   ```

3. **Set up the client:**
   ```bash
   cd client
   npm install
   # Create .env file (see client/README.md)
   npm run dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## 📚 Documentation

For detailed setup and usage instructions, see:
- [Client Documentation](./client/README.md)
- [Server Documentation](./server/README.md)

## 🎯 Features

### For Customers
- Browse AC services
- Book appointments with date/time selection
- Choose preferred technician
- View booking history
- Manage profile

### For Technicians
- View assigned bookings
- Update job status
- Manage schedule

### For Administrators
- View all bookings
- Assign technicians
- Manage booking statuses
- View statistics

## 🔐 User Roles

- **Customer** - Book and manage services
- **Technician** - Handle assigned jobs
- **Admin** - Full system access

## 🧪 Test Accounts

After seeding the database, you can use these accounts:

**Admin:**
- Email: `admin@actechweb.com`
- Password: `Admin123!`

**Customer:**
- Email: `john.doe@example.com`
- Password: `Password123!`

**Technician:**
- Email: `mike.johnson@example.com`
- Password: `Password123!`

## 🛠️ Development

### Running Both Services

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

### Environment Variables

Both client and server require `.env` files. See individual README files for details:
- Client: `VITE_API_URL`
- Server: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`

## 📦 Available Scripts

### Server
```bash
npm start          # Start production server
npm run dev        # Start development server
npm run seed       # Seed database with sample data
```

### Client
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🚀 Deployment

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the server** to your hosting service (Heroku, Railway, etc.)

3. **Deploy the client** `dist/` folder to static hosting (Netlify, Vercel, etc.)

4. **Update environment variables** on hosting platforms

## 🔒 Security

- All passwords are hashed with bcryptjs
- JWT tokens for authentication
- Environment variables for sensitive data
- Input validation on all endpoints
- CORS configured for frontend origin