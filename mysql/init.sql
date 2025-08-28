-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: py_vms
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES ('20241129073949_Initialcatalogs','8.0.0'),('20241129095944_InitialUpdateTables','8.0.0');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activitylogs`
--

DROP TABLE IF EXISTS `activitylogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylogs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `ModuleName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Action` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `RegData` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ActivityLogs_UserId` (`UserId`),
  CONSTRAINT `FK_ActivityLogs_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylogs`
--

LOCK TABLES `activitylogs` WRITE;
/*!40000 ALTER TABLE `activitylogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activitylogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alertmasters`
--

DROP TABLE IF EXISTS `alertmasters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alertmasters` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `AlertName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `AlertInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `AlertStatus` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_AlertMasters_CameraId` (`CameraId`),
  CONSTRAINT `FK_AlertMasters_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alertmasters`
--

LOCK TABLES `alertmasters` WRITE;
/*!40000 ALTER TABLE `alertmasters` DISABLE KEYS */;
/*!40000 ALTER TABLE `alertmasters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anprstatus`
--

DROP TABLE IF EXISTS `anprstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anprstatus` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `CameraName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `URL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ANPRStatus_CameraId` (`CameraId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `FK_ANPRStatus_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=411 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anprstatus`
--

LOCK TABLES `anprstatus` WRITE;
/*!40000 ALTER TABLE `anprstatus` DISABLE KEYS */;
INSERT INTO `anprstatus` VALUES (54,195,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2024-12-31 10:38:57.563824',65),(55,195,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2024-12-31 10:47:39.329589',65),(350,511,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2025-08-01 10:08:48.696127',79),(351,511,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2025-08-01 10:10:35.283710',79),(352,514,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2025-08-01 10:10:57.733078',80),(353,514,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2025-08-01 10:11:32.453546',80),(354,511,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2025-08-01 10:40:49.701762',79),(361,535,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',0,'2025-08-05 08:10:15.510264',81),(362,537,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2025-08-05 08:13:37.583983',81),(363,537,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',0,'2025-08-05 08:13:44.960422',81),(364,536,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',0,'2025-08-05 08:13:54.872679',81),(365,535,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',0,'2025-08-05 08:14:02.338025',81),(409,1475,'MediaProfile_Channel4_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif',0,'2025-08-28 04:27:43.531111',76),(410,1475,'MediaProfile_Channel4_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif',0,'2025-08-28 04:28:04.043259',76);
/*!40000 ALTER TABLE `anprstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetroleclaims`
--

DROP TABLE IF EXISTS `aspnetroleclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetroleclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetroleclaims`
--

LOCK TABLES `aspnetroleclaims` WRITE;
/*!40000 ALTER TABLE `aspnetroleclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetroleclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetroles`
--

DROP TABLE IF EXISTS `aspnetroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetroles` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetroles`
--

LOCK TABLES `aspnetroles` WRITE;
/*!40000 ALTER TABLE `aspnetroles` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserclaims`
--

DROP TABLE IF EXISTS `aspnetuserclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserclaims`
--

LOCK TABLES `aspnetuserclaims` WRITE;
/*!40000 ALTER TABLE `aspnetuserclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserlogins`
--

DROP TABLE IF EXISTS `aspnetuserlogins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserlogins` (
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderDisplayName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  KEY `IX_AspNetUserLogins_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserlogins`
--

LOCK TABLES `aspnetuserlogins` WRITE;
/*!40000 ALTER TABLE `aspnetuserlogins` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserlogins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserroles`
--

DROP TABLE IF EXISTS `aspnetuserroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserroles`
--

LOCK TABLES `aspnetuserroles` WRITE;
/*!40000 ALTER TABLE `aspnetuserroles` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetusers`
--

DROP TABLE IF EXISTS `aspnetusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetusers` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `UserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Email` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedEmail` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `SecurityStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `EmailIndex` (`NormalizedEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetusers`
--

LOCK TABLES `aspnetusers` WRITE;
/*!40000 ALTER TABLE `aspnetusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetusertokens`
--

DROP TABLE IF EXISTS `aspnetusertokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetusertokens` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LoginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetusertokens`
--

LOCK TABLES `aspnetusertokens` WRITE;
/*!40000 ALTER TABLE `aspnetusertokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetusertokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add anprstatus',7,'add_anprstatus'),(26,'Can change anprstatus',7,'change_anprstatus'),(27,'Can delete anprstatus',7,'delete_anprstatus'),(28,'Can view anprstatus',7,'view_anprstatus'),(29,'Can add activitylogs',8,'add_activitylogs'),(30,'Can change activitylogs',8,'change_activitylogs'),(31,'Can delete activitylogs',8,'delete_activitylogs'),(32,'Can view activitylogs',8,'view_activitylogs'),(33,'Can add alertmasters',9,'add_alertmasters'),(34,'Can change alertmasters',9,'change_alertmasters'),(35,'Can delete alertmasters',9,'delete_alertmasters'),(36,'Can view alertmasters',9,'view_alertmasters'),(37,'Can add aspnetroleclaims',10,'add_aspnetroleclaims'),(38,'Can change aspnetroleclaims',10,'change_aspnetroleclaims'),(39,'Can delete aspnetroleclaims',10,'delete_aspnetroleclaims'),(40,'Can view aspnetroleclaims',10,'view_aspnetroleclaims'),(41,'Can add aspnetroles',11,'add_aspnetroles'),(42,'Can change aspnetroles',11,'change_aspnetroles'),(43,'Can delete aspnetroles',11,'delete_aspnetroles'),(44,'Can view aspnetroles',11,'view_aspnetroles'),(45,'Can add aspnetuserclaims',12,'add_aspnetuserclaims'),(46,'Can change aspnetuserclaims',12,'change_aspnetuserclaims'),(47,'Can delete aspnetuserclaims',12,'delete_aspnetuserclaims'),(48,'Can view aspnetuserclaims',12,'view_aspnetuserclaims'),(49,'Can add aspnetuserlogins',13,'add_aspnetuserlogins'),(50,'Can change aspnetuserlogins',13,'change_aspnetuserlogins'),(51,'Can delete aspnetuserlogins',13,'delete_aspnetuserlogins'),(52,'Can view aspnetuserlogins',13,'view_aspnetuserlogins'),(53,'Can add aspnetuserroles',14,'add_aspnetuserroles'),(54,'Can change aspnetuserroles',14,'change_aspnetuserroles'),(55,'Can delete aspnetuserroles',14,'delete_aspnetuserroles'),(56,'Can view aspnetuserroles',14,'view_aspnetuserroles'),(57,'Can add aspnetusertokens',15,'add_aspnetusertokens'),(58,'Can change aspnetusertokens',15,'change_aspnetusertokens'),(59,'Can delete aspnetusertokens',15,'delete_aspnetusertokens'),(60,'Can view aspnetusertokens',15,'view_aspnetusertokens'),(61,'Can add aspnetusers',16,'add_aspnetusers'),(62,'Can change aspnetusers',16,'change_aspnetusers'),(63,'Can delete aspnetusers',16,'delete_aspnetusers'),(64,'Can view aspnetusers',16,'view_aspnetusers'),(65,'Can add cameraactivities',17,'add_cameraactivities'),(66,'Can change cameraactivities',17,'change_cameraactivities'),(67,'Can delete cameraactivities',17,'delete_cameraactivities'),(68,'Can view cameraactivities',17,'view_cameraactivities'),(69,'Can add cameraalertstatuss',18,'add_cameraalertstatuss'),(70,'Can change cameraalertstatuss',18,'change_cameraalertstatuss'),(71,'Can delete cameraalertstatuss',18,'delete_cameraalertstatuss'),(72,'Can view cameraalertstatuss',18,'view_cameraalertstatuss'),(73,'Can add cameraalerts',19,'add_cameraalerts'),(74,'Can change cameraalerts',19,'change_cameraalerts'),(75,'Can delete cameraalerts',19,'delete_cameraalerts'),(76,'Can view cameraalerts',19,'view_cameraalerts'),(77,'Can add cameraiplists',20,'add_cameraiplists'),(78,'Can change cameraiplists',20,'change_cameraiplists'),(79,'Can delete cameraiplists',20,'delete_cameraiplists'),(80,'Can view cameraiplists',20,'view_cameraiplists'),(81,'Can add camerarecords',21,'add_camerarecords'),(82,'Can change camerarecords',21,'change_camerarecords'),(83,'Can delete camerarecords',21,'delete_camerarecords'),(84,'Can view camerarecords',21,'view_camerarecords'),(85,'Can add cameratrackingdatas',22,'add_cameratrackingdatas'),(86,'Can change cameratrackingdatas',22,'change_cameratrackingdatas'),(87,'Can delete cameratrackingdatas',22,'delete_cameratrackingdatas'),(88,'Can view cameratrackingdatas',22,'view_cameratrackingdatas'),(89,'Can add cameras',23,'add_cameras'),(90,'Can change cameras',23,'change_cameras'),(91,'Can delete cameras',23,'delete_cameras'),(92,'Can view cameras',23,'view_cameras'),(93,'Can add features',24,'add_features'),(94,'Can change features',24,'change_features'),(95,'Can delete features',24,'delete_features'),(96,'Can view features',24,'view_features'),(97,'Can add groups',25,'add_groups'),(98,'Can change groups',25,'change_groups'),(99,'Can delete groups',25,'delete_groups'),(100,'Can view groups',25,'view_groups'),(101,'Can add licenseactivations',26,'add_licenseactivations'),(102,'Can change licenseactivations',26,'change_licenseactivations'),(103,'Can delete licenseactivations',26,'delete_licenseactivations'),(104,'Can view licenseactivations',26,'view_licenseactivations'),(105,'Can add licenses',27,'add_licenses'),(106,'Can change licenses',27,'change_licenses'),(107,'Can delete licenses',27,'delete_licenses'),(108,'Can view licenses',27,'view_licenses'),(109,'Can add multcameras',28,'add_multcameras'),(110,'Can change multcameras',28,'change_multcameras'),(111,'Can delete multcameras',28,'delete_multcameras'),(112,'Can view multcameras',28,'view_multcameras'),(113,'Can add nvr',29,'add_nvr'),(114,'Can change nvr',29,'change_nvr'),(115,'Can delete nvr',29,'delete_nvr'),(116,'Can view nvr',29,'view_nvr'),(117,'Can add numberplatedetections',30,'add_numberplatedetections'),(118,'Can change numberplatedetections',30,'change_numberplatedetections'),(119,'Can delete numberplatedetections',30,'delete_numberplatedetections'),(120,'Can view numberplatedetections',30,'view_numberplatedetections'),(121,'Can add profileandfeatures',31,'add_profileandfeatures'),(122,'Can change profileandfeatures',31,'change_profileandfeatures'),(123,'Can delete profileandfeatures',31,'delete_profileandfeatures'),(124,'Can view profileandfeatures',31,'view_profileandfeatures'),(125,'Can add profiles',32,'add_profiles'),(126,'Can change profiles',32,'change_profiles'),(127,'Can delete profiles',32,'delete_profiles'),(128,'Can view profiles',32,'view_profiles'),(129,'Can add readedvehiclenoplates',33,'add_readedvehiclenoplates'),(130,'Can change readedvehiclenoplates',33,'change_readedvehiclenoplates'),(131,'Can delete readedvehiclenoplates',33,'delete_readedvehiclenoplates'),(132,'Can view readedvehiclenoplates',33,'view_readedvehiclenoplates'),(133,'Can add roles',34,'add_roles'),(134,'Can change roles',34,'change_roles'),(135,'Can delete roles',34,'delete_roles'),(136,'Can view roles',34,'view_roles'),(137,'Can add usercamerapermissions',35,'add_usercamerapermissions'),(138,'Can change usercamerapermissions',35,'change_usercamerapermissions'),(139,'Can delete usercamerapermissions',35,'delete_usercamerapermissions'),(140,'Can view usercamerapermissions',35,'view_usercamerapermissions'),(141,'Can add users',36,'add_users'),(142,'Can change users',36,'change_users'),(143,'Can delete users',36,'delete_users'),(144,'Can view users',36,'view_users'),(145,'Can add vehicledetections',37,'add_vehicledetections'),(146,'Can change vehicledetections',37,'change_vehicledetections'),(147,'Can delete vehicledetections',37,'delete_vehicledetections'),(148,'Can view vehicledetections',37,'view_vehicledetections'),(149,'Can add videoanalytics',38,'add_videoanalytics'),(150,'Can change videoanalytics',38,'change_videoanalytics'),(151,'Can delete videoanalytics',38,'delete_videoanalytics'),(152,'Can view videoanalytics',38,'view_videoanalytics'),(153,'Can add efmigrationshistory',39,'add_efmigrationshistory'),(154,'Can change efmigrationshistory',39,'change_efmigrationshistory'),(155,'Can delete efmigrationshistory',39,'delete_efmigrationshistory'),(156,'Can view efmigrationshistory',39,'view_efmigrationshistory');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cameraactivities`
--

DROP TABLE IF EXISTS `cameraactivities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cameraactivities` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `UserId` int NOT NULL,
  `Activity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_CameraActivities_CameraId` (`CameraId`),
  KEY `IX_CameraActivities_UserId` (`UserId`),
  CONSTRAINT `FK_CameraActivities_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_CameraActivities_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cameraactivities`
--

LOCK TABLES `cameraactivities` WRITE;
/*!40000 ALTER TABLE `cameraactivities` DISABLE KEYS */;
/*!40000 ALTER TABLE `cameraactivities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cameraalerts`
--

DROP TABLE IF EXISTS `cameraalerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cameraalerts` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `FramePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ObjectName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ObjectCount` int DEFAULT NULL,
  `AlertStatus` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_CameraAlerts_CameraId` (`CameraId`),
  KEY `fk_alert_status_UserId` (`UserId`),
  CONSTRAINT `fk_alert_status_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_CameraAlerts_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1573 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cameraalerts`
--

LOCK TABLES `cameraalerts` WRITE;
/*!40000 ALTER TABLE `cameraalerts` DISABLE KEYS */;
INSERT INTO `cameraalerts` VALUES (356,352,'C:\\Users\\dharmendra\\Desktop\\dharmendra_VMS\\analytic\\analysis_db_writer\\media\\MediaProfile_Channel2_MainStream\\2025-07-22_11_01_10.jpg','{\'person\': 1}',1,'B',0,'2025-07-22 05:31:16.722190',75),(357,352,'C:\\Users\\dharmendra\\Desktop\\dharmendra_VMS\\analytic\\analysis_db_writer\\media\\MediaProfile_Channel2_MainStream\\2025-07-22_11_01_45.jpg','{\'person\': 2}',2,'B',0,'2025-07-22 05:31:56.840961',75),(358,352,'C:\\Users\\dharmendra\\Desktop\\dharmendra_VMS\\analytic\\analysis_db_writer\\media\\MediaProfile_Channel2_MainStream\\2025-07-22_11_02_39.jpg','{\'person\': 2}',2,'B',0,'2025-07-22 05:33:13.789598',75),(359,352,'C:\\Users\\dharmendra\\Desktop\\dharmendra_VMS\\analytic\\analysis_db_writer\\media\\MediaProfile_Channel2_MainStream\\2025-07-22_11_02_41.jpg','{\'person\': 1}',1,'B',0,'2025-07-22 05:33:13.910012',75),(835,514,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_11_00.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-01 10:11:00.858255',80),(836,514,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_11_05.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-01 10:11:05.917374',80),(837,514,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_11_06.jpg','{\'chair\': 2, \'person\': 4}',6,'B',0,'2025-08-01 10:11:07.015290',80),(838,514,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_11_22.jpg','{\'person\': 3}',3,'B',0,'2025-08-01 10:11:23.495562',80),(839,514,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_11_28.jpg','{\'person\': 2}',2,'B',0,'2025-08-01 10:11:29.266635',80),(840,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_08_49.jpg','{\'person\': 2}',2,'B',0,'2025-08-01 10:37:47.262365',79),(841,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_08_54.jpg','{\'person\': 3}',3,'B',0,'2025-08-01 10:37:59.132609',79),(842,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_08_59.jpg','{\'person\': 4}',4,'B',0,'2025-08-01 10:38:08.987702',79),(843,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_09_07.jpg','{\'person\': 4, \'chair\': 2}',6,'B',0,'2025-08-01 10:38:28.608238',79),(844,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_09_09.jpg','{\'person\': 4, \'chair\': 1}',5,'B',0,'2025-08-01 10:38:32.996568',79),(845,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_09_11.jpg','{\'person\': 6, \'chair\': 1}',7,'B',0,'2025-08-01 10:38:35.228691',79),(846,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_41_06.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-01 10:42:40.125232',79),(847,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_41_26.jpg','{\'person\': 3, \'chair\': 3}',6,'B',0,'2025-08-01 10:43:30.314810',79),(848,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_41_28.jpg','{\'person\': 4, \'chair\': 3}',7,'B',0,'2025-08-01 10:43:36.220313',79),(849,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_41_35.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-01 10:43:52.758082',79),(850,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_42_03.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-01 10:45:15.715697',79),(851,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_42_28.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-01 10:46:07.576999',79),(852,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_44_26.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-01 10:48:59.025312',79),(853,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_44_31.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-01 10:49:07.022570',79),(854,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_44_36.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-01 10:49:14.419165',79),(855,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_45_06.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-01 10:50:25.258602',79),(856,511,'/app/media/MediaProfile_Channel1_MainStream/2025-08-01_10_45_22.jpg','{\'chair\': 3}',3,'B',0,'2025-08-01 10:51:16.517793',79),(863,523,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel2_MainStream\\2025-08-04_14_19_35.jpg','{\'person\': 2}',2,'B',0,'2025-08-04 08:58:06.219613',64),(864,523,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel2_MainStream\\2025-08-04_14_20_17.jpg','{\'person\': 1}',1,'B',0,'2025-08-04 08:58:15.588142',64),(868,531,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel2_MainStream\\2025-08-05_11_25_28.jpg','{\'without helmet\': 1}',1,'B',0,'2025-08-05 05:55:30.918094',78),(869,531,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel2_MainStream\\2025-08-05_11_30_37.jpg','{\'without helmet\': 1}',1,'B',0,'2025-08-05 06:00:40.419824',78),(870,531,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel2_MainStream\\2025-08-05_11_33_24.jpg','{\'without helmet\': 1}',1,'B',0,'2025-08-05 06:03:27.439926',78),(871,531,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel2_MainStream\\2025-08-05_11_33_41.jpg','{\'without helmet\': 2}',2,'B',0,'2025-08-05 06:03:44.458767',78),(872,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_13_48.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-05 09:19:18.949713',81),(873,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_13_50.jpg','{\'chair\': 3}',3,'B',0,'2025-08-05 09:19:37.490323',81),(874,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_13_58.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-05 09:20:09.248450',81),(875,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_14_05.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-05 09:20:20.821614',81),(876,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_14_17.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-05 09:21:33.549885',81),(877,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_15_03.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-06 00:29:41.754204',81),(878,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_15_04.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-06 00:30:11.626191',81),(879,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_15_24.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-06 00:31:35.659615',81),(880,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_15_47.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-06 00:33:29.119525',81),(881,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_16_29.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-06 00:34:48.983288',81),(882,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_16_45.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-06 00:35:13.741825',81),(883,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_08_17_09.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-06 00:36:16.221305',81),(884,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_16_03.jpg','{\'person\': 3, \'chair\': 4}',7,'B',0,'2025-08-06 00:40:42.287176',81),(885,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_16_05.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-06 00:41:05.181230',81),(886,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_16_19.jpg','{\'person\': 4, \'chair\': 5}',9,'B',0,'2025-08-06 00:41:38.980686',81),(887,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_16_19.jpg','{\'person\': 3, \'chair\': 4}',7,'B',0,'2025-08-06 00:41:50.485537',81),(888,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_16_20.jpg','{\'person\': 4, \'chair\': 4}',8,'B',0,'2025-08-06 00:41:55.244052',81),(889,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_16_39.jpg','{\'person\': 3, \'chair\': 3}',6,'B',0,'2025-08-06 00:42:20.683286',81),(890,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_17_40.jpg','{\'person\': 3, \'chair\': 4}',7,'B',0,'2025-08-06 00:44:43.605820',81),(891,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_17_59.jpg','{\'person\': 2, \'chair\': 4}',6,'B',0,'2025-08-06 00:45:16.413851',81),(892,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_18_00.jpg','{\'person\': 2, \'chair\': 5}',7,'B',0,'2025-08-06 00:45:43.996202',81),(893,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_18_31.jpg','{\'chair\': 5, \'person\': 2}',7,'B',0,'2025-08-06 00:46:21.709645',81),(894,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_18_31.jpg','{\'chair\': 5, \'person\': 1}',6,'B',0,'2025-08-06 00:46:28.754263',81),(895,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_18_34.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-06 00:47:01.856501',81),(896,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_18_35.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-06 00:47:27.850244',81),(897,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_19_46.jpg','{\'person\': 2, \'chair\': 5}',7,'B',0,'2025-08-06 00:48:51.006024',81),(898,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_19_51.jpg','{\'person\': 3, \'chair\': 5}',8,'B',0,'2025-08-06 00:49:17.402727',81),(899,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_19_52.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-06 00:49:38.131697',81),(900,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_19_57.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-06 00:50:14.541049',81),(901,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_20_34.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-06 00:50:37.866028',81),(902,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_20_36.jpg','{\'person\': 2, \'chair\': 4}',6,'B',0,'2025-08-06 00:51:03.612451',81),(903,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_20_41.jpg','{\'person\': 2, \'chair\': 5}',7,'B',0,'2025-08-06 00:51:23.559993',81),(904,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_21_10.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-06 00:52:11.120553',81),(905,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_21_15.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-06 00:52:26.519404',81),(906,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_22_04.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-06 00:54:06.327246',81),(907,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_22_33.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-06 00:54:25.943861',81),(908,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_22_34.jpg','{\'person\': 2, \'chair\': 1}',3,'B',0,'2025-08-06 00:54:41.286238',81),(909,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_22_37.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-06 00:54:54.995770',81),(910,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_22_39.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-06 00:55:03.113873',81),(911,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_23_02.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-06 00:56:16.437324',81),(912,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_23_51.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-06 00:56:43.104567',81),(913,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_23_51.jpg','{\'person\': 3, \'chair\': 2}',5,'B',0,'2025-08-06 00:57:15.676573',81),(914,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_24_17.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-06 00:57:42.875207',81),(915,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_24_19.jpg','{\'chair\': 5, \'person\': 2}',7,'B',0,'2025-08-06 00:58:01.878477',81),(916,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_24_30.jpg','{\'person\': 3, \'chair\': 6}',9,'B',0,'2025-08-06 00:58:42.526975',81),(917,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_24_33.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-06 00:59:03.384744',81),(918,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-05_09_24_35.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-06 00:59:26.365829',81),(919,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_30_13.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:00:02.436205',81),(920,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_30_33.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:00:21.742803',81),(921,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_30_36.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:00:22.231707',81),(922,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_33_26.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:05:48.123207',81),(923,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_33_40.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:06:17.649597',81),(924,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_36_14.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:10:51.044554',81),(925,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_36_27.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:11:23.996415',81),(926,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_36_52.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-06 01:11:59.968479',81),(927,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_39_02.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:15:56.140876',81),(928,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_39_20.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:16:36.556113',81),(929,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_41_40.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:21:08.696901',81),(930,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_42_05.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:21:43.096162',81),(931,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_44_58.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:26:16.484053',81),(932,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_45_53.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:27:12.750909',81),(933,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_48_36.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:31:55.517374',81),(934,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_49_22.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:33:01.410263',81),(935,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_52_14.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:37:05.479427',81),(936,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_53_22.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:38:41.934665',81),(937,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_56_05.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:42:05.872034',81),(938,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_00_57_25.jpg','{\'chair\': 1}',1,'B',0,'2025-08-06 01:43:53.298360',81),(939,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_00_00.jpg','{\'chair\': 2}',2,'B',0,'2025-08-06 01:47:50.453424',81),(940,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_00_31.jpg','{\'chair\': 1}',1,'B',0,'2025-08-08 04:40:16.470367',81),(941,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_01_21.jpg','{\'chair\': 2}',2,'B',0,'2025-08-08 04:43:15.710819',81),(942,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_01_59.jpg','{\'chair\': 1}',1,'B',0,'2025-08-08 05:42:16.240633',81),(943,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_02_49.jpg','{\'chair\': 2}',2,'B',0,'2025-08-08 06:01:57.863851',81),(944,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_03_35.jpg','{\'chair\': 1}',1,'B',0,'2025-08-08 06:15:56.527049',81),(945,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_04_09.jpg','{\'chair\': 2}',2,'B',0,'2025-08-08 06:18:16.166943',81),(946,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_18_48.jpg','{\'chair\': 2}',2,'B',0,'2025-08-11 08:52:16.281187',81),(947,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_18_53.jpg','{\'chair\': 1}',1,'B',0,'2025-08-11 08:52:21.255181',81),(948,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_21_50.jpg','{\'chair\': 3}',3,'B',0,'2025-08-11 08:57:26.392156',81),(949,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_21_53.jpg','{\'chair\': 1}',1,'B',0,'2025-08-11 08:57:32.044638',81),(950,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_21_55.jpg','{\'chair\': 2}',2,'B',0,'2025-08-11 08:57:36.593687',81),(951,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_25_25.jpg','{\'chair\': 1}',1,'B',0,'2025-08-11 09:02:54.500232',81),(952,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_25_28.jpg','{\'chair\': 2}',2,'B',0,'2025-08-11 09:02:59.730643',81),(953,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_28_08.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 04:54:20.438220',81),(954,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_28_13.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 04:54:32.104384',81),(955,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_29_33.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 04:59:30.844928',81),(956,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_29_38.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 04:59:50.082526',81),(957,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_31_05.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 05:04:41.749572',81),(958,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_31_08.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 05:04:50.586223',81),(959,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_33_20.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 05:15:48.055828',81),(960,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_33_23.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 05:15:56.193634',81),(961,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_35_05.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 05:22:16.671453',81),(962,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_35_08.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 05:22:28.900049',81),(963,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_36_48.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 05:28:59.324969',81),(964,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_36_53.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 05:29:14.630705',81),(965,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_38_55.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 05:36:05.244456',81),(966,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_38_58.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 05:36:14.192068',81),(967,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_40_23.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 06:26:28.419862',81),(968,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_40_28.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 06:26:50.136290',81),(969,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_40_33.jpg','{\'chair\': 3}',3,'B',0,'2025-08-12 06:27:06.430264',81),(970,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_41_55.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 06:50:39.035362',81),(971,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_42_38.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 06:53:24.154615',81),(972,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_43_18.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 06:55:38.230539',81),(978,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_44_05.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 12:14:24.493810',81),(979,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_44_40.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-12 12:16:02.698709',81),(980,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_45_03.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 12:17:15.313535',81),(981,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_45_53.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 12:20:13.257210',81),(982,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_47_02.jpg','{\'chair\': 1}',1,'B',0,'2025-08-12 12:24:15.604707',81),(983,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_47_28.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-12 12:25:27.745573',81),(984,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_01_47_30.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 12:25:36.833091',81),(985,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_10_36_06.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-12 12:29:08.747385',81),(986,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-06_10_36_08.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-12 12:29:20.825653',81),(987,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_04_39_11.jpg','{\'chair\': 3}',3,'B',0,'2025-08-12 12:30:43.862619',81),(988,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_04_39_32.jpg','{\'chair\': 2}',2,'B',0,'2025-08-12 12:31:59.810167',81),(989,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_04_40_12.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-12 12:35:05.127265',81),(990,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_04_40_14.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-12 12:35:09.187936',81),(991,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_04_40_25.jpg','{\'chair\': 3}',3,'B',0,'2025-08-12 12:36:12.319537',81),(992,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_04_40_35.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-12 12:36:32.187257',81),(993,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_40_13.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 00:42:08.882317',81),(994,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_40_14.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 00:42:14.369789',81),(995,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_40_15.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 00:42:21.383441',81),(996,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_41_02.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 00:47:18.684838',81),(997,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_41_05.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 00:47:38.140060',81),(998,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_41_09.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 00:48:03.154871',81),(999,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_41_59.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-13 00:52:36.039995',81),(1000,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_42_00.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 00:52:41.201768',81),(1001,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_42_59.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 00:57:46.131063',81),(1002,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_43_02.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-13 00:57:58.832255',81),(1003,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_05_43_05.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 00:58:16.116373',81),(1004,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_01_01.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 01:03:05.693689',81),(1005,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_01_08.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 01:03:36.176735',81),(1006,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_01_11.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 01:03:57.196953',81),(1007,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_01_38.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-13 01:06:28.737599',81),(1008,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_01_53.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 01:08:07.665751',81),(1009,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_01_58.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 01:08:39.265518',81),(1010,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_02_00.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 01:08:54.623759',81),(1011,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_02_04.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 01:09:19.486782',81),(1012,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_02_28.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 01:11:53.336921',81),(1013,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_02_48.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 01:14:01.631170',81),(1014,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_03_02.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 01:15:28.074720',81),(1015,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_03_03.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-13 01:15:34.472108',81),(1016,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_03_09.jpg','{\'person\': 4, \'chair\': 4}',8,'B',0,'2025-08-13 01:16:17.673360',81),(1017,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_03_20.jpg','{\'chair\': 5, \'person\': 2}',7,'B',0,'2025-08-13 01:17:23.701863',81),(1018,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_03_22.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 01:17:40.026587',81),(1019,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_03_50.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 01:20:28.820322',81),(1020,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_15_04.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 01:21:19.308294',81),(1021,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_15_19.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 06:10:54.084734',81),(1022,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_15_24.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-13 06:11:15.487257',81),(1023,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_15_31.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 06:11:46.736469',81),(1024,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_15_36.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-13 06:12:10.267961',81),(1025,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_15_55.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 06:13:35.787304',81),(1026,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_16_02.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 07:06:48.407818',81),(1027,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_16_40.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-13 07:08:53.516342',81),(1028,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_16_57.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 07:09:28.524746',81),(1029,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_17_31.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-13 07:10:28.765101',81),(1030,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_17_52.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 07:11:09.009406',81),(1031,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_18_24.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 07:12:10.866795',81),(1032,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_18_26.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-13 07:12:16.628770',81),(1033,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_31_57.jpg','{\'chair\': 4, \'person\': 6}',10,'B',0,'2025-08-13 07:14:31.508456',81),(1034,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_31_59.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-13 07:14:38.615972',81),(1035,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_32_03.jpg','{\'chair\': 4, \'person\': 5}',9,'B',0,'2025-08-13 07:14:46.322313',81),(1036,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_32_27.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-13 07:15:31.882887',81),(1037,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_32_51.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 07:16:14.987380',81),(1038,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_32_52.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 07:16:18.283707',81),(1039,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-08_06_33_37.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 07:17:51.025011',81),(1040,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_19_13.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 07:20:10.480301',81),(1041,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_19_22.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 07:20:18.991361',81),(1042,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_30_35.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 07:25:19.000118',81),(1043,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_31_35.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 07:26:15.408027',81),(1044,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_37_20.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 07:31:29.771723',81),(1045,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_37_22.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 07:31:31.689796',81),(1046,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_43_14.jpg','{\'chair\': 1}',1,'B',0,'2025-08-13 07:38:00.281906',81),(1047,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_43_17.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 07:38:01.942889',81),(1048,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_45_37.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 07:40:20.895078',81),(1049,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_50_52.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 07:45:54.273884',81),(1050,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_50_54.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 07:45:57.337304',81),(1051,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_56_14.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 07:51:28.599910',81),(1052,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_00_56_17.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 07:51:30.342772',81),(1053,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_01_01_32.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 07:56:33.985104',81),(1054,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_01_01_37.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 07:56:38.112238',81),(1055,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_01_07_04.jpg','{\'chair\': 2}',2,'B',0,'2025-08-13 08:01:42.972349',81),(1056,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_01_07_07.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 08:01:45.487265',81),(1057,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_01_16_34.jpg','{\'chair\': 4}',4,'B',0,'2025-08-13 08:11:28.412614',81),(1058,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_01_16_37.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 08:11:32.390279',81),(1059,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_52_24.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 08:16:46.298047',81),(1060,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_52_32.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-13 08:17:08.651229',81),(1061,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_52_41.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 08:17:16.605498',81),(1062,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_55_59.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-13 08:21:49.807708',81),(1063,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_56_10.jpg','{\'chair\': 5}',5,'B',0,'2025-08-13 08:22:08.981298',81),(1064,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_56_17.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 08:22:20.400735',81),(1065,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_56_22.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-13 08:22:28.469778',81),(1066,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_59_32.jpg','{\'chair\': 4}',4,'B',0,'2025-08-13 08:27:00.781377',81),(1067,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_59_44.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-13 08:27:19.370384',81),(1068,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_08_59_46.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 08:27:21.727874',81),(1069,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_09_00_45.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-13 08:28:45.988843',81),(1070,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_09_02_50.jpg','{\'chair\': 4}',4,'B',0,'2025-08-13 08:32:02.357863',81),(1071,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_09_03_10.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-13 08:32:22.573126',81),(1072,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-11_09_03_12.jpg','{\'chair\': 3}',3,'B',0,'2025-08-13 08:32:24.618577',81),(1073,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_54_54.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 08:37:07.244084',81),(1074,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_54_56.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 08:37:09.358211',81),(1075,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_55_07.jpg','{\'person\': 2, \'chair\': 1}',3,'B',0,'2025-08-13 08:37:31.366599',81),(1076,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_55_08.jpg','{\'person\': 3, \'chair\': 2}',5,'B',0,'2025-08-13 08:37:33.637524',81),(1077,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_55_11.jpg','{\'person\': 4, \'chair\': 4}',8,'B',0,'2025-08-13 08:37:39.185795',81),(1078,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_55_17.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 08:37:47.493287',81),(1079,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_56_58.jpg','{\'person\': 6, \'chair\': 3}',9,'B',0,'2025-08-13 08:40:16.776833',81),(1080,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_58_37.jpg','{\'person\': 4, \'chair\': 2}',6,'B',0,'2025-08-13 08:42:38.480936',81),(1081,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_58_38.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-13 08:42:40.024789',81),(1082,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_58_46.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 08:42:50.930562',81),(1083,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_58_57.jpg','{\'person\': 4, \'chair\': 1}',5,'B',0,'2025-08-13 08:43:06.919030',81),(1084,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_04_59_37.jpg','{\'person\': 6, \'chair\': 4}',10,'B',0,'2025-08-13 08:44:24.314170',81),(1085,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_00_13.jpg','{\'person\': 4}',4,'B',0,'2025-08-13 08:45:30.905469',81),(1086,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_01_27.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 08:47:49.031396',81),(1087,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_01_40.jpg','{\'person\': 3, \'chair\': 2}',5,'B',0,'2025-08-13 08:48:10.705292',81),(1088,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_01_55.jpg','{\'person\': 2, \'chair\': 1}',3,'B',0,'2025-08-13 08:48:35.792587',81),(1089,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_02_31.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 08:49:28.491707',81),(1090,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_04_17.jpg','{\'person\': 3, \'chair\': 1}',4,'B',0,'2025-08-13 08:52:25.253743',81),(1091,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_04_40.jpg','{\'chair\': 2, \'person\': 4}',6,'B',0,'2025-08-13 08:52:58.331193',81),(1092,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_04_50.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-13 08:53:12.279679',81),(1093,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_06_19.jpg','{\'chair\': 2, \'person\': 5}',7,'B',0,'2025-08-13 08:56:08.884943',81),(1094,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_06_57.jpg','{\'chair\': 4, \'person\': 4}',8,'B',0,'2025-08-13 08:57:13.818374',81),(1095,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_07_30.jpg','{\'chair\': 2, \'person\': 4}',6,'B',0,'2025-08-13 08:58:09.117549',81),(1096,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_08_06.jpg','{\'chair\': 1, \'person\': 4}',5,'B',0,'2025-08-13 08:59:14.081932',81),(1097,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_09_19.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-13 09:01:24.352616',81),(1098,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_09_35.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 09:01:55.343508',81),(1099,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_14_32.jpg','{\'chair\': 2, \'person\': 6}',8,'B',0,'2025-08-13 09:02:26.110440',81),(1100,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_14_54.jpg','{\'person\': 4, \'chair\': 2}',6,'B',0,'2025-08-13 09:03:10.716003',81),(1101,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_15_32.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-13 09:04:14.160393',81),(1102,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_15_46.jpg','{\'person\': 3}',3,'B',0,'2025-08-13 09:04:34.292690',81),(1103,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_16_58.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 09:06:37.914903',81),(1104,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_17_15.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-13 09:07:03.516702',81),(1105,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_17_35.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-13 09:07:42.774278',81),(1106,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_17_55.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 09:08:20.978936',81),(1107,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_18_23.jpg','{\'chair\': 4, \'person\': 5}',9,'B',0,'2025-08-13 09:09:03.268194',81),(1108,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_18_37.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 09:09:41.076223',81),(1109,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_19_43.jpg','{\'chair\': 5, \'person\': 2}',7,'B',0,'2025-08-13 09:11:37.669906',81),(1110,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_20_12.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 09:12:25.950717',81),(1111,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_20_55.jpg','{\'chair\': 4, \'person\': 2}',6,'B',0,'2025-08-13 09:13:35.838556',81),(1112,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_21_49.jpg','{\'person\': 3, \'chair\': 2}',5,'B',0,'2025-08-13 09:15:03.774416',81),(1113,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_22_24.jpg','{\'chair\': 4, \'person\': 4}',8,'B',0,'2025-08-13 09:16:04.356189',81),(1114,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_22_52.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-13 09:16:43.921176',81),(1115,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_23_38.jpg','{\'chair\': 4, \'person\': 5}',9,'B',0,'2025-08-13 09:18:03.031999',81),(1116,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_24_04.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 09:18:43.792749',81),(1117,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_24_06.jpg','{\'person\': 4, \'chair\': 2}',6,'B',0,'2025-08-13 09:18:46.325323',81),(1118,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_25_18.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 09:20:20.148820',81),(1119,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_26_21.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 09:22:03.376880',81),(1120,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_26_30.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-13 09:22:14.160898',81),(1121,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_27_36.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-13 09:23:48.527637',81),(1122,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_28_49.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 09:25:22.169159',81),(1123,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_30_05.jpg','{\'person\': 3, \'chair\': 4}',7,'B',0,'2025-08-13 09:27:13.147676',81),(1124,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_30_11.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-13 09:27:21.974505',81),(1125,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_31_01.jpg','{\'chair\': 1, \'person\': 2}',3,'B',0,'2025-08-13 09:28:33.550518',81),(1126,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_31_13.jpg','{\'person\': 3, \'chair\': 3}',6,'B',0,'2025-08-13 09:28:50.065888',81),(1127,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_31_18.jpg','{\'person\': 5, \'chair\': 3}',8,'B',0,'2025-08-13 09:28:57.784900',81),(1128,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_32_13.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 09:30:24.870987',81),(1129,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_33_29.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 09:32:20.310668',81),(1130,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_33_33.jpg','{\'person\': 2}',2,'B',0,'2025-08-13 09:32:24.495781',81),(1131,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_34_20.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-13 09:33:36.504907',81),(1132,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_34_30.jpg','{\'person\': 4, \'chair\': 2}',6,'B',0,'2025-08-13 09:33:54.712053',81),(1133,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_34_59.jpg','{\'chair\': 2, \'person\': 7}',9,'B',0,'2025-08-13 09:34:39.072682',81),(1134,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_35_14.jpg','{\'person\': 5, \'chair\': 3}',8,'B',0,'2025-08-13 09:34:58.084184',81),(1135,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_35_33.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-13 09:35:24.451265',81),(1136,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_37_03.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-13 09:37:24.556005',81),(1137,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_38_16.jpg','{\'person\': 3, \'chair\': 3}',6,'B',0,'2025-08-13 09:39:10.347956',81),(1138,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_39_01.jpg','{\'chair\': 4, \'person\': 4}',8,'B',0,'2025-08-13 09:40:09.740065',81),(1139,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_40_07.jpg','{\'person\': 3, \'chair\': 2}',5,'B',0,'2025-08-13 09:42:00.580564',81),(1140,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_40_23.jpg','{\'person\': 4, \'chair\': 3}',7,'B',0,'2025-08-13 09:42:24.699528',81),(1141,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_05_40_38.jpg','{\'person\': 5, \'chair\': 4}',9,'B',0,'2025-08-13 09:42:41.541221',81),(1142,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_25_52.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-13 09:42:45.882573',81),(1143,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_26_03.jpg','{\'person\': 2, \'chair\': 1}',3,'B',0,'2025-08-13 09:43:02.859532',81),(1144,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_27_52.jpg','{\'chair\': 2, \'person\': 4}',6,'B',0,'2025-08-13 09:45:26.410096',81),(1145,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_28_27.jpg','{\'person\': 5, \'chair\': 3}',8,'B',0,'2025-08-13 09:46:13.733638',81),(1146,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_28_58.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-13 09:47:05.091040',81),(1147,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_29_23.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-13 09:47:37.328876',81),(1148,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_29_51.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-13 09:48:20.393911',81),(1149,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_49_14.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-13 09:48:33.510720',81),(1150,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_49_52.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-14 00:31:27.098699',81),(1151,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_50_10.jpg','{\'person\': 3, \'chair\': 4}',7,'B',0,'2025-08-14 00:33:07.777516',81),(1152,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_50_17.jpg','{\'person\': 4, \'chair\': 4}',8,'B',0,'2025-08-14 00:33:35.778327',81),(1153,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_50_35.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-14 00:35:15.311944',81),(1154,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_50_46.jpg','{\'chair\': 4, \'person\': 5}',9,'B',0,'2025-08-14 00:36:20.742827',81),(1155,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_50_49.jpg','{\'chair\': 5, \'person\': 5}',10,'B',0,'2025-08-14 00:36:35.425089',81),(1156,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_50_56.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-14 00:37:18.856886',81),(1157,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_51_20.jpg','{\'chair\': 4, \'person\': 3}',7,'B',0,'2025-08-14 00:39:11.618833',81),(1158,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_51_23.jpg','{\'person\': 5, \'chair\': 3}',8,'B',0,'2025-08-14 00:39:18.305275',81),(1159,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_51_51.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-14 00:41:01.049708',81),(1160,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_52_30.jpg','{\'person\': 3, \'chair\': 3}',6,'B',0,'2025-08-14 00:43:03.294292',81),(1161,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_52_50.jpg','{\'person\': 5, \'chair\': 4}',9,'B',0,'2025-08-14 00:44:06.366977',81),(1162,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_52_51.jpg','{\'person\': 4, \'chair\': 3}',7,'B',0,'2025-08-14 00:44:08.383075',81),(1163,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_53_09.jpg','{\'person\': 3, \'chair\': 1}',4,'B',0,'2025-08-14 00:45:08.268006',81),(1164,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_53_30.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-14 00:46:15.842445',81),(1165,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_54_05.jpg','{\'chair\': 2, \'person\': 1}',3,'B',0,'2025-08-14 00:48:06.698774',81),(1166,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_54_23.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-14 00:49:00.729992',81),(1167,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_54_51.jpg','{\'person\': 1, \'chair\': 1}',2,'B',0,'2025-08-14 00:50:13.413910',81),(1168,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_54_51.jpg','{\'person\': 2, \'chair\': 2}',4,'B',0,'2025-08-14 00:50:15.305639',81),(1169,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_55_10.jpg','{\'person\': 2, \'chair\': 3}',5,'B',0,'2025-08-14 00:51:18.797627',81),(1170,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_55_44.jpg','{\'person\': 3}',3,'B',0,'2025-08-14 00:53:09.783116',81),(1171,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_56_17.jpg','{\'chair\': 3, \'person\': 4}',7,'B',0,'2025-08-14 00:54:48.335604',81),(1172,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_56_40.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-14 00:56:00.689040',81),(1173,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_56_57.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-14 00:56:50.598595',81),(1174,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_57_23.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-14 00:58:09.569882',81),(1175,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_06_57_30.jpg','{\'chair\': 4, \'person\': 4}',8,'B',0,'2025-08-14 00:58:34.513337',81),(1176,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_11_57_49.jpg','{\'chair\': 3}',3,'B',0,'2025-08-14 00:59:04.058638',81),(1177,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_14_05.jpg','{\'chair\': 2}',2,'B',0,'2025-08-14 00:59:48.298478',81),(1178,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_15_35.jpg','{\'chair\': 4}',4,'B',0,'2025-08-14 01:04:35.017114',81),(1179,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_15_37.jpg','{\'chair\': 3}',3,'B',0,'2025-08-14 01:04:38.376738',81),(1180,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_17_43.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-14 01:11:04.994142',81),(1181,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_17_44.jpg','{\'chair\': 3}',3,'B',0,'2025-08-14 01:11:07.990912',81),(1182,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_19_24.jpg','{\'chair\': 4}',4,'B',0,'2025-08-14 01:16:17.737630',81),(1183,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_19_25.jpg','{\'chair\': 3}',3,'B',0,'2025-08-14 01:16:22.613225',81),(1184,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_21_28.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-14 03:11:35.886069',81),(1185,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_21_32.jpg','{\'chair\': 3}',3,'B',0,'2025-08-14 03:11:50.696147',81),(1186,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_21_40.jpg','{\'chair\': 4, \'person\': 1}',5,'B',0,'2025-08-14 03:12:22.392471',81),(1187,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_23_19.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-14 03:16:50.853570',81),(1188,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_23_22.jpg','{\'chair\': 3}',3,'B',0,'2025-08-14 03:16:58.525771',81),(1189,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_23_34.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-14 03:17:39.660729',81),(1190,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_26_02.jpg','{\'chair\': 2}',2,'B',0,'2025-08-14 05:37:00.370917',81),(1191,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_26_03.jpg','{\'chair\': 3}',3,'B',0,'2025-08-14 05:37:02.582628',81),(1192,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_26_08.jpg','{\'chair\': 3, \'person\': 1}',4,'B',0,'2025-08-14 05:37:05.523485',81),(1193,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_27_12.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-14 05:38:22.491868',81),(1194,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_27_14.jpg','{\'chair\': 2, \'person\': 5}',7,'B',0,'2025-08-14 05:38:25.171473',81),(1195,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_28_03.jpg','{\'chair\': 3, \'person\': 3}',6,'B',0,'2025-08-14 05:39:25.260533',81),(1196,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_30_03.jpg','{\'chair\': 3, \'person\': 5}',8,'B',0,'2025-08-14 05:41:51.213010',81),(1197,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_30_06.jpg','{\'chair\': 3, \'person\': 6}',9,'B',0,'2025-08-14 05:41:54.304189',81),(1198,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_30_27.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-14 05:42:19.636136',81),(1199,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_31_02.jpg','{\'chair\': 1, \'person\': 2}',3,'B',0,'2025-08-14 05:43:00.207696',81),(1200,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_31_26.jpg','{\'chair\': 2, \'person\': 3}',5,'B',0,'2025-08-14 05:43:31.323594',81),(1201,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_31_37.jpg','{\'person\': 2}',2,'B',0,'2025-08-14 05:43:45.102138',81),(1202,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_34_03.jpg','{\'person\': 3, \'chair\': 3}',6,'B',0,'2025-08-14 05:46:53.862843',81),(1203,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_34_27.jpg','{\'chair\': 2, \'person\': 2}',4,'B',0,'2025-08-14 05:47:24.546604',81),(1204,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_35_22.jpg','{\'chair\': 1, \'person\': 2}',3,'B',0,'2025-08-14 05:48:37.037601',81),(1205,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_35_25.jpg','{\'chair\': 3, \'person\': 2}',5,'B',0,'2025-08-14 05:48:41.020834',81),(1206,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_12_38_47.jpg','{\'chair\': 5, \'person\': 2}',7,'B',0,'2025-08-14 05:52:16.976992',81),(1207,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-12_21_52_40.jpg','{\'chair\': 2}',2,'B',0,'2025-08-14 05:52:49.358118',81),(1208,537,'/app/media/MediaProfile_Channel1_MainStream/2025-08-13_00_31_37.jpg','{\'chair\': 4}',4,'B',0,'2025-08-14 05:52:53.129388',81),(1563,1475,'/app/media/MediaProfile_Channel4_MainStream/2025-08-28_04_27_45.jpg','{\'person\': 5, \'chair\': 1}',6,'B',0,'2025-08-28 04:27:49.291446',76),(1564,1475,'/app/media/MediaProfile_Channel4_MainStream/2025-08-28_04_27_48.jpg','{\'person\': 3, \'chair\': 1}',4,'B',0,'2025-08-28 04:27:51.145397',76),(1565,1475,'/app/media/MediaProfile_Channel4_MainStream/2025-08-28_04_27_50.jpg','{\'person\': 3, \'chair\': 2}',5,'B',0,'2025-08-28 04:27:52.801684',76),(1566,1475,'/app/media/MediaProfile_Channel4_MainStream/2025-08-28_04_27_56.jpg','{\'person\': 5, \'chair\': 2}',7,'B',0,'2025-08-28 04:27:58.309939',76),(1567,1475,'/app/media/MediaProfile_Channel4_MainStream/2025-08-28_04_27_57.jpg','{\'person\': 6, \'chair\': 2}',8,'B',0,'2025-08-28 04:27:58.899624',76),(1568,1476,'E:\\analytic1\\analytic\\analysis_db_writer\\media\\MediaProfile_Channel1_MainStream\\2025-08-28_11_37_00.jpg','{\'helmet\': 2}',2,'B',0,'2025-08-28 06:07:17.224198',76),(1569,1476,'E:\\analytic1\\analytic\\analysis_db_writer\\media\\MediaProfile_Channel1_MainStream\\2025-08-28_11_37_01.jpg','{\'helmet\': 1}',1,'B',0,'2025-08-28 06:07:18.870834',76),(1570,1476,'E:\\analytic1\\analytic\\analysis_db_writer\\media\\MediaProfile_Channel1_MainStream\\2025-08-28_11_37_23.jpg','{\'helmet\': 3}',3,'B',0,'2025-08-28 06:07:35.183663',76),(1571,1483,'\"/app/media/MediaProfile_Channel1_MainStream/2025-08-12_21_52_40.jpg\"','\"{\'chair\': 2}\"',2,'B',1,'2025-08-28 06:27:39.964739',83),(1572,1483,'E:\\analytic1\\analytic\\analysis_db_writer\\media\\192.168.1.101\\2025-08-28_12_05_16.jpg','{\'head\': 1}',1,'B',0,'2025-08-28 06:35:17.943859',76);
/*!40000 ALTER TABLE `cameraalerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cameraalertstatuss`
--

DROP TABLE IF EXISTS `cameraalertstatuss`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cameraalertstatuss` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `Recording` tinyint(1) NOT NULL,
  `ANPR` tinyint(1) NOT NULL,
  `Snapshot` tinyint(1) NOT NULL,
  `PersonDetection` tinyint(1) NOT NULL,
  `FireDetection` tinyint(1) NOT NULL,
  `AnimalDetection` tinyint(1) NOT NULL,
  `BikeDetection` tinyint(1) NOT NULL,
  `MaskDetection` tinyint(1) NOT NULL,
  `UmbrelaDetection` tinyint(1) NOT NULL,
  `BrifecaseDetection` tinyint(1) NOT NULL,
  `GarbageDetection` tinyint(1) NOT NULL,
  `WeaponDetection` tinyint(1) NOT NULL,
  `WrongDetection` tinyint(1) NOT NULL,
  `QueueDetection` tinyint(1) NOT NULL,
  `SmokeDetection` tinyint(1) NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_CameraAlertStatuss_CameraId` (`CameraId`),
  KEY `fk_cameraalert_UserId` (`UserId`),
  CONSTRAINT `fk_cameraalert_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_CameraAlertStatuss_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1319 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cameraalertstatuss`
--

LOCK TABLES `cameraalertstatuss` WRITE;
/*!40000 ALTER TABLE `cameraalertstatuss` DISABLE KEYS */;
INSERT INTO `cameraalertstatuss` VALUES (49,180,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2024-12-25 16:22:57.387693',62),(50,181,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2024-12-25 16:22:29.308952',62),(51,182,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2024-12-30 08:47:28.460544',63),(63,195,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2024-12-31 10:47:34.419988',65),(64,196,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2024-12-31 11:06:08.643847',66),(65,197,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2024-12-31 11:06:57.553557',66),(79,211,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-01-07 05:13:49.279155',66),(218,351,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-07-22 05:29:01.088497',75),(219,352,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2025-07-22 05:31:00.715492',75),(357,511,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-01 10:40:47.175449',79),(358,512,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-01 10:07:47.573816',79),(359,513,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-01 10:10:41.253403',80),(360,514,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-01 10:11:32.401476',80),(367,523,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-04 08:54:15.850944',64),(369,525,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-04 09:16:48.850568',64),(374,530,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-05 05:40:08.931016',78),(375,531,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-05 06:04:27.510773',78),(379,535,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-05 08:13:59.478908',81),(380,536,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-05 08:13:52.306872',81),(381,537,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-05 08:13:40.751672',81),(382,538,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-05 09:24:11.263355',78),(588,746,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-22 18:01:55.557311',83),(589,747,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-22 18:01:55.584426',83),(590,748,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-22 18:01:55.608857',83),(1098,1263,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-26 19:38:28.837708',67),(1099,1264,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-26 19:38:29.018108',67),(1100,1265,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-26 19:38:29.084808',67),(1101,1266,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-26 19:38:29.199703',67),(1303,1468,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:24:57.739264',76),(1304,1469,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:24:57.782115',76),(1305,1470,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:24:57.811552',76),(1306,1471,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:24:57.838760',76),(1307,1472,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:26:38.012687',76),(1308,1473,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:26:38.050816',76),(1309,1474,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:26:38.106535',76),(1310,1475,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:28:03.921090',76),(1311,1476,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 06:07:30.871451',76),(1312,1477,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:29:23.844537',76),(1313,1478,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:29:23.886033',76),(1314,1479,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:29:23.916098',76),(1315,1480,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:38:54.175372',82),(1316,1481,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:38:54.355604',82),(1317,1482,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:38:54.528259',82),(1318,1483,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-08-28 04:38:54.881410',82);
/*!40000 ALTER TABLE `cameraalertstatuss` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cameraiplists`
--

DROP TABLE IF EXISTS `cameraiplists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cameraiplists` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraIP` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ObjectList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_CameraIPLists_CameraIP` (`CameraIP`),
  KEY `fk_camera_ip_UserId` (`UserId`),
  CONSTRAINT `fk_camera_ip_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cameraiplists`
--

LOCK TABLES `cameraiplists` WRITE;
/*!40000 ALTER TABLE `cameraiplists` DISABLE KEYS */;
INSERT INTO `cameraiplists` VALUES (3,'MediaProfile_Channel2_MainStream','[\"Fire\",\"Person\",\"Chair\",\"Couch\"]','2024-12-30 06:24:32.930237',77),(4,'MediaProfile_Channel7_MainStream','[]','2025-01-03 07:20:22.169394',67),(5,'MediaProfile_Channel6_MainStream','[]','2025-01-07 08:49:21.983630',67),(6,'MediaProfile_Channel3_MainStream','[\"Fire\",\"Person\",\"Chair\"]','2025-01-08 05:50:59.538873',76),(7,'117.211.78.51','[\"Bird\",\"Bicycle\",\"Car\",\"Person\",\"Dog\",\"Cat\",\"Chair\"]','2025-07-09 22:23:46.303365',67),(8,'01@117.211.78.5','[\"Person\",\"Bird\",\"Chair\",\"Car\"]','2025-07-10 16:48:15.383868',67),(9,'rtsp://admin:Central@0001','[\"Bicycle\",\"Car\"]','2025-07-10 18:09:19.470150',67),(10,'MediaProfile_Channel1_MainStream','[\"Chair\",\"Person\",\"Fire\",\"Laptop\",\"Keyboard\"]','2025-07-17 06:47:01.858812',76),(11,'MediaProfile_Channel4_MainStream','[\"Chair\",\"Person\",\"Without Seat belt\"]','2025-07-17 15:51:21.676895',76);
/*!40000 ALTER TABLE `cameraiplists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camerarecords`
--

DROP TABLE IF EXISTS `camerarecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camerarecords` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `RecordPath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_CameraRecords_CameraId` (`CameraId`),
  CONSTRAINT `FK_CameraRecords_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camerarecords`
--

LOCK TABLES `camerarecords` WRITE;
/*!40000 ALTER TABLE `camerarecords` DISABLE KEYS */;
/*!40000 ALTER TABLE `camerarecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cameras`
--

DROP TABLE IF EXISTS `cameras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cameras` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CameraIP` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Area` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `NVRId` int NOT NULL,
  `Brand` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Manufacture` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `MacAddress` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Make` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Port` int DEFAULT NULL,
  `ChannelId` int DEFAULT NULL,
  `Latitude` decimal(65,30) DEFAULT NULL,
  `Longitude` decimal(65,30) DEFAULT NULL,
  `InstallationDate` datetime(6) DEFAULT NULL,
  `LastLive` datetime(6) DEFAULT NULL,
  `RTSPURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PinCode` int DEFAULT NULL,
  `isRecording` tinyint(1) DEFAULT NULL,
  `isStreaming` tinyint(1) DEFAULT NULL,
  `isANPR` tinyint(1) DEFAULT NULL,
  `Status` tinyint(1) NOT NULL,
  `UpdateDate` datetime(6) DEFAULT NULL,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Cameras_NVRId` (`NVRId`),
  KEY `fk_cameras_UserId` (`UserId`),
  CONSTRAINT `FK_Cameras_NVR_NVRId` FOREIGN KEY (`NVRId`) REFERENCES `nvr` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cameras_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1484 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cameras`
--

LOCK TABLES `cameras` WRITE;
/*!40000 ALTER TABLE `cameras` DISABLE KEYS */;
INSERT INTO `cameras` VALUES (180,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','NONE','Delhi',34,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2024-12-25 16:18:13.988072',62),(181,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','NONE','Delhi',34,'NONE','NONE','NONE',NULL,554,2,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2024-12-25 16:20:57.249867',62),(182,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','NONE','noida',36,'NONE','NONE','NONE',NULL,554,3,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2024-12-30 04:54:56.514287',63),(195,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','East','Noida',41,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2024-12-31 10:38:17.757483',65),(196,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','East','Delhi',42,'NONE',NULL,'NONE',NULL,554,3,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2024-12-31 11:06:03.961182',66),(197,'MediaProfile_Channel6_MainStream','MediaProfile_Channel6_MainStream','East','Delhi',42,'NONE',NULL,'NONE',NULL,554,6,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=6&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2024-12-31 11:06:09.905083',66),(211,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','East','Delhi',42,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-01-07 05:13:39.488447',66),(351,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','west','Noida',68,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-07-22 05:28:54.766860',75),(352,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','west','Noida',68,'NONE','NONE','NONE',NULL,554,2,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-07-22 05:29:38.305641',75),(511,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','NA','NA',105,'NONE',NULL,'NONE',NULL,554,1,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-01 10:07:35.812967',79),(512,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','NA','NA',105,'NONE',NULL,'NONE',NULL,554,2,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-01 10:07:42.043031',79),(513,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','West','Noida',106,'NONE',NULL,'NONE',NULL,554,2,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-01 10:10:36.234062',80),(514,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','West','Noida',106,'NONE',NULL,'NONE',NULL,554,1,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-01 10:10:41.271889',80),(523,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','east','India',108,'NONE','NONE','NONE',NULL,554,2,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-04 08:47:41.275366',64),(525,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','east','India',108,'NONE','NONE','NONE',NULL,554,3,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-04 08:55:18.241208',64),(530,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','east','India',103,'NONE','NONE','NONE',NULL,554,3,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-05 04:58:33.602238',78),(531,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','east','India',103,'NONE','NONE','NONE',NULL,554,2,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-05 05:40:41.500533',78),(535,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','west','noida',107,'NONE','NONE','NONE',NULL,554,3,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-05 08:08:17.901852',81),(536,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','west','noida',107,'NONE','NONE','NONE',NULL,554,2,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-05 08:11:37.436300',81),(537,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','west','noida',107,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-05 08:11:46.259094',81),(538,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','east','India',103,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-05 09:24:02.692882',78),(746,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','west','noida',110,'NONE',NULL,'NONE',NULL,554,2,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-22 18:01:55.535216',83),(747,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','west','noida',110,'NONE',NULL,'NONE',NULL,554,1,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-22 18:01:55.568607',83),(748,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','west','noida',110,'NONE',NULL,'NONE',NULL,554,3,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-22 18:01:55.594273',83),(1263,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','west','noida',127,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-26 19:38:28.767815',67),(1264,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','west','noida',127,'NONE','NONE','NONE',NULL,554,2,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-26 19:38:28.951446',67),(1265,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','west','noida',127,'NONE','NONE','NONE',NULL,554,3,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-26 19:38:29.040481',67),(1266,'MediaProfile_Channel4_MainStream','MediaProfile_Channel4_MainStream','west','noida',127,'NONE','NONE','NONE',NULL,554,4,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-26 19:38:29.138501',67),(1468,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','West','Noida',158,'NONE',NULL,'NONE',NULL,554,1,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:24:57.717962',76),(1469,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','West','Noida',158,'NONE',NULL,'NONE',NULL,554,2,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:24:57.755176',76),(1470,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','West','Noida',158,'NONE',NULL,'NONE',NULL,554,3,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:24:57.792909',76),(1471,'MediaProfile_Channel4_MainStream','MediaProfile_Channel4_MainStream','West','Noida',158,'NONE',NULL,'NONE',NULL,554,4,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:24:57.821978',76),(1472,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','West','Noida',159,'NONE',NULL,'NONE',NULL,554,2,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:26:37.995058',76),(1473,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','West','Noida',159,'NONE',NULL,'NONE',NULL,554,1,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:26:38.024287',76),(1474,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','West','Noida',159,'NONE',NULL,'NONE',NULL,554,3,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:26:38.064619',76),(1475,'MediaProfile_Channel4_MainStream','MediaProfile_Channel4_MainStream','West','Noida',159,'NONE',NULL,'NONE',NULL,554,4,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:26:38.119605',76),(1476,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','West','Noida',160,'NONE',NULL,'NONE',NULL,554,1,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:29:23.789989',76),(1477,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','West','Noida',160,'NONE',NULL,'NONE',NULL,554,2,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:29:23.824462',76),(1478,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','West','Noida',160,'NONE',NULL,'NONE',NULL,554,3,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:29:23.854531',76),(1479,'MediaProfile_Channel4_MainStream','MediaProfile_Channel4_MainStream','West','Noida',160,'NONE',NULL,'NONE',NULL,554,4,21.146600000000000000000000000000,79.088900000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:29:23.895176',76),(1480,'MediaProfile_Channel1_MainStream','MediaProfile_Channel1_MainStream','West','Noida',129,'NONE','NONE','NONE',NULL,554,1,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:38:54.156409',82),(1481,'MediaProfile_Channel2_MainStream','MediaProfile_Channel2_MainStream','West','Noida',129,'NONE','NONE','NONE',NULL,554,2,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:38:54.338492',82),(1482,'MediaProfile_Channel3_MainStream','MediaProfile_Channel3_MainStream','West','Noida',129,'NONE','NONE','NONE',NULL,554,3,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:38:54.502216',82),(1483,'MediaProfile_Channel4_MainStream','MediaProfile_Channel4_MainStream','West','Noida',129,'NONE','NONE','NONE',NULL,554,4,21.140000000000000000000000000000,79.080000000000000000000000000000,NULL,NULL,'rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif',NULL,NULL,NULL,NULL,0,NULL,'2025-08-28 04:38:54.857570',82);
/*!40000 ALTER TABLE `cameras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cameratrackingdatas`
--

DROP TABLE IF EXISTS `cameratrackingdatas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cameratrackingdatas` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `VichelImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `NoPlateImage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `VichelNo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_CameraTrackingDatas_CameraId` (`CameraId`),
  CONSTRAINT `FK_CameraTrackingDatas_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cameratrackingdatas`
--

LOCK TABLES `cameratrackingdatas` WRITE;
/*!40000 ALTER TABLE `cameratrackingdatas` DISABLE KEYS */;
/*!40000 ALTER TABLE `cameratrackingdatas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(8,'app','activitylogs'),(9,'app','alertmasters'),(7,'app','anprstatus'),(10,'app','aspnetroleclaims'),(11,'app','aspnetroles'),(12,'app','aspnetuserclaims'),(13,'app','aspnetuserlogins'),(14,'app','aspnetuserroles'),(16,'app','aspnetusers'),(15,'app','aspnetusertokens'),(17,'app','cameraactivities'),(19,'app','cameraalerts'),(18,'app','cameraalertstatuss'),(20,'app','cameraiplists'),(21,'app','camerarecords'),(23,'app','cameras'),(22,'app','cameratrackingdatas'),(39,'app','efmigrationshistory'),(24,'app','features'),(25,'app','groups'),(26,'app','licenseactivations'),(27,'app','licenses'),(28,'app','multcameras'),(30,'app','numberplatedetections'),(29,'app','nvr'),(31,'app','profileandfeatures'),(32,'app','profiles'),(33,'app','readedvehiclenoplates'),(34,'app','roles'),(35,'app','usercamerapermissions'),(36,'app','users'),(37,'app','vehicledetections'),(38,'app','videoanalytics'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-12-21 17:45:45.355496'),(2,'auth','0001_initial','2024-12-21 17:45:45.933181'),(3,'admin','0001_initial','2024-12-21 17:45:46.053026'),(4,'admin','0002_logentry_remove_auto_add','2024-12-21 17:45:46.069014'),(5,'admin','0003_logentry_add_action_flag_choices','2024-12-21 17:45:46.075260'),(6,'contenttypes','0002_remove_content_type_name','2024-12-21 17:47:00.648211'),(7,'auth','0002_alter_permission_name_max_length','2024-12-21 17:47:00.717356'),(8,'auth','0003_alter_user_email_max_length','2024-12-21 17:47:00.739950'),(9,'auth','0004_alter_user_username_opts','2024-12-21 17:47:00.752367'),(10,'auth','0005_alter_user_last_login_null','2024-12-21 17:47:00.816044'),(11,'auth','0006_require_contenttypes_0002','2024-12-21 17:47:00.823357'),(12,'auth','0007_alter_validators_add_error_messages','2024-12-21 17:47:00.832923'),(13,'auth','0008_alter_user_username_max_length','2024-12-21 17:47:00.882315'),(14,'auth','0009_alter_user_last_name_max_length','2024-12-21 17:47:00.950575'),(15,'auth','0010_alter_group_name_max_length','2024-12-21 17:47:00.971718'),(16,'auth','0011_update_proxy_permissions','2024-12-21 17:47:01.003457'),(17,'auth','0012_alter_user_first_name_max_length','2024-12-21 17:47:01.048824'),(18,'sessions','0001_initial','2024-12-21 17:47:01.094591'),(19,'app','0001_initial','2024-12-21 20:00:35.284060'),(20,'app','0002_remove_cameraactivities_cameraid_and_more','2024-12-21 20:00:35.304098'),(21,'app','0003_alter_nvr_options_anprstatus_cameraid_and_more','2024-12-21 20:00:35.310391'),(22,'app','0004_alter_anprstatus_options_alter_cameraalerts_options_and_more','2024-12-22 06:46:38.113291'),(23,'app','0005_alter_anprstatus_table_alter_cameraalerts_table_and_more','2024-12-25 16:11:14.787962');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `features` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ProfileId` int NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Features_ProfileId` (`ProfileId`),
  CONSTRAINT `FK_Features_Profiles_ProfileId` FOREIGN KEY (`ProfileId`) REFERENCES `profiles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fire_detection`
--

DROP TABLE IF EXISTS `fire_detection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fire_detection` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int DEFAULT NULL,
  `framePath` varchar(1000) DEFAULT NULL,
  `AlertStatus` varchar(100) DEFAULT NULL,
  `RegDate` varchar(50) DEFAULT NULL,
  `Alert` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fire_detection`
--

LOCK TABLES `fire_detection` WRITE;
/*!40000 ALTER TABLE `fire_detection` DISABLE KEYS */;
INSERT INTO `fire_detection` VALUES (4,288,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-18_13_02_11.jpg','B','2025-07-18 13:02:11','Fire',67),(5,288,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-18_14_16_45.jpg','B','2025-07-18 14:16:45','Fire',67),(6,288,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-18_14_32_22.jpg','B','2025-07-18 14:32:22','Fire',67),(7,306,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_11_59_44.jpg','B','2025-07-21 11:59:44','Fire',67),(8,309,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_12_12_58.jpg','B','2025-07-21 12:12:58','Fire',67),(9,309,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_12_25_03.jpg','B','2025-07-21 12:25:03','Fire',67),(10,319,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\122.186.21.222\\2025-07-22_10_45_04.jpg','B','2025-07-22 10:45:04','Fire',67),(11,319,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\122.186.21.222\\2025-07-22_10_45_10.jpg','B','2025-07-22 10:45:10','Fire',67),(12,319,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\122.186.21.222\\2025-07-22_10_45_55.jpg','B','2025-07-22 10:45:55','Fire',67),(13,365,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-22_14_08_22.jpg','B','2025-07-22 14:08:22','Fire',67),(14,365,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-22_14_27_13.jpg','B','2025-07-22 14:27:13','Fire',67),(15,365,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-23_13_05_32.jpg','B','2025-07-23 13:05:32','Fire',67),(16,365,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-23_13_10_13.jpg','B','2025-07-23 13:10:13','Fire',67),(17,365,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-23_13_10_14.jpg','B','2025-07-23 13:10:14','Fire',67),(18,521,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel1_MainStream\\2025-08-04_12_28_37.jpg','B','2025-08-04 12:28:37','Fire',64),(19,521,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel1_MainStream\\2025-08-04_12_28_38.jpg','B','2025-08-04 12:28:38','Fire',64),(20,521,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel1_MainStream\\2025-08-04_12_28_40.jpg','B','2025-08-04 12:28:40','Fire',64),(21,525,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel3_MainStream\\2025-08-04_14_26_15.jpg','B','2025-08-04 14:26:15','Fire',64),(22,525,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel3_MainStream\\2025-08-04_14_27_57.jpg','B','2025-08-04 14:27:57','Fire',64),(23,525,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel3_MainStream\\2025-08-04_14_28_26.jpg','B','2025-08-04 14:28:26','Fire',64),(24,525,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel3_MainStream\\2025-08-04_14_42_51.jpg','B','2025-08-04 14:42:51','Fire',64),(25,525,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel3_MainStream\\2025-08-04_14_42_52.jpg','B','2025-08-04 14:42:52','Fire',64),(26,525,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel3_MainStream\\2025-08-04_14_42_55.jpg','B','2025-08-04 14:42:55','Fire',64),(27,525,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel3_MainStream\\2025-08-04_14_42_56.jpg','B','2025-08-04 14:42:56','Fire',64),(28,553,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel2_MainStream\\2025-08-20_15_49_12.jpg','B','2025-08-20 15:49:12','Fire',67);
/*!40000 ALTER TABLE `fire_detection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Groups_Name` (`Name`),
  KEY `fk_Groups_UserId` (`UserId`),
  CONSTRAINT `fk_Groups_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licenseactivations`
--

DROP TABLE IF EXISTS `licenseactivations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licenseactivations` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `LicenseId` int NOT NULL,
  `MachineIP` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ExpiryDate` datetime(6) NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_LicenseActivations_LicenseId` (`LicenseId`),
  KEY `IX_LicenseActivations_UserId` (`UserId`),
  CONSTRAINT `FK_LicenseActivations_Licenses_LicenseId` FOREIGN KEY (`LicenseId`) REFERENCES `licenses` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_LicenseActivations_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licenseactivations`
--

LOCK TABLES `licenseactivations` WRITE;
/*!40000 ALTER TABLE `licenseactivations` DISABLE KEYS */;
/*!40000 ALTER TABLE `licenseactivations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licenses`
--

DROP TABLE IF EXISTS `licenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licenses` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LicenseKey` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductCode` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Days` int NOT NULL,
  `TotalPC` int NOT NULL,
  `TotalCamera` int NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licenses`
--

LOCK TABLES `licenses` WRITE;
/*!40000 ALTER TABLE `licenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `licenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `multcameras`
--

DROP TABLE IF EXISTS `multcameras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `multcameras` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RTSPURL` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Latitude` decimal(65,30) DEFAULT NULL,
  `Longitude` decimal(65,30) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `multcameras`
--

LOCK TABLES `multcameras` WRITE;
/*!40000 ALTER TABLE `multcameras` DISABLE KEYS */;
/*!40000 ALTER TABLE `multcameras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `numberplatedetections`
--

DROP TABLE IF EXISTS `numberplatedetections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `numberplatedetections` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `PlatePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_NumberPlateDetections_CameraId` (`CameraId`),
  KEY `fk_number_plate_UserId` (`UserId`),
  CONSTRAINT `fk_number_plate_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_NumberPlateDetections_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `numberplatedetections`
--

LOCK TABLES `numberplatedetections` WRITE;
/*!40000 ALTER TABLE `numberplatedetections` DISABLE KEYS */;
/*!40000 ALTER TABLE `numberplatedetections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nvr`
--

DROP TABLE IF EXISTS `nvr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nvr` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NVRIP` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Port` int NOT NULL,
  `Username` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `NVRType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Model` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Make` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Zone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  `IMG` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Responsible_Person` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_nvr_UserId` (`UserId`),
  CONSTRAINT `fk_nvr_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nvr`
--

LOCK TABLES `nvr` WRITE;
/*!40000 ALTER TABLE `nvr` DISABLE KEYS */;
INSERT INTO `nvr` VALUES (34,'CP-UNR-4K2162-V3CPPLUS','14.195.152.243',80,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Delhi','CPPLUS','East',0,'2024-12-25 15:37:27.531228','','Mohan,7888',62),(35,'CP-UNR-4K2162-V2CPPLUS1','14.195.152.243',80,'admin','admin@123','','CP-UNR-4K2162-V2','Delhi','CPPLUS','East',0,'2024-12-28 14:45:20.541260','','NA,123',62),(36,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',80,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','noida','CPPLUS','sector 124',0,'2024-12-30 04:51:19.741989','data/images/Capture1.JPG','manoj,785946022',63),(41,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',80,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Noida','CPPLUS','East',0,'2024-12-31 09:32:12.857647','data/images/download_1_EhmTWT9.jpeg','Shubham,9087654321',65),(42,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',80,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Delhi','CPPLUS','East',0,'2024-12-31 11:06:01.093940','data/images/images.jpeg','Mohan,67',66),(68,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',80,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Noida','CPPLUS','west',0,'2025-07-22 04:27:47.767900','',',',75),(102,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','India','CPPLUS','east',0,'2025-07-31 06:44:19.142168','','ss,1234567890',77),(103,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','India','CPPLUS','east',0,'2025-07-31 09:37:52.565245','','s2,1234567890',78),(105,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','NA','CPPLUS','NA',0,'2025-08-01 10:07:35.218558','','NA,1234567890',79),(106,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Noida','CPPLUS','West',0,'2025-08-01 10:10:36.212384','',',',80),(107,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','noida','CPPLUS','west',0,'2025-08-01 11:04:54.506553','','Sh,9876543212',81),(108,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','India','CPPLUS','east',0,'2025-08-04 06:16:06.288483','','s2,1234567890',64),(110,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','noida','CPPLUS','west',0,'2025-08-22 18:01:55.370367','',',',83),(127,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','noida','CPPLUS','west',0,'2025-08-26 19:36:56.847850','',',',67),(129,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Noida','CPPLUS','West',0,'2025-08-26 20:11:36.203724','',',',82),(158,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Noida','CPPLUS','West',0,'2025-08-28 04:24:57.640357','',',',76),(159,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Noida','CPPLUS','West',0,'2025-08-28 04:26:37.954852','',',',76),(160,'CP-UNR-4K2162-V2CPPLUS','14.195.152.243',8080,'admin','admin@123',NULL,'CP-UNR-4K2162-V2','Noida','CPPLUS','West',0,'2025-08-28 04:29:23.753114','',',',76);
/*!40000 ALTER TABLE `nvr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profileandfeatures`
--

DROP TABLE IF EXISTS `profileandfeatures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profileandfeatures` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProfileId` int NOT NULL,
  `FeaturesId` int DEFAULT NULL,
  `FeatureId` int NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ProfileAndFeatures_FeaturesId` (`FeaturesId`),
  KEY `IX_ProfileAndFeatures_ProfileId` (`ProfileId`),
  CONSTRAINT `FK_ProfileAndFeatures_Features_FeaturesId` FOREIGN KEY (`FeaturesId`) REFERENCES `features` (`Id`),
  CONSTRAINT `FK_ProfileAndFeatures_Profiles_ProfileId` FOREIGN KEY (`ProfileId`) REFERENCES `profiles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profileandfeatures`
--

LOCK TABLES `profileandfeatures` WRITE;
/*!40000 ALTER TABLE `profileandfeatures` DISABLE KEYS */;
/*!40000 ALTER TABLE `profileandfeatures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `readedvehiclenoplates`
--

DROP TABLE IF EXISTS `readedvehiclenoplates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `readedvehiclenoplates` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FramePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PlatePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `CameraId` int NOT NULL,
  `Text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ReadedVehicleNoPlates_CameraId` (`CameraId`),
  KEY `fk_read_plate_UserId` (`UserId`),
  CONSTRAINT `fk_read_plate_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_ReadedVehicleNoPlates_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `readedvehiclenoplates`
--

LOCK TABLES `readedvehiclenoplates` WRITE;
/*!40000 ALTER TABLE `readedvehiclenoplates` DISABLE KEYS */;
/*!40000 ALTER TABLE `readedvehiclenoplates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rodent_detection`
--

DROP TABLE IF EXISTS `rodent_detection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rodent_detection` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int DEFAULT NULL,
  `framePath` varchar(1000) DEFAULT NULL,
  `AlertStatus` varchar(100) DEFAULT NULL,
  `RegDate` varchar(50) DEFAULT NULL,
  `Alert` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rodent_detection`
--

LOCK TABLES `rodent_detection` WRITE;
/*!40000 ALTER TABLE `rodent_detection` DISABLE KEYS */;
INSERT INTO `rodent_detection` VALUES (1,288,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-18_17_31_45.jpg','B','2025-07-18 17:31:45','Rodent',67),(2,297,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-18_18_47_39.jpg','B','2025-07-18 18:47:39','Rodent',67),(3,306,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_11_21_17.jpg','B','2025-07-21 11:21:17','Rodent',67),(4,306,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_11_36_45.jpg','B','2025-07-21 11:36:45','Rodent',67),(5,306,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_12_00_14.jpg','B','2025-07-21 12:00:14','Rodent',67),(6,306,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_12_00_15.jpg','B','2025-07-21 12:00:15','Rodent',67),(7,309,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_12_13_51.jpg','B','2025-07-21 12:13:51','Rodent',67),(8,309,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\MediaProfile_Channel4_MainStream\\2025-07-21_12_25_04.jpg','B','2025-07-21 12:25:04','Rodent',67),(9,319,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\122.186.21.222\\2025-07-22_10_45_10.jpg','B','2025-07-22 10:45:10','Rodent',67),(10,319,'C:\\Users\\Administrator\\Desktop\\ANPR\\writer\\media\\122.186.21.222\\2025-07-22_10_45_18.jpg','B','2025-07-22 10:45:18','Rodent',67);
/*!40000 ALTER TABLE `rodent_detection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Roles_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin',1,'2024-11-29 13:13:31.504694'),(2,'personal',1,'2024-12-18 15:49:30.456211'),(3,'Organization',1,'2024-12-18 15:49:50.511301');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usercamerapermissions`
--

DROP TABLE IF EXISTS `usercamerapermissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usercamerapermissions` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `CameraId` int NOT NULL,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_UserCameraPermissions_CameraId` (`CameraId`),
  KEY `IX_UserCameraPermissions_UserId` (`UserId`),
  CONSTRAINT `FK_UserCameraPermissions_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_UserCameraPermissions_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usercamerapermissions`
--

LOCK TABLES `usercamerapermissions` WRITE;
/*!40000 ALTER TABLE `usercamerapermissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `usercamerapermissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FirstName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `LastName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `MobileNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EmailId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `RoleId` int NOT NULL,
  `Image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Users_EmailId` (`EmailId`),
  UNIQUE KEY `IX_Users_MobileNo` (`MobileNo`),
  UNIQUE KEY `IX_Users_Username` (`Username`),
  KEY `IX_Users_RoleId` (`RoleId`),
  CONSTRAINT `FK_Users_Roles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (60,'Shruti','Kalra','9999999999','shru@gmail.com','shruti','pbkdf2_sha256$720000$szjayyvZV7y5NUBMsO2g3U$5OU/IgDnruoGoF15Fy5qW8Z1LVqGW9vqaVqMwBYaCvA=',2,'',1,'2024-12-24 17:30:29.054087'),(61,'Vishal','Gupta','9654323500','vishal.gupta@ajeevi.com','vgupta','pbkdf2_sha256$720000$cHO5Kh9Xt3wRYaqj06ckRK$JoOj9++IwZA5BBNjzGDqSU7KgwMCZSXycsugCRYuKDk=',2,'',1,'2024-12-25 06:47:40.341267'),(62,'Raunak','Singh','5544332217','raunak@gmaul.com','dummy','pbkdf2_sha256$720000$voXwldenPd9ddn2wPuamHY$wqmfhGruJLng7AsNmYHeXkxI3sB970b1904Yz325UC4=',2,'',1,'2024-12-25 15:34:05.711087'),(63,'manoj','shakya','7895643022','manojshakya444@gmail.com','manoj','pbkdf2_sha256$720000$S4ycRHGdOmN22x8QekVm1Z$HDA6aFJCFnILhJSX1RUcSl2rjLmzf756el0i6wxTZW4=',2,'',1,'2024-12-30 04:22:52.299242'),(64,'SATYA','GADE','2323232323','xidober582@cutxsew.com','w1','pbkdf2_sha256$720000$RbyxPSaKbJy3OZoR4wSS3H$ZpoWxRjWVQYp1SaMkOHDCBSVWZQuGP1zl40QXEFGyFQ=',2,'',1,'2024-12-30 04:26:11.785989'),(65,'Shubham','AKRAM','2323232324','test@gmail.com','d1','pbkdf2_sha256$720000$6nsEEn7rrUwCtSPKfo2nEJ$VvmMNmHKLXCbJxcb2j+RGnCvdcaKnbKlqRBdBbl6bDo=',2,'',1,'2024-12-31 09:10:58.474028'),(66,'Harshit','Rai','9911223311','rai@gmail.com','harshit','pbkdf2_sha256$720000$SZ0Mcy9vn8RoA4KnkHflI2$+Jihb2bm//4N40GlNbp3awqiTPZys5guNEgqIVEebHE=',2,'',1,'2024-12-31 09:11:11.677778'),(67,'Steve','Rogers','9891989198','steve@gmail.com','s1','pbkdf2_sha256$720000$fG5cIIUQdsWgbbjzvek8RN$vBWz5STJertZ1Op4aBxsqrVHEhL1thvjfdoQ7eQuYck=',2,'',1,'2025-01-02 05:18:24.560903'),(68,'demo','demo','8877665544','fff@fe.com','demo123','pbkdf2_sha256$720000$hou7byGj8jvbuH3YfsXxZ1$Dr6Bgcy6y8wGHEE3xRL+A1c473E2hGXSZs69Fit4Imk=',2,'',1,'2025-01-04 09:17:34.381642'),(69,'Hello','Hello','6789987645','hello@gmail.com','hello','pbkdf2_sha256$720000$mbvU11SJTDcNjjhRY0wIy6$LAckiTgwE1dSClN7U+3og2W3rkPSikWCqNPpKX12OKo=',2,'',1,'2025-01-09 10:46:45.016209'),(70,'new','hi','6677889988','hi@gmail.com','hi','pbkdf2_sha256$720000$Cu52iLzljtY9NHCjUAXXMN$sQzBJEMcSZ1IWmhY5fJ3ae6Hb1zCN6asKvIQXbCcT54=',2,'',1,'2025-01-09 11:59:21.093851'),(71,'Abhinav','Singh','2233445566','abhi@gmail.com','abhinav','pbkdf2_sha256$720000$41iT1mrrXK0mFvlZrTis6V$a1BPNn730LStshBjNg5VRqev8aS5Df8Z3JeacNyAvX0=',2,'',1,'2025-01-16 14:51:47.001145'),(72,'manoj','shakya','7895642530','shakyamanoj4444@gmail.com','ajeevi','pbkdf2_sha256$720000$2RfqaM5H3m5mTw2nPIuYQ7$CRyHyeuiktL6SywTY5JunyMpVz85mM2NpEBK8g4fF3A=',2,'',1,'2025-07-17 09:24:21.973137'),(73,'Manoj','Shakya','7895686435','shakyamanoj@gail.com','m1','pbkdf2_sha256$720000$aXCC1bqbwM7Hr5oG6gquy7$dOS2EdnH+xq/3bOp1z2r6K+l1yS/1lDShHLg547zYyw=',2,'',1,'2025-07-21 07:18:21.461027'),(74,'Vijay','Rathore','7505715427','vijay.rathore@agiletech.co.in','vijay','pbkdf2_sha256$720000$qfB8wqM77PxZUqU8L30lP7$hmEoAD5Gv78iO1UDOzsqZR5cb9+jEAKCuvJbeSTOvQc=',2,'',1,'2025-07-21 11:35:58.629559'),(75,'Dharmendra','Yadav','3344557788','dhar@gmail.com','dhar','pbkdf2_sha256$720000$NSgozhpY16CSTUKiPf7oxn$Ol5E/a+KebEh7wEDviZohXh5qihwtv2sMiKeKpaHvvA=',3,'',1,'2025-07-21 12:41:19.931351'),(76,'DM Yadav','Yadav','9889939995','dhar1@gmail.com','dm1','pbkdf2_sha256$720000$2DbJrPaDzrOMXCJzhPGl3l$w8fJI6v1dOWI7j3Pb3SqzFkUmiMPAY9Eb5dDxa7L+b8=',2,'',1,'2025-07-22 05:49:27.135887'),(77,'q1','q1','7895642556','shaky4444@gmail.com','q1','pbkdf2_sha256$720000$X6nDxz22nhQF9fXGHwyAsY$uaRxKTzCdm7vLB4zjcu37w2t+LJK3KYCt4rOxFayxsk=',2,'',1,'2025-07-29 10:35:08.359652'),(78,'z1','z1','1234567899','veconew938@calmpros.com','z1','pbkdf2_sha256$720000$CkFPFoQWWcwVxHU4pT8qWu$73nuVXR4FmAoZge1x+sV70agewFmoxdt39dHrCpoHXE=',2,'',1,'2025-07-31 06:50:32.239076'),(79,'Demo_1','Singh','1234567890','demo1@demo.com','11','pbkdf2_sha256$720000$wVTrqc24s99SJoMLe2eSNi$56ytI5Aeju6YwzbGXib7874aiMNV8qQnR52rEZ6NCcc=',2,'',1,'2025-08-01 10:06:47.325217'),(80,'Shyam','Singh','9098765734','Shyam1234@gmail.com','l1','pbkdf2_sha256$720000$pb8ccYMREVNCvN92tWm7MU$MI1JEnwRPo01oIIJ7sNRYZUXIInTvmJ2ZtMnA9EMrxM=',3,'',1,'2025-08-01 10:09:30.221164'),(81,'shruti','kalra','8888899876','shruti.kalra@12.com','shruti1','pbkdf2_sha256$720000$vkZHobj12WaW1EdRUXx8GQ$5/GE3Z6ZFtZDTZwHSfJjqXRJvZiqxZn2ef3g2fP/OM0=',2,'',1,'2025-08-01 11:00:09.123195'),(82,'dm','yadav','9897654321','dhear@gmail.com','n1','pbkdf2_sha256$720000$7vT70kr5zu5GeKSAee0Qk3$ijxaaE65+QJsTNhGLBBRggpJkp2udulQK8HypL3rrBM=',2,'',1,'2025-08-22 09:13:28.103193'),(83,'dr','yadav','2134535676','drdm@gmail.com','b1','pbkdf2_sha256$720000$SAnNZ2HUtJ8ttcZnBQhzRO$BjJtzcf3+ynTvH+C24+IEJ3vEz+PeLfOLTty4lXcWMY=',2,'',1,'2025-08-22 18:00:34.390788');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicledetections`
--

DROP TABLE IF EXISTS `vehicledetections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicledetections` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `FramePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `VehicleType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_VehicleDetections_CameraId` (`CameraId`),
  KEY `fk_vehicel_UserId` (`UserId`),
  CONSTRAINT `fk_vehicel_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_VehicleDetections_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicledetections`
--

LOCK TABLES `vehicledetections` WRITE;
/*!40000 ALTER TABLE `vehicledetections` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicledetections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videoanalytics`
--

DROP TABLE IF EXISTS `videoanalytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videoanalytics` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CameraId` int NOT NULL,
  `CameraIP` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `RTSPUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ObjectList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Status` tinyint(1) NOT NULL,
  `RegDate` datetime(6) NOT NULL,
  `UserId` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_VideoAnalytics_CameraId` (`CameraId`),
  KEY `fk_VideoAnalytics` (`UserId`),
  CONSTRAINT `fk_VideoAnalytics` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_VideoAnalytics_Cameras_CameraId` FOREIGN KEY (`CameraId`) REFERENCES `cameras` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=524 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videoanalytics`
--

LOCK TABLES `videoanalytics` WRITE;
/*!40000 ALTER TABLE `videoanalytics` DISABLE KEYS */;
INSERT INTO `videoanalytics` VALUES (58,195,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,1,'2024-12-31 10:38:54.992213',65),(59,195,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif',NULL,0,'2024-12-31 10:47:37.368730',65),(261,352,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Person\"]',1,'2025-07-22 05:31:00.762493',75),(420,511,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\"]',1,'2025-08-01 10:08:47.566642',79),(421,511,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\"]',0,'2025-08-01 10:10:34.200885',79),(422,514,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\"]',1,'2025-08-01 10:10:57.704168',80),(423,514,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\"]',0,'2025-08-01 10:11:32.426808',80),(424,511,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\"]',1,'2025-08-01 10:40:48.561990',79),(429,523,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Person\",\"Chair\"]',1,'2025-08-04 08:49:14.448810',64),(430,523,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-04 08:49:44.611984',64),(431,523,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-04 08:50:33.182964',64),(432,523,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-04 08:51:00.198100',64),(433,523,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-04 08:52:03.308418',64),(434,523,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',0,'2025-08-04 08:54:16.435808',64),(435,525,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-04 08:56:09.481135',64),(436,525,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',0,'2025-08-04 09:16:49.252612',64),(439,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-05 05:02:24.752761',78),(440,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-05 05:03:35.801440',78),(441,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-05 05:03:35.803558',78),(442,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-05 05:04:05.638389',78),(443,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-05 05:04:05.810121',78),(444,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-05 05:13:52.786844',78),(445,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:14:15.913522',78),(446,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',0,'2025-08-05 05:21:41.625484',78),(447,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:37:21.184527',78),(448,530,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',0,'2025-08-05 05:40:09.294734',78),(449,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Fire\"]',1,'2025-08-05 05:41:19.338953',78),(450,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:41:35.749142',78),(451,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:42:01.995513',78),(452,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:42:28.826711',78),(453,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',0,'2025-08-05 05:43:38.131100',78),(454,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:48:29.651682',78),(455,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',0,'2025-08-05 05:49:13.897555',78),(456,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:51:30.578632',78),(457,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',0,'2025-08-05 05:52:20.114848',78),(458,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:54:52.980740',78),(459,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',0,'2025-08-05 05:55:39.636579',78),(460,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 05:58:33.660882',78),(461,531,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',0,'2025-08-05 06:04:27.876604',78),(462,535,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 08:10:14.526980',81),(463,537,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Fire\"]',0,'2025-08-05 08:13:36.105343',81),(464,537,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Fire\"]',1,'2025-08-05 08:13:43.280098',81),(465,536,'MediaProfile_Channel2_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 08:13:53.351489',81),(466,535,'MediaProfile_Channel3_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=3&subtype=0&unicast=true&proto=Onvif','[\"Without Helmet\"]',1,'2025-08-05 08:14:00.822107',81),(518,1475,'MediaProfile_Channel4_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Without Seat belt\"]',1,'2025-08-28 04:27:43.433872',76),(519,1475,'MediaProfile_Channel4_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=4&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Without Seat belt\"]',0,'2025-08-28 04:28:03.962771',76),(520,1476,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Fire\",\"Laptop\",\"Keyboard\"]',1,'2025-08-28 06:05:15.315284',76),(521,1476,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Fire\",\"Laptop\",\"Keyboard\"]',0,'2025-08-28 06:06:16.969616',76),(522,1476,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Fire\",\"Laptop\",\"Keyboard\"]',1,'2025-08-28 06:06:58.350927',76),(523,1476,'MediaProfile_Channel1_MainStream','rtsp://admin:admin%40123@14.195.152.243:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif','[\"Chair\",\"Person\",\"Fire\",\"Laptop\",\"Keyboard\"]',0,'2025-08-28 06:07:31.077190',76);
/*!40000 ALTER TABLE `videoanalytics` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-28 15:24:31
