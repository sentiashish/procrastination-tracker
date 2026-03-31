# 🎯 Procrastination Killer - Behavior Analytics System

> A full-stack MERN application that tracks the gap between planned tasks and actual execution, analyzes procrastination patterns, and generates behavioral insights to improve productivity.

## 📌 About the Project

### Why I Built This
Productivity isn't about working harder—it's about understanding **why** we procrastinate. Most task managers only track *what* we do, but don't analyze the behavioral patterns behind delays. This app bridges that gap by:

- **Tracking Execution Gaps**: Recording planned vs. actual task execution times
- **Monitoring Distractions**: Logging distraction activities to identify patterns
- **Generating Insights**: Calculating efficiency scores and distraction breakdowns
- **Behavioral Analytics**: Helping users understand their procrastination triggers

### Problem It Solves
1. **The Productivity Illusion**: You plan 8 hours of work but only complete 3
2. **Missing Context**: Standard todo apps don't explain *why* tasks are delayed
3. **Distraction Blindness**: You're unaware of time spent on non-productive activities
4. **No Actionable Insights**: No data-driven understanding of personal behavior

This app provides **concrete data** to help you make informed decisions about productivity improvements.

---

## ✨ Features

### Core Features
- ✅ **User Authentication**: Secure JWT-based login/register system
- ✅ **Task Management**: Create, edit, delete tasks with planned time windows
- ✅ **Real-time Tracking**: Start/end tasks to capture actual execution times
- ✅ **Distraction Logging**: Manually log distraction activities (YouTube, Instagram, Gaming, etc.)
- ✅ **Weekly Analytics Dashboard**: 
  - Bar chart comparing planned vs. actual hours
  - Pie chart showing distraction breakdown
  - Efficiency score calculations
- ✅ **Behavioral Insights**: 
  - Efficiency Score = (Actual Hours / Planned Hours) × 100
  - Distraction Hours = Total non-study activity time
  - Delay Detection: Tasks that start after planned time

### Premium Features (Coming Soon)
- 📊 Monthly/Yearly reports with trend analysis
- 🤖 AI-powered procrastination predictions
- 📱 Mobile app for on-the-go tracking
- 🔔 Smart reminders based on distraction patterns
- 👥 Team analytics and collaboration

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling with custom design system
- **Recharts** - Data visualization (bar & pie charts)
- **Axios** - HTTP client with JWT interceptors
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for data modeling
- **JWT** - Authentication token management
- **bcryptjs** - Password hashing

### Deployment
- **Frontend**: Vercel (auto-deploy from git)
- **Backend**: Render or Railway (Node.js hosting)
- **Database**: MongoDB Atlas (cloud database)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/procrastination-killer.git
cd procrastination-killer
```

### Step 2: Setup Backend

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure `.env` with your MongoDB Atlas connection:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/procrastination-killer
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

5. Get `MONGO_URI` from MongoDB Atlas:
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account
   - Create a new cluster
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<username>:<password>` with your credentials

### Step 3: Setup Frontend

1. Navigate to client directory:
```bash
cd ../client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Verify `.env` configuration:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend (runs on port 5000)**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend (runs on port 5173)**
```bash
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser

### Production Build

**Backend:**
```bash
cd server
npm start  # Runs compiled JavaScript
```

**Frontend:**
```bash
cd client
npm run build  # Creates optimized dist/ folder
npm run preview  # Preview production build locally
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure-password"
}

Response: { token, user }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure-password"
}

Response: { token, user }
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: { user }
```

### Task Endpoints (All Protected)

#### Create Task
```http
POST /api/tasks/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project report",
  "plannedStartTime": "2026-03-31T09:00:00Z",
  "plannedEndTime": "2026-03-31T11:00:00Z"
}

Response: { _id, title, status: "pending", ... }
```

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer {token}

Response: [ { task objects } ]
```

#### Start Task
```http
PUT /api/tasks/start/{taskId}
Authorization: Bearer {token}

Response: { task with actualStartTime, status updated }
```

#### End Task
```http
PUT /api/tasks/end/{taskId}
Authorization: Bearer {token}

Response: { task with actualEndTime, status: "completed" }
```

### Activity Endpoints (All Protected)

#### Log Activity (Distraction)
```http
POST /api/activity/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "activityType": "youtube",
  "startTime": "2026-03-31T12:00:00Z",
  "endTime": "2026-03-31T12:30:00Z"
}

Response: { _id, userId, activityType, ... }
```

#### Get Activity Logs
```http
GET /api/activity
Authorization: Bearer {token}

