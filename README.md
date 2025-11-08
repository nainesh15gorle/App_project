# SRM Institutional Email Authentication System

A full-stack web application with email and password authentication that only allows SRM institutional email IDs (ending with @srmist.edu.in).

## Features

- **SRM Email Validation**: Only allows emails matching `/^[A-Za-z0-9._%+-]+@srmist\.edu\.in$/i`
- **Secure Authentication**: Powered by Supabase Auth
- **Password Security**: Built-in bcrypt hashing
- **Protected Routes**: Dashboard accessible only with valid session
- **Responsive Design**: Modern UI with Tailwind CSS
- **Hosted Backend**: No custom backend needed - Supabase handles everything

## Tech Stack

### Backend (Supabase)
- **Supabase Auth**: Built-in authentication system
- **PostgreSQL**: Managed database
- **Row Level Security**: Database-level security
- **Real-time**: Live data synchronization
- **Edge Functions**: Serverless functions (optional)

### Frontend
- **React** with **TypeScript**
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Supabase Client**: Authentication and data management

## Project Structure

```
App_project/
├── backend/                 # Backend server
│   ├── config/
│   │   └── database.js      # MySQL connection with Sequelize
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   └── User.js          # User model with validation
│   ├── routes/
│   │   └── auth.js          # Authentication routes
│   ├── package.json         # Backend dependencies
│   ├── server.js           # Express server setup
│   └── env.example         # Environment variables template
├── src/                     # Frontend React app
│   ├── components/
│   │   ├── AuthWrapper.tsx  # Authentication wrapper
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   └── ...              # Other components
│   ├── App.tsx              # Main app component
│   └── main.tsx             # React entry point
├── package.json             # Frontend dependencies
├── vite.config.ts          # Vite configuration with proxy
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup

#### Backend Environment
Create a `.env` file in the `backend` directory:

```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5179
DB_HOST=localhost
DB_PORT=3306
DB_NAME=srm_auth
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Important Security Notes:**
- Use a strong, random JWT_SECRET (at least 32 characters)
- In production, use a secure MySQL connection string
- Set NODE_ENV=production for production deployment

### 3. Database Setup

#### Option A: Local MySQL
1. Install MySQL locally
2. Start MySQL service:
   ```bash
   # macOS with Homebrew
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   
   # Windows
   net start MySQL
   ```
3. Create database:
   ```sql
   CREATE DATABASE srm_auth;
   ```

#### Option B: MySQL Cloud (PlanetScale, AWS RDS, etc.)
1. Create a MySQL database on your preferred cloud provider
2. Get your connection details and update the database variables in `.env`

### 4. Running the Application

#### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
# or
npm start
```

The backend server will start on `http://localhost:5179`

#### Terminal 2: Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Access the Application

1. Open your browser and go to `http://localhost:5173`
2. You'll see the login/register page
3. Create an account with a valid SRM email (e.g., `yourname@srmist.edu.in`)
4. After successful registration/login, you'll be redirected to the dashboard

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | `{ email, password }` |
| POST | `/login` | Login user | `{ email, password }` |
| GET | `/me` | Get current user | - |
| POST | `/logout` | Logout user | - |

### Example API Usage

```javascript
// Register
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'student@srmist.edu.in',
    password: 'password123'
  })
});

// Login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'student@srmist.edu.in',
    password: 'password123'
  })
});
```

## Security Features

### Password Security
- **bcrypt** with 12 salt rounds
- Minimum 6 character password requirement
- Passwords are never stored in plain text

### JWT Security
- **HttpOnly cookies** prevent XSS attacks
- **Secure flag** in production (HTTPS only)
- **SameSite: strict** prevents CSRF attacks
- 7-day token expiration

### Email Validation
- Strict regex validation: `/^[A-Za-z0-9._%+-]+@srmist\.edu\.in$/i`
- Only SRM institutional emails are allowed
- Case-insensitive validation

### CORS Configuration
- Configured for `http://localhost:5173` (frontend)
- Credentials included for cookie-based auth
- Production-ready CORS settings

## Production Deployment

### Security Checklist

1. **Environment Variables**
   ```env
   NODE_ENV=production
   JWT_SECRET=your-very-long-random-secret-key
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   CLIENT_URL=https://yourdomain.com
   ```

2. **HTTPS Configuration**
   - Use HTTPS in production
   - Update CORS settings for production domain
   - Enable secure cookies

3. **Database Security**
   - Use MySQL with proper authentication
   - Enable SSL connections in production
   - Use strong database passwords

4. **Server Security**
   - Use environment variables for secrets
   - Implement rate limiting
   - Add request logging
   - Use helmet.js for security headers

### Deployment Options

#### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

#### Backend (Railway/Heroku/DigitalOcean)
```bash
# Set environment variables in your hosting platform
# Deploy the backend/ folder
```

## Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start with nodemon (development)
npm start           # Start server (production)
```

## Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   - Check if MySQL is running
   - Verify database credentials in `.env`
   - Ensure database `srm_auth` exists
   - Check network connectivity

2. **CORS Errors**
   - Ensure backend is running on port 5179
   - Check CORS configuration in `server.js`
   - Verify CLIENT_URL in `.env`

3. **JWT Token Issues**
   - Check JWT_SECRET in `.env`
   - Verify cookie settings
   - Check browser developer tools for cookies

4. **Email Validation Failing**
   - Ensure email ends with `@srmist.edu.in`
   - Check for typos in email format
   - Verify regex pattern in validation

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

Check browser console and server logs for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Review server logs
- Check browser console for errors
- Ensure all environment variables are set correctly