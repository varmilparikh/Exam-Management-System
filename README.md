## Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)

# 📘 Exam Duty Management System

A full-stack enterprise-style Exam Duty Management System built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

The system manages examination sessions, faculty opt-ins, duty allocation, transfers, direct faculty swaps, notifications, reports and activity logging through role-based workflows.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)

![Express](https://img.shields.io/badge/Express-5.x-black)

![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

![Swagger](https://img.shields.io/badge/Swagger-API-green)


## 📖 Overview

The Exam Duty Management System is a role-based web application designed to simplify the management of examination duties within educational institutions.

It enables administrators to manage employees, departments, examinations, and examination duties while allowing faculty members to request transfers and duty swaps through configurable approval workflows.

The system also maintains detailed activity logs and notifications to ensure accountability and transparency throughout the examination process.


## ✨ Features

### Authentication
- JWT Authentication
- Role-Based Authorization (RBAC)
- Protected APIs

### Department Management
- Create
- Update
- Delete
- View Departments

### Employee Management
- Employee Profiles
- Department Assignment
- Role Management

### Examination Management
- Create Exams
- Update Exams
- Delete Exams
- Named sessions with start/end times and time-range validation

### Exam Duty Management
- Assign Duties
- Track Duty Status
- Duty History

### Transfer Workflow
- Replacement-found and replacement-assistance requests
- COE/SUPER_ADMIN replacement assignment or rejection
- Notifications
- Activity Logs

### Swap Workflow
- Faculty-to-Faculty Swap Requests
- Receiver Acceptance/Rejection
- Automatic validation and duty exchange after receiver acceptance
- Authority notifications and audit events

### Faculty Exam Opt-in
- Faculty can opt into upcoming exam sessions
- Duplicate opt-ins, capacity overbooking and schedule conflicts are prevented
- COE/SUPER_ADMIN confirmation and rejection notifications
- HOD and authorities can monitor requests within their permitted scope

### Notification System
- User Notifications
- Read Status
- Notification History
- Paginated notification history and bulk read actions

### Activity Logs
- Audit Trail
- User Actions
- Administrative Monitoring
- Search, date filters and pagination for SUPER_ADMIN and COE

### Reports
- Employee directory and faculty workload reports
- Exam, duty, transfer, swap, activity and combined overview reports
- Search, status, date and sorting filters with pagination
- CSV, Excel and PDF exports fetch all matching records in pages
- HOD workload/duty reports are department-scoped; faculty views are self-scoped

### API Documentation
- Swagger UI



## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

### Authentication

- JWT
- bcrypt

### Documentation

- Swagger (OpenAPI)

### Development Tools

- ESLint
- Prettier
- Nodemon

# Backend Setup

## Clone

```bash
git clone <repository-url>
cd backend
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

```bash
cp .env.example .env
```

Update the values in `.env`.

## Generate Prisma Client

```bash
npm run generate
```

## Run Database Migrations

```bash
npm run migrate
```

For an existing deployment, apply committed additive migrations with `npm run deploy`. These migrations add session fields, opt-in records, transfer request types and completed-swap tracking while preserving existing exam and request data.

## Seed the Database

```bash
npm run seed
```

## Start the Development Server

```bash
npm run dev
```

## Verification

From `backend`, run `npm run test`, `npm run lint`, and `npm run build`. From `frontend`, run `npm run lint` and `npm run build`. Backend unit tests cover session utilities and exam/transfer validation; workflows that require PostgreSQL should be verified against a migrated development database.

# Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` and set `VITE_API_BASE_URL` to the backend API URL (for example, `http://localhost:5000/api`).

```bash
npm run dev
```
