drop database if exists `hs01-2`;

create database if not exists `hs01-2`;
alter database `hs01-2` default character set latin1 default collate latin1_german2_ci;
use `hs01-2`;

drop table if exists `t_highscore`;

create table `t_highscore`
(	id MEDIUMINT NOT NULL AUTO_INCREMENT,
        name CHAR(30) NOT NULL,
        punkte DECIMAL(65),
        PRIMARY KEY (id)
)	engine=InnoDB;
