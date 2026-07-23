-- ==============================================================================
-- Smart Employee & Project Management System Database Script
-- Compatible with MySQL 8.0+ / 8.4
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `Employee_Management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `Employee_Management`;

-- ------------------------------------------------------------------------------
-- Table Structure: users
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `project_employees`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `audit_log`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) DEFAULT NULL,
    `last_name` VARCHAR(255) DEFAULT NULL,
    `department` VARCHAR(255) DEFAULT NULL,
    `designation` VARCHAR(255) DEFAULT NULL,
    `salary` DOUBLE DEFAULT NULL,
    `phone` VARCHAR(255) DEFAULT NULL,
    `hire_date` DATE DEFAULT NULL,
    `approved` BIT(1) NOT NULL DEFAULT b'1',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- Table Structure: user_roles
-- ------------------------------------------------------------------------------
CREATE TABLE `user_roles` (
    `user_id` BIGINT NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    KEY `fk_user_roles_user` (`user_id`),
    CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- Table Structure: projects
-- ------------------------------------------------------------------------------
CREATE TABLE `projects` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(2000) DEFAULT NULL,
    `status` VARCHAR(50) DEFAULT NULL,
    `priority` VARCHAR(50) DEFAULT NULL,
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- Table Structure: project_employees
-- ------------------------------------------------------------------------------
CREATE TABLE `project_employees` (
    `project_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
    PRIMARY KEY (`project_id`, `employee_id`),
    KEY `fk_project_employees_user` (`employee_id`),
    CONSTRAINT `fk_project_employees_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_project_employees_user` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- Table Structure: tasks
-- ------------------------------------------------------------------------------
CREATE TABLE `tasks` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(2000) DEFAULT NULL,
    `status` VARCHAR(50) DEFAULT NULL,
    `priority` VARCHAR(50) DEFAULT NULL,
    `deadline` DATE DEFAULT NULL,
    `remarks` VARCHAR(1000) DEFAULT NULL,
    `assigned_employee_id` BIGINT DEFAULT NULL,
    `project_id` BIGINT DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_tasks_employee` (`assigned_employee_id`),
    KEY `fk_tasks_project` (`project_id`),
    CONSTRAINT `fk_tasks_employee` FOREIGN KEY (`assigned_employee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_tasks_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- Table Structure: notifications
-- ------------------------------------------------------------------------------
CREATE TABLE `notifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` VARCHAR(1000) NOT NULL,
    `is_read` BIT(1) NOT NULL DEFAULT b'0',
    `type` VARCHAR(50) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_notifications_user` (`user_id`),
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- Table Structure: audit_log
-- ------------------------------------------------------------------------------
CREATE TABLE `audit_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `action` VARCHAR(255) DEFAULT NULL,
    `username` VARCHAR(255) DEFAULT NULL,
    `details` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- Seed Initial Data (DML)
-- ------------------------------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password`, `first_name`, `last_name`, `department`, `designation`, `salary`, `phone`, `hire_date`, `approved`) VALUES
(1, 'admin', 'admin@evernorth.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVym54n0ySg6Y.6.1J0O.YKG', 'System', 'Admin', 'Executive', 'System Admin', 1800000.0, '+1000000000', '2024-01-01', b'1'),
(2, 'john_doe', 'john.doe@evernorth.com', '$2a$10$e8w.p4eDkXg8j/2r9f3LceY8rS8zJ5O0e/5qX9y7Z.1K4.YKG', 'John', 'Doe', 'Engineering', 'Senior Developer', 950000.0, '+1000000001', '2024-02-15', b'1'),
(3, 'priya_r', 'priya.r@evernorth.com', '$2a$10$e8w.p4eDkXg8j/2r9f3LceY8rS8zJ5O0e/5qX9y7Z.1K4.YKG', 'Priya', 'R', 'Engineering', 'QA Engineer', 820000.0, '+1000000002', '2024-03-01', b'1');

INSERT INTO `user_roles` (`user_id`, `role`) VALUES
(1, 'ADMIN'),
(1, 'EMPLOYEE'),
(2, 'EMPLOYEE'),
(3, 'EMPLOYEE');

INSERT INTO `projects` (`id`, `name`, `description`, `status`, `priority`, `start_date`, `end_date`) VALUES
(1, 'Smart Portal Revamp', 'Comprehensive redesign and feature expansion of corporate employee portal.', 'IN_PROGRESS', 'HIGH', '2024-06-01', '2024-12-31');

INSERT INTO `project_employees` (`project_id`, `employee_id`) VALUES
(1, 2),
(1, 3);

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `priority`, `deadline`, `remarks`, `assigned_employee_id`, `project_id`) VALUES
(1, 'Implement portal features', 'Build core REST APIs and React UI components.', 'IN_PROGRESS', 'HIGH', '2024-08-15', 'Backend APIs completed, UI in progress', 2, 1),
(2, 'Test portal features', 'Execute end-to-end unit and integration test suite.', 'PENDING', 'MEDIUM', '2024-08-30', 'Awaiting feature completion', 3, 1);

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `is_read`, `type`, `created_at`) VALUES
(1, 1, 'Welcome Admin', 'Welcome to Smart Employee Management System!', b'0', 'SYSTEM', NOW()),
(2, 1, 'System Alert', 'New employee registration requests are pending review.', b'0', 'SYSTEM', NOW()),
(3, 2, 'Welcome John', 'Welcome to the platform. Check out your assigned tasks.', b'0', 'SYSTEM', NOW()),
(4, 2, 'Task Assigned', 'You have been assigned to task: Implement portal features', b'0', 'TASK', NOW()),
(5, 3, 'Welcome Priya', 'Welcome to the team! You have 1 new task assigned.', b'0', 'SYSTEM', NOW());
