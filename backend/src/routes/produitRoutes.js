import express from "express";

import * as produitController from "../controllers/produitController.js";

const router = express.Router();

router.get("/produits", produitController.getProduits);
router.post("/produits", produitController.createProduits);
router.put("/produits/:id", produitController.updateProduits);
router.delete("/produits/:id", produitController.deleteProduits);
router.get("/produits/search", produitController.searchProduits);

export default router;
