# Rup Darpon - A Photography Website

<p align="center">
  A modern full-stack photography website developed for showcasing photography services, galleries, videos, packages, bookings, and customer reviews.
</p>

<p align="center">
  <a href="LIVE-URL">🌐 Live Website</a>
  &nbsp; • &nbsp;
  <a href="https://github.com/sabbirsohag-1509/Rup-Darpan">💻 GitHub Repository</a>
</p>

---

## 📌 About The Project

**Rup Darpon** is a full-stack photography website developed to provide a professional online presence for a photography service.

The website allows visitors to explore photography works, browse categorized galleries, watch featured videos, view photography packages, submit booking requests, and leave reviews.

The project also includes an **Admin Dashboard** for managing website content such as photos, videos, hero images, packages, users, bookings, and reviews.

I worked on this project as the **Full-Stack Developer**, responsible for developing the frontend, backend, API integration, authentication, database integration, and administrative functionality.

---

## 🌐 Live Website

### 🔗 Live Demo

**Live URL:**
`LIVE-URL`

---

## 💻 GitHub Repository

### 🔗 Source Code

**GitHub Repository:**
`https://github.com/sabbirsohag-1509/Rup-Darpan`

---

# 🖼️ Screenshots

## 🏠 Homepage

<!-- Add homepage screenshot here -->

![Rup Darpon Homepage](LIVE-URL)

---

## 📸 Photography Gallery

<!-- Add gallery screenshot here -->

![Photography Gallery](LIVE-URL)

---

## 🎥 Featured Videos

<!-- Add featured videos screenshot here -->

![Featured Videos](LIVE-URL)

---

## 📦 Photography Packages

<!-- Add packages screenshot here -->

![Photography Packages](LIVE-URL)

---

## 📅 Booking

<!-- Add booking screenshot here -->

![Booking System](LIVE-URL)

---

## ⭐ Customer Reviews

<!-- Add reviews screenshot here -->

![Customer Reviews](LIVE-URL)

---

## 🛠️ Admin Dashboard

<!-- Add admin dashboard screenshot here -->

![Admin Dashboard](LIVE-URL)

---

# ✨ Main Features

## 👤 User Features

* User registration and login
* Email/password authentication
* Google authentication
* JWT-based authentication
* Protected routes
* User profile management
* Change password
* Forgot password
* Password reset
* Login activity tracking
* Browse photography gallery
* Search photos
* Filter photos by category
* View detailed photo information
* View featured photos
* Watch featured videos
* Explore photography services
* View photography packages
* View package details
* Submit booking requests
* Submit reviews
* Responsive design

---

# 📸 Photography Gallery

The gallery provides an interactive way for visitors to explore photography work.

### Gallery Features

* Category filtering
* Search functionality
* Pagination
* Responsive grid/masonry layout
* Featured photo labels
* Photo detail modal
* Previous/next navigation
* Keyboard navigation
* Zoom controls
* Mouse-wheel zoom
* Photo metadata
* Photo statistics
* Tags
* Loading skeleton
* Error state
* Empty state

---

# 🎥 Featured Videos

The website includes a dedicated section for showcasing featured photography videos.

### Features

* Featured videos
* Facebook video support
* Video management
* Featured video limit
* Search
* Pagination
* Responsive video section

---

# 🖼️ Dynamic Hero Section

The homepage hero section is dynamically managed from the backend.

### Features

* Add hero images
* Edit hero images
* Delete hero images
* Activate/deactivate hero images
* Search hero images
* Sort hero images
* Maximum hero image limit

---

# 📦 Photography Packages

Visitors can explore available photography packages and their details.

### Features

* Package listing
* Package details
* Pricing information
* Package descriptions
* Responsive package cards
* Admin package management

---

# 📅 Booking System

Visitors can submit photography booking requests through the website.

### Features

* Package selection
* Booking form
* Booking request submission
* Booking information management
* Booking status management
* Admin booking management

---

# ⭐ Review System

Customers can submit reviews about their experience.

### Features

* Submit reviews
* Display reviews
* Review management
* Admin review management

---

# 🔐 Authentication

The application implements secure authentication and authorization.

## 🔐 Authentication & Authorization

Rup Darpon uses a custom backend authentication system built with Node.js, Express.js, MongoDB, JWT, and Passport.js.

### Authentication Features

- Custom email/password authentication
- Google OAuth authentication
- Password hashing
- JWT-based authentication
- HTTP-only cookies
- Protected routes
- Role-based authorization
- Admin authorization
- Forgot password
- Password reset
- Change password
- Login activity tracking

---

# 👨‍💼 Admin Dashboard

An administrative dashboard was developed to manage the website's content and users.

### Admin Features

* Dashboard
* User management
* Photo management
* Video management
* Hero image management
* Package management
* Booking management
* Review management
* User role management
* Search
* Pagination
* Featured content management

---

# 👥 User Management

Administrators can manage registered users.

### Features

* View users
* Search users
* Update user information
* Change user roles
* Delete users
* View login activity

---

# 📸 Photo Management

Administrators can manage photography content.

### Features

* Add photos
* Edit photos
* Delete photos
* Mark photos as featured
* Search photos
* Category management
* Pagination

---

# 🎥 Video Management

Administrators can manage featured videos.

### Features

* Add videos
* Edit videos
* Delete videos
* Mark videos as featured
* Search videos
* Featured video limit

---

# 🧰 Technologies Used

## Frontend

* React.js
* JavaScript
* Vite
* React Router
* React Query
* Axios
* Tailwind CSS
* DaisyUI
* Custom Authentication
* React Hook Form

---

## Backend