Response: [ { activity objects } ]
```

### Report Endpoints (All Protected)

#### Get Weekly Report
```http
GET /api/reports/weekly
Authorization: Bearer {token}

Response: {
  report: {
    userId,
    weekStart,
    totalPlannedHours,
    totalActualHours,
    distractionHours,
    efficiencyScore
  },
  taskCount,
  activityCount
}
```

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/procrastination-killer.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `client` directory as root
   - Add Env Variable: `VITE_API_URL=https://your-backend-url.com/api`
   - Click "Deploy"

3. **Auto-Deploy**: Every git push to main branch automatically deploys

### Backend Deployment (Render)

1. **Create account** on [render.com](https://render.com)

2. **Create new Web Service**:
   - Connect GitHub repo
   - Set **Root Directory**: `server`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`

3. **Add Environment Variables** in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure secret key
   - `CLIENT_URL`: Your Vercel frontend URL
   - `NODE_ENV`: `production`

4. **Deploy**: Render auto-deploys on git push

### Backend Deployment (Railway Alternative)

1. Visit [railway.app](https://railway.app)
2. Create new Project
3. Connect GitHub repository
4. Railway auto-detects Node.js
5. Set Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
6. Deploy!

### Database Setup (MongoDB Atlas)

1. **Create Account**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Choose "Free Tier"
3. **Create Database User**:
   - Security → Database Access
   - Username: `procrastination-app`
   - Generate Secure Password
4. **Get Connection String**:
   - Deployment → Databases → Connect
   - Choose "Connect your application"
   - Copy connection string
5. **Configure in `.env`**:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/procrastination-killer?retryWrites=true&w=majority
   ```

---

## 📊 Screenshots

### Dashboard
![Dashboard - Coming Soon]

### Task Manager
![Task Manager - Coming Soon]

### Analytics Page
![Analytics - Coming Soon]

### Mobile Responsive
![Mobile - Coming Soon]

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected routes (AuthContext, ProtectedRoute)
- ✅ HTTP-only cookie storage (future enhancement)
- ✅ CORS configured for frontend domain
- ✅ Input validation on backend and frontend

---

## 🧪 Project Structure

```
procrastination-tracker/
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Dashboard, Tasks, Analytics)
│   │   ├── context/          # AuthContext for state management
│   │   ├── services/         # API client (api.js with axios)
│   │   ├── App.jsx           # Main app with routes
│   │   └── main.jsx          # React DOM entry point
│   ├── index.css             # Tailwind directives
│   ├── tailwind.config.js    # Tailwind design tokens
│   └── package.json
│
├── server/                    # Express Backend
│   ├── controllers/          # Business logic for each resource
│   ├── models/               # Mongoose schemas (User, Task, Activity, Report)
│   ├── routes/               # API routes
│   ├── middleware/           # JWT auth, error handling
│   ├── utils/                # Helper functions (JWT, time calculations)
│   ├── config/               # Database connection
│   ├── server.js             # Express app setup
│   └── package.json
│
└── README.md                 # This file!
```

---

## 🔄 Workflow Example

### Step-by-Step User Flow

1. **Register/Login**
   - User signs up with email & password
   - Backend creates user in MongoDB
   - JWT token returned and stored in localStorage

2. **Create Task**
   - Go to "Task Manager"
   - Click "+ New Task"
   - Enter title and planned time window
   - Task created with `status: "pending"`

3. **Track Task Execution**
   - Go to "Dashboard"
   - Click "Start" on task
   - `actualStartTime` recorded; status updated if delayed
   - Click "End" when done
   - `actualEndTime` recorded; status changed to `"completed"`

4. **Log Distractions**
   - Go to "Analytics"
   - Click "+ Log Distraction"
   - Select activity type (YouTube, Instagram, etc.)
   - Enter duration
   - Activity saved to database

5. **View Analytics**
   - Go to "Analytics"
   - Weekly report auto-loads with:
     - Bar chart: Planned vs. Actual hours
     - Pie chart: Distraction breakdown
     - Efficiency score calculation
   - Manual "Regenerate" button available

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 📧 Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Email: your-email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

## 🎯 Roadmap

- [x] MVP: Task tracking + weekly analytics
- [ ] Advanced charts (monthly/yearly trends)
- [ ] AI-powered procrastination predictions
- [ ] Mobile app (React Native)
- [ ] Smart reminders based on patterns
- [ ] Export reports as PDF
- [ ] Team collaboration features
- [ ] Browser extension for auto-tracking

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

Last updated: March 31, 2026

---
