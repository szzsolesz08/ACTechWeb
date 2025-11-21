# ACTechWeb - Client

Frontend application for AC Technician Services booking platform.

## 🚀 Tech Stack

- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Styling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## 🛠️ Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Create a `.env` file in the client root directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   **Note:** The `.env` file is gitignored for security. Never commit it to version control.

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build

```bash
npm run build
```

Build output will be in the `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── NavigationBar.jsx
│   │   └── NavigationBar.css
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── AdminBookingsPage.jsx
│   │   └── TechnicianBookingsPage.jsx
│   ├── services/       # API service modules
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── bookingService.js
│   │   └── userService.js
│   ├── App.jsx         # Main app component
│   ├── App.css         # Global styles
│   └── main.jsx        # Entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── eslint.config.js    # ESLint configuration
└── package.json        # Dependencies and scripts
```

## 🎨 Features

### User Authentication

- User registration with validation
- Login/logout functionality
- Role-based access (Customer, Technician, Admin)
- Persistent authentication with localStorage

### Customer Features

- Browse AC services
- Book service appointments
- Select preferred date and time
- Choose specific technician or auto-assign
- View booking history
- Update profile information

### Technician Features

- View assigned bookings
- Update booking status
- Manage schedule

### Admin Features

- View all bookings
- Manage booking statuses
- Assign technicians to bookings
- View booking statistics

## 🔐 User Roles

1. **Customer** - Can book services and manage their bookings
2. **Technician** - Can view and manage assigned jobs
3. **Admin** - Full access to all bookings and user management

## 📡 API Integration

The client communicates with the backend API through the following services:

- **authService** - Authentication (login, register, logout)
- **bookingService** - Booking management (create, view, update)
- **userService** - User profile management

All API calls use Axios with automatic token injection for authenticated requests.

## 🎯 Available Routes

| Route                  | Component              | Access          |
| ---------------------- | ---------------------- | --------------- |
| `/`                    | HomePage               | Public          |
| `/services`            | ServicesPage           | Public          |
| `/login`               | LoginPage              | Public          |
| `/register`            | RegisterPage           | Public          |
| `/profile`             | ProfilePage            | Authenticated   |
| `/booking`             | BookingPage            | Authenticated   |
| `/admin/bookings`      | AdminBookingsPage      | Admin only      |
| `/technician/bookings` | TechnicianBookingsPage | Technician only |

## 🔧 Configuration

### Vite Configuration

The project uses Vite for fast development and optimized builds. Configuration is in `vite.config.js`.

### ESLint Configuration

Code linting is configured in `eslint.config.js` with React-specific rules.

## 🌐 Environment Variables

The `.env` file contains the following configuration:

| Variable       | Description     | Default                     |
| -------------- | --------------- | --------------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

**Security Note:** The `.env` file is excluded from Git via `.gitignore`. This prevents sensitive configuration from being committed to the repository.

## 📦 Dependencies

### Production

- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client

### Development

- `vite` - Build tool
- `eslint` - Code linting
- `@vitejs/plugin-react` - React plugin for Vite

## 🚀 Deployment

1. Build the production bundle:

   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service (Netlify, Vercel, etc.)

3. Ensure environment variables are set on your hosting platform

## 📝 Code Style

- Use functional components with hooks
- Follow React best practices
- Use CSS modules or scoped styles
- Keep components small and focused
- Use meaningful variable and function names

## 🐛 Common Issues

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### API Connection Error

Ensure the backend server is running and the `VITE_API_URL` is correctly set in `.env`.

### Authentication Issues

Clear localStorage and try logging in again:

```javascript
localStorage.clear()
```

## 📄 License

This project is part of ACTechWeb platform.

## 👥 Support

For issues or questions, please contact the development team.
