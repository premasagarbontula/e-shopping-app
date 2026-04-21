# E-shopping App (MERN) 🚀

Production-ready MERN e-shopping application providing user authentication, role-based access (admin/user), product catalog with search/suggestions, cart management, order placement, and an admin dashboard for managing users and products.

Live Demo: https://e-shopping-app-wiyh.onrender.com

---

## Tech Stack

- Frontend
  - React, Context API, Axios, Tailwind CSS
- Backend
  - Node.js, Express.js, Mongoose, JWT
- Database
  - MongoDB
- Tools / Utilities
  - dotenv, cookie-parser, cors, morgan, express-formidable, Stripe, nodemon, concurrently, slugify

---

## Key Features

- User (Customer)
  - Register / Login / Logout
  - Protected routes (profile, orders)
  - Product search with suggestions
  - Cart: add / remove / update items
  - Place orders, view order history
- Admin
  - Role-based authorization
  - Manage users (list / block / role)
  - Manage categories and products (CRUD)
  - View orders and basic order management
- Shared
  - JWT-based authentication with secure cookies
  - Middleware to guard inactive/blocked accounts
  - Server-side validation and centralized error handling

---

## Screenshots

- Home / Product Listing
  - ![placeholder-home](https://github.com/premasagarbontula/e-shopping-app/blob/main/client/src/assets/home.png)
- Product Details
  - ![placeholder-product](https://github.com/premasagarbontula/e-shopping-app/blob/main/client/src/assets/details.png)
- Cart
  - ![placeholder-cart](https://github.com/premasagarbontula/e-shopping-app/blob/main/client/src/assets/cart.png)
- Admin Dashboard
  - ![placeholder-admin](https://github.com/premasagarbontula/e-shopping-app/blob/main/client/src/assets/admin.png)
- Register page
  - ![placeholder-register](https://github.com/premasagarbontula/e-shopping-app/blob/main/client/src/assets/register.png)

---

## Project Structure

Backend (root)

- app.js
- package.json
- config/
  - db.js
  - stripe.js
- controllers/
  - authController.js
  - categoryController.js
  - productController.js
- middlewares/
  - authMiddleware.js
- models/
  - userModel.js
  - productModel.js
  - categoryModel.js
  - orderModel.js
- routes/
  - authRoute.js
  - categoryRoute.js
  - productRoute.js

Frontend (client/)

- src/
  - api/axios.js
  - components/
    - common/Spinner.js
    - form/CategoryForm.js, SearchInput.js
    - layout/Header.js, Footer.js, Layout.js
  - context/
    - authContext.js, cartContext.js, searchContext.js
  - pages/
    - auth/, admin/, product/, cart/, user/, home/
  - routes/
    - PrivateRoute.js, AdminRoute.js
  - styles/, assets/

---

## Installation & Setup

Prerequisites:

- Node 18+
- npm or yarn
- MongoDB (URI or Atlas)
- (Optional) Stripe account for payments

1. Clone

   ```bash
   git clone https://github.com/your-org/ecommerce-app-2026.git
   cd "Ecommerce App 2026"
   ```

2. Backend

   ```bash
   cd .
   npm install
   # dev: runs server + client concurrently
   npm run server         # starts backend with nodemon
   # or
   npm run start          # production server
   ```

3. Frontend

   ```bash
   cd client
   npm install
   npm run start          # runs React dev server on :3000
   # to build for production:
   npm run build
   ```

4. Running Fullstack (dev)
   From project root:
   ```bash
   npm run dev
   ```

---

## Environment Variables

Backend (.env)

```env
PORT=8080
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxx
COOKIE_NAME=token
```

Frontend (client/.env)

```env
// filepath: d:\CCBP\Resume Projects\Ecommerce App 2026\client\.env
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_STRIPE_KEY=pk_test_xxx
```

Use placeholders; never commit secrets.

---

## API Endpoints (core)

| Route                 | Method | Auth  | Description                             |
| --------------------- | -----: | :---: | --------------------------------------- |
| /api/v1/auth/register |   POST |  No   | Register new user                       |
| /api/v1/auth/login    |   POST |  No   | Authenticate user -> issues JWT cookie  |
| /api/v1/auth/logout   |   POST |  Yes  | Clear auth cookie / logout              |
| /api/v1/category      |    GET |  No   | List categories                         |
| /api/v1/category      |   POST | Admin | Create category                         |
| /api/v1/category/:id  |    PUT | Admin | Update category                         |
| /api/v1/category/:id  | DELETE | Admin | Delete category                         |
| /api/v1/product       |    GET |  No   | Product listing / search (query params) |
| /api/v1/product/:id   |    GET |  No   | Product details                         |
| /api/v1/product       |   POST | Admin | Create product (multipart/form-data)    |
| /api/v1/product/:id   |    PUT | Admin | Update product                          |
| /api/v1/product/:id   | DELETE | Admin | Delete product                          |

Note: Additional routes for cart, orders, user management and Stripe payments exist — consult controllers/routes folder for full list.

---

## Authentication Flow (brief)

- On login/register the server signs a JWT (user id, role) and sets it as an HttpOnly secure cookie.
- Frontend sends credentials to /auth/login; subsequent requests include the cookie automatically (with credentials).
- Backend middleware verifies JWT, attaches user to request, and enforces role-based access and inactive-user blocking.

---

## Best Practices Used

- Separation of concerns: controllers, routes, models, middlewares.
- Reusable React components + Context API for global state (auth, cart, search).
- Centralized error handling and request logging (morgan).
- Secure auth: JWT in HttpOnly cookies, role checks in middleware.
- Environment-driven configuration, .env per environment.
- Static client build served by Express for production.

---

## Future Improvements

- Add unit & integration tests (Jest + Supertest).
- Full cart persistence with server-side session and merge on login.
- Pagination, advanced filtering, and faceted search (ElasticSearch).
- Webhooks for Stripe to handle asynchronous payment events.
- CI/CD pipeline, Dockerization, and Kubernetes deployment.

---

## Contributing

- Fork the repo → create feature branch → open PR with clear description and tests.
- Follow commit message conventions and code style.
- Open issues for major changes before implementing.

---

## Author

Prema Sagar B  
Email: prem.b.sagar@gmail.com  
GitHub: https://github.com/premasagarbontula

---

## License

MIT © premasagar
