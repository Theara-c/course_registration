import express from "express";
import cors from "cors";
import { Router }  from "express";
import {sequelize} from "../database/db.js";
const categoryRouter = Router();
categoryRouter.get('/', async (req, res) => {
    try {
   const categories = await sequelize.query( `select * from category`);
      res.json(categories[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
}});

export default categoryRouter;