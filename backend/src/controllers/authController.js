import * as authService from "../services/authServices.js";

export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const newUser = await authService.registerUser(
      firstname,
      lastname,
      email,
      password
    );
    res
      .status(201)
      .json({ message: "Utilisateur enregistré avec succès", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
