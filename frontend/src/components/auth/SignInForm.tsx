import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { EyeCloseIcon, EyeIcon } from "../../icons"; // Assuming these are correctly imported
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });

      console.log('User signed in successfully:', response.data);

      navigate("/produits");
    } catch (error) {
      console.error('There was an error signing in:', error);
      // You can add an error notification here
    }
  };

  return (
    
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-orange-900 p-4">
      {/* The main form container with dark background and rounded corners */}
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-semibold text-white">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Adresse mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder=" " // Empty placeholder to match the image's input style
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Mot de passe
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" " // Empty placeholder
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 pr-10" // Added pr-10 for eye icon
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <Checkbox
              id="remember-me"
              checked={isChecked}
              onChange={setIsChecked}
              className="h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Se souvenir de moi
            </label>
          </div>


          {/* Login Button */}
          <div>
            <Button
              size="sm"
              className="w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Connexion
            </Button>
          </div>
        </form>

        {/* Forgot password link */}
        <div className="mt-4 text-center">
          <Link
            to="/reset-password"
            className="text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Create account link */}
        <div className="mt-6 text-center text-gray-400">
          <p className="text-sm">
            Pas encore inscrit ?{" "}
            <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
