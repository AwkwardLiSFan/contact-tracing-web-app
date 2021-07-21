-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: covidApp
-- ------------------------------------------------------
-- Server version	8.0.19-0ubuntu5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `covidApp`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `covidApp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `covidApp`;

--
-- Table structure for table `Hotspot`
--

DROP TABLE IF EXISTS `Hotspot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Hotspot` (
  `h_id` int NOT NULL AUTO_INCREMENT,
  `v_id` int NOT NULL,
  `hotspot_intensity` int DEFAULT '1',
  PRIMARY KEY (`h_id`),
  KEY `v_id` (`v_id`),
  CONSTRAINT `Hotspot_ibfk_1` FOREIGN KEY (`v_id`) REFERENCES `Venue` (`venue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Hotspot`
--

LOCK TABLES `Hotspot` WRITE;
/*!40000 ALTER TABLE `Hotspot` DISABLE KEYS */;
INSERT INTO `Hotspot` VALUES (17,2,2),(18,3,2);
/*!40000 ALTER TABLE `Hotspot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `given_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(128) DEFAULT NULL,
  `email` varchar(128) NOT NULL,
  `phone_number` varchar(64) DEFAULT NULL,
  `password` varchar(160) DEFAULT NULL,
  `is_manager` tinyint(1) DEFAULT NULL,
  `is_official` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (42,'Soham','Sevak','s_sevak','soham.sevak@gmail.com','0444333222','$2b$10$Xx1BPU4vB0aOzPv6/nNwau8iVWnmiPCjQqBzgdOiieZvWZh4ycxBC',1,0),(43,'Tom','Zhu','t_zhu','abc@gamil.com','126126514124124','$2b$10$rsp1/7nkeEpoGYB64hE/8OdBuY7VOnTaoKcKXAX4q2MJJF/0WkILi',0,0),(44,'Bakery','Manager','bm','hello@example.com','0455667779','$2b$10$3/Y8aJogKDFuBWoTRR98be4xDTekplSTApJ.3emwRSjUhPcRgIllq',1,0),(45,'Museum','Guard','guard','guard@example.com','0456456456','$2b$10$D5na8XZVaV/lzFEBNrxp6uB.l7zGL5JQsQVmBF9aHKlBwisjBmB9u',1,0),(46,'Patrick','Miller','p_miller','patrick.miller@student.adelaide.edu.au','0499888776','$2b$10$RU.KF0piZaeG9BxfgiuDAeSPuNL.Aw9NRuspHf1Zhry8dh.dnzg/q',0,1),(50,'Admin','Sir','admin','admin@admin.com','0444555111','admin',0,1),(51,'jk','jk','jk','jk@gmail.com','4444555666','$2b$10$jlIDawy5A6Yo.ykYUlPBBeiqmTvZnPMC68s2jSl3zOTCzPhu1YOjm',0,0),(53,'john','smith','johnsmith','johnsmith@email.com','15691895601698','$2b$10$P2slLTur6pq59HtCo2eh4OsQati6kE4zubTjUXniQZEHgx3XKG2g6',0,0),(54,'tom','zhu','tomzhu1','a1770422@student.adelaide.edu.au','0515195681698','$2b$10$cIke6ubzGERbCQXGT6v58.XPAt1I38MYqkvNxK6rpaIhuXE9bRzeG',0,0),(55,'abc','abc','abc','auighu@gmail.com','1512512515','$2b$10$ht2vfpDe6lyzJ.MQQWACo.S4OV3ijoeUzIYCqQlX/CG5SB.t/15le',0,1),(57,'adc','adc','12345','ashdjas@gmail.com','04215818689168','$2b$10$9gKdfRd5hVrQnUfbTv.3b.zhd.J723krETq.BHc5.fwUnbUIF6C12',0,0),(58,'agg','agg','123456','aafbasg@gmai.com','519052195','$2b$10$w4EFQPJTakxXWQO0ywS1WejYhYegAx9XWSeSkbIflICzy/b7Cjo/i',0,0),(59,'asd','asd','asg','asda@gaqgag.com','12591285','$2b$10$FRiSh2bOnB881mdoF9R/Xe1RnyAJ1BWVl5C1DVbcUbSuriQfcrpvq',0,1);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Venue`
--

DROP TABLE IF EXISTS `Venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Venue` (
  `venue_id` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) NOT NULL,
  `venue_address` varchar(255) NOT NULL,
  `venue_capacity` int DEFAULT '10',
  `manager_id` int NOT NULL,
  `venue_phone` varchar(64) DEFAULT NULL,
  `venue_type` varchar(32) DEFAULT NULL,
  `venue_xcoordinate` double DEFAULT NULL,
  `venue_ycoordinate` double DEFAULT NULL,
  PRIMARY KEY (`venue_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `Venue_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `Venue_chk_1` CHECK ((`venue_capacity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Venue`
--

LOCK TABLES `Venue` WRITE;
/*!40000 ALTER TABLE `Venue` DISABLE KEYS */;
INSERT INTO `Venue` VALUES (1,'Capri Theatre','141 Goodwood Rd, Goodwood SA 5034',50,42,'(08)86453234','Cinema',138.59034729003906,-34.95238494873047),(2,'Army Museum of SA','16 Anzac Hwy, Everard Park SA 5035',500,45,'(08)83056374','Museum',138.58181762695312,-34.945735931396484),(3,'Patrick\'s Gourmet Bakery','81 Glen Osmond Rd, Eastwood SA 5063',9,44,'(08)82729699','Restaurant',138.6226806640625,-34.943477630615234);
/*!40000 ALTER TABLE `Venue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checkInHistory`
--

DROP TABLE IF EXISTS `checkInHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkInHistory` (
  `checkIn_id` int NOT NULL AUTO_INCREMENT,
  `u_id` int NOT NULL,
  `v_id` int NOT NULL,
  `time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`checkIn_id`),
  KEY `u_id` (`u_id`),
  KEY `v_id` (`v_id`),
  CONSTRAINT `checkInHistory_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `User` (`user_id`),
  CONSTRAINT `checkInHistory_ibfk_2` FOREIGN KEY (`v_id`) REFERENCES `Venue` (`venue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkInHistory`
--

LOCK TABLES `checkInHistory` WRITE;
/*!40000 ALTER TABLE `checkInHistory` DISABLE KEYS */;
INSERT INTO `checkInHistory` VALUES (18,43,1,'2021-06-14 08:17:59'),(19,43,2,'2021-06-14 08:18:04'),(20,43,3,'2021-06-14 08:18:09'),(21,43,3,'2021-06-14 12:07:47'),(23,54,1,'2021-06-14 12:54:41'),(24,54,3,'2021-06-14 12:54:46'),(25,54,2,'2021-06-14 13:13:20');
/*!40000 ALTER TABLE `checkInHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-14 13:46:07
