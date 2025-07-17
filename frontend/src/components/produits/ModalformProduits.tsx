import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import Select from "../form/Select";

interface ProduitData {
  id: number;
  designation: string;
  quantite: number;
  etat: 'nouveau' | 'bon' | 'mauvaise';
  date_entree: string;
}

interface ModalformProduitsProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'add';
  onSubmit: (produitData: ProduitData) => Promise<void>;
  produitData?: ProduitData ;
}

export default function ModalformProduits({ isOpen, onClose, mode, onSubmit, produitData }: ModalformProduitsProps) {
  const [designation, setDesignation] = useState('');
  const [quantite, setQuantite] = useState('');
  const [etat, setEtat] = useState<'nouveau' | 'bon' | 'mauvaise'>('nouveau');
  const [isOpene, setIsOpen] = useState(false);
  
  function closeDropdown() {
    setIsOpen(false);
  }
  const options = [
    { value: "nouveau", label: "Nouveau" },
    { value: "bon", label: "Bon" },
    { value: "mauvaise", label: "Mauvaise" },
  ];
  const handleSelectChange = (value: string) => {
    setEtat(value as 'nouveau' | 'bon' | 'mauvaise');
    console.log("Selected value:", value); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newProduitData: ProduitData = {
        id: mode === 'edit' && produitData ? produitData.id : Date.now(), // Temporary ID for new entries
        designation,
        quantite: Number(quantite),
        etat,
        date_entree: mode === 'edit' && produitData ? produitData.date_entree : new Date().toISOString(),
      };
      await onSubmit(newProduitData);
      onClose();
    } catch (err) {
      console.error("Error adding client", err);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && produitData) {
      setDesignation(produitData.designation);
      setQuantite(produitData.quantite.toString());
      setEtat(produitData.etat);
    } else {
      // Reset fields when adding a new client
      setDesignation('');
      setQuantite('');
      setEtat('nouveau');
    }
  }, [mode, produitData]);

  return (
    <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="fixed flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700" >
        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
         {mode === 'edit' ? 'Edit produit' : 'Ajout produit'}
        </h5>
        <button
            onClick={onClose}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

     <form onSubmit={handleSubmit}>
	<div>
          <Label htmlFor="input">Désignation</Label>
          <Input 
            type="text"
            placeholder="Nom utilisateur"
            value={designation}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDesignation(e.target.value)}
           />
        </div>

        <div>
          <Label htmlFor="input">Quantité</Label>
          <Input 
            type="number"
            placeholder="Ex: 5"
            value={quantite}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>setQuantite(e.target.value)}
            min="1"
          />
        </div>
        
       <div>
          <Label> Etat </Label>
          <Select
            value={etat}
            options={options}
            placeholder="Choisir l'etat"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>


      
      <div className="flex items-center sm:gap-5 mt-5">
          <Button size="sm" variant="primary"  >
           {mode === 'edit' ? 'Sauvegarder' : 'Ajouter'}
           </Button>
          <Button size="sm" variant="primary"  onClick={onClose}>
              Annuler
          </Button>
      </div>
    </form>

     </Dropdown> 

  );
}
