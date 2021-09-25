--之前的新闻数据表
CREATE TABLE `fetches` (
  `id_fetches` int(11)  NOT NULL AUTO_INCREMENT,
  `url` varchar(200) DEFAULT NULL,
  `source_name` varchar(200) DEFAULT NULL,
  `source_encoding` varchar(45) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `keywords` varchar(200) DEFAULT NULL,
  `author` varchar(200) DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `crawltime` datetime DEFAULT NULL,
  `content` longtext,
  `createtime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_fetches`),
  UNIQUE KEY `id_fetches_UNIQUE` (`id_fetches`),
  UNIQUE KEY `url_UNIQUE` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--创建用户信息数据表
CREATE TABLE `crawl`.`user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `registertime` datetime DEFAULT CURRENT_TIMESTAMP,
  `stopflag` INT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`))
ENGINE=InnoDB DEFAULT CHARSET=utf8;


--记录用户的登陆，查询（具体查询语句）操作
CREATE TABLE `crawl`.`user_action` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `request_time` VARCHAR(45) NOT NULL,
  `request_method` VARCHAR(20) NOT NULL,
  `request_url` VARCHAR(300) NOT NULL,
  `status` int(4),
  `remote_addr` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`))
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE WordSplit ( 
id_fetches int,
word varchar(50) DEFAULT NULL
);

CREATE TABLE Score ( 
id_fetches int, 
word varchar(50) DEFAULT NULL, 
weight float 
);

