
drop database if exists `HS02_Gruppe_4`;

create database if not exists HS02_Gruppe_4;
alter database HS02_Gruppe_4 default character set latin1 default collate latin1_german2_ci;
use HS02_Gruppe_4;

drop table if exists `t_highscore`;
create table t_highscore
(	id MEDIUMINT NOT NULL AUTO_INCREMENT,
        name CHAR(30) NOT NULL,
	punkte DECIMAL(65),
        level DECIMAL(10),
        linien DECIMAL(65),
        PRIMARY KEY (id)
)	engine=InnoDB;
