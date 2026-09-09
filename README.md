# CivicConnect

CivicConnect is a civic issue reporting and tracking platform.

## Technology
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MySQL

## Database features
- 6 core tables
- Views
- Stored Procedure
- Triggers
- Status History
- Rewards

## Architecture
Frontend -> Node.js + Express -> MySQL

## Local Setup Instructions

1. **Database:**
   - Install MySQL and ensure it is running.
   - Execute the files in the `database/` folder in this order: `schema.sql`, `sample_data.sql`, `queries.sql`, `views.sql`, `procedures.sql`, `triggers.sql`.

2. **Backend:**
   - Navigate to the `backend/` directory: `cd backend`
   - Install dependencies: `npm install`
   - Start the server: `node server.js`
   - The backend API will run on `http://localhost:5000`

3. **Frontend:**
   - Simply open `frontend/front.html` in any modern browser, or run a local static server inside the `frontend/` directory (e.g., `npx http-server`).
