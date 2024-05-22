/*
  Warnings:

  - You are about to drop the column `posisition` on the `employees` table. All the data in the column will be lost.
  - You are about to alter the column `hire_date` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `status` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - Added the required column `position` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employees` DROP COLUMN `posisition`,
    ADD COLUMN `position` VARCHAR(100) NOT NULL,
    MODIFY `hire_date` DATETIME NOT NULL,
    MODIFY `status` ENUM('probation', 'kontrak', 'tetap') NOT NULL DEFAULT 'probation';

-- CreateTable
CREATE TABLE `failed_exported_employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `failed_reason` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
