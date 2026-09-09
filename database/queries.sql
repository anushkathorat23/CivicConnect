USE CivicConnectDB;

-- 1. Basic SELECT: Get all citizens ordered by highest points (calculated dynamically from Rewards_Log)
SELECT u.name, COALESCE(SUM(r.points_awarded), 0) AS total_points 
FROM Users u
LEFT JOIN Rewards_Log r ON u.user_id = r.user_id
WHERE u.role = 'Citizen' 
GROUP BY u.user_id
ORDER BY total_points DESC;

-- 2. INSERT: Add a new user
INSERT INTO Users (name, phone_number, email) 
VALUES ('Anil Kapoor', '9988776655', 'anil@example.com');

-- 3. UPDATE: Update a user's phone number (Assuming Anil got user_id 14)
UPDATE Users 
SET phone_number = '9988776600' 
WHERE name = 'Anil Kapoor';

-- 4. DELETE: Delete a user who requested account deletion
DELETE FROM Users 
WHERE name = 'Anil Kapoor';

-- 5. INNER JOIN: Get issue details along with citizen name and category name
SELECT i.report_id, u.name AS citizen_name, c.category_name, i.current_status
FROM Issues i
INNER JOIN Users u ON i.user_id = u.user_id
INNER JOIN Categories c ON i.category_id = c.category_id;

-- 6. LEFT JOIN: Get all departments and count of issues they are handling (even if 0)
SELECT d.dept_name, COUNT(i.issue_id) AS total_issues
FROM Departments d
LEFT JOIN Categories c ON d.dept_id = c.dept_id
LEFT JOIN Issues i ON c.category_id = i.category_id
GROUP BY d.dept_name;

-- 7. Aggregate functions: Calculate total points awarded across the entire platform
SELECT SUM(points_awarded) AS platform_total_points
FROM Rewards_Log;

-- 8. GROUP BY: Get the count of issues per category for Admin Charts
SELECT c.category_name, COUNT(i.issue_id) AS issue_count
FROM Issues i
JOIN Categories c ON i.category_id = c.category_id
GROUP BY c.category_name;

-- 9. HAVING: Find users who have earned more than 50 points
SELECT u.name, SUM(r.points_awarded) as total_earned
FROM Users u
JOIN Rewards_Log r ON u.user_id = r.user_id
GROUP BY u.user_id
HAVING total_earned > 50;

-- 10. Subqueries: Find the issue that was reported most recently
SELECT report_id, description, created_at
FROM Issues
WHERE created_at = (SELECT MAX(created_at) FROM Issues);

-- 10b. Subqueries: Find citizens who have reported at least one 'Critical' priority issue
SELECT name 
FROM Users 
WHERE user_id IN (
    SELECT user_id FROM Issues WHERE priority = 'Critical'
);
