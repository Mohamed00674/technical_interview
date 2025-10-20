# 📝 MEAN Blog Platform

A simple collaborative blog application built with **MongoDB**, **Express**, **Angular**, and **Node.js**.

---

## 🚀 Features

- 🔐 User registration and login (JWT authentication)
- ✍️ Create, edit, and delete blog posts
- 💬 Add comments to blog posts
- 👀 View all blogs and their comments
- ⚡ Built with modern MEAN stack and TypeScript

---

## 🧰 Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | Angular 16+ |
| **Backend** | Node.js + Express + Full TypeScript |
| **Database** | MongoDB |
| **Auth** | JWT (JSON Web Token) + Roles supported |

---

## ⚙️ Project Setup

### 1️⃣ Clone the repository
```bash
https://github.com/Mohamed00674/technical_interview.git
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
npm install

APP_HOST=http://localhost
APP_PORT=3000
APP_ORIGINS=http://localhost:4200
APP_MONGO_URI=mongodb://localhost:27017/interview

JWT_SECRET=supersecret
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=refreshsecret
JWT_REFRESH_EXPIRATION=7d

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};


