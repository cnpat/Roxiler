# Store Ratings Platform

A web application that allows users to submit ratings for stores registered on the platform.

## Project Structure

- `backend/` - Node.js/Express API server
- `frontend/` - Next.js frontend application

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (running on localhost:27017)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (if not already running)

4. Start the server:
```bash
npm start
```

Backend runs on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## User Roles

1. **System Administrator** - Can add stores, users, and admins. Has access to dashboard and filtering capabilities.
2. **Normal User** - Can sign up, view stores, search stores, and submit ratings.
3. **Store Owner** - Can view their store's ratings and average rating.

## Features

- User authentication with JWT
- Role-based access control
- Store management
- Rating system (1-5 scale)
- Search and filtering
- Dashboard for admins and store owners

## Form Validations

- Name: 20-60 characters
- Address: Max 400 characters
- Password: 8-16 characters, must include uppercase and special character
- Email: Standard email validation
