import * as produitService from "../services/produitServices.js";

export const getProduits = async (req, res) => {
  try {
    const produits = await produitService.getProduits();
    res.status(200).json(produits);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProduits = async (req, res) => {
  try {
    const produitData = req.body;
    const newProduit = await produitService.createProduits(produitData);
    res.status(200).json(newProduit);
  } catch (err) {
    console.error("Erreur ajout du produit:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduits = async (req, res) => {
  try {
    const produitId = req.params.id;
    const produitData = req.body;
    const updatedProduits = await produitService.updateProduits(
      produitId,
      produitData
    );
    if (!updatedProduits) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(updatedProduits);
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduits = async (req, res) => {
  try {
    const produitId = req.params.id;
    const deleted = await produitService.deleteProduits(produitId);
    if (!deleted) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchProduits = async (req, res) => {
  try {
    const searchTerm = req.query.q; // Get the search term from the query parameters
    const produits = await produitService.searchProduits(searchTerm);
    res.status(200).json(produits);
  } catch (error) {
    console.error("Error searching clients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
