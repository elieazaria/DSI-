import { query } from "../db.js";

export const getProduits = async () => {
  const { rows } = await query(
    "SELECT id, designation, quantite, etat, date_entree::date AS date_entree FROM produits"
  );

  return rows;
};

export const createProduits = async (produitData) => {
  const { designation, quantite, etat } = produitData;
  const { rows } = await query(
    `INSERT INTO produits (designation, quantite, etat) 
         VALUES ($1, $2, $3) RETURNING *`,
    [designation, quantite, etat]
  );

  return rows[0];
};

export const updateProduits = async (produitId, produitData) => {
  const { designation, quantite, etat } = produitData;

  const { rows } = await query(
    `UPDATE produits SET designation = $1, quantite = $2, etat = $3
       WHERE id = $4 RETURNING *`,
    [designation, quantite, etat, produitId]
  );

  return rows[0];
};

export const deleteProduits = async (produitId) => {
  const { rowCount } = await query(`DELETE FROM produits WHERE id = $1`, [
    produitId,
  ]);
  return rowCount > 0;
};

export const searchProduits = async (searchTerm) => {
  const { rows } = await query(
    `SELECT * FROM produits WHERE name ILIKE $1 OR email ILIKE $1 OR job ILIKE $1`,
    [`%${searchTerm}%`]
  );
  return rows;
};
