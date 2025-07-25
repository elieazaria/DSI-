import express from "express";
// Importe les fonctions de contrôleur spécifiques
import {
  handleMaterialRequestSubmission,
  getAllRequests,
  updateRequestStatus,
} from "../controllers/materialRequestController.js";

const router = express.Router();

router.post("/submit-request", handleMaterialRequestSubmission);
router.get("/material-requests", getAllRequests);
router.put("/material-requests/:requestId/status", updateRequestStatus);

export default router;
