# Library Management System (MERN)

Full-stack library management app: manage books and members, issue books, and record returns.

## Stack

- MongoDB + Mongoose
- Express.js / Node.js REST API
- React (Vite) + React Router + Axios

## Project structure

```
library-management-system/
├── client/            # React frontend (Vite)
│   └── src/{components,pages,services}
├── server/            # Express backend
│   └── {config,controllers,models,routes,middleware}
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

Quick local MongoDB with Docker:

```bash
docker run -d --name lms-mongo -p 27017:27017 mongo:7
```

## Setup

Backend:

```bash
cd server
npm install
cp .env.example .env      # adjust MONGODB_URI if needed
npm run seed              # optional sample data
npm run dev               # http://localhost:5000
```

Frontend:

```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/books` | List books (`?search=`) |
| GET | `/api/books/:id` | Get a book |
| POST | `/api/books` | Create a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |
| GET | `/api/members` | List members (`?search=`) |
| GET | `/api/members/:id` | Get a member |
| POST | `/api/members` | Create a member |
| PUT | `/api/members/:id` | Update a member |
| DELETE | `/api/members/:id` | Delete a member |
| GET | `/api/transactions` | List transactions (`?status=issued\|returned`) |
| GET | `/api/transactions/stats` | Dashboard statistics |
| POST | `/api/transactions/issue` | Issue a book to a member |
| PUT | `/api/transactions/:id/return` | Return an issued book |

## Pages

Dashboard, Books list, Add/Edit book, Members list, Add/Edit member, Issue book, Transactions (with return action).

## Business rules

- Issuing decrements `availableQuantity`; returning increments it (never above `quantity`).
- A book with no available copies cannot be issued.
- A book currently issued cannot be deleted, and its quantity cannot drop below the issued count.
- A member with outstanding issued books cannot be deleted.
- Required fields, unique ISBN/email, and email/phone formats are validated on both client and server.
