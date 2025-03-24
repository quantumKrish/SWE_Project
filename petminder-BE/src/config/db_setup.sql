-- Create Database
CREATE DATABASE IF NOT EXISTS petminder;
USE petminder;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `userID` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `phoneNumber` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `address` TEXT,
    `verified` BOOLEAN DEFAULT FALSE,
    `language` VARCHAR(50),
    `role` ENUM('owner', 'minder', 'admin') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pet Minder table
CREATE TABLE IF NOT EXISTS `petMinder` (
    `minderID` INT AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `description` TEXT,
    `availability` TEXT,
    `ratings` FLOAT DEFAULT 0,
    FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE CASCADE
);

-- Pet Owner table
CREATE TABLE IF NOT EXISTS `petOwner` (
    `ownerID` INT AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `ratings` FLOAT DEFAULT 0,
    FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE CASCADE
);

-- Admin table
CREATE TABLE IF NOT EXISTS `admin` (
    `adminID` INT AUTO_INCREMENT PRIMARY KEY,
    `userID` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE CASCADE
);

-- Report table
CREATE TABLE IF NOT EXISTS `report` (
    `reportID` INT AUTO_INCREMENT PRIMARY KEY,
    `reportedBy` INT NOT NULL,
    `reportedUser` INT NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('pending', 'resolved', 'closed') DEFAULT 'pending',
    FOREIGN KEY (`reportedBy`) REFERENCES `users`(`userID`) ON DELETE CASCADE,
    FOREIGN KEY (`reportedUser`) REFERENCES `users`(`userID`) ON DELETE CASCADE
);

-- Booking table
CREATE TABLE IF NOT EXISTS `booking` (
    `bookingID` INT AUTO_INCREMENT PRIMARY KEY,
    `ownerID` INT NOT NULL,
    `minderID` INT NOT NULL,
    `petID` INT NOT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'canceled') DEFAULT 'pending',
    `timeSlot` TIMESTAMP,
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
    FOREIGN KEY (`reviewerID`) REFERENCES `users`(`userID`) ON DELETE CASCADE,
    FOREIGN KEY (`reviewedUserID`) REFERENCES `users`(`userID`) ON DELETE CASCADE,
    FOREIGN KEY (`bookingID`) REFERENCES `booking`(`bookingID`) ON DELETE CASCADE
);
