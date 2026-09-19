# 🏙️ CivicConnect

## Smart Civic Issue Reporting & Management Platform

> Report. Track. Resolve. Improve your community.

CivicConnect is a web-based civic issue reporting and management platform that allows citizens to report local issues, track their complaints, and view their resolution status.

The platform provides an administrative dashboard for managing reported issues and uses a MySQL database to store users, departments, categories, issues, status history, and reward information.

---

## ✨ Features

### 👤 Citizen Features

- Report civic issues through an online form
- Submit issue location using latitude and longitude
- Select issue categories
- Specify issue priority
- Track submitted issues using a Report ID
- View issue status and progress
- View reported issues on an interactive map
- Receive reward points when a reported issue is resolved

### 🛠️ Admin Features

- View overall issue statistics
- View all reported civic issues
- Filter and manage reports
- Update issue status
- View issue-related statistics
- Monitor issues according to categories and departments

### 🗄️ Database Features

- Relational MySQL database
- Primary and foreign key constraints
- Normalized database design
- SQL joins
- Aggregate functions
- GROUP BY and HAVING
- Subqueries
- Views
- Stored procedure
- Transactions
- Triggers
- Status history tracking
- Automated reward generation

---

## 🔄 How CivicConnect Works

```text
Citizen
   ↓
Report Civic Issue
   ↓
Select Category + Location + Priority
   ↓
Backend API
   ↓
MySQL Database
   ↓
Admin Reviews Issue
   ↓
Status Updated
   ↓
Reported → In Progress → Resolved
   ↓
Status History Updated
   ↓
Reward Points Generated
   ↓
Citizen Tracks Resolution
🏗️ System Architecture
┌───────────────────────────────┐
│           Frontend            │
│      HTML + CSS + JavaScript  │
└───────────────┬───────────────┘
                │
                │ REST API
                ↓
┌───────────────────────────────┐
│           Backend             │
│      Node.js + Express.js     │
└───────────────┬───────────────┘
                │
                │ SQL
                ↓
┌───────────────────────────────┐
│          MySQL Database       │
│                               │
│ Users                         │
│ Departments                   │
│ Categories                    │
│ Issues                        │
│ Status_History                │
│ Rewards_Log                   │
└───────────────────────────────┘
📁 Project Structure
CivicConnect/
│
├── frontend/
│   ├── front.html
│   ├── report.html
│   ├── tracking.html
│   ├── liveMap.html
│   ├── Admin.html
│   │
│   ├── css/
│   │   ├── frontstyle.css
│   │   ├── report.css
│   │   ├── tracking.css
│   │   ├── livemap.css
│   │   └── Admin.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .gitignore
│
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│   ├── queries.sql
│   ├── views.sql
│   ├── procedures.sql
│   └── triggers.sql
│
├── .gitignore
└── README.md
🖥️ Application Pages
🏠 Home Page

Provides the main entry point to CivicConnect and navigation to the platform's major features.

📝 Report Issue

Citizens can submit civic issues by providing:

Issue category
Description
Location
Latitude
Longitude
Priority

A unique Report ID is generated for tracking the submitted issue.

🔎 Track Report

Citizens can enter their Report ID to view:

Issue details
Current status
Status timeline
Resolution progress
🗺️ Live Map

Displays reported civic issues geographically using an interactive map.

The map uses issue location data stored in the database.

📊 Admin Dashboard

The administrator can:

View total reports
View resolved reports
View active users
View issue records
Filter reports
Update issue status
Monitor issue information
🗄️ Database Design

CivicConnect uses a relational MySQL database with six core tables.

Table	Purpose
Users	Stores citizen/user information
Departments	Stores departments responsible for issues
Categories	Stores civic issue categories
Issues	Stores reported civic issues
Status_History	Maintains the history of issue status changes
Rewards_Log	Stores reward points generated for resolved issues
Relationship Overview
Users
  │
  ├───────────────┐
  │               │
  ↓               ↓
Issues        Rewards_Log
  │
  ├──────────────→ Categories
  │
  ├──────────────→ Departments
  │
  └──────────────→ Status_History
🔑 DBMS Concepts Implemented

CivicConnect demonstrates several important DBMS concepts.

Primary Keys

Each major entity has a unique identifier used as its primary key.

Foreign Keys

Relationships between users, issues, categories, departments, status history, and rewards are maintained using foreign keys.

Constraints

The database uses constraints to maintain data integrity, including:

PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
CHECK
SQL Operations

The project includes:

SELECT
INSERT
UPDATE
DELETE
Joins

The database uses:

INNER JOIN
LEFT JOIN
Aggregate Functions

Examples include:

COUNT()
SUM()
AVG()
MAX()
MIN()
GROUP BY and HAVING

Used for analyzing and filtering grouped data.

Subqueries

Used for retrieving data based on results from other queries.

Views

The project implements:

vw_IssueDetails
vw_UnresolvedIssues
⚙️ Stored Procedure

The project implements the stored procedure:

sp_SubmitIssue

The procedure handles issue submission as a database transaction.

It:

Accepts issue information.
Generates a Report ID.
Inserts the issue into the Issues table.
Creates the initial status history entry.
Commits the transaction.
Rolls back the transaction if an SQL error occurs.
🔔 Trigger

The project implements:

trg_IssueResolved_Reward

When an issue changes to Resolved, the trigger:

Records the status change in Status_History
Adds the applicable reward entry to Rewards_Log
Prevents duplicate reward entries for the same resolved issue

The current reward logic awards 100 points when an eligible issue is resolved.

🌐 REST API

The Node.js backend provides REST API endpoints for communication between the frontend and database.

Method	Endpoint	Purpose
GET	/	Check backend status
GET	/api/categories	Get issue categories
GET	/api/departments	Get departments
GET	/api/issues	Get issues
POST	/api/issues	Submit a new issue
GET	/api/issues/:reportId	Track an issue
GET	/api/admin/stats	Get admin statistics
GET	/api/admin/issues	Get admin issue records
PUT	/api/issues/:reportId/status	Update issue status
🛠️ Technology Stack
Frontend
HTML5
CSS3
JavaScript
Leaflet.js
Backend
Node.js
Express.js
REST APIs
CORS
dotenv
Database
MySQL
Development & Deployment
Visual Studio Code
Git
GitHub
Vercel
Railway
🚀 Run the Project Locally
Prerequisites

Make sure the following are installed:

Node.js
MySQL
Git
Visual Studio Code
1. Clone the Repository
git clone https://github.com/anushkathorat23/CivicConnect.git
cd CivicConnect
2. Set Up the Database

CivicConnect uses MySQL as its database.

The database/ folder contains:

schema.sql - Creates the database tables and relationships
sample_data.sql - Inserts sample data
queries.sql - Contains SQL queries used in the project
views.sql - Creates database views
procedures.sql - Creates the stored procedure
triggers.sql - Creates database triggers

Create the CivicConnectDB database in MySQL and execute the required SQL files from the database/ folder.

3. Configure the Backend

Open the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file with your MySQL configuration:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=CivicConnectDB
DB_PORT=3306

Important: Never commit .env to GitHub because it contains database credentials.

4. Start the Backend
node server.js

The backend runs on:

http://localhost:5000

5. Run the Frontend

Open the frontend folder in Visual Studio Code and launch front.html.

The project can be run using the Live Server extension.

When running locally, the frontend automatically connects to:

http://localhost:5000/api

☁️ Deployment

CivicConnect follows this deployment architecture:

                Internet
                   │
                   ↓
        ┌────────────────────┐
        │       Vercel       │
        │      Frontend      │
        └─────────┬──────────┘
                  │
                  │ HTTPS / REST API
                  ↓
        ┌────────────────────┐
        │      Railway       │
        │ Node.js + Express  │
        └─────────┬──────────┘
                  │
                  │ SQL
                  ↓
        ┌────────────────────┐
        │      Railway       │
        │       MySQL        │
        └────────────────────┘
Live Project

Frontend:
https://frontend-sepia-xi-75.vercel.app/front.html

Backend:
https://backend-production-0c6b2.up.railway.app

GitHub Repository:
https://github.com/anushkathorat23/CivicConnect

🧪 Testing & Verification

The application has been tested for:

Frontend page loading
Backend API connectivity
MySQL database connectivity
Issue submission
Report ID generation
Issue tracking
Admin issue retrieval
Admin status updates
Status history generation
Reward trigger execution
Duplicate reward prevention
Live map issue display
Resolved issue handling
Navigation between application pages
Complete end-to-end user flow
Verified End-to-End Flow
Report Issue
     ↓
Report ID Generated
     ↓
Track Report
     ↓
Admin Reviews Issue
     ↓
In Progress
     ↓
Resolved
     ↓
Status History Updated
     ↓
Reward Trigger Executed
     ↓
Issue Reflected on Live Map
🎯 Project Objectives
Provide a centralized platform for reporting civic issues.
Simplify communication between citizens and administrators.
Allow citizens to track the progress of reported issues.
Provide administrators with a centralized issue management dashboard.
Display reported issues geographically using an interactive map.
Demonstrate practical implementation of DBMS concepts.
Maintain issue status history for better transparency.
Encourage civic participation through a reward mechanism.
🔮 Future Enhancements

Possible future improvements include:

User authentication and role-based access
Mobile application
Real-time notifications
Email and SMS notifications
AI-based issue categorization
Image-based issue verification
Advanced analytics and reporting
Improved geolocation features
Extended citizen reward and achievement system
Scalable cloud infrastructure
📚 DBMS Learning Outcomes

CivicConnect demonstrates the practical application of:

Relational Database Design
        ↓
Normalization
        ↓
Primary & Foreign Keys
        ↓
SQL Queries
        ↓
Joins & Aggregation
        ↓
Views
        ↓
Stored Procedures
        ↓
Transactions
        ↓
Triggers
        ↓
Database-Backend Integration
👩‍💻 Project
CivicConnect

Smart Civic Issue Reporting & Management Platform

GitHub Repository:
https://github.com/anushkathorat23/CivicConnect
