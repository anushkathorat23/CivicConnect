-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS CivicConnectDB;
USE CivicConnectDB;

-- 2. Create Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('Citizen', 'Admin') DEFAULT 'Citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Departments Table
CREATE TABLE Departments (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100) UNIQUE NOT NULL,
    contact_email VARCHAR(100)
);

-- 4. Create Categories Table
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    dept_id INT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 5. Create Issues Table
CREATE TABLE Issues (
    issue_id INT PRIMARY KEY AUTO_INCREMENT,
    report_id VARCHAR(20) UNIQUE NOT NULL,
    user_id INT, -- Allowed to be NULL if a user deletes their account
    category_id INT NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    photo_url VARCHAR(255),
    priority ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    current_status ENUM('Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected') DEFAULT 'Reported',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE RESTRICT,
    CHECK (latitude BETWEEN -90 AND 90),
    CHECK (longitude BETWEEN -180 AND 180)
);

-- 6. Create Status_History Table
CREATE TABLE Status_History (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    issue_id INT NOT NULL,
    status_state ENUM('Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected') NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    FOREIGN KEY (issue_id) REFERENCES Issues(issue_id) ON DELETE CASCADE
);

-- 7. Create Rewards_Log Table
CREATE TABLE Rewards_Log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    issue_id INT UNIQUE NOT NULL, -- Ensures ONLY ONE reward is ever given per issue
    points_awarded INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (issue_id) REFERENCES Issues(issue_id) ON DELETE CASCADE
);