* Node.js
* Express.js
* MongoDB
* JWT
* Passport.js
* Nodemailer
* UAParser
* CORS

---

## Other Technologies & Services

* Custom Authentication
* MongoDB Atlas
* Cloudinary
* Google OAuth
* REST API
* Git
* GitHub

---

> The structure above is an overview and may vary depending on the final project structure.

---

# 🔄 Application Architecture

```text
                 ┌────────────────────┐
                 │       User         │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │  React Frontend    │
                 │      + Vite        │
                 └─────────┬──────────┘
                           │
                       REST API
                           │
                           ▼
                 ┌────────────────────┐
                 │ Express + Node.js  │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │      MongoDB       │
                 └────────────────────┘
```

---

# 🗄️ Database Collections

The backend uses MongoDB for storing application data.

### Collections

* `users`
* `photos`
* `videos`
* `heroImages`
* `packages`
* `bookings`
* `reviews`
* `loginActivities`
* `Likes and Reacts`

---

# 🔌 API Endpoints

## Users

```text
GET     /users
GET     /users/me
PATCH   /users/me
PATCH   /users/:id
PATCH   /users/:id/role
DELETE  /users/:id
```

## Photos

```text
POST    /photos
GET     /photos
GET     /featured-photos
GET     /all-photos
PUT     /photos/:id
DELETE  /photos/:id
```

## Videos

```text
POST    /videos
GET     /videos
PATCH   /videos/:id/featured
PUT     /videos/:id
DELETE  /videos/:id
```

## Hero Images

```text
POST    /hero-images
GET     /hero-images
PUT     /hero-images/:id
DELETE  /hero-images/:id
```

## Packages

```text
POST    /packages
GET     /packages
GET     /packages/:id
PUT     /packages/:id
DELETE  /packages/:id
```

## Bookings

```text
POST    /bookings
GET     /bookings
PATCH   /bookings/:id
DELETE  /bookings/:id
```

## Reviews

```text
POST    /reviews
GET     /reviews
PATCH   /reviews/:id
DELETE  /reviews/:id
```

## Likes and Reacts

```text
POST    /likes
GET     /likes

```



# 🔒 Environment Variables

Sensitive credentials should not be committed to GitHub.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
```

Never expose:

* MongoDB credentials
* JWT secret
* Custom authentication private credentials
* Google OAuth secret
* Email credentials
* API keys that should remain private

---

# 📱 Responsive Design

The website is designed to provide a responsive experience across:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

The interface uses responsive Tailwind CSS utilities and adaptive layouts.

---

# 🎨 UI & Design

The website focuses on providing a modern photography-oriented user experience.

### Design Highlights

* Modern typography
* Photography-focused layouts
* Dark visual theme
* Responsive navigation
* Interactive gallery
* Smooth UI interactions
* Image-focused sections
* Responsive cards
* Loading skeletons
* Error states
* Empty states

---

# ⚡ Performance

Several techniques are used to improve the application's performance:

* React Query caching
* API pagination
* Limited data fetching
* Responsive layouts
* Loading skeletons
* Conditional rendering
* Image optimization support
* Cloudinary integration
* Efficient API requests

---

# 🛡️ Security

The application includes:

* JWT authentication
* HTTP-only cookies
* Protected routes
* Role-based authorization
* Admin authorization
* Environment variables
* CORS configuration
* Password reset functionality
* Authentication validation

---

# 🧪 Error & Loading States

The frontend provides user-friendly states for:

* Loading
* API errors
* Empty data
* Invalid input
* Authentication errors
* Unauthorized access
* Failed API requests

---

# 🚀 Deployment

The project can be deployed using platforms such as:

### Frontend

* Netlify

### Backend

* Vercel or,
* Railway

### Database

* MongoDB Atlas

---

# 🔮 Future Improvements

Possible future improvements include:

* Online payment integration
* Advanced booking calendar
* Real-time booking notifications
* Email notifications
* SMS notifications
* Advanced analytics
* Customer dashboard
* Wishlist/favorite photos
* SEO optimization
* Progressive Web App support

---

# 🧠 Development Experience

While developing Rup Darpon, I worked with and gained practical experience in:

* Full-stack MERN development
* React component architecture
* REST API development
* MongoDB database design
* Authentication & authorization
* Custom authentication
* Google OAuth
* JWT-based authentication
* React Query
* Axios
* React Router
* Tailwind CSS
* DaisyUI
* CRUD operations
* Pagination
* Search & filtering
* Admin dashboard development
* Role-based access control
* API integration
* Git & GitHub
* Frontend-backend integration

---

# 👨‍💻 Developer

### Sabbir Hossain Sohag

**Full-Stack MERN Developer**

I worked on the **development of the Rup Darpon website**, including the frontend, backend, API integration, authentication, database integration, and admin dashboard functionality.

### Connect With Me

* **GitHub:** `https://github.com/sabbirsohag-1509`
* **LinkedIn:** `https://www.linkedin.com/in/sabbirhossainsohag`
* **Portfolio:** `https://portfolio-sabbir-sohag-f956ef.netlify.app`
* **Email:** `sabbirhossainsohag5@gmail.com`

---

# 📄 Project Ownership

**Rup Darpon** is a photography website developed for its respective owner/client.

The website content, photography work, branding, images, videos, and business information belong to their respective owner/client.

I contributed to the project as the **Full-Stack Developer** responsible for the technical development and implementation.

---

# ⭐ Acknowledgement

Thanks to the **Rup Darpon** team/client for the opportunity to work on this project.

---

<p align="center">
  Developed with ❤️ using the MERN Stack
</p>
