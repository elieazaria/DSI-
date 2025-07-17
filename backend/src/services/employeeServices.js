//import { query } from "../db.js";

export const getEmployeeDetailsByMatricule = async (numeroMatricule) => {
  const client = await query.connect();
  try {
    const sql = `
        SELECT
          e.nom,
          e.prenom
        FROM
          employee e
        JOIN
          details_employe de ON e.employee_id = de.employee_id
        WHERE
          de.numero_matricule = $1;
      `;
    const result = await client.query(sql, [numeroMatricule]);

    if (result.rows.length > 0) {
      return result.rows[0]; // Retourne le nom et le prenom
    } else {
      return null; // Aucun employé trouvé avec ce matricule
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'employé:",
      error
    );
    throw error; // Propager l'erreur pour la gérer dans le contrôleur
  } finally {
    client.release(); // Relâcher le client dans le pool
  }
};
