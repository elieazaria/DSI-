import React from 'react';
import Button from "../../components/ui/button/Button";
import ColumnVisibilityFilter from "./ColumnVisibilityFilter";
import { FaPrint, FaFileExcel } from 'react-icons/fa'; // Importez les icônes nécessaires

interface NavbarSortiesProps {
  onOpen: () => void;
  onExportToExcel: () => void;
  onColumnVisibilityChange: (columnName: string, isVisible: boolean) => void;
  columnTitles: string[];
  initialVisibleColumns?: string[];
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
          {/* Icône d'impression ajoutée à gauche du texte */}
          <FaPrint className="mr-2" /> 
          Afficher Bon de Sortie
        </Button>
        <Button size="sm" variant="primary" onClick={onExportToExcel}>
          {/* Icône d'exportation (Excel) ajoutée à gauche du texte */}
          <FaFileExcel className="mr-2" />
          Exporter en Excel
        </Button>
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