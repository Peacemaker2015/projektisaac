drop database if exists projektMM;

create database if not exists projektMM;

use projektMM;

drop table if exists t_highscore;

create table if not exists t_highscore
(	ID							int auto_increment,
	Name						varchar(30),
	Punkte						int,
	primary key (ID)
)	engine=InnoDB;

Insert Into t_highscore values(ID,"Alex",'2000');
Insert Into t_highscore values(ID,'Benjamin','1900');
Insert Into t_highscore values(ID,'Chalie','1800');
Insert Into t_highscore values(ID,'Doris','1700');
Insert Into t_highscore values(ID,'Emanuel','1600');

select Name, Punkte from t_highscore order by Punkte desc;
