# Smart Placement Tracker

A portal for college Training & Placement Offices (TPO) to manage recruitment drives.

## Description

Smart Placement Tracker helps TPO teams manage company listings, track student eligibility, follow interview rounds, and automate communication.
It provides a central dashboard for posting recruitment drives, filtering students by branch and CGPA, tracking interview status through multiple rounds, and notifying selected students automatically.

## Key Features

- Company listings with package details and eligibility criteria
- Student eligibility filtering by CGPA and branch
- Interview round tracking: Round 1, Round 2, Selected
- Automated email notifications for placement updates
- Secure login and user management for students and admin users
- Responsive React frontend with Express/MongoDB backend

## Repository Structure

- `backend/` - Express server, MongoDB models, routes, authentication, email notifications
- `frontend/` - React + Vite client, pages for login, registration, companies, and admin dashboard

## Setup

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. In a separate terminal, navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

## Notes

- The application expects the backend API to be running while the frontend is in development mode.
- Add environment variables for database connection, JWT secret, and email SMTP settings in the backend.

## Contact

For any updates or enhancements, open an issue or update the repository documentation.
