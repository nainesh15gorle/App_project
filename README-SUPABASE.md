# SRM Authentication System with Supabase

A full-stack web application with SRM institutional email authentication powered by Supabase.

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

### Frontend
- **React** with **TypeScript**
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Supabase Client**: Authentication and data management

## Quick Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your Supabase credentials
```

**Edit `.env`:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Supabase Authentication

1. **Enable Email Authentication**:
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable "Enable email confirmations"
   - Set "Site URL" to `http://localhost:5173`

2. **Configure Email Domain Restriction** (Optional):
   - Go to Authentication > Policies
   - Create a policy to restrict registration to `@srmist.edu.in` domains

### 5. Run the Application

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
App_project/
├── src/
│   ├── components/
│   │   ├── AuthWrapper.tsx  # Authentication wrapper
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx    # Registration page
│   │   └── Header.tsx       # Header with user info
│   ├── lib/
│   │   ├── auth.ts          # Supabase authentication functions
│   │   └── supabase.ts      # Supabase client configuration
│   └── App.tsx              # Main app component
├── package.json             # Dependencies
├── vite.config.ts          # Vite configuration
├── env.example             # Environment template
└── README-SUPABASE.md      # This file
```

## Authentication Flow

1. **Registration**: Users register with SRM email
2. **Email Verification**: Supabase sends verification email
3. **Login**: Users sign in with verified credentials
4. **Dashboard Access**: Protected routes require authentication
5. **Logout**: Secure session termination

## Security Features

- **SRM Email Validation**: Frontend and backend validation
- **Email Verification**: Required for account activation
- **Secure Sessions**: Supabase handles session management
- **Password Hashing**: Built-in bcrypt encryption
- **Row Level Security**: Database-level access control

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Check your project URL and anon key
   - Verify environment variables are set correctly

2. **Email Verification Not Working**
   - Check Supabase email settings
   - Verify SMTP configuration in Supabase dashboard

3. **SRM Email Validation Failing**
   - Ensure email ends with `@srmist.edu.in`
   - Check frontend validation logic

## Benefits of Supabase

- **No Backend Code**: Authentication handled by Supabase
- **Managed Database**: PostgreSQL with built-in security
- **Real-time Updates**: Live data synchronization
- **Scalable**: Handles traffic automatically
- **Secure**: Enterprise-grade security features
- **Free Tier**: Generous free usage limits

## Support

For issues and questions:
- Check Supabase documentation
- Review browser console for errors
- Verify environment variables
- Check Supabase dashboard for authentication logs




