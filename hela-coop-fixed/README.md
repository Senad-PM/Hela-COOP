# Hela-COOP

A role-based web app for managing a local co-operative society: members, savings accounts, loans, transactions and an audit trail.

## Roles
| Role | What they do |
|------|--------------|
| **Admin** | Registers staff/manager accounts, manages users, views the activity log |
| **Staff** | Registers members, opens savings accounts, deposits / withdraws, applies for loans |
| **Manager** | Reviews dashboards, approves or rejects loan applications |

## Tech stack
- **Client:** React 19, Vite, Tailwind CSS 4, Framer Motion, GSAP, Chart.js
- **Server:** Node.js, Express 5, MongoDB + Mongoose, JWT (access + refresh tokens), node-cron, Nodemailer

## Features
- Role-based access control with JWT authentication
- Savings: regular and fixed-deposit accounts with daily accrual and monthly interest payout
- Loans: EMI calculation, amortization schedule, approval workflow, automatic monthly repayment and overdue e-mails (cron jobs)
- Activity log of important actions

## Run locally
```bash
# server
cd server
cp .env.example .env     # fill in MONGO_URI, JWT secrets, ADMIN_EMAIL / ADMIN_PASSWORD, e-mail settings
npm install
npm run dev

# client (new terminal)
cd client
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```
The first admin account is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`.

## Team
Built as a university team project.
