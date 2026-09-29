# Verde Library — MERN Book Library Management System

A premium, responsive MERN-stack library application based on the project requirements:
- React + Vite frontend
- Node.js + Express REST API
- MongoDB + Mongoose
- User signup/login with JWT
- Add, display, search, edit and delete books
- Available / Issued status
- Borrower and due-date tracking
- Dashboard statistics and category breakdown
- Responsive premium UI with a warm cream + deep green palette (no blue)
- Netlify + Render deployment ready

## 1. Requirements
Install:
- Node.js 18+
- MongoDB Atlas account (recommended) or local MongoDB

## 2. Backend setup

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

Backend: http://localhost:5000

## 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173

## 4. MongoDB Atlas
1. Create a free cluster.
2. Create a database user.
3. Add your development IP under Network Access.
4. Copy the Node.js connection string.
5. Put it in `backend/.env` as `MONGO_URI`.

## 5. Main API endpoints

### Auth
- POST `/api/auth/signup`
- POST `/api/auth/login`

### Books
- GET `/api/books`
- GET `/api/books/:id`
- POST `/api/books`
- PUT `/api/books/:id`
- PATCH `/api/books/:id/status`
- DELETE `/api/books/:id`

### Dashboard
- GET `/api/dashboard/stats`

All book/dashboard endpoints require:

`Authorization: Bearer <JWT_TOKEN>`

## 6. Netlify + Render deployment

### Render
Create a Web Service:
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`

### Netlify
Create a site from the `frontend` folder:
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable:
  `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`

After Netlify gives its URL, update Render's `CLIENT_URL` to that Netlify URL and redeploy.

## 7. Suggested presentation points
For your project/demo, explain:
1. React handles the responsive UI.
2. Axios connects React to REST endpoints.
3. Express handles authentication and CRUD APIs.
4. Mongoose defines User and Book schemas.
5. MongoDB stores users and book records.
6. JWT protects private API routes.
7. Search/filter is handled by query parameters.
8. Dashboard statistics are calculated using MongoDB aggregation/counts.

## 8. Extra features added
Beyond the original specification, this version includes:
- Premium responsive dashboard
- Book cover URL support
- ISBN field
- Book description
- Category filters
- Availability/status filter
- Borrower and due date
- Dashboard category distribution
- Mobile sidebar
- Empty/loading states
- JWT authentication
- Password hashing with bcrypt
- Protected REST APIs
