import "reflect-metadata";

import express, { Express, Request, Response } from "express";
import { AdEntity } from "./entities/ad";

import db from "./db";

const app: Express = express();
app.use(express.json());
const port: number = 3000;

app.listen(port, async () => {
  await db.initialize();
  console.log(`App listening on port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/ad", async (req: Request, res: Response) => {
  try {
    const ads = await AdEntity.find();
    res.send(ads);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.post("/ad", async (req: Request, res: Response) => {
  try {
    const newAd = AdEntity.create(req.body);
    const newAdWithId = await newAd.save(newAd);
    res.send(newAdWithId);
    res.status(201);
  } catch (err) {
    console.error(
      "Une erreur s'est produite lors de la création de l'annonce :",
      err
    );
    res.sendStatus(500);
  }
});

app.delete("/ad/:id", async (req, res) => {
  try {
    const idToDelete = parseInt(req.params.id, 10);

    const adToDelete = await AdEntity.findBy({ id: idToDelete });

    if (!adToDelete) {
      return res.status(404).json({ erreur: "Annonce non trouvée" });
    }

    await AdEntity.remove(adToDelete);
    res.sendStatus(204);
  } catch (err) {
    console.log(
      "Une erreur s'est produite lors de la suppression de l'annonce :",
      err
    );
    res
      .status(500)
      .json({ error: "Une erreur interne du serveur s'est produite." });
  }
});

app.patch("/ad/:id", async (req: Request, res: Response) => {
  try {
    const idToUpdate = parseInt(req.params.id, 10);
    const newUpdate = req.body;

    const adToUpdate = await AdEntity.findOneBy({ id: idToUpdate });

    if (!adToUpdate) {
      return res.status(404).json({ erreur: "Annonce non trouvée" });
    }

    // Mise à jour l'annonce en fusionnant les données de req.body
    AdEntity.merge(adToUpdate, newUpdate);

    // Sauvegarde les modifications dans la base de données
    await adToUpdate.save();
    res.status(200).json(adToUpdate);
  } catch (err) {
    console.log(
      "Une erreur s'est produite lors de la mise à jour de l'annonce :",
      err
    );
    res
      .status(500)
      .json({ error: "Une erreur interne du serveur s'est produite." });
  }
});
