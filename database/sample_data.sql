USE CivicConnectDB;

-- Insert Departments
INSERT INTO Departments (dept_name, contact_email) VALUES
('Public Works', 'roads@civicconnect.gov.in'),
('Sanitation', 'waste@civicconnect.gov.in'),
('Electricity', 'power@civicconnect.gov.in'),
('Water Department', 'water@civicconnect.gov.in');

-- Insert Categories
INSERT INTO Categories (category_name, dept_id) VALUES
('Pothole', 1),
('Road Damage', 1),
('Drainage', 1),
('Garbage', 2),
('Streetlight', 3),
('Water Leakage', 4);

-- Insert Users (Citizens and Admins)
INSERT INTO Users (name, phone_number, email, role) VALUES
('Ravi Kumar', '9876543210', 'ravi@example.com', 'Citizen'),
('Priya Singh', '8765432109', 'priya@example.com', 'Citizen'),
('Amit Patel', '7654321098', 'amit@example.com', 'Citizen'),
('Neha Sharma', '9988776655', 'neha@example.com', 'Citizen'),
('Arjun Das', '9123456780', 'arjun@example.com', 'Citizen'),
('Sneha Reddy', '8123456781', 'sneha@example.com', 'Citizen'),
('Vikram Gupta', '7123456782', 'vikram@example.com', 'Citizen'),
('Meera Nair', '6123456783', 'meera@example.com', 'Citizen'),
('Rahul Verma', '9234567890', 'rahul@example.com', 'Citizen'),
('Anjali Bose', '8234567891', 'anjali@example.com', 'Citizen'),
('Karan Johar', '7234567892', 'karan@example.com', 'Citizen'),
('Admin Officer 1', '1122334455', 'admin1@civicconnect.gov.in', 'Admin'),
('Admin Officer 2', '2233445566', 'admin2@civicconnect.gov.in', 'Admin');

-- Insert Issues (20 demo issues)
INSERT INTO Issues (report_id, user_id, category_id, description, latitude, longitude, priority, current_status, created_at, resolved_at) VALUES
('JH-2026-001', 1, 1, 'Large pothole on Station Road', 23.344100, 85.309600, 'High', 'Reported', '2026-09-01 10:00:00', NULL),
('JH-2026-002', 2, 4, 'Garbage not collected for 3 days', 22.804600, 86.202900, 'Medium', 'Acknowledged', '2026-09-02 11:30:00', NULL),
('JH-2026-003', 1, 5, 'Broken streetlight near City Mall', 23.795700, 86.430400, 'Medium', 'In Progress', '2026-09-03 14:15:00', NULL),
('JH-2026-004', 3, 6, 'Water leakage from main pipe', 23.669300, 86.151100, 'Critical', 'Resolved', '2026-08-25 09:00:00', '2026-08-27 16:00:00'),
('JH-2026-005', 4, 2, 'Road completely damaged after rain', 23.355100, 85.319600, 'Critical', 'In Progress', '2026-09-01 08:00:00', NULL),
('JH-2026-006', 5, 3, 'Clogged drainage causing flood', 22.814600, 86.212900, 'High', 'Acknowledged', '2026-09-03 10:30:00', NULL),
('JH-2026-007', 6, 1, 'Small pothole on 4th Avenue', 23.805700, 86.440400, 'Low', 'Resolved', '2026-08-20 14:15:00', '2026-08-22 10:00:00'),
('JH-2026-008', 7, 4, 'Overflowing dumpster at market', 23.679300, 86.161100, 'High', 'Reported', '2026-09-04 09:00:00', NULL),
('JH-2026-009', 8, 5, 'Streetlight flickering', 23.364100, 85.329600, 'Low', 'Reported', '2026-09-04 11:00:00', NULL),
('JH-2026-010', 9, 6, 'No water supply in block C', 22.824600, 86.222900, 'Critical', 'In Progress', '2026-09-02 08:30:00', NULL),
('JH-2026-011', 10, 1, 'Multiple potholes near school', 23.815700, 86.450400, 'High', 'Resolved', '2026-08-15 14:15:00', '2026-08-18 16:00:00'),
('JH-2026-012', 11, 4, 'Garbage truck missed our street', 23.689300, 86.171100, 'Medium', 'Resolved', '2026-08-28 09:00:00', '2026-08-29 12:00:00'),
('JH-2026-013', 1, 3, 'Drain cover missing', 23.374100, 85.339600, 'Critical', 'Acknowledged', '2026-09-03 15:00:00', NULL),
('JH-2026-014', 2, 5, 'Entire street dark', 22.834600, 86.232900, 'High', 'In Progress', '2026-09-01 19:30:00', NULL),
('JH-2026-015', 3, 2, 'Sidewalk caved in', 23.825700, 86.460400, 'High', 'Reported', '2026-09-04 07:15:00', NULL),
('JH-2026-016', 4, 6, 'Tap water is muddy', 23.699300, 86.181100, 'High', 'Resolved', '2026-08-10 09:00:00', '2026-08-12 11:00:00'),
('JH-2026-017', 5, 1, 'Pothole causing accidents', 23.384100, 85.349600, 'Critical', 'In Progress', '2026-09-02 12:00:00', NULL),
('JH-2026-018', 6, 4, 'Illegal dumping near park', 22.844600, 86.242900, 'High', 'Acknowledged', '2026-09-03 08:30:00', NULL),
('JH-2026-019', 7, 5, 'Light pole leaning', 23.835700, 86.470400, 'Critical', 'Reported', '2026-09-04 10:15:00', NULL),
('JH-2026-020', 8, 3, 'Water logging on main road', 23.709300, 86.191100, 'High', 'Resolved', '2026-08-05 09:00:00', '2026-08-06 15:00:00');

