import express, { Express, Request, Response } from "express";
import { Ad } from "./utils/types";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("good_corner.sqlite");

const app: Express = express();
app.use(express.json());
const port: number = 3000;

let ads: Ad[] = [
  {
    id: 1,
    title: "Bike to sell",
    description:
      "My bike is blue, working fine. I'm selling it because I've got a new one",
    owner: "bike.seller@gmail.com",
    price: 100,
    picture:
      "https://images.lecho.be/view?iid=dc:113129565&context=ONLINE&ratio=16/9&width=640&u=1508242455000",
    location: "Paris",
    createdAt: "2023-09-05T10:13:14.755Z",
  },
  {
    id: 2,
    title: "Car to sell",
    description:
      "My car is blue, working fine. I'm selling it because I've got a new one",
    owner: "car.seller@gmail.com",
    price: 10000,
    picture:
      "https://www.automobile-magazine.fr/asset/cms/34973/config/28294/apres-plusieurs-prototypes-la-bollore-bluecar-a-fini-par-devoiler-sa-version-definitive.jpg",
    location: "Paris",
    createdAt: "2023-10-05T10:14:15.922Z",
  },
];

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/ad", (req: Request, res: Response) => {
  db.all("SELECT * FROM ad", (err, rows) => {
    if (!err) return res.send(rows);
    console.log(err);
  });
});

app.post("/ad", (req: Request, res: Response) => {

  const newAd = {
    $title: req.body.title,
    $description: req.body.description,
    $owner: req.body.owner,
    $price: req.body.price,
    $picture: req.body.picture,
    $location: req.body.location,
    $createdAt: new Date().toISOString(),
    $categorie_id: req.body.categorie_id,
  };

  const sql = `
    INSERT INTO ad (title, description, owner, price, picture, location, createdAt, categorie_id)
    VALUES ($title, $description, $owner, $price, $picture, $location, $createdAt, $categorie_id)
  `;

  db.run(sql, newAd, function (err) {
    if (err) {
      console.error("Erreur lors de l'insertion de l'annonce : " + err.message);
      res.status(500).send("Erreur lors de l'insertion de l'annonce.");
    } else {
      console.log("Annonce insérée avec succès !");
      res.status(201).send("Annonce insérée avec succès.");
    }
  });
});

// app.delete("/ad/:id", (req: Request, res: Response) => {
//   const idOfAdToDelete: number = parseInt(req.params.id, 10);

//   const adToDelete = ads.find((ad) => ad.id === idOfAdToDelete);

//   if (!adToDelete) return res.sendStatus(404);

//   ads = ads.filter((ad) => ad.id !== idOfAdToDelete);
//   res.sendStatus(204);
// });

app.delete("/ad/:id", (req, res) => {
  const idOfAdToDelete: number = parseInt(req.params.id, 10);
  const sqlSelectById : string = "SELECT id FROM ad WHERE id = ?"
  const sqlDeleteById : string = "DELETE FROM ad WHERE id = ?"
  // Vérifier si l'annonce avec l'ID spécifié existe dans la base de données
  db.get(sqlSelectById, idOfAdToDelete, (err, row) => {
    if (err) {
      console.error("Erreur lors de la recherche de l'annonce : " + err.message);
      return res.status(500).send("Erreur lors de la recherche de l'annonce.");
    }
    if (!row) {
      // L'annonce n'a pas été trouvée, renvoyer une réponse 404
      return res.status(404).send("Annonce non trouvée.");
    }

    // Supprimer l'annonce avec l'ID spécifié
    db.run(sqlDeleteById, idOfAdToDelete, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'annonce : " + err.message);
        return res.status(500).send("Erreur lors de la suppression de l'annonce.");
      }
      console.log("Annonce supprimée avec succès !");
      res.sendStatus(204);
    });
  });
});

// app.patch("/ad/:id", (req: Request, res: Response) => {
//   const idOfAdToUpdate: number = parseInt(req.params.id, 10);
//   const adToUpdate = ads.find((ad) => ad.id === idOfAdToUpdate);

//   if (!adToUpdate) return res.sendStatus(404);

//   const updatedAd = {
//     ...adToUpdate,
//     ...req.body,
//   };

//   const adIndex: number = ads.findIndex((ad) => ad.id === idOfAdToUpdate);
//   ads[adIndex] = updatedAd;
//   res.json(updatedAd);
// });

app.patch("/ad/:id", (req: Request, res: Response) => {
  db.get("SELECT * FROM ad WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (!row) return res.sendStatus(404);

    // creates a string with this shape : "title = $title, description = $description, ..."
    const setProps = Object.keys(req.body)
      .reduce<string[]>((acc, prop) => [...acc, `${prop} = $${prop}`], [])
      .join(", ");

    // creates an object with this shape : {$title: "title sent by client", "$description: " description sent by client", ...}
    const propsToUpdate = Object.keys(req.body).reduce(
      (acc, prop) => ({ ...acc, [`$${prop}`]: req.body[prop] }),
      {}
    );

    db.run(
      `UPDATE ad SET ${setProps} WHERE id = $id`,
      { ...propsToUpdate, $id: req.params.id },
      (err: any) => {
        if (!err) return res.send({ ...row, ...req.body });
        console.log(err);
        res.sendStatus(500);
      }
    );
  });
});

