USE CivicConnectDB;

-- 1. View: vw_IssueDetails
-- Combines Issues, Categories, Departments, and Users into a single readable table.
-- Useful for the Admin Dashboard to avoid writing complex JOINs repeatedly.
CREATE OR REPLACE VIEW vw_IssueDetails AS
SELECT 
    i.report_id,
    u.name AS reported_by,
    c.category_name,
    d.dept_name AS responsible_department,
    i.description,
    i.priority,
    i.current_status,
    i.created_at
FROM Issues i
LEFT JOIN Users u ON i.user_id = u.user_id
JOIN Categories c ON i.category_id = c.category_id
JOIN Departments d ON c.dept_id = d.dept_id;


-- 2. View: vw_UnresolvedIssues
-- Shows only the issues that need attention (not Resolved or Rejected).
-- Useful for the Live Map to easily fetch active pins without a WHERE clause every time.
CREATE OR REPLACE VIEW vw_UnresolvedIssues AS
SELECT 
    report_id,
    category_id,
    latitude,
    longitude,
    priority,
    current_status,
    created_at
FROM Issues
WHERE current_status NOT IN ('Resolved', 'Rejected');
