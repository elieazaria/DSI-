import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from 'axios';
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { CalenderIcon } from "../../icons";
import Flatpickr from "react-flatpickr";
import DateRdv from "../equivalence/DateRdv";

export default function DemandForm() {
  const [isChecked, setIsChecked] = useState(false);
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState("");
  const navigate = useNavigate();
  const options = [
    { value: "1", label: "08:00 - 09:00"},
    { value: "2", label: "09:00 - 10:00" },
    { value: "3", label: "10:00 - 11:00" },
    { value: "4", label: "11:00 - 12:00" },
    { value: "5", label: "13:00 - 14:00" },
    
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };
  
  const handleDateChange = (date: Date[]) => {
    setDateOfBirth(date[0].toLocaleDateString()); // Handle selected date and format it
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation basique côté client
    if (!firstname || !lastname || !isChecked) {
      setError('Veuillez remplir tous les champs et accepter les conditions.');
      return;
    }
    
    // Réinitialiser les états
    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        firstname,
        lastname,

      });

      console.log('User signed up successfully:', response.data);
      setIsSuccess(true);
      
      // Réinitialiser le formulaire
      setFirstName('');
      setLastName('');
      
      setIsChecked(false);
      
      // Rediriger vers une autre page après 2 secondes
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch (error) {
      console.error('There was an error signing up:', error);
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          
          {/* Message de succès */}
          {isSuccess && (
            <div className="p-4 mb-5 text-sm font-medium text-green-800 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400">
              Inscription réussie ! Vous allez être redirigé vers la page de connexion.
            </div>
          )}
          
          {/* Message d'erreur */}
          {error && (
            <div className="p-4 mb-5 text-sm font-medium text-red-800 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
          
          <div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Enter your first name"
                      value={firstname}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Enter your last name"
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Numero<span className="text-error-500">*</span>
                  </Label>
                  <DateRdv ></DateRdv>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    name="honeNumbe"
                    placeholder="Enter your email"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                
                
                <div>
          <Label htmlFor="datePicker">Date</Label>
          <div className="relative w-full flatpickr-wrapper">
            <Flatpickr
              value={dateOfBirth} // Set the value to the state
              onChange={handleDateChange} // Handle the date change
              options={{
                dateFormat: "d-m-Y", // Set the date format
              }}
              placeholder="Select an option"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon className="size-6" />
            </span>
          </div>
        </div>

        <div>
          <Label>Crénaux horaires</Label>
          <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
                <div>
                  <button 
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Inscription en cours...' : 'Sign Up'}
                  </button>
                </div>
              </div>
            </form>

           
          </div>
        </div>
      </div>
    </div>
  );
}
