/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password_hash` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Users` table. All the data in the column will be lost.
  - The required column `id` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    DROP COLUMN `password_hash`,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `username` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
