

# ART Management & Employee Nomination App

## Overview
A role-based team management application with three user roles (Admin, Art Manager, Employee), approval-based login workflows, team/sprint management, and employee nomination features. This will be a **frontend prototype with mock data** to validate the flow before adding a real backend.

---

## 1. Login & Approval System

### Login Page
- Three distinct cards for **Admin**, **Art Manager**, and **Employee**
- Each card has First Name, Last Name, and Password fields
- On first login attempt, a **registration request** is sent to the appropriate approver
- Users cannot access their dashboard until approved

### Approval Flow
- **Admin** approves/declines other Admin and Art Manager registration requests
- **Art Manager** approves/declines Employee registration requests
- Unapproved users see a "Pending Approval" screen after login

---

## 2. Admin Dashboard

### Pending Requests Section
- Two separate lists: **Admin Requests** and **Art Manager Requests**
- Each request shows the user's name with Accept/Decline buttons

### Art Manager Management
- A section to **add new Art Managers** with fields like name, email, department
- Admin **cannot** nominate employees for sprints

---

## 3. Art Manager Dashboard

### Employee Requests
- List of pending employee registration requests with Accept/Decline buttons

### Manage ARTs
- **Create ART**: Form with ART name and department name
- Under each ART, option to **create and delete teams**
- Team details displayed: team name, description, number of enrolled employees

### Manage Teams Card
- Create teams with name, description
- View team details and member count

### Create Sprint Card
- Create time-boxed sprints with name, start date, end date, linked to teams

### Manage Awards Card
- Add or delete award categories for nominations

### Nomination Leaderboard
- View which employee is leading in each award category (read-only, no nominating)

---

## 4. Employee Dashboard

### ART & Team Selection
- Card showing the employee's assigned ART name
- On click, displays all teams created by the Art Manager
- Employee can **join only one team** (selection is locked after joining)

### Nomination Board
- Nominate teammates (only from the same team) for specific award categories
- View current nomination standings

### Organization Pulse
- Activity feed showing recent org-wide events: new teams created, sprint updates, award announcements, new members joined

---

## 5. Design & Navigation
- Clean, modern UI with card-based layouts
- Role-specific sidebar navigation
- Consistent color-coded role indicators (e.g., Admin = blue, Art Manager = green, Employee = orange)
- Responsive design for desktop use
- Toast notifications for actions (approve, decline, nominate, etc.)

