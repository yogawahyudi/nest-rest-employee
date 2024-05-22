-- CreateTable
CREATE TABLE `Employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(50) NOT NULL,
    `employee_number` VARCHAR(100) NOT NULL,
    `posisition` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `hire_date` DATETIME NOT NULL,
    `photo` VARCHAR(255) NOT NULL,
    `status` ENUM('Probation', 'Kontrak', 'Tetap') NOT NULL DEFAULT 'Probation',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `Employees_employee_number_key`(`employee_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
