# 📚 Online Book Store : https://onlinebookstorebyd.netlify.app/

A complete e-commerce web application for browsing, filtering, and purchasing books online. Built using **ReactJS**, this platform features a dynamic user interface with cart and wishlist functionality, and an admin dashboard for book management.

---

## 🔥 Features

- 🏠 Home page with navigation
- 🔐 User Login / Signup system
- 📚 Book listing with filters
- ✅ Add to Cart & Wishlist
- 📦 Display stock availability
- 🔍 Book detail page
- 🛒 View and manage cart
- 💖 View and manage wishlist
- 🧑‍💼 Admin dashboard for:
  - Adding new books
  - Editing existing books
  - Deleting books
- ⚙️ User account settings (edit email, password)
- 📊 Mock backend with JSON Server

---

## 🛠️ Tech Stack

| Layer         | Technology              |
|---------------|--------------------------|
| Frontend      | ReactJS, HTML5, CSS3     |
| Routing       | React Router DOM         |
| State         | React Hooks (`useState`, `useEffect`) |
| Mock Backend  | JSON Server              |
| Tools         | VS Code, Git, GitHub     |

---

## 🗃️ JSON Server (Mock API)

`db.json` file is used as a mock backend to simulate a REST API.

It stores:
- User details
- Book data
- Cart and wishlist items
- Admin credentials

To run the JSON server locally:
```bash
npx json-server --watch src/db.json --port 3001
