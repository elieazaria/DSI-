import { ChangeEvent,  } from 'react';
import Button from "../../components/ui/button/Button";
import Input from "../form/input/InputField";

interface NavbarProduitsProps {
  onOpen: () => void;
  onSearch: (searchTerm: string) => void;
}

export default function NavbarProduits({ onOpen, onSearch }: NavbarProduitsProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); 
  };

    return (
        <>
        <div className="flex items-center sm:gap-5">
          <Input type="text" id="inputTwo" placeholder="Recherche" onChange={handleSearchChange} />
          <Button size="sm" variant="primary"  onClick={onOpen}>
              Ajouter
          </Button>
          </div>
        </>
    )
}