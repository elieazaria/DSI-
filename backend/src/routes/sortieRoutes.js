import express from "express";

import * as sortieController from "../controllers/sortieController.js";
const router = express.Router();

router.get("/sorties", sortieController.getHistoriqueSorties);
router.post("/sorties", sortieController.sortieProduit);

export default router;
