# 🚀 AttackMode - Advanced Productivity App

A comprehensive personal productivity application built with Next.js 15, featuring task management, behavior tracking, problem-solving tools, and advanced analytics with voice AI integration.

## ✨ Features

### 📋 Core Productivity Features
- **Task Management**: Create, complete, and track daily tasks with streak counters
- **Power System**: Brain/Muscle/Money categorized todos for holistic development
- **Problem Solving**: Advanced problem analysis with emotional impact tracking
- **Behavior Tracking**: Monitor and analyze personal behavior patterns
- **Journal System**: Daily reflection and mood tracking
- **Statistical Dashboard**: Visual analytics with charts and progress tracking

### 🧠 AI & Analytics
- **AI Coach**: Intelligent productivity guidance and insights
- **Voice AI Integration**: Real-time voice assistant powered by OmniDimension
- **Progress Analytics**: Daily/weekly progress visualization with Recharts
- **Streak Tracking**: Gamified consistency monitoring

### 🔐 Authentication & Security
- **NextAuth.js**: Secure authentication with multiple providers
- **Database**: PostgreSQL with Prisma ORM
- **Session Management**: Persistent user sessions and data protection

## �️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: TanStack Query (React Query)

### Backend
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes
- **Password Hashing**: bcryptjs

### Development Tools
- **Build Tool**: Turbopack for fast development
- **Linting**: ESLint with Next.js configuration
- **Database Studio**: Prisma Studio
- **Type Safety**: Full TypeScript implementation

## 📁 Project Structure

```
AttackMode/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── analytics/     # Analytics data endpoints
│   │   │   ├── tasks/         # Task management APIs
│   │   │   ├── behaviors/     # Behavior tracking APIs
│   │   │   └── problems/      # Problem solving APIs
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── stats/             # Statistics & analytics
│   │   ├── behavior-history/  # Behavior tracking history
│   │   ├── solved-problems/   # Problem solving history
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── AuthGuard.tsx     # Route protection
│   │   ├── TaskListNew.tsx   # Task management
│   │   ├── PowerSystem.tsx   # Power system todos
│   │   ├── StatsDashboard.tsx # Analytics dashboard
│   │   ├── AICoach.tsx       # AI coaching interface
│   │   └── ...               # Other feature components
│   └── lib/                  # Utilities and configurations
│       ├── auth.ts           # NextAuth configuration
│       ├── prisma.ts         # Database connection
│       ├── api.ts            # API client functions
│       └── hooks.ts          # Custom React hooks
├── prisma/
│   └── schema.prisma         # Database schema
├── .env.local                # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git for version control

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/attackmode.git
cd attackmode/nextapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/attackmode"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Authentication Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-secret"

# OmniDimension AI (optional)
OMNIDIMENSION_SECRET_KEY="your-omnidimension-key"
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Database Schema

### Core Models
- **User**: Authentication and profile data
- **Task**: Daily task management with completion tracking
- **PowerSystemTodo**: Categorized todos (Brain/Muscle/Money)
- **BehaviorEntry**: Behavior tracking entries
- **ProblemSolvingEntry**: Problem analysis with impact metrics
- **JournalEntry**: Daily journal and mood tracking
- **UserStats**: Aggregated user statistics and streaks

### Key Relationships
- Users have many tasks, behaviors, problems, and journal entries
- All data is user-scoped with proper authorization
- Cascade deletion for data consistency

## � Available Scripts

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

### Database Management
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio GUI
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database (WARNING: Deletes all data)
```

## 🎯 Core Features Implementation

### 1. Task Management System
- Create and manage daily tasks
- Mark tasks as complete with timestamps
- Track completion streaks and rates
- Visual progress indicators

### 2. Power System Framework
- **Brain**: Learning and cognitive development tasks
- **Muscle**: Physical health and fitness goals
- **Money**: Financial and career objectives
- Category-based progress tracking

### 3. Advanced Problem Solving
- Identify problematic behaviors and patterns
- Analyze emotional impact (0-100 scale)
- Develop coping strategies and solutions
- Track long-term consequences and outcomes

### 4. Behavior Analytics
- Log daily behaviors and habits
- Visual progress tracking with charts
- Pattern recognition and insights
- Historical data analysis

### 5. Statistical Dashboard
- Daily/weekly progress visualization
- Task completion analytics
- Behavior trend analysis
- Interactive charts and graphs

## 🤖 AI Integration

### Voice AI Assistant
- Real-time voice interaction using OmniDimension
- Context-aware productivity coaching
- Personalized insights based on user data
- Integrated seamlessly into the dashboard

### AI Coach Features
- Productivity pattern analysis
- Personalized recommendations
- Goal setting assistance
- Motivational support

## 🔐 Authentication Flow

1. **Sign Up/Sign In**: Multiple provider support (credentials, Google, GitHub)
2. **Session Management**: Secure JWT tokens with NextAuth.js
3. **Route Protection**: AuthGuard component protects authenticated routes
4. **Data Security**: User-scoped data access with proper authorization

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Touch-friendly interface elements
- Optimized for all screen sizes
- Progressive Web App capabilities

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
npm run start
```

### Database Hosting
- Recommended: Supabase, PlanetScale, or Railway
- Ensure DATABASE_URL is properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://prisma.io/) for database management
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Recharts](https://recharts.org/) for data visualization
- [OmniDimension](https://omnidim.io/) for voice AI integration

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

---

Built with ❤️ for productivity enthusiasts and developers who believe in continuous improvement.
