README.md
│
├── Project Banner
├── Project Overview
├── Features
├── Tech Stack
├── Architecture
├── Folder Structure
├── Installation
├── Environment Variables
├── Database Setup
├── Running the Project
├── API Documentation
├── Business Workflows
├── Project Status
├── Roadmap
├── Contributing
└── License

# 📘 Exam Duty Management System

A full-stack enterprise-style Exam Duty Management System built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

The system automates examination duty allocation, transfer requests, swap requests, approvals, notifications, and activity logging through secure role-based workflows.

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

### Exam Duty Management
- Assign Duties
- Track Duty Status
- Duty History

### Transfer Workflow
- Faculty Transfer Requests
- COE Approval/Rejection
- Notifications
- Activity Logs

### Swap Workflow
- Faculty-to-Faculty Swap Requests
- Receiver Acceptance/Rejection
- COE Approval/Rejection
- Automatic Duty Exchange

### Notification System
- User Notifications
- Read Status
- Notification History

### Activity Logs
- Audit Trail
- User Actions
- Administrative Monitoring

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