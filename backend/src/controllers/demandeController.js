import * as materialRequestService from "../services/materialRequestService.js"; // Importe toutes les fonctions du service

/**
 * Gère le processus de demande de matériel en deux étapes :
 * 1. Récupération des informations de l'employé par matricule.
 * 2. Création de la demande de matériel.
 *
 * POST /api/submit-request
 * Le corps de la requête peut contenir soit seulement l'employee_id,
 * soit l'employee_id avec les détails de la demande.
 */
export const handleMaterialRequestSubmission = async (req, res) => {
  const { employee_id, designation, quantity, technical_characteristics } =
    req.body;

  if (!employee_id) {
    return res
      .status(400)
      .json({ message: "Le matricule de l'employé est obligatoire." });
  }

  try {
    const employee = await materialRequestService.getEmployeeById(employee_id);

    if (!employee) {
      return res
        .status(404)
        .json({
          message: "Employé non trouvé. Veuillez vérifier le matricule.",
        });
    }

    // Si seule l'ID de l'employé est fournie, cela signifie que le frontend veut afficher les détails.
    if (!designation && !quantity) {
      return res.status(200).json({
        message:
          "Employé trouvé. Veuillez maintenant saisir les détails de la demande.",
        employeeDetails: {
          employee_id: employee.employee_id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          position: employee.position,
          department: employee.department,
          office_number: employee.office_number,
        },
      });
    }

    // Si les détails de la demande sont également fournis, alors on crée la demande.
    if (!designation || !quantity) {
      return res
        .status(400)
        .json({
          message:
            "La désignation et la quantité sont obligatoires pour créer une demande.",
        });
    }

    const newRequest = await materialRequestService.createMaterialRequest(
      employee_id,
      designation,
      quantity,
      technical_characteristics
    );

    res.status(201).json({
      message: "Demande de matériel créée avec succès.",
      request: newRequest,
      employeeDetails: {
        // Vous pouvez renvoyer les détails de l'employé pour confirmation
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        position: employee.position,
        department: employee.department,
        office_number: employee.office_number,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la soumission de la demande de matériel :",
      error
    ); // Log l'erreur complète pour le débogage
    res
      .status(500)
      .json({ message: error.message || "Erreur interne du serveur." });
  }
};

/**
 * API pour récupérer toutes les demandes de matériel.
 * GET /api/material-requests
 */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await materialRequestService.getAllMaterialRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de toutes les demandes :",
      error
    );
    res
      .status(500)
      .json({ message: error.message || "Erreur interne du serveur." });
  }
};

/**
 * API pour mettre à jour le statut d'une demande.
 * PUT /api/material-requests/:requestId/status
 */
export const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Le statut est obligatoire." });
  }

  const allowedStatuses = ["En attente", "Approuvée", "Rejetée", "Livrée"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide." });
  }

  try {
    const updatedRequest =
      await materialRequestService.updateMaterialRequestStatus(
        requestId,
        status
      );
    if (updatedRequest) {
      res.status(200).json({
        message: "Statut de la demande mis à jour avec succès.",
        request: updatedRequest,
      });
    } else {
      res.status(404).json({ message: "Demande non trouvée." });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la demande :",
      error
    );
    res
      .status(500)
      .json({ message: error.message || "Erreur interne du serveur." });
  }
};
