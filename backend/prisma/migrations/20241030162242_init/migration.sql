-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `role` ENUM('STUDENT', 'PROFESSOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
