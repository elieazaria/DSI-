import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../../components/ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";
import TextArea from "../form/input/TextArea"; // Assurez-vous que ce chemin est correct

interface ProduitData {
  id: number;
  designation: string;
  quantite: number;
  etat: 'nouveau' | 'bon' | 'mauvaise';
  date_entree: string;
}

interface NewSortieProduitData {
  produit_id: number;
  quantite_sortie: number;
  detenteur: string;
  numero_porte: string;
  observation?: string | null;
}

interface ModalformSortieProduitsProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newSortieData: NewSortieProduitData) => Promise<void>; // Attend les données pour une NOUVELLE sortie
  produitData?: ProduitData;
}

export default function ModalformSorties({
  isOpen,
  onClose,
  onSubmit,
  produitData
}: ModalformSortieProduitsProps) {

  // États pour les champs du formulaire
  const [produitId, setProduitId] = useState<string>('');
  const [quantiteSortie, setQuantiteSortie] = useState<string>('');
  const [detenteur, setDetenteur] = useState<string>('');
  const [numeroPorte, setNumeroPorte] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  

  function closeDropdown() {
    onClose();
  }

  const handleSubmitSortie = async (e: FormEvent) => {
    e.preventDefault();
    // Validation de base
    if (!produitId || !quantiteSortie || !detenteur || !numeroPorte || Number(quantiteSortie) <= 0) {
        console.error("Validation failed: Required fields missing or invalid quantity.");
        // Ajoutez ici une logique pour afficher un message à l'utilisateur si nécessaire
        return;
    }

    try {
      const newSortieData: NewSortieProduitData = {
        produit_id: Number(produitId),
        quantite_sortie: Number(quantiteSortie),
        detenteur,
        numero_porte: numeroPorte,
        observation: observation || null,
      };

      await onSubmit(newSortieData); // Appelle la fonction onSubmit du parent
      // Réinitialiser les champs du formulaire après soumission réussie (optionnel, mais bonne pratique)
      setProduitId('');
      setQuantiteSortie('');
      setDetenteur('');
      setNumeroPorte('');
      setObservation('');
      onClose(); // Ferme le modal après succès

    } catch (err) {
      console.error("Error adding sortie produit", err);
      // Gérer l'erreur (afficher un message à l'utilisateur)
      alert("Erreur lors de l'ajout de la sortie produit."); // Exemple simple
    }
  };

  useEffect(() => {
    // Réinitialiser les états lorsque le modal s'ouvre ou que produitData change
    if (isOpen) {
      setProduitId(produitData ? String(produitData.id) : '');
      setQuantiteSortie('');
      setDetenteur('');
      setNumeroPorte('');
      setObservation('');
    }
  }, [isOpen, produitData]); // Dépendances: isOpen et produitData

  // Ne rend rien si le modal n'est pas ouvert (géré par la prop isOpen)
    if (!isOpen) {
        return null;
    }

  return (
    // Utilisation de isOpen directement pour le Dropdown
    <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown} // Utilise la fonction closeDropdown qui appelle onClose
        className="fixed flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700" >
        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Sortie de Produit
        </h5>
        <button
            onClick={onClose} // Appelle directement la prop onClose pour fermer
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

      <form onSubmit={handleSubmitSortie}>
        <div>
          <Label htmlFor="quantiteSortie">Quantité Sortie</Label> {/* Ajout d'un htmlFor pertinent */}
          <Input
            type="number"
            id="quantiteSortie" // Ajout d'un id correspondant au htmlFor du label
            placeholder="Ex: 5"
            value={quantiteSortie}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantiteSortie(e.target.value)} // InputField utilise probablement l'événement
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="detenteur">Détenteur</Label> {/* Ajout d'un htmlFor pertinent */}
          <Input
            type="text"
            id="detenteur" // Ajout d'un id correspondant au htmlFor du label
            placeholder="Nom utilisateur"
            value={detenteur}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDetenteur(e.target.value)} // InputField utilise probablement l'événement
           />
        </div>
        <div>
          <Label htmlFor="numeroPorte">Numéro de Porte</Label> {/* Ajout d'un htmlFor pertinent */}
          <Input
            type="text"
            id="numeroPorte" // Ajout d'un id correspondant au htmlFor du label
            placeholder="Ex: 204"
            value={numeroPorte}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>setNumeroPorte(e.target.value)} // InputField utilise probablement l'événement
           />
        </div>
        <div>
          <Label htmlFor="observation">Description</Label> {/* Ajout d'un htmlFor pertinent */}
          <TextArea
             id="observation" // Ajout d'un id correspondant au htmlFor du label
             value={observation}
             onChange={(value) => setObservation(value ?? '')} // Correction ici: passer la valeur directement
             rows={1}
          />
        </div>

      <div className="flex items-center sm:gap-5 mt-5">
           <Button size="sm" variant="primary" > {/* Ajout de type="submit" pour déclencher le formulaire */}
             Ajouter
            </Button>
            {/* Le bouton Annuler ne doit pas être de type submit */}
            <Button size="sm" variant="primary"  onClick={onClose}> {/* Ajout de type="button" */}
              Annuler
            </Button>
      </div>
    </form>


      </Dropdown>

  );
}