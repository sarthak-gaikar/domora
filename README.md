# 🏡 DOMORA – Listings Web Application

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/) 
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Passport](https://img.shields.io/badge/Passport-34E27A?logo=passport&logoColor=white)](https://www.passportjs.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-34495E?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

A full-stack, secure web application built with **Node.js, Express, MongoDB, and EJS** that allows users to seamlessly discover, create, review, and manage property or product listings.

---

## 📌 Features

### 🏡 Listing Management (CRUD)
- ➕ **Create Listings**: Post a listing with title, description, price, location, country, and image uploads.
- ✏️ **Edit & Update Listings**: Edit properties you own using a dynamic form.
- ❌ **Delete Listings**: Remove listings you own safely. All associated reviews are automatically deleted in cascade.
- 👀 **View Listings**: Browse all listings in a clean, fully responsive gallery or drill down into details for a specific listing.

### 🔐 Authentication & Authorization
- 👤 **User Accounts**: Register, log in, and log out with robust password hashing and session tracking.
- 🛡️ **Role-Based Access Control**:
  - Listings can only be created by logged-in users.
  - Listings can only be edited or deleted by their verified owner (`isOwner` middleware).
  - Reviews can only be submitted by logged-in users and deleted by their original author (`isReviewAuthor` middleware).

### ☁️ Cloud Image Uploads
- 📷 **Cloudinary Storage**: Fully integrated with Multer and Cloudinary storage. Images uploaded via the listing creation form are stored securely in the cloud, rather than locally, for robust media delivery.

### 💬 Review System
- ⭐️ **Interactive Reviews**: Share experiences on any listing with custom ratings (1–5 stars) and comments.
- 👤 **Author Verification**: Reviews display the username of their author for enhanced trust.

### ⚡ Technical Utilities & Experience
- 🎨 **Templating with ejs-mate**: Layout inheritance boilerplate structure, modularizing header/navbar, footer, and flash messages.
- 🛡️ **Joi Validation**: Dynamic server-side validation schemas to ensure only sanitized, clean, and secure data input enters the database.
- ✉️ **Flash Alerts**: Real-time feedback via session-based dynamic flash alerts (success and error messages) rendered elegantly on screen actions.
- 🔒 **Global Error Handling**: Custom `ExpressError` class coupled with asynchronous error wrapping middleware (`wrapAsync`) to safely catch and render detailed custom errors on `views/error.ejs`.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Embedded JavaScript templates), `ejs-mate` (layout engines), Vanilla CSS, Bootstrap
- **Database:** MongoDB with Mongoose ODM (Schemas, middlewares, cascading deletes, model population)
- **Validation:** Joi (schema validation middleware)
- **Authentication:** Passport.js, Passport-Local Strategy, `passport-local-mongoose`
- **File Uploads:** Multer, `multer-storage-cloudinary`, Cloudinary SDK
- **Sessions & Storage:** Express-Session, Connect-Flash

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/DOMORA.git
cd DOMORA
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root of the project:

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
SESSION_SECRET=your_express_session_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Initialize & seed the database (Optional)
To populate the database with seed listings, run:
```bash
node init/index.js
```

### 5. Run the development server
```bash
npm start
```
*Note: Make sure your `package.json` contains a start script, or execute `node app.js` directly.*

Visit: **[http://localhost:8080](http://localhost:8080)**

---

## 📂 Project Structure

```
DOMORA/
├── controllers/          # MVC Controllers (business logic separation)
│   ├── listings.js       # Listing logic
│   ├── reviews.js        # Review logic
│   └── users.js          # Authentication logic
├── init/                 # Database initialization & seeding scripts
│   ├── data.js           # Dummy seeding dataset
│   └── index.js          # Seeding script
├── models/               # Mongoose schemas (Listing, Review, User)
│   ├── listing.js
│   ├── reviews.js
│   └── user.js
├── public/               # Static assets
│   ├── css/              # Stylesheets
│   └── js/               # Client-side scripts
├── routes/               # Express Router routes
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── utils/                # Custom helper classes and utility wrappers
│   ├── ExpressError.js   # Custom error constructor
│   └── wrapAsync.js      # Async handler error-catching wrapper
├── views/                # EJS template engine files
│   ├── includes/         # Partial elements (navbar.ejs, footer.ejs, flash.ejs)
│   ├── layouts/          # Layout engines (boilerplate.ejs)
│   ├── listings/         # Listing views (index.ejs, show.ejs, new.ejs, edit.ejs)
│   ├── users/            # Authentication views (login.ejs, register.ejs)
│   ├── error.ejs         # User-facing global error view
│   └── home.ejs          # Application homepage
├── .env                  # Environmental variables configurations (excluded in git)
├── .gitignore
├── app.js                # Core Express application configuration & server entrypoint
├── cloudConfig.js        # Cloudinary and Multer integration configurations
├── middleware.js         # Security and validation middlewares (isLoggedIn, isOwner, validateListing)
├── package.json          # Project configurations, commands, and dependency tree
└── schema.js             # Joi input validation schema configurations
```

---

## 📋 API Endpoints

### 👤 Authentication & Users
| Method | Endpoint    | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/register` | Render sign-up form | Public |
| `POST` | `/register` | Create a new user account | Public |
| `GET` | `/login` | Render sign-in form | Public |
| `POST` | `/login` | Log in to account and redirect | Public |
| `GET` | `/logout` | Terminate session and logout | Public |

### 🏡 Listings
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/listings` | List all listings | Public |
| `GET` | `/listings/new` | Render form to create listing | Protected (User) |
| `POST` | `/listings` | Add listing with image upload | Protected (User) + Joi Validated |
| `GET` | `/listings/:id` | View listing details, owner & reviews | Public |
| `GET` | `/listings/:id/edit` | Render listing edit form | Protected (Owner only) |
| `PUT` | `/listings/:id` | Update listing details | Protected (Owner only) + Joi Validated |
| `DELETE`| `/listings/:id` | Delete listing and its reviews | Protected (Owner only) |

### 💬 Reviews
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/listings/:id/reviews` | Create review for a listing | Protected (User) + Joi Validated |
| `DELETE`| `/listings/:id/reviews/:reviewId` | Delete specific review | Protected (Author only) |

---

## 🛡️ Middlewares & Validations
- **`isLoggedIn`**: Protects routes by verifying that `req.isAuthenticated()` is true; dynamically redirects back to the previous URL upon successful authentication.
- **`isOwner`**: Validates whether the current logged-in user is the creator of the listing before granting edit or delete permissions.
- **`isReviewAuthor`**: Validates whether the current user is the original writer of the review before letting them delete it.
- **`validateListing`** & **`validateReview`**: Integrates robust server-side Joi schemas checking inputs prior to standard processing.

---

## 🤝 Contributing
Contributions are always welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
