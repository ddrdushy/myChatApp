-- phpMyAdmin SQL Dump
-- version 3.5.5
-- http://www.phpmyadmin.net
--
-- Host: sql6.freemysqlhosting.net
-- Generation Time: Jan 04, 2017 at 08:07 AM
-- Server version: 5.5.49-0ubuntu0.14.04.1
-- PHP Version: 5.3.28

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sql6152186`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE IF NOT EXISTS `chat` (
  `user` varchar(100) NOT NULL,
  `id` varchar(50) NOT NULL,
  `status` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`user`, `id`, `status`) VALUES
('dushy', 'GMWmdUh81j8--me8AAAD', 'Y'),
('ddr', 'A8hLvab_daMyRxJwAAAC', 'N'),
('java', 'g0iQUDvnXbazhqSJAAAC', 'N');

-- --------------------------------------------------------

--
-- Table structure for table `pen_message`
--

CREATE TABLE IF NOT EXISTS `pen_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from` varchar(100) NOT NULL,
  `to` varchar(100) NOT NULL,
  `message` varchar(200) NOT NULL,
  `status` varchar(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=36 ;

--
-- Dumping data for table `pen_message`
--

INSERT INTO `pen_message` (`id`, `from`, `to`, `message`, `status`) VALUES
(1, 'ddr', 'dushy', 'dfgdf', 'Y'),
(2, 'ddr', 'dushy', 'sdfs', 'Y'),
(3, 'ddr', 'dushy', 'sdf', 'Y'),
(4, 'ddr', 'dushy', 'asdasd', 'Y'),
(5, 'ddr', 'dushy', 'dsfgsdfgd', 'Y'),
(6, 'java', 'dushy', 'dgdsfdf', 'Y'),
(7, 'java', 'dushy', 'fghfgh', 'Y'),
(8, 'java', 'dushy', 'sdf', 'Y'),
(9, 'ddr', 'dushy', 'sdf', 'Y'),
(10, 'ddr', 'dushy', 'sdfsgsdf', 'Y'),
(11, 'don', 'ddr', 'hello ddr', 'Y'),
(12, 'ddr', 'dushy', 'dgdfg', 'Y'),
(13, 'ddr', 'dushy', 'dfgfd', 'Y'),
(14, 'ddr', 'dushy', 'ow r u', 'Y'),
(15, 'ddr', 'dushy', 'How r u', 'Y'),
(16, 'ddr', 'dushy', 'How r u', 'Y'),
(17, 'ddr', 'dushy', 'How r u', 'Y'),
(18, 'ddr', 'dushy', 'How r u', 'Y'),
(19, 'ddr', 'dushy', 'How r u', 'Y'),
(20, 'don', 'dushy', 'How r u', 'Y'),
(21, 'don', 'dushy', 'How r u', 'Y'),
(22, 'don', 'dushy', 'How r u', 'Y'),
(23, 'don', 'dushy', 'How r u', 'Y'),
(24, 'don', 'ddr', 'Hsdfsdf', 'Y'),
(25, 'don', 'ddr', 'Hsdfsdf', 'Y'),
(26, 'don', 'ddr', 'Hsdfsdf', 'Y'),
(27, 'don', 'ddr', 'Hsdfsdf', 'Y'),
(28, 'don', 'ddr', 'Hsdfsdfsdfsf', 'Y'),
(29, 'don', 'ddr', 'Hsdfsdfsdfsf', 'Y'),
(30, 'don', 'ddr', 'Hsdfsdfsdfsf', 'Y'),
(31, 'don', 'ddr', 'Hsdfsdfsdfsf', 'Y'),
(32, 'don', 'ddr', 'Hsdfsdfsdfsf', 'Y'),
(33, 'don', 'ddr', 'Hsdfsdfsdfsf', 'Y'),
(34, 'don', 'ddr', 'Hsdf', 'Y'),
(35, 'ddr', 'dushy', 'helloadas', 'Y');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
