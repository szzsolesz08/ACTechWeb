# Database Seeders

This directory contains scripts to populate your database with sample data for testing and development.

## Available Seeders

### 1. Complete Database Seeder (Recommended)

Seeds both users and bookings in the correct order:

```bash
npm run seed
```

This will:

- Clear all existing users and bookings
- Create 7 users (3 customers, 3 technicians, 1 admin)
- Create 12 bookings with various statuses
- Display a summary of created data

### 2. Users Only

Seeds only user accounts:

```bash
npm run seed:users
```

Creates:

- **3 Customers**: John Doe, Jane Smith, Peter Brown
- **3 Technicians**: Mike Johnson, Sarah Williams, David Martinez
- **1 Admin**: Admin User

### 3. Bookings Only

Seeds only bookings (requires users to exist first):

```bash
npm run seed:bookings
```

Creates 400 bookings with different:

- Service types (installation, repair, maintenance, etc.)
- Statuses (pending, confirmed, in-progress, completed, cancelled)
- Dates (past, present, and future)

## Test Credentials

After seeding, you can log in with these accounts:

### Customer Account

- **Email**: john.doe@example.com
- **Password**: Password123!

### Technician Account

- **Email**: mike.johnson@example.com
- **Password**: Password123!

### Admin Account

- **Email**: admin@actechweb.com
- **Password**: Admin123!

## Sample Data Overview

### Users (7 total)

- **Customers (3)**:
  - John Doe - Budapest
  - Jane Smith - Budapest
  - Peter Brown - Pécs

- **Technicians (3)**:
  - Mike Johnson - Debrecen
  - Sarah Williams - Szeged
  - David Martinez - Győr

- **Admin (1)**:
  - Admin User - Budapest

### Bookings (400 total)

- **Pending (6)**: Future bookings awaiting confirmation
- **Confirmed (6)**: Future bookings with assigned technicians
- **In-Progress (5)**: Current bookings being worked on
- **Completed (320)**: Past bookings successfully finished
- **Cancelled (63)**: Cancelled bookings

## Booking Types Included

- ✅ Installation
- ✅ Repair
- ✅ Maintenance
- ✅ Maintenance Plans (Basic & Premium)
- ✅ Inspection
- ✅ Consultation

## When to Use Seeders

### Development

Run seeders when you:

- Start working on the project
- Need to test with realistic data
- Want to reset your database to a known state
- Need to test different user roles

### Testing

Seeders provide consistent test data for:

- API endpoint testing
- Frontend development
- User flow testing
- Role-based access testing

## Important Notes

⚠️ **Warning**: Running seeders will **DELETE ALL EXISTING DATA** in the users, bookings, and contacts tables.

✅ **Safe for Development**: Seeders are designed for development and testing environments only.

❌ **Never Run in Production**: Do not run seeders on production databases!

## Customizing Seed Data

To modify the seed data:

1. **Users**: Edit `seeders/data/users.js`
2. **Bookings**: Edit `seeders/data/bookings.js`

Then run the appropriate seeder script.

## Troubleshooting

### "MySQL connection error"

- Make sure MySQL is running
- Check your MySQL credentials in `config/database.js`
- Verify MySQL service: `net start MySQL`

### "Please run userSeeder first"

- Bookings require users to exist
- Run `npm run seed:users` first, then `npm run seed:bookings`
- Or use `npm run seed` to do both

### "Foreign key constraint error"

- Tables must be dropped in the correct order due to foreign key constraints
- Use `npm run seed` which handles this automatically
