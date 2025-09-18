# 🏡 DOMORA – Listings Web Application

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/) 
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/) 

A full-stack web application built with **Node.js, Express, MongoDB, and EJS** that allows users to create, edit, view, and manage property or product listings.  

---

## 📌 Features
- ➕ **Create Listings** with title, description, price, location, and country.  
- ✏️ **Edit & Update Listings** with images and details.  
- ❌ **Delete Listings** safely.  
- 👀 **View Listings** in a clean, responsive EJS-powered UI.  
- 🎨 **Templating with ejs-mate** for layouts and partials.  
- ⚡ **Validation with Joi** to ensure clean and secure data input.  
- 🔒 **Error Handling Middleware** with a custom `ExpressError` utility.  

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Frontend:** EJS, ejs-mate  
- **Database:** MongoDB with Mongoose ODM  
- **Validation:** Joi  
- **Utilities:** Method-Override, Custom ExpressError class  

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
Create a `.env` file in the root with:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 4. Run the development server
```bash
npm start
```

Visit: **[http://localhost:3000](http://localhost:8080)**

---

## 📂 Project Structure
```
DOMORA/
├── models/              # Mongoose schemas (listing.js)
│   └── listing.js
├── utils/               # Utility helpers
│   ├── ExpressError.js  # Custom error handler
│   └── wrapAsync.js     # Async wrapper
├── views/               # EJS templates
│   ├── includes/        # Reusable partials (footer, navbar)
│   ├── layouts/         # Boilerplate layout
│   ├── listings/        # CRUD views (index, show, new, edit)
│   └── error.ejs        # Error page
├── public/              # Static assets (css, js)
├── app.js               # Main Express application
├── schema.js            # Joi validation schemas
├── package.json         # Dependencies & scripts
└── .gitignore
```

---

## 📋 API Endpoints

### Listings
| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/listings`     | View all listings     |
| GET    | `/listings/:id` | View a single listing |
| POST   | `/listings`     | Create a new listing  |
| PUT    | `/listings/:id` | Edit a listing        |
| DELETE | `/listings/:id` | Delete a listing      |

---

## 🛡️ Error Handling
* All errors use a custom `ExpressError` class.
* Errors are rendered with **views/error.ejs**.
* Joi validation ensures no invalid data enters the database.

---

## 🤝 Contributing
Contributions are welcome! Please fork this repo and submit a pull request.  
For major changes, open an issue first to discuss your ideas.

---
