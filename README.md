# Abhishek Dass Portfolio

A modern, professional portfolio website built with Next.js, React, TypeScript, and MongoDB featuring a LinkedIn-style admin panel for content management.

## Features

### Frontend
- ✨ **Modern Design**: High-contrast tech/motorsports theme with Racing Yellow and Electric Green accents
- 🏎️ **F1 Progress Bar**: Unique scrolling progress indicator with animated F1 car and checkered flag finish animation
- 🎨 **Dark/Light Mode**: Theme toggle for user preference
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 🎯 **Smooth Animations**: Fade-in, slide-up, and scroll-triggered animations
- ♿ **Accessible**: WCAG compliant with reduced-motion support

### Sections
- **Hero**: Full-screen intro with name, title, tagline, and CTA buttons
- **About**: Professional bio with photo and contact information
- **Projects**: Showcase of work with images, tags, and links
- **Experience**: Timeline of roles and achievements
- **Skills**: Categorized skills with visual progress indicators
- **Goals**: Short-term and long-term career objectives
- **Contact**: Contact form for messages

### Admin Panel (LinkedIn-Style Editing)
- 🔐 **Secure Authentication**: Login/Register with JWT
- 👤 **Profile Editor**: Edit all personal information
- 💼 **Projects Manager**: Add, edit, delete projects with images and links
- 🏢 **Experience Manager**: Manage work history with bullet points
- ⚡ **Skills Manager**: Organize skills by category with proficiency levels
- 🎯 **Goals Manager**: Set short-term and long-term goals
- 📧 **Contact Messages**: View messages from portfolio visitors

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally, or MongoDB Atlas account
- Git (optional)

## Installation

1. **Clone or navigate to the project**
   ```bash
   cd D:\Portfolio
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Edit `.env.local` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your-secure-secret-key-here
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # Windows
   mongod

   # Or if MongoDB is installed as a service, it's already running
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   - Portfolio: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## First-Time Setup

1. **Create Admin Account**
   - Visit http://localhost:3000/admin
   - Click "Register" tab
   - Create your admin account

2. **Add Content**
   - Login to admin dashboard
   - Fill in your Profile information
   - Add Projects, Experience, Skills, and Goals
   - View your portfolio at http://localhost:3000

## Project Structure

```
D:\Portfolio
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── dashboard/      # Admin dashboard
│   │   └── page.tsx        # Admin login
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── profile/        # Profile management
│   │   ├── projects/       # Projects CRUD
│   │   ├── experience/     # Experience CRUD
│   │   ├── skills/         # Skills CRUD
│   │   ├── goals/          # Goals CRUD
│   │   └── contact/        # Contact form
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── providers.tsx       # App providers
├── components/
│   ├── admin/              # Admin editor components
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── experience/
│   │   ├── skills/
│   │   └── goals/
│   ├── hero/               # Hero section
│   ├── about/              # About section
│   ├── projects/           # Projects section
│   ├── experience/         # Experience section
│   ├── skills/             # Skills section
│   ├── goals/              # Goals section
│   ├── contact/            # Contact section
│   ├── layout/             # Navigation and F1 progress bar
│   └── ui/                 # UI components (theme toggle, back to top)
├── lib/
│   ├── models/             # Mongoose models
│   ├── utils/              # Utility functions
│   └── mongodb.ts          # MongoDB connection
├── public/                 # Static assets
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Features Guide

### F1 Progress Bar
- Appears at the bottom of the page
- Shows scroll progress with animated F1 car
- Displays checkered flag animation when reaching the bottom
- Finish line at the end

### Admin Panel Editing
Similar to LinkedIn profile editing:
- Click "Edit" on any section
- Make changes in modal/form
- Click "Save" to update immediately
- Changes appear on portfolio instantly

### Theme Toggle
- Click sun/moon icon in top-right
- Switches between light and dark modes
- Preference saved in browser

### Contact Form
- Messages saved in database
- View messages in admin panel (future enhancement)
- Email notifications (can be added)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Import to Vercel:
   - Visit https://vercel.com
   - Click "Import Project"
   - Connect your GitHub repository
   - Add environment variables:
     - `MONGODB_URI` (use MongoDB Atlas)
     - `JWT_SECRET`
     - `NEXT_PUBLIC_API_URL` (your Vercel domain)

3. Deploy!

### MongoDB Atlas Setup (For Production)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Add database user
4. Whitelist your IP (or 0.0.0.0/0 for all)
5. Get connection string
6. Use it in `MONGODB_URI` environment variable

## Customization

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  racing: {
    yellow: '#FFD700',  // Change to your brand color
    green: '#39FF14',   // Change to your accent color
    graphite: '#2C2C2C', // Change to your dark color
  },
}
```

### Content
Use the admin panel to edit all content without touching code!

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env.local`
- For Atlas, ensure IP is whitelisted

**Admin Login Issues**
- Clear browser cookies
- Check JWT_SECRET in `.env.local`
- Re-register if needed

**Styling Issues**
- Run `npm run dev` (development mode shows better errors)
- Check browser console for errors
- Ensure all CSS files are imported

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Support

For issues or questions:
1. Check MongoDB connection
2. Verify environment variables
3. Clear browser cache
4. Restart development server

## License

MIT License - feel free to use for your own portfolio!

## Credits

Built with ❤️ for Abhishek Dass
Designed for Motorsports & Tech Enthusiasts
