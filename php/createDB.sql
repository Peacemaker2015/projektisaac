
drop database if exists `projektmm`;

create database if not exists projektmm;
alter database projektmm default character set latin1 default collate latin1_german2_ci;
use projektmm;

drop table if exists `t_highscore`;

create table t_highscore
(	id MEDIUMINT NOT NULL AUTO_INCREMENT,
        name CHAR(30) NOT NULL,
        punkte DECIMAL(65),
        PRIMARY KEY (id)
)	engine=InnoDB;
