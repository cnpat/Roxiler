# Backend API - Store Ratings Platform

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running on `mongodb://127.0.0.1:27017/test`

3. Set environment variables (optional, defaults provided):
```bash
export JWT_SECRET=your-secret-key
export PORT=8080
export NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:8080` (or the PORT you specified).

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - Sign up as a normal user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `PATCH /auth/password` - Update password (requires auth)

### Stores (`/stores`)
- `GET /stores` - List stores with user ratings (requires auth)
- `GET /stores/public` - List all stores (public)

### Ratings (`/ratings`)
- `POST /ratings` - Submit/update rating (requires auth)

### Admin (`/admin`) - Requires admin role
- `GET /admin/dashboard/stats` - Get dashboard statistics
- `POST /admin/users` - Create user
- `GET /admin/users` - List users (with filters)
- `GET /admin/users/:id` - Get user details
- `POST /admin/stores` - Create store
- `GET /admin/stores` - List stores (with filters)
- `GET /admin/stores/:id` - Get store details

### Owner (`/owner`) - Requires owner role
- `GET /owner/dashboard` - Get owner dashboard with ratings

## Authentication

The API uses JWT tokens stored in HTTP-only cookies. Include credentials in requests:
```javascript
fetch('http://localhost:8080/api/endpoint', {
  credentials: 'include'
})
```

## User Roles
- `admin` - System Administrator
- `user` - Normal User
- `owner` - Store Owner
