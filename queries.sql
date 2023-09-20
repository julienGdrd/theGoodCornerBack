DROP TABLE if EXISTS ad;

CREATE TABLE ad 
(
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title VARCHAR(100) NOT NULL,
	description TEXT,
	owner VARCHAR(100) NOT NULL,
	price INT,
	picture VARCHAR(100),
	location VARCHAR(100),
	createdAt DATE
);

INSERT INTO ad (title, description, owner, price, picture, location, createdAt) VALUES
('Blouson', 'blouson en cuir', 'robert@dupont.fr', '20', 'exemple@image.com', 'Bordeaux', '01/09/2023'),
('Veste', 'Veste bleu', 'robert@dupont.fr', '25', 'exemple@image.com', 'Bordeaux', '01/09/2023'),
('Ordinateur', 'PC asus', 'robert@dupont.fr', '250', 'exemple@image.com', 'Bordeaux', '01/09/2023'),
('Clavier', 'presque neuf', 'regis@durand.fr', '15', 'exemple@image.com', 'Lyon', '05/09/2023'),
('Lampe', 'Bon état', 'regis@durand.fr', '30', 'exemple@image.com', 'Lyon', '05/09/2023'),
('Vtt', 'Pour pièce', 'regis@durand.fr', '22', 'exemple@image.com', 'Lyon', '05/09/2023'),
('Tapis', 'Quelques taches', 'isabelle@jaures.fr', '5', 'exemple@image.com', 'Paris', '07/09/2023'),
('Livre', 'Neuf', 'isabelle@jaures.fr', '9', 'exemple@image.com', 'Paris', '07/09/2023'),
('Lunettes de soleil', 'Catégorie 3', 'isabelle@jaures.fr', '24', 'exemple@image.com', 'Paris', '07/09/2023'),
('Chapeau', 'Melon', 'isabelle@jaures.fr', '18', 'exemple@image.com', 'Paris', '08/09/2023');


SELECT * FROM ad;

SELECT * FROM ad WHERE location = "Bordeaux";

DELETE FROM ad WHERE price > 40;

UPDATE ad SET price = 0 WHERE createdAt = '01/09/2023';

SELECT AVG(price) AS moyenne_prix_Paris FROM ad WHERE location = 'Paris';

SELECT AVG(price) FROM ad WHERE location = 'Paris';

SELECT location, AVG(price) AS moyenne_prix FROM ad GROUP BY location;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100)
);

ALTER TABLE ad ADD COLUMN categorie_id INTEGER;

ALTER TABLE ad ADD FOREIGN KEY (categorie_id) REFERENCES categories(id);

INSERT INTO categories (name) VALUES
('vêtement'),
('voiture'),
('autre');

UPDATE ad SET categorie_id = 1 WHERE id IN (8, 16);
UPDATE ad SET categorie_id = 3 WHERE id IN (10, 11, 12, 13, 14, 15, 17);

SELECT ad.* FROM ad
INNER JOIN categories ON ad.categorie_id = categories.id
WHERE categories.name = 'vêtement';

SELECT ad.* FROM ad
INNER JOIN categories ON ad.categorie_id = categories.id
WHERE categories.name IN ('vêtement', 'voiture');

SELECT AVG(ad.price) AS prix_moyen
FROM ad
INNER JOIN categories ON ad.categorie_id = categories.id
WHERE categories.name = 'autre';

SELECT ad.*
FROM ad
INNER JOIN categories ON ad.categorie_id = categories.id
WHERE categories.name LIKE 'v%';

SELECT *
FROM ad
WHERE title LIKE 'v%';