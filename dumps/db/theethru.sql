# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Database: THEETHRU
# Generation Time: 2021-02-14 08:24:10 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table commonCodes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `commonCodes`;

CREATE TABLE `commonCodes` (
  `code` varchar(64) NOT NULL DEFAULT '' COMMENT 'Code',
  `parentCode` varchar(64) DEFAULT NULL COMMENT 'Parent Code',
  `names` varchar(1024) NOT NULL DEFAULT '{}' COMMENT 'Code Name(JSON)',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `commonCodes` WRITE;
/*!40000 ALTER TABLE `commonCodes` DISABLE KEYS */;

INSERT INTO `commonCodes` (`code`, `parentCode`, `names`)
VALUES
	('genderType',NULL,'{\"en\":\"Gender\",\"ko\":\"성별\"}'),
	('genderType:etc','genderType','{\"en\":\"ETC\",\"ko\":\"기타\"}'),
	('genderType:female','genderType','{\"en\":\"Female\",\"ko\":\"여성\"}'),
	('genderType:male','genderType','{\"en\":\"Male\",\"ko\":\"남성\"}'),
	('genderType:unknown','genderType','{\"en\":\"Unknown\",\"ko\":\"알 수 없음\"}'),
	('signupType',NULL,'{\"en\":\"Signup Type\",\"ko\":\"회원가입 타입\"}'),
	('signupType:apple','signupType','{\"en\":\"Apple\",\"ko\":\"애플\"}'),
	('signupType:email','signupType','{\"en\":\"Email\",\"ko\":\"이메일\"}'),
	('signupType:facebook','signupType','{\"en\":\"Facebook\",\"ko\":\"페이스북\"}'),
	('signupType:google','signupType','{\"en\":\"Google\",\"ko\":\"구글\"}'),
	('userStatus',NULL,'{\"en\":\"User Status\",\"ko\":\"유저 상태\"}'),
	('userStatus:dormant','userStatus','{\"en\":\"Dormant Account\",\"ko\":\"휴면계정\"}'),
	('userStatus:locked','userStatus','{\"en\":\"Locked Account\",\"ko\":\"잠김 계정\"}'),
	('userStatus:normal','userStatus','{\"en\":\"Normal\",\"ko\":\"일반\"}'),
	('userStatus:secession','userStatus','{\"en\":\"Secession Account\",\"ko\":\"탈퇴 계정\"}');

/*!40000 ALTER TABLE `commonCodes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table images
# ------------------------------------------------------------

DROP TABLE IF EXISTS `images`;

CREATE TABLE `images` (
  `id` bigint(20) unsigned NOT NULL COMMENT 'ID',
  `bucket` varchar(256) NOT NULL DEFAULT '' COMMENT 'S3 bucket',
  `uri` varchar(1024) NOT NULL DEFAULT '' COMMENT 'S3 uri',
  `fileName` varchar(1024) NOT NULL DEFAULT '' COMMENT 'Original File Name',
  `fileSize` int(10) NOT NULL COMMENT 'File Size',
  `width` int(10) NOT NULL COMMENT 'Image Width',
  `height` int(10) NOT NULL COMMENT 'Image Height',
  `isActivated` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Activated or not',
  `isRemoved` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Removed or Not',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table refreshTokens
# ------------------------------------------------------------

DROP TABLE IF EXISTS `refreshTokens`;

CREATE TABLE `refreshTokens` (
  `id` varchar(64) NOT NULL DEFAULT '' COMMENT 'ID',
  `token` varchar(1024) NOT NULL DEFAULT '' COMMENT 'Refresh Token',
  `expiresAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` varchar(128) NOT NULL DEFAULT '' COMMENT 'ID',
  `signupTypeCode` varchar(64) NOT NULL DEFAULT 'signupType:email' COMMENT 'Signup Type Code(from commonCodes)',
  `email` varchar(256) NOT NULL DEFAULT '' COMMENT 'Email address(User ID)',
  `password` varchar(256) DEFAULT '' COMMENT 'Password(Hashed)',
  `name` varchar(32) DEFAULT '' COMMENT 'Name',
  `imageId` bigint(20) DEFAULT NULL,
  `genderTypeCode` varchar(64) DEFAULT 'genderType:unknown' COMMENT 'Gender Type Code(from commonCodes)',
  `userStatusCode` varchar(32) NOT NULL DEFAULT 'userStatus:normal' COMMENT 'User Status Code(from commonCodes)',
  `lastActivityAt` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Last Activity Time',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`signupTypeCode`,`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
