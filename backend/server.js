const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- GET / (Health Check) ---
app.get('/', (req, res) => {
    res.send('CivicConnect Backend is Running!');
});

// --- GET /api/categories ---
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Categories');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong fetching categories' });
    }
});

// --- GET /api/departments ---
app.get('/api/departments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Departments');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong fetching departments' });
    }
});

// --- GET /api/issues ---
app.get('/api/issues', async (req, res) => {
    try {
        const query = `
            SELECT i.*, c.category_name, d.dept_name, u.name AS citizen_name
            FROM Issues i
            JOIN Categories c ON i.category_id = c.category_id
            JOIN Departments d ON c.dept_id = d.dept_id
            LEFT JOIN Users u ON i.user_id = u.user_id
            ORDER BY i.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong fetching issues' });
    }
});

// --- GET /api/issues/:reportId ---
app.get('/api/issues/:reportId', async (req, res) => {
    const { reportId } = req.params;
    try {
        const query = `
            SELECT i.*, c.category_name, d.dept_name, u.name AS citizen_name
            FROM Issues i
            JOIN Categories c ON i.category_id = c.category_id
            JOIN Departments d ON c.dept_id = d.dept_id
            LEFT JOIN Users u ON i.user_id = u.user_id
            WHERE i.report_id = ?
        `;
        const [issues] = await db.query(query, [reportId]);
        
        if (issues.length === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        const issue = issues[0];
        
        // Fetch status history
        const [history] = await db.query('SELECT * FROM Status_History WHERE issue_id = ? ORDER BY updated_at ASC', [issue.issue_id]);
        
        res.json({ ...issue, history });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong fetching the issue' });
    }
});

// --- POST /api/issues ---
app.post('/api/issues', async (req, res) => {
    // Basic validation
    const { user_id, category_id, description, latitude, longitude, priority } = req.body;
    
    // For demo purposes, if user_id is not provided, we might default it or require it.
    // The frontend should ideally pass this. We will assume user_id=1 for testing if missing.
    const uid = user_id || 1; 

    try {
        const [results] = await db.query(
            'CALL sp_SubmitIssue(?, ?, ?, ?, ?, ?)',
            [uid, category_id, description, latitude, longitude, priority]
        );
        
        // Stored procedure returns multiple result sets. The first one contains NewReportID.
        if (results && results[0] && results[0][0] && results[0][0].NewReportID) {
            res.json({ success: true, report_id: results[0][0].NewReportID });
        } else {
            res.status(500).json({ error: 'Failed to generate report ID' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong submitting the issue' });
    }
});

// --- PUT /api/issues/:reportId/status ---
app.put('/api/issues/:reportId/status', async (req, res) => {
    const { reportId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const [result] = await db.query(
            'UPDATE Issues SET current_status = ? WHERE report_id = ?',
            [status, reportId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        res.json({ success: true, message: 'Status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong updating status' });
    }
});

// --- GET /api/admin/stats ---
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [totalIssues] = await db.query('SELECT COUNT(*) as count FROM Issues');
        const [resolvedIssues] = await db.query('SELECT COUNT(*) as count FROM Issues WHERE current_status = "Resolved"');
        const [pendingIssues] = await db.query('SELECT COUNT(*) as count FROM Issues WHERE current_status != "Resolved" AND current_status != "Rejected"');
        const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM Users');

        res.json({
            total_issues: totalIssues[0].count,
            resolved_issues: resolvedIssues[0].count,
            pending_issues: pendingIssues[0].count,
            total_users: totalUsers[0].count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong fetching stats' });
    }
});

// --- GET /api/admin/issues ---
app.get('/api/admin/issues', async (req, res) => {
    try {
        const query = `
            SELECT i.report_id, u.name AS citizen_name, c.category_name, i.priority, i.current_status, i.created_at
            FROM Issues i
            LEFT JOIN Users u ON i.user_id = u.user_id
            JOIN Categories c ON i.category_id = c.category_id
            ORDER BY i.created_at DESC
            LIMIT 20
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong fetching admin issues' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend server is running on http://localhost:${port}`);
});
