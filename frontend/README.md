# Frontend - Store Ratings Platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (create `.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`.

## Pages

- `/login` - Login page
- `/signup` - Sign up page (normal users only)
- `/dashboard` - User dashboard (normal users)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - Manage users (admin)
- `/admin/stores` - Manage stores (admin)
- `/owner/dashboard` - Store owner dashboard

## Features

### Normal Users
- Sign up and login
- View list of stores
- Search stores by name and address
- Submit ratings (1-5) for stores
- Update their submitted ratings
- Update password

### Admin Users
- Dashboard with statistics
- Add new stores, users, and admin users
- View and filter users and stores
- View user details including store ratings for owners

### Store Owners
- View dashboard with average rating
- View list of users who rated their store
- Update password

## Form Validations

- **Name**: 20-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, must include uppercase and special character
- **Email**: Standard email validation
