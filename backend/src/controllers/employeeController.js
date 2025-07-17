import * as employeeService from "../services/employeeServices.js";

export const getEmployeeDetails = async (req, res) => {
  const numeroMatricule = req.params.matricule; // Récupère le matricule depuis l'URL

  if (!numeroMatricule) {
    return res
      .status(400)
      .json({ message: "Numéro matricule manquant dans la requête." });
  }

  try {
    const employeeDetails = await employeeService.getEmployeeDetailsByMatricule(
      numeroMatricule
    );

    if (employeeDetails) {
      res.status(200).json(employeeDetails); // Retourne le nom et le prenom
    } else {
      res
        .status(404)
        .json({ message: "Aucun employé trouvé avec ce numéro matricule." });
    }
  } catch (error) {
    console.error(
      "Erreur dans le contrôleur lors de la récupération des détails de l'employé:",
      error
    );
    res
      .status(500)
      .json({
        message:
          "Erreur serveur lors de la récupération des détails de l'employé.",
      });
  }
};
