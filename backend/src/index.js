import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import clientRoutes from "./routes/clientRoutes.js";
import produitRoutes from "./routes/produitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sortieRoutes from "./routes/sortieRoutes.js";
import demandeRoutes from "./routes/demandeRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", clientRoutes);
app.use("/api", produitRoutes);
app.use("/api", authRoutes);
app.use("/api", sortieRoutes);
app.use("/api", demandeRoutes);

app.listen(port, () => {
  console.log("listening on port 3000");
});
