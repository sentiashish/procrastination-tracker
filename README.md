# Procrastination Killer - Behavior Analytics System

A behavior-first productivity platform built with MERN that measures the gap between what you planned and what you actually executed.

## 🔥 Why This Project Exists
Most productivity tools stop at task lists. They help you plan, but they do not explain execution failure.

As a BTech student, I wanted to build something closer to real life:
- We plan deep work blocks.
- We start late.
- We get distracted.
- We overestimate productivity.

Procrastination Killer was built to track these behavior gaps with data, not assumptions.

## 🚀 Product Features
- **Execution Gap Tracking**: Create planned time blocks and compare them against actual start/end times.
- **Delay Detection**: Automatically marks delayed starts when actual execution misses planned schedule.
- **Distraction Logging**: Manually log distractions like YouTube, Instagram, gaming, and other non-work activities.
- **Weekly Intelligence Dashboard**: View planned vs actual hours, distraction breakdown, and behavior trends.
- **Efficiency Scoring**: Computes a clear execution score from planned and actual work time.
- **Secure Auth + Protected Workflows**: JWT-based authentication for all user-specific actions and analytics.
- **Actionable UI**: Dedicated Dashboard, Task Manager, and Insights pages with chart-based visualization.

## 🧠 Unique Value
This is not a todo app clone.

What makes it different:
- It measures **behavior quality**, not just completion count.
- It captures **why productivity drops** (late starts + distraction load).
- It gives **weekly feedback loops** so users can improve execution patterns over time.

## 🛠 Tech Stack
| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts, Axios, Framer Motion |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Tooling | Postman, Git, npm |
| Deployment | Vercel (frontend), Render/Railway (backend), MongoDB Atlas |

## 📸 Screenshots
Add screenshots in a folder like `docs/screenshots/` and update the links below.

- Dashboard: `docs/screenshots/dashboard.png`
- Task Manager: `docs/screenshots/task-manager.png`
- Analytics: `docs/screenshots/analytics.png`
- Mobile View: `docs/screenshots/mobile.png`

## ⚙️ Installation & Setup
### 1. Clone Repository
```bash
git clone https://github.com/<your-username>/procrastination-killer.git
cd procrastination-tracker
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` from `server/.env.example` and fill values.

Run backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open a second terminal:
```bash
cd client
npm install
```

Create `.env` from `client/.env.example`.

Run frontend:
```bash
npm run dev
```

### 4. Open App
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 🔐 Environment Variables
### Backend (`server/.env`)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/procrastination-killer
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints
Base URL: `/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (protected)

### Tasks
- `POST /tasks/create`
- `GET /tasks`
- `PUT /tasks/start/:id`
- `PUT /tasks/end/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

### Activity
- `POST /activity/add`
- `GET /activity`

### Reports
- `GET /reports/weekly`

## 🧱 Project Structure
```text
procrastination-tracker/
├─ client/
│  ├─ src/
│  │  ├─ components/      # shared UI components (shell, routes, nav)
│  │  ├─ context/         # auth/theme/toast state
│  │  ├─ pages/           # Dashboard, Task Manager, Analytics, Auth, Settings
│  │  └─ services/        # axios API layer
│  └─ ...
├─ server/
│  ├─ config/             # db connection
│  ├─ controllers/        # auth/task/activity/report handlers
│  ├─ middleware/         # auth/error handlers
│  ├─ models/             # User, Task, ActivityLog, Report
│  ├─ routes/             # API route definitions
│  └─ utils/              # jwt/time helpers
└─ README.md
```

## 📊 How Analytics Works
Weekly analytics is generated from task execution and distraction logs:

- **Delay in start**: when `actualStartTime > plannedStartTime`.
- **Total planned work**: sum of `(plannedEndTime - plannedStartTime)` for tasks.
- **Total actual work**: sum of `(actualEndTime - actualStartTime)` for completed/in-progress execution windows.
- **Distraction time**: sum of distraction activity durations.
- **Efficiency score**:

$$
\text{Efficiency Score} = \frac{\text{Total Actual Work Hours}}{\text{Total Planned Work Hours}} \times 100
$$

## 🚀 Deployment
### Backend (Render or Railway)
1. Connect GitHub repo.
2. Set root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env vars from `server/.env`.

### Frontend (Vercel)
1. Import repo.
2. Set root directory to `client`.
3. Add `VITE_API_URL=https://<your-backend-domain>/api`
4. Deploy.

### Final Step
Update backend `CLIENT_URL` to deployed frontend URL for CORS.

## 🎯 Future Improvements
- AI-based procrastination pattern detection and suggestion engine
- Passive distraction tracking integrations (browser/app usage)
- Focus mode timers with adaptive break recommendations
- Monthly behavior trend reports
- Smart nudges based on historical delay windows
- Team and mentor dashboards

## 👨‍💻 Author
**Ashish Kumar**

If this project resonates with you, feel free to connect and share feedback.
