# Task Management System

A full-stack Task Management System built as part of a Full-Stack Developer Intern technical assessment.

## Features

- User Registration & Login
- JWT Authentication
- Protected Routes
- Create, Read, Update and Delete Tasks
- Dashboard Analytics
- Responsive User Interface
- PostgreSQL Database
- RESTful API

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt

## Installation

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend folder.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

## Author

Mohamed Mishal
