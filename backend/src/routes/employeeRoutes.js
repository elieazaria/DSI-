import express from "express";
import * as employeeController from "../controllers/employeeController.js";

const router = express.Router();
router.get(
  "/employee-details/:matricule",
  employeeController.getEmployeeDetails
);

export default router;
