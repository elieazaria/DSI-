import { ChangeEvent,  } from 'react';
//import Button from "../../components/ui/button/Button";
import Input from "../form/input/InputField";
import ColumnVisibilityFilter from "../produits/ColumnVisibilityFilter";

interface NavbarDemandesProps {
  onSearch: (searchTerm: string) => void;
  onColumnVisibilityChange: (columnName: string, isVisible: boolean) => void;
  columnTitles: string[];
  initialVisibleColumns?: string[];
}

export default function NavbarDemandes({  onSearch,
  onColumnVisibilityChange,
  columnTitles,
  initialVisibleColumns,}: NavbarDemandesProps) {

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); 
  };

    return (
        <>
        <div className="flex items-center sm:gap-5">
          <Input type="text" id="inputTwo" placeholder="Recherche" onChange={handleSearchChange} />
          <ColumnVisibilityFilter
          columns={columnTitles}
          onColumnToggle={onColumnVisibilityChange}
          initialVisibleColumns={initialVisibleColumns}
        />
          </div>
        </>
    )
}