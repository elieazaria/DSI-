import * as sortieService from "../services/sortieServices.js";

export const sortieProduit = async (req, res) => {
  try {
    const {
      produit_id,
      quantite_sortie,
      detenteur,
      numero_porte,
      observation,
    } = req.body;

    if (!produit_id || !quantite_sortie || !detenteur || !numero_porte) {
      return res
        .status(400)
        .json({ message: "Tous les champs requis ne sont pas remplis" });
    }

    const sortie = await sortieService.sortieProduit(
      produit_id,
      quantite_sortie,
      detenteur,
      numero_porte,
      observation
    );
    res.status(201).json({ message: "Sortie enregistrée avec succès", sortie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistoriqueSorties = async (req, res) => {
  try {
    const historiques = await sortieService.getHistoriqueSorties();
    res.status(200).json(historiques);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'historique",
      error: error.message,
    });
  }
};
