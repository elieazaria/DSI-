import React from "react"; 

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value: string | undefined; // Peut être undefined initialement ou pour le placeholder

  
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value, // Reçoit la valeur de l'état du parent
  // defaultValue, // Retiré car on utilise 'value'
}) => {
  // Supprimez l'état interne 'selectedValue'
  // const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    // N'update pas un état interne, appelle simplement la fonction onChange du parent
    onChange(newValue);
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        // Le style doit maintenant dépendre de la prop 'value'
        value ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      // Utilise la prop 'value' comme source de vérité
      value={value}
      onChange={handleChange}
    >
      {/* Placeholder option */}
      {/* Assurez-vous que le placeholder a une valeur qui correspond à la valeur initiale ou 'vide' */}
       {/* Ajouter 'hidden' empêche le placeholder de réapparaître dans la liste déroulante après sélection */}
      <option
        value="" // Souvent la valeur vide pour le placeholder
        disabled
        hidden // Cache l'option désactivée de la liste déroulante
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;