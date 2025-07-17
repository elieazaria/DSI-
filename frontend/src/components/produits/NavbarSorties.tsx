import React from 'react';
import Button from "../../components/ui/button/Button";
import ColumnVisibilityFilter from "./ColumnVisibilityFilter"; // Importez le nouveau composant

interface NavbarSortiesProps {
  onOpen: () => void;
  onExportToExcel: () => void;
  onColumnVisibilityChange: (columnName: string, isVisible: boolean) => void;
  // Ajoutez une prop pour la liste des titres de colonnes
  columnTitles: string[];
  initialVisibleColumns?: string[]; // Optionnel, pour initialiser les colonnes visibles
}

const NavbarSorties: React.FC<NavbarSortiesProps> = ({
  onOpen,
  onExportToExcel,
  onColumnVisibilityChange,
  columnTitles,
  initialVisibleColumns,
}) => {
  return (
    <>
      <div className="flex items-center gap-5 sm:gap-5 justify-between"> 
        <Button size="sm" variant="primary" onClick={onOpen}>
          Afficher Bon de Sortie
        </Button>
        <Button size="sm" variant="primary" onClick={onExportToExcel}>
          Exporter en Excel
        </Button>
        {/* Composant de filtre de colonnes */}
        <ColumnVisibilityFilter
          columns={columnTitles}
          onColumnToggle={onColumnVisibilityChange}
          initialVisibleColumns={initialVisibleColumns}
        />
      </div>
    </>
  );
}

export default NavbarSorties;


