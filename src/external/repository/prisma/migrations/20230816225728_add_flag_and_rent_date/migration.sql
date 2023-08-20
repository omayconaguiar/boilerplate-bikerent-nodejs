-- AlterTable
ALTER TABLE `Bike` ADD COLUMN `is_available` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rented_untill` DATETIME(3) NULL;
