USE CivicConnectDB;

-- Stored Procedure: sp_SubmitIssue
-- Use case: When a citizen fills out the report.html form and clicks submit, 
-- this procedure inserts the Issue and its initial 'Reported' status in one transaction.

DELIMITER //

CREATE PROCEDURE sp_SubmitIssue(
    IN p_user_id INT,
    IN p_category_id INT,
    IN p_description TEXT,
    IN p_latitude DECIMAL(10, 6),
    IN p_longitude DECIMAL(10, 6),
    IN p_priority ENUM('Low', 'Medium', 'High', 'Critical')
)
BEGIN
    DECLARE new_issue_id INT;
    DECLARE next_seq INT;
    DECLARE generated_report_id VARCHAR(20);
    
    -- Start a transaction to ensure both inserts succeed or fail together
    START TRANSACTION;
    
    BEGIN
        -- Error handler: if any SQL error occurs, rollback the transaction
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 'Error: Issue submission failed. Transaction rolled back.' AS Message;
        END;
        
        -- Generate a human-readable report ID (e.g., JH-2026-001)
        SELECT IFNULL(MAX(issue_id), 0) + 1 INTO next_seq FROM Issues;
        SET generated_report_id = CONCAT('JH-', YEAR(CURDATE()), '-', LPAD(next_seq, 3, '0'));
        
        -- 1. Insert into Issues table
        INSERT INTO Issues (
            report_id, user_id, category_id, description, 
            latitude, longitude, priority, current_status
        ) VALUES (
            generated_report_id, p_user_id, p_category_id, p_description, 
            p_latitude, p_longitude, p_priority, 'Reported'
        );
        
        -- Get the auto-incremented issue_id of the row we just inserted
        SET new_issue_id = LAST_INSERT_ID();
        
        -- 2. Insert the initial state into Status_History
        INSERT INTO Status_History (issue_id, status_state, remarks) 
        VALUES (new_issue_id, 'Reported', 'Issue initially submitted by citizen.');
        
        -- If both succeeded, commit the transaction
        COMMIT;
        
        SELECT generated_report_id AS NewReportID, 'Success' AS Message;
    END;
END //

DELIMITER ;
