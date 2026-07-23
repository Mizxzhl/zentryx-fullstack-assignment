# Task Management System

A full-stack Task Management System developed as part of the Zentryx Innovation Full-Stack Developer Intern Technical Assessment.

The application allows users to register, log in securely, and manage their daily tasks through a responsive web interface. It includes user authentication, task management, analytics, and a PostgreSQL database.

---

# Features

- User Registration
- User Login with JWT Authentication
- Protected Routes
- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Dashboard Analytics
- Responsive User Interface
- PostgreSQL Database Integration

---

# Tech Stack Summary

## Frontend

- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios

### Why these technologies?

- **React** was chosen for building a fast and component-based user interface.
- **TypeScript** improves code quality through static typing.
- **Tailwind CSS** enables rapid development of responsive and modern UI components.
- **React Router DOM** handles client-side routing efficiently.
- **Axios** simplifies communication with the backend API.

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

### Why these technologies?

- **Node.js** provides an efficient JavaScript runtime.
- **Express.js** is lightweight and ideal for building REST APIs.
- **TypeScript** improves maintainability and reduces runtime errors.
- **Prisma ORM** simplifies database queries and migrations.
- **PostgreSQL** offers reliable relational database storage.
- **JWT** is used for secure authentication.
- **bcrypt** securely hashes user passwords before storing them.

---

# Project Structure

```
zentryx-fullstack-assignment
│
├── backend
│   ├── prisma
│   ├── src
│   ├── package.json
│   └── tsconfig.json
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/Mizxzhl/zentryx-fullstack-assignment.git
```

```bash
cd zentryx-fullstack-assignment
```

---

# Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key
```

Run Prisma migrations.

```bash
npx prisma migrate dev
```

Start the backend server.

```bash
npm run dev
```

The backend runs on:

```
http://localhost:3000
```

---

# Frontend Setup

Open another terminal.

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run the frontend.

```bash
npm run dev
```

The frontend runs on:

```
http://localhost:5173
```

---

# Database Schema

## User

| Field | Type |
|------|------|
| id | String |
| name | String |
| email | String |
| password | String (Hashed) |
| createdAt | DateTime |

---

## Task

| Field | Type |
|------|------|
| id | String |
| title | String |
| description | String |
| priority | String |
| status | String |
| dueDate | DateTime |
| createdAt | DateTime |
| userId | String (Foreign Key) |

---

## Relationship

```
User
 ├── id
 ├── name
 ├── email
 └── password
      │
      │ One User
      │
      ▼
Many Tasks
      │
      ├── title
      ├── description
      ├── priority
      ├── status
      └── dueDate
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Tasks

| Method | Endpoint |
|---------|----------|
| GET | /api/tasks |
| POST | /api/tasks |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |
| GET | /api/tasks/analytics |

---

# Future Improvements

- Email verification
- Password reset
- Task filtering and searching
- File attachments
- Notifications
- Role-based access control

---

# Author

**Mohamed Mishal**

GitHub:
https://github.com/Mizxzhl

---

Thank you for reviewing my submission.
