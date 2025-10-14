# MongoDB Local Setup Guide

## Installation

### For Windows:

1. **Download MongoDB Community Server**
   - Visit: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select: Windows
   - Version: Latest (7.0 or higher)
   - Package: MSI
   - Click "Download"

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool - optional but helpful)
   - Click "Install"

3. **Verify Installation**
   Open Command Prompt and run:
   ```bash
   mongod --version
   ```
   You should see the MongoDB version information.

## Starting MongoDB

### If installed as a Service (recommended):
MongoDB starts automatically. You can manage it via:
```bash
# Check status
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Start MongoDB
net start MongoDB
```

### If NOT installed as a Service:
1. Create data directory:
   ```bash
   mkdir C:\data\db
   ```

2. Start MongoDB manually:
   ```bash
   mongod
   ```
   Keep this terminal window open while developing.

## Configure Your Application

Your `.env` file should already have the correct local connection:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/actechweb
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## Test the Connection

1. Start your server:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   Server is running on port 5000
   MongoDB connected successfully
   ```

## Using MongoDB Compass (Optional)

MongoDB Compass is a GUI tool to view and manage your database:

1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. You'll see your `actechweb` database after creating some data
5. Browse collections: `users`, `bookings`

## Troubleshooting

### "MongoDB not found" error:
- Make sure MongoDB is installed
- Add MongoDB to your PATH environment variable
- Default location: `C:\Program Files\MongoDB\Server\7.0\bin`

### "Connection refused" error:
- Check if MongoDB service is running: `net start MongoDB`
- Or start manually: `mongod`

### Port 27017 already in use:
- Another MongoDB instance is running
- Stop it: `net stop MongoDB`
- Or use a different port in your connection string

## Database Management

### View Data:
- Use MongoDB Compass (GUI)
- Or use MongoDB Shell:
  ```bash
  mongosh
  use actechweb
  db.users.find()
  db.bookings.find()
  ```

### Clear Database:
```bash
mongosh
use actechweb
db.dropDatabase()
```

## Advantages of Local MongoDB

✅ No internet connection required
✅ Faster development (no network latency)
✅ Full control over data
✅ Free and unlimited storage
✅ Easy to reset/clear data
✅ No IP whitelisting needed

## Production Note

For production deployment, consider:
- MongoDB Atlas (cloud-hosted)
- Or a dedicated MongoDB server
- Never use localhost in production!