-- Insert Status History
-- (Only partial history shown for brevity, but all have at least 'Reported')
INSERT INTO Status_History (issue_id, status_state, updated_at, remarks) VALUES
(1, 'Reported', '2026-09-01 10:00:00', 'Issue submitted by citizen.'),
(2, 'Reported', '2026-09-02 11:30:00', 'Issue submitted by citizen.'),
(2, 'Acknowledged', '2026-09-02 15:00:00', 'Sanitation team notified.'),
(3, 'Reported', '2026-09-03 14:15:00', 'Issue submitted by citizen.'),
(3, 'Acknowledged', '2026-09-03 16:00:00', 'Assigned to technician.'),
(3, 'In Progress', '2026-09-04 10:00:00', 'Technician on site.'),
(4, 'Reported', '2026-08-25 09:00:00', 'Issue submitted by citizen.'),
(4, 'Acknowledged', '2026-08-25 10:30:00', 'Water board notified.'),
(4, 'In Progress', '2026-08-26 09:00:00', 'Repair started.'),
(4, 'Resolved', '2026-08-27 16:00:00', 'Pipe fixed successfully.'),
(7, 'Reported', '2026-08-20 14:15:00', 'Submitted'),
(7, 'Resolved', '2026-08-22 10:00:00', 'Pothole filled.'),
(11, 'Reported', '2026-08-15 14:15:00', 'Submitted'),
(11, 'Resolved', '2026-08-18 16:00:00', 'Fixed.'),
(12, 'Reported', '2026-08-28 09:00:00', 'Submitted'),
(12, 'Resolved', '2026-08-29 12:00:00', 'Garbage cleared.'),
(16, 'Reported', '2026-08-10 09:00:00', 'Submitted'),
(16, 'Resolved', '2026-08-12 11:00:00', 'Water cleared.'),
(20, 'Reported', '2026-08-05 09:00:00', 'Submitted'),
(20, 'Resolved', '2026-08-06 15:00:00', 'Drainage cleared.');

-- Insert Rewards Log (Only for Resolved issues: 4, 7, 11, 12, 16, 20)
-- Note: User 3 gets reward for Issue 4.
INSERT INTO Rewards_Log (user_id, issue_id, points_awarded, reason, earned_at) VALUES
(3, 4, 100, 'Issue Resolved Bonus', '2026-08-27 16:00:00'),
(6, 7, 100, 'Issue Resolved Bonus', '2026-08-22 10:00:00'),
(10, 11, 100, 'Issue Resolved Bonus', '2026-08-18 16:00:00'),
(11, 12, 100, 'Issue Resolved Bonus', '2026-08-29 12:00:00'),
(4, 16, 100, 'Issue Resolved Bonus', '2026-08-12 11:00:00'),
(8, 20, 100, 'Issue Resolved Bonus', '2026-08-06 15:00:00');
