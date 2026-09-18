# 🏙️ CivicConnect

### Smart Civic Issue Reporting & Management Platform

> **Report. Track. Resolve. Improve your community.**

CivicConnect is a web-based civic issue reporting and management platform that allows citizens to report local issues, track their complaints, and view their resolution status.

The platform provides an administrative dashboard for managing reported issues and uses a MySQL database to store users, departments, categories, issues, status history, and reward information.

---

## ✨ Features

### 👤 Citizen Features

- 📝 Report civic issues through an online form
- 📍 Submit issue location using latitude and longitude
- 🏷️ Select issue categories
- ⚡ Specify issue priority
- 🔎 Track submitted issues using a Report ID
- 📊 View issue status and progress
- 🗺️ View reported issues on an interactive map
- 🎁 Receive reward points when a reported issue is resolved

### 🛠️ Admin Features

- 📊 View overall issue statistics
- 📋 View all reported civic issues
- 🔍 Filter and manage reports
- 🔄 Update issue status
- 📈 View issue-related statistics
- 🗂️ Monitor issues according to their categories and departments

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

# 🔄 How CivicConnect Works

```text
Citizen
   │
   ▼
Report Civic Issue
   │
   ▼
Select Category + Location + Priority
   │
   ▼
Backend API
   │
   ▼
MySQL Database
   │
   ▼
Admin Reviews Issue
   │
   ▼
Status Updated
   │
   ├── Reported
   ├── In Progress
   └── Resolved
   │
   ▼
Status History Updated
   │
   ▼
Reward Points Generated
   │
   ▼
Citizen Tracks Resolution
🏗️ System Architecture
┌───────────────────────────────┐
│           Frontend            │
│      HTML + CSS + JavaScript  │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│           Backend             │
│      Node.js + Express.js     │
└───────────────┬───────────────┘
                │
                │ SQL
                ▼
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
│   ├── triggers.sql
│   └── README_DBMS.md
│
├── .gitignore
└── README.md
🖥️ Application Pages
🏠 Home Page

Provides the main entry point to CivicConnect and navigation to the platform's major features.

📝 Report Issue

Citizens can submit civic issues by providing information such as:

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

The project uses a relational MySQL database with six core tables.

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
  ▼               ▼
Issues        Rewards_Log
  │
  ├──────────────► Categories
  │
  ├──────────────► Departments
  │
  └──────────────► Status_History
🔑 DBMS Concepts Implemented

CivicConnect demonstrates several important DBMS concepts.

1. Primary Keys

Each major entity has a unique identifier used as its primary key.

2. Foreign Keys

Relationships between users, issues, categories, departments, status history, and rewards are maintained using foreign keys.

3. Constraints

The database uses constraints to maintain data integrity.

Examples include:

PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
CHECK
4. SQL Queries

The project includes SQL operations such as:

SELECT
INSERT
UPDATE
DELETE
5. Joins

The database uses:

INNER JOIN
LEFT JOIN

to combine information from multiple tables.

6. Aggregate Functions

Examples include:

COUNT()
SUM()
AVG()
MAX()
MIN()
7. GROUP BY and HAVING

Used for analyzing and filtering grouped data.

8. Subqueries

Used for retrieving data based on results from other queries.

9. Views

Two database views are implemented:

vw_IssueDetails
vw_UnresolvedIssues

These views simplify frequently used queries.

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

The trigger is executed when an issue is updated.

When an issue changes to:

Resolved

the trigger:

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
Development Tools
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