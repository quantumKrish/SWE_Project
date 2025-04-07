-- Create Database
CREATE DATABASE IF NOT EXISTS petminder;
USE petminder;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255),
    `phoneNumber` VARCHAR(15),
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `address` TEXT,
    `verified` BOOLEAN DEFAULT FALSE,
    `language` VARCHAR(50),
    `role` ENUM('owner', 'minder', 'admin', 'user') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `send_id` INT NOT NULL,
  `receive_id` INT NOT NULL,
  `message` TEXT NOT NULL
);

-- Pet Minder table
CREATE TABLE IF NOT EXISTS `petMinder` (
    `minderID` INT AUTO_INCREMENT PRIMARY KEY,
    `id` INT NOT NULL,
    `description` TEXT,
    `availability` TEXT,
    `ratings` FLOAT DEFAULT 0,
    `latitude` DECIMAL(9,6),
    `longitude` DECIMAL(9,6),
    `locationUpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Pet Owner table
CREATE TABLE IF NOT EXISTS `petOwner` (
    `ownerID` INT AUTO_INCREMENT PRIMARY KEY,
    `id` INT NOT NULL,
    `ratings` FLOAT DEFAULT 0,
    FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Admin table
CREATE TABLE IF NOT EXISTS `admin` (
    `adminID` INT AUTO_INCREMENT PRIMARY KEY,
    `id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Report table
CREATE TABLE IF NOT EXISTS `report` (
    `reportID` INT AUTO_INCREMENT PRIMARY KEY,
    `reportedBy` INT NOT NULL,
    `reportedUser` INT NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('pending', 'resolved', 'closed') DEFAULT 'pending',
    FOREIGN KEY (`reportedBy`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reportedUser`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Booking table
CREATE TABLE IF NOT EXISTS `booking` (
    `bookingID` INT AUTO_INCREMENT PRIMARY KEY,
    `ownerID` INT NOT NULL,
    `minderID` INT NOT NULL,
    `petID` INT NOT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'canceled', 'rejected') DEFAULT 'pending',
    `timeSlot` TIMESTAMP,
    `duration` INT NOT NULL,
    `checklist` TEXT,
    FOREIGN KEY (`ownerID`) REFERENCES `petOwner`(`ownerID`) ON DELETE CASCADE,
    FOREIGN KEY (`minderID`) REFERENCES `petMinder`(`minderID`) ON DELETE CASCADE
);

-- Payment table
CREATE TABLE IF NOT EXISTS `payment` (
    `paymentID` INT AUTO_INCREMENT PRIMARY KEY,
    `bookingID` INT NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `method` ENUM('credit_card', 'paypal', 'bank_transfer') NOT NULL,
    `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    FOREIGN KEY (`bookingID`) REFERENCES `booking`(`bookingID`) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS `reviews` (
    `reviewID` INT AUTO_INCREMENT PRIMARY KEY,
    `reviewerID` INT NOT NULL,  -- User leaving the review
    `reviewedUserID` INT NOT NULL,  -- User being reviewed
    `bookingID` INT NOT NULL,  -- Links to the booking
    `rating` FLOAT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),  -- Rating 1-5
    `comment` TEXT,  -- Optional comment
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`reviewerID`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reviewedUserID`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`bookingID`) REFERENCES `booking`(`bookingID`) ON DELETE CASCADE
);

-- Pet table
CREATE TABLE IF NOT EXISTS `pet` (
    `petID` INT AUTO_INCREMENT PRIMARY KEY,
    `ownerID` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` ENUM('dog', 'cat', 'other') NOT NULL,
    `breed` VARCHAR(255),
    `age` INT,
    `weight` DECIMAL(5, 2),
    `description` TEXT,
    FOREIGN KEY (`ownerID`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
