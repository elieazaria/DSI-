import { query } from "../db.js";

//Récupère les informations d'un employé par son matricule.

export const getEmployeeById = async (employeeId) => {
  try {
    const { rows } = await query(
      `SELECT employee_id, nom, prenom, fonction, departement, numero_porte
             FROM employees
             WHERE employee_id = $1`,
      [employeeId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'employé par ID :",
      error
    );
    throw new Error("Échec de la récupération des informations de l'employé.");
  }
};

/**
 * Crée une nouvelle demande de matériel.
 * @param {string} employeeId - Le matricule de l'employé.
 * @param {string} designation - La désignation du matériel.
 * @param {number} quantite - La quantité.
 * @param {string} caracteristiques- Les caractéristiques techniques.
 * @returns {Promise<object>} La demande de matériel créée.
 */
export const createMaterialRequest = async (
  employeeId,
  designation,
  quantite,
  caracteristiques
) => {
  try {
    // Générer une référence unique pour la demande
    const request_id = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { rows } = await query(
      // Utilisation de pool.query
      `INSERT INTO material_requests (request_id, employee_id, designation, quantite, caracteristiques)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`, // Retourne la ligne insérée
      [request_id, employeeId, designation, quantite, caracteristiques]
    );
    return rows[0];
  } catch (error) {
    console.error(
      "Erreur lors de la création de la demande de matériel :",
      error
    );
    throw new Error("Échec de la création de la demande de matériel.");
  }
};

/**
 * Récupère toutes les demandes de matériel.
 * @returns {Promise<Array<object>>} Liste de toutes les demandes.
 */
export const getAllMaterialRequests = async () => {
  try {
    const { rows } = await query(
      // Utilisation de pool.query
      `SELECT mr.request_id, mr.designation, mr.quantite, mr.caracteristiques, mr.request_date, mr.statut,
                    e.employee_id, e.nom, e.prenom, e.fonction, e.departement, e.numero_porte
             FROM material_requests mr
             JOIN employees e ON mr.employee_id = e.employee_id
             ORDER BY mr.request_date ASC`
    );
    return rows;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de toutes les demandes de matériel :",
      error
    );
    throw new Error("Échec de la récupération des demandes de matériel.");
  }
};

/**
 * Met à jour le statut d'une demande de matériel.
 * @param {string} requestId - L'ID de la demande.
 * @param {string} statut - Le nouveau statut.
 * @returns {Promise<object|null>} La demande mise à jour ou null si non trouvée.
 */
export const updateMaterialRequestStatus = async (requestId, statut) => {
  try {
    const { rows } = await query(
      `UPDATE material_requests
             SET statut = $1
             WHERE request_id = $2
             RETURNING *`,
      [statut, requestId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la demande de matériel :",
      error
    );
    throw new Error(
      "Échec de la mise à jour du statut de la demande de matériel."
    );
  }
};

// Pas de fonction deleteMaterialRequest ni searchMaterialRequest dans votre contexte initial
// Mais si vous les ajoutez, elles suivraient la même forme :
/*
export const deleteMaterialRequest = async (requestId) => {
    try {
        const { rowCount } = await pool.query(`DELETE FROM material_requests WHERE request_id = $1`, [requestId]);
        return rowCount > 0;
    } catch (error) {
        console.error('Erreur lors de la suppression de la demande de matériel :', error);
        throw new Error('Échec de la suppression de la demande de matériel.');
    }
};

export const searchMaterialRequests = async (searchTerm) => {
    try {
        const { rows } = await pool.query(
            `SELECT mr.request_id, mr.designation, mr.quantity, mr.technical_characteristics, mr.request_date, mr.status,
                    e.first_name, e.last_name, e.department
             FROM material_requests mr
             JOIN employees e ON mr.employee_id = e.employee_id
             WHERE mr.designation ILIKE $1 OR e.first_name ILIKE $1 OR e.last_name ILIKE $1
             ORDER BY mr.request_date DESC`,
            [`%${searchTerm}%`]
        );
        return rows;
    } catch (error) {
        console.error('Erreur lors de la recherche de demandes de matériel :', error);
        throw new Error('Échec de la recherche de demandes de matériel.');
    }
};
*/
