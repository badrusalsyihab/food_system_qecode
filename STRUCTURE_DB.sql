-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for restaurant_food_ordering
CREATE DATABASE IF NOT EXISTS `restaurant_food_ordering` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurant_food_ordering`;

-- Dumping structure for table restaurant_food_ordering.menu_categories
CREATE TABLE IF NOT EXISTS `menu_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `display_order` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table restaurant_food_ordering.menu_categories: ~2 rows (approximately)
INSERT INTO `menu_categories` (`id`, `name`, `display_order`) VALUES
	(1, 'category1', 1),
	(2, 'category2', 2);

-- Dumping structure for table restaurant_food_ordering.menu_items
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table restaurant_food_ordering.menu_items: ~1 rows (approximately)
INSERT INTO `menu_items` (`id`, `category_id`, `name`, `description`, `price`, `is_available`, `image_url`) VALUES
	(1, 1, 'Donat', 'Donat gireng', 10000.00, 1, NULL);

-- Dumping structure for table restaurant_food_ordering.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_id` int NOT NULL,
  `status` enum('pending','preparing','ready','delivered') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `special_requests` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table restaurant_food_ordering.orders: ~0 rows (approximately)

-- Dumping structure for table restaurant_food_ordering.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `special_request` text,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table restaurant_food_ordering.order_items: ~0 rows (approximately)

-- Dumping structure for table restaurant_food_ordering.tables
CREATE TABLE IF NOT EXISTS `tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_number` varchar(10) NOT NULL,
  `qr_code` varchar(255) NOT NULL,
  `is_occupied` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_number` (`table_number`),
  UNIQUE KEY `qr_code` (`qr_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table restaurant_food_ordering.tables: ~2 rows (approximately)
INSERT INTO `tables` (`id`, `table_number`, `qr_code`, `is_occupied`) VALUES
	(1, 'T1', 'tableT1.png', 0),
	(2, 'T2', 'tableT2.png', 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
