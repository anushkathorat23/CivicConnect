USE CivicConnectDB;

-- Trigger: trg_IssueResolved_Reward
-- Use case: Whenever an issue's status is changed to 'Resolved', 
-- automatically give the citizen 100 reward points.

DELIMITER //

CREATE TRIGGER trg_IssueResolved_Reward
AFTER UPDATE ON Issues
FOR EACH ROW
BEGIN
    DECLARE reward_already_given INT DEFAULT 0;

    -- Only run this logic if the status actually changed to 'Resolved' and user exists
    IF NEW.current_status = 'Resolved' AND OLD.current_status <> 'Resolved' AND NEW.user_id IS NOT NULL THEN
        
        -- Check if a reward was already given for this specific issue.
        -- This prevents duplicate points if an issue goes Resolved -> In Progress -> Resolved.
        SELECT COUNT(*) INTO reward_already_given 
        FROM Rewards_Log 
        WHERE issue_id = NEW.issue_id;
        
        -- If no reward exists yet, insert exactly one.
        IF reward_already_given = 0 THEN
            INSERT INTO Rewards_Log (user_id, issue_id, points_awarded, reason)
            VALUES (NEW.user_id, NEW.issue_id, 100, 'Issue Resolved Bonus');
        END IF;
        
    END IF;
    
    -- Consistency Fix: Automatically log any status change in Status_History
    -- so that Issues and Status_History never become desynchronized.
    -- This ONLY fires when the status itself changes (not location/priority/etc).
    IF NEW.current_status <> OLD.current_status THEN
        INSERT INTO Status_History (issue_id, status_state, remarks)
        VALUES (NEW.issue_id, NEW.current_status, CONCAT('Status updated to ', NEW.current_status));
    END IF;
    
END //

DELIMITER ;
