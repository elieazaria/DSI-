import { query } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (firstname, lastname, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await query(
    "INSERT INTO users (firstname,lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, firstname,lastname, email",
    [firstname, lastname, email, hashedPassword]
  );

  return rows[0];
};

export const loginUser = async (email, password) => {
  const a = "SELECT * FROM users WHERE email = $1";
  const result = await query(a, [email]);

  if (result.rows.length === 0) {
    throw new Error("Utilisateur non trouvé");
  }

  const user = result.rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Mot de passe incorrect");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
  };
};
