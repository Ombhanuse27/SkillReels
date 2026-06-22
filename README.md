# SkillReels - Short-Video Learning Platform

A full-stack, production-ready short-video learning platform inspired by Instagram Reels and YouTube Shorts. Built as an assessment project, this application features a vertical scroll-snap feed, intelligent video autoplay, optimistic UI updates, and a highly responsive modern UI.

## 🚀 Features

### Frontend (User Experience)

* **Vertical Snap Feed:** Full-screen video layout with smooth CSS snap-scrolling.
* **Smart Autoplay:** Uses `IntersectionObserver` to automatically play videos when in view and pause when scrolled away.
* **Optimistic UI:** Like and Bookmark buttons update instantly for a snappy feel, seamlessly reverting if network requests fail.
* **Slide-up Bottom Sheet:** Interactive, animated comments section using Framer Motion.
* **Native Sharing:** Integrates the Web Share API for mobile-native sharing menus.
* **State Management:** JWT-based authentication flow managed globally via Redux Toolkit.

### Backend (Architecture & Data)

* **Smart SQL Toggles:** Database-level `UNIQUE` constraints and transactional logic prevent duplicate likes/bookmarks.
* **Relational Integrity:** Fully relational PostgreSQL database with composite primary keys.
* **Centralized Error Handling:** Global middleware to intercept and format API errors.
* **Secure Authentication:** Password hashing via bcrypt and route protection via JWT.
* **Static File Serving:** Local video delivery via Express static middleware.

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Redux Toolkit
* React Router
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* Node.js
* Express.js
* PostgreSQL (Neon/Supabase)
* pg Pool
* JWT
* bcrypt

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js (v16+)
* PostgreSQL Database (Neon, Supabase, or Local)

---

## 1. Database Setup

Run the following SQL schema:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    file_path VARCHAR(255) NOT NULL,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_category ON videos(category);

CREATE TABLE likes (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, video_id)
);

CREATE TABLE bookmarks (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, video_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### Add Video Files

Create an `uploads/` folder inside the backend root and place the provided video files there.

```text
backend/
├── uploads/
│   ├── Introduction_German.mp4
│   ├── Learning_German.mp4
│   └── Story_German.mp4
```

**Important:** Add uploads folder to `.gitignore`.

```gitignore
uploads/
.env
```

### Run Backend Server

```bash
npm run dev
```

---

## 3. Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create a `.env` file inside frontend:

```env
VITE_API_URL=http://localhost:5000
```

### Run Frontend

```bash
npm run dev
```

---

## 📂 Project Structure

### Backend

```text
src/
├── config/
│   └── db.js

├── controllers/
│   ├── authController.js
│   ├── videoController.js
│   └── interactionController.js

├── middlewares/
│   ├── authMiddleware.js
│   └── errorMiddleware.js

├── routes/
│   ├── authRoutes.js
│   ├── videoRoutes.js
│   └── interactionRoutes.js

├── services/
│   ├── authService.js
│   ├── videoService.js
│   └── interactionService.js

├── utils/
│   ├── ApiError.js
│   └── generateToken.js

server.js
```

### Frontend

```text
src/
├── api/
│   ├── axios.js
│   └── videoApi.js

├── components/
│   ├── VideoPlayer.jsx
│   ├── VideoActions.jsx
│   ├── CommentSheet.jsx
│   └── Loader.jsx

├── hooks/
│   └── useElementOnScreen.js

├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Feed.jsx

├── redux/
│   ├── store.js
│   ├── authSlice.js
│   └── videoSlice.js

├── App.jsx
└── main.jsx
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/auth/register` | Register a new user      |
| POST   | `/auth/login`    | Login and receive JWT    |
| GET    | `/auth/me`       | Get current user profile |

### Videos

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/videos`     | Get all videos      |
| GET    | `/videos/:id` | Get single video    |
| POST   | `/videos`     | Create/upload video |

### Interactions

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/videos/:id/like`     | Like/Unlike video        |
| POST   | `/videos/:id/bookmark` | Bookmark/Remove bookmark |
| GET    | `/videos/:id/comments` | Get comments             |
| POST   | `/videos/:id/comment`  | Add comment              |

---

## 🔐 Authentication Flow

1. User registers using email and password.
2. Password is hashed using bcrypt before storage.
3. User logs in and receives JWT token.
4. JWT is stored in localStorage.
5. Axios attaches token to protected requests.
6. Backend middleware validates token before accessing protected routes.

---

## ✨ Advanced Features

* JWT Authentication
* Password Hashing (bcrypt)
* PostgreSQL Transactions
* Optimistic UI Updates
* Vertical Scroll Snap Feed
* Auto Play / Pause Videos
* Framer Motion Animations
* Global Error Handling
* Redux Toolkit State Management
* Modular Service-Based Architecture
* Static Video Serving with Express

---


## 👨‍💻 Author

**Om Bhanuse**

