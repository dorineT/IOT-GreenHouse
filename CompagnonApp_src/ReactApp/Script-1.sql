CREATE TABLE IF NOT EXISTS plante (
	plante_id INTEGER PRIMARY KEY AUTOINCREMENT,
	nom TEXT NOT NULL,
	type_plante TEXT NOT NULL,
	plantation TEXT NOT NULL,
	recolte TEXT NOT NULL,
	terre TEXT NOT NULL,
	eau TEXT NOT NULL,
	ph TEXT NOT NULL,
	humidite TEXT NOT NULL,
	temperature TEXT NOT NULL,
	description TEXT NOT NULL,
	image TEXT NOT NULL,
	lien TEXT
);

CREATE TABLE IF NOT EXISTS serre (
	id_serre INTEGER PRIMARY KEY,
	type_action TEXT CHECK( type_action  IN ('arrosage','c_humidite','c_luminosite', 'c_temperature','c_ph') ) NOT NULL,
	moment datetime default current_timestamp
);

CREATE TABLE IF NOT EXISTS emplacement (
	label INTEGER PRIMARY KEY AUTOINCREMENT,
	plante_id  INTEGER  NOT NULL,
	FOREIGN KEY (plante_id) 
      REFERENCES plante (plante_id) 
);

------ insert data plant ---

drop table emplacement;
drop table plante ;
drop table serre ;

INSERT INTO plante (nom,type_plante,plantation,recolte,terre,eau,ph,humidite,temperature,image, description)
VALUES 
('Basilic','Comestible, aromatique','f�vrier - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drain�','> 10 degr�s c','https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile � cultiver en ext�rieur ou en int�rieur, en pot ou en pleine terre. Tr�s appr�ci� pour sa fra�cheur et sa saveur, il rel�ve les plats de l''�t�. C''est un r�el plaisir de le cueillir selon ses besoins.'),
('Thym','Comestible, aromatique','f�vrier - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drain�','> 10 degr�s c','https://www.tomatopiu.com/wp-content/uploads/2016/08/BASILICO-GRECOsmall.png','Le basilic est une plante aromatique facile � cultiver en ext�rieur ou en int�rieur, en pot ou en pleine terre. Tr�s appr�ci� pour sa fra�cheur et sa saveur, il rel�ve les plats de l''�t�. C''est un r�el plaisir de le cueillir selon ses besoins.'),
('Paquerette','Comestible, aromatique','f�vrier - juillet','juin-novembre','pleine terre, bac','quotidien','neutre','drain�','> 10 degr�s c','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaRQ_b37aFTSkwh8OKmhTqf6zlJHHMbG4GByIG-VYzg&s','Le basilic est une plante aromatique facile � cultiver en ext�rieur ou en int�rieur, en pot ou en pleine terre. Tr�s appr�ci� pour sa fra�cheur et sa saveur, il rel�ve les plats de l''�t�. C''est un r�el plaisir de le cueillir selon ses besoins.');



----

select * from plante;