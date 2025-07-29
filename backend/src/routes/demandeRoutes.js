import express from "express";

import {
  handleMaterialRequestSubmission,
  getAllRequests,
  updateRequestStatus,
} from "../controllers/demandeController.js";

const router = express.Router();

router.post("/submit-request", handleMaterialRequestSubmission);
router.get("/material-requests", getAllRequests);
router.put("/material-requests/:requestId/statut", updateRequestStatus);

export default router;
