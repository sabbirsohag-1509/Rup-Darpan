# Rup Darpon

A full-stack photography service platform for showcasing photography work, managing packages, accepting bookings, collecting reviews, and processing payments.

## Live Application

- Frontend: https://rup-darpon.netlify.app
- Backend API: https://rupdarpon-server.vercel.app
- API health check: https://rupdarpon-server.vercel.app/

## Features

### Public and User Features

- Browse photography galleries, videos, hero images, and packages
- Filter and search gallery content
- View package details and package reviews
- Register and log in with email/password
- Sign in with Google OAuth
- Manage profile information and profile photo
- Submit, edit, and delete reviews
- Submit photography booking requests
- Track booking status and payment status
- Receive booking and account notifications
- Pay through SSLCommerz after booking confirmation

### Admin Features

- Dashboard with platform statistics
- User and role management
- Photo, video, hero image, and package management
- Booking review, confirmation, cancellation, and deletion
- Review approval, rejection, featuring, and deletion
- Notification management
- Pagination, search, loading states, and error states

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- TanStack React Query
- Axios
- React Hook Form
- Tailwind CSS and DaisyUI
- Lucide React
- Framer Motion

### Backend

- Node.js
- Express 5
- MongoDB Atlas
- JWT authentication with HTTP-only cookies
- Passport.js and Google OAuth
- bcrypt password hashing
- Nodemailer
- SSLCommerz
- CORS

### Deployment and Services

- Netlify for the frontend
- Vercel for the backend API
- MongoDB Atlas for the database
- Cloudinary for profile image uploads
- Google Cloud OAuth credentials

## Project Structure

```text
Rup-Darpan/
├── backend/
│   ├── index.js
│   ├── vercel.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layout/
│       ├── pages/
│       └── router/
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas database
- Google OAuth credentials for Google login
- SSLCommerz credentials for payments
- Cloudinary upload preset for profile images

## Local Setup

Clone the repository and install dependencies in both applications:

```bash
git clone https://github.com/sabbirsohag-1509/Rup-Darpan.git
cd Rup-Darpan

cd backend
npm install

cd ../frontend
npm install
```

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

DB_USER=your-mongodb-user
DB_PASS=your-mongodb-password
JWT_SECRET=your-long-random-jwt-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

EMAIL_USER=your-email-address
EMAIL_PASS=your-email-app-password

SSLCOMMERZ_STORE_ID=your-store-id
SSLCOMMERZ_STORE_PASSWORD=your-store-password
SSLCOMMERZ_IS_LIVE=false
```

Never commit `backend/.env` or expose its values publicly.

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=https://rupdarpon-server.vercel.app
```

For local backend development, use:

```env
VITE_API_URL=http://localhost:5000
```

The frontend reads the API URL from `src/hooks/apiConfig.js`.

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend normally runs at `http://localhost:5173`.

## Production Deployment

### Backend on Vercel

Set the Vercel project Root Directory to `backend`, add all backend environment variables under the Production environment, then deploy:

```bash
cd backend
vercel --prod
```

Required production values include:

```env
CLIENT_URL=https://rup-darpon.netlify.app
SERVER_URL=https://rupdarpon-server.vercel.app
GOOGLE_CALLBACK_URL=https://rupdarpon-server.vercel.app/auth/google/callback
```

MongoDB Atlas must allow connections from Vercel. Configure the Atlas Network Access rules appropriately for the deployment environment.

### Frontend on Netlify

Use these Netlify build settings:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist` when the base directory is `frontend`
- Environment variable: `VITE_API_URL=https://rupdarpon-server.vercel.app`

The included `frontend/public/_redirects` file supports client-side routing on Netlify.

## Google OAuth Configuration

For production Google login, configure the same OAuth client used by the backend.

Authorized JavaScript origin:

```text
https://rup-darpon.netlify.app
```

Authorized redirect URI:

```text
https://rupdarpon-server.vercel.app/auth/google/callback
```

The redirect URI must match exactly, including protocol, spelling, path, and trailing slash behavior. Keep `GOOGLE_CLIENT_SECRET` only in backend/Vercel environment variables.

## API Overview

All API paths are relative to `https://rupdarpon-server.vercel.app`.

### Authentication

```text
POST  /register
POST  /login
POST  /logout
GET   /me
GET   /auth/google
GET   /auth/google/callback
POST  /users/forgot-password
PATCH /users/reset-password/:token
PATCH /users/change-password
```

### Content

```text
GET    /all-photos
GET    /featured-photos
POST   /photos
GET    /photos
PUT    /photos/:id
DELETE /photos/:id

GET    /all-videos
GET    /featured-videos
POST   /videos
GET    /videos
PUT    /videos/:id
DELETE /videos/:id

GET    /hero-images
POST   /hero-images
PUT    /hero-images/:id
DELETE /hero-images/:id

GET    /packages
GET    /packages/:id
POST   /packages
PUT    /packages/:id
DELETE /packages/:id
```

### Bookings and Reviews

```text
POST   /bookings
GET    /bookings
GET    /admin/bookings
PATCH  /admin/bookings/:id/confirm
PATCH  /admin/bookings/:id/cancel
DELETE /admin/bookings/:id

GET    /reviews/package/:packageId
POST   /reviews
GET    /reviews/my
PATCH  /reviews/:id
DELETE /reviews/:id
GET    /admin/reviews
PATCH  /admin/reviews/:id/approve
PATCH  /admin/reviews/:id/reject
PATCH  /admin/reviews/:id/feature
DELETE /admin/reviews/:id
```

### Notifications and Payments

```text
POST   /notifications
GET    /notifications
GET    /notifications/unread-count
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
DELETE /notifications/:id

POST   /payment/init
POST   /payment/success
POST   /payment/fail
POST   /payment/cancel
POST   /payment/ipn
```

Protected endpoints require the authentication cookie. Admin endpoints additionally require an admin role.

## Database Collections

- `users`
- `photos`
- `photoLikes`
- `videos`
- `heroImages`
- `packages`
- `bookings`
- `reviews`
- `notifications`
- `loginActivities`

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
npm start
npm run dev
```

## Security Notes

- Do not commit `.env`, `.env.local`, or production credentials.
- Do not expose `GOOGLE_CLIENT_SECRET`, database credentials, JWT secrets, email passwords, or SSLCommerz passwords.
- Rotate any secret that has been accidentally shared.
- Use separate credentials for local development and production where possible.
- Keep MongoDB Atlas Network Access and Database Access configured for the deployed backend.

## Developer

### Sabbir Hossain Sohag

- GitHub: https://github.com/sabbirsohag-1509/Rup-Darpan
- LinkedIn: https://www.linkedin.com/in/sabbirhossainsohag
- Portfolio: https://portfolio-sabbir-sohag-f956ef.netlify.app
- Email: sabbirhossainsohag5@gmail.com

## Project Ownership

Rup Darpon is a photography website developed for its respective owner/client. The website content, photography work, branding, images, videos, and business information belong to their respective owner/client.

The developer contributed the technical implementation, including the frontend, backend, API integration, authentication, database integration, payment workflow, and admin dashboard.
