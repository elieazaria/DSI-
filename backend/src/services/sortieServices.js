import { query } from "../db.js";

export const sortieProduit = async (
  produit_id,
  quantite_sortie,
  detenteur,
  numero_porte,
  observation
) => {
  try {
    await query("BEGIN");

    // Vérifier si la quantité demandée est disponible
    const { rows } = await query(
      "SELECT quantite FROM produits WHERE id = $1",
      [produit_id]
    );
    if (rows.length === 0) throw new Error("Produit introuvable");
    if (rows[0].quantite < quantite_sortie)
      throw new Error("Quantité insuffisante");

    // Insérer la sortie
    const insertQuery = `
            INSERT INTO sorties_produits (produit_id, quantite_sortie, detenteur, numero_porte, observation)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
    const sortie = await query(insertQuery, [
      produit_id,
      quantite_sortie,
      detenteur,
      numero_porte,
      observation,
    ]);

    // Mettre à jour la quantité du produit
    const updateQuery =
      "UPDATE produits SET quantite = quantite - $1 WHERE id = $2";
    await query(updateQuery, [quantite_sortie, produit_id]);

    await query("COMMIT");

    return sortie.rows[0];
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  } finally {
    release();
  }
};

export const getHistoriqueSorties = async () => {
  const a = `
      SELECT s.id, s.quantite_sortie, s.detenteur, s.numero_porte, s.observation, s.date_sortie,
             p.designation,p.etat
      FROM sorties_produits s
      JOIN produits p ON s.produit_id = p.id
      ORDER BY s.date_sortie DESC
    `;
  const { rows } = await query(a);
  return rows;
};
