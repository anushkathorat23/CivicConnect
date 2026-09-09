# CivicConnect - DBMS Academic Project

This directory contains the MySQL database design and SQL implementation for the **CivicConnect** project.

## Table Structure (3NF Normalized)

The database consists of 6 core tables.
1. **Users**: Stores citizens and admins. (`user_id` PK)
2. **Departments**: Stores government departments handling issues. (`dept_id` PK)
3. **Categories**: Stores issue types (Pothole, Garbage) and links them to a specific department. (`category_id` PK, `dept_id` FK)
4. **Issues**: The central table storing reported civic problems. (`issue_id` PK, `user_id` FK, `category_id` FK)
5. **Status_History**: Tracks every status change of an issue (Reported ➔ Acknowledged ➔ In Progress ➔ Resolved). (`history_id` PK, `issue_id` FK)
6. **Rewards_Log**: Logs points awarded to citizens for resolving issues. (`log_id` PK, `user_id` FK, `issue_id` FK)

### Why 3NF (Third Normal Form)?
*   **1NF (First Normal Form)**: All columns contain atomic (indivisible) values. There are no repeating groups.
*   **2NF (Second Normal Form)**: Meets 1NF, and all non-key attributes are fully functionally dependent on the primary key. We use auto-incremented primary keys (`issue_id`, `user_id`) to ensure this.
*   **3NF (Third Normal Form)**: Meets 2NF, and there are no transitive dependencies. 
    *   *Example 1*: An Issue belongs to a Category, and a Category belongs to a Department. If we put `dept_name` directly inside the `Issues` table, it would depend on the `category_id`, not the `issue_id` (a transitive dependency). By separating them into `Departments` ➔ `Categories` ➔ `Issues`, we achieve 3NF.
    *   *Example 2 (Points as a Derived Value)*: We removed `total_points` from the `Users` table. While not strictly required by 3NF, a user's total points is a derived value (the sum of their entries in the `Rewards_Log`). It was removed to avoid storing redundant data and to completely prevent any synchronization inconsistencies. We calculate it dynamically via SQL `SUM()` when needed.

### Key Design Decisions
*   **Why is Status History a separate table?** An issue changes status multiple times. If we only kept a `current_status` column in `Issues`, we would lose the historical timestamps of *when* it was acknowledged or resolved. The 1-to-Many relationship allows us to draw a timeline on the frontend tracking page.
*   **Why is Rewards_Log a separate table?** By logging each reward transaction individually, we have a verifiable audit trail. We strictly enforce a "one resolution reward per issue" rule by placing a `UNIQUE` constraint on `issue_id` inside the `Rewards_Log` table.
*   **Primary Key vs Report ID**: `issue_id` is an integer PK because integers are much faster for MySQL to index and join. `report_id` (like 'JH-2026-001') is kept as a `UNIQUE` string for human readability on the frontend search.
*   **Handling Deleted Users**: The foreign key `user_id` on the `Issues` table uses `ON DELETE SET NULL`. If a citizen deletes their account, the city still retains the record of the pothole to fix it, but it anonymizes the reporter.

## DBMS Concepts Implemented

### 1. Constraints
*   **PRIMARY KEY**: Uniquely identifies rows.
*   **FOREIGN KEY**: Enforces referential integrity.
*   **UNIQUE**: Ensures no two users share a phone number, and prevents duplicate rewards (`UNIQUE (issue_id)` in Rewards_Log).
*   **CHECK**: Ensures `latitude` is between -90 and 90, and `longitude` between -180 and 180.

### 2. Joins & Aggregation (`queries.sql`)
*   **INNER JOIN**: Used to fetch the full details of an issue.
*   **LEFT JOIN**: Used to dynamically calculate total points for a user (joining Users to Rewards_Log), ensuring even users with 0 rewards are listed.
*   **GROUP BY & HAVING**: Used to calculate data for Admin Charts (Issues per category) and finding users with points > 50.

### 3. Subqueries (`queries.sql`)
*   Used to dynamically find the most recently reported issue by comparing `created_at` against `MAX(created_at)`.

### 4. Views (`views.sql`)
*   `vw_IssueDetails`: Pre-joins Issues, Users, Categories, and Departments.
*   `vw_UnresolvedIssues`: Filters out 'Resolved' and 'Rejected' issues for map rendering.

### 5. Stored Procedures & Transactions (`procedures.sql`)
*   `sp_SubmitIssue`: Demonstrates a **Transaction** (`START TRANSACTION`, `COMMIT`, `ROLLBACK`). It calculates a human-readable `report_id`, inserts into `Issues`, grabs the `LAST_INSERT_ID()`, and inserts into `Status_History`.

### 6. Triggers (`triggers.sql`)
*   `trg_IssueResolved_Reward`: An `AFTER UPDATE` trigger on the `Issues` table. It performs two critical functions:
    1. **Reward Logic**: It counts if a reward already exists for this issue. If not, and the status changed to 'Resolved', it inserts 100 points into `Rewards_Log`. This completely prevents duplicate awards even if an issue toggles between states repeatedly.
    2. **Status Sync**: It automatically inserts a row into `Status_History` whenever an issue's status changes. This guarantees that `Issues.current_status` and the `Status_History` table can never become desynchronized, even if a DBA runs a manual `UPDATE` query.
