import React, { useState, useRef, useEffect } from 'react';
import Checkbox from "../form/input/Checkbox"; // Assurez-vous que le chemin est correct
import { MdFilterList } from 'react-icons/md'; // Exemple d'icône, installez react-icons si vous ne l'avez pas

interface ColumnVisibilityFilterProps {
  columns: string[]; // Noms des colonnes à filtrer
  onColumnToggle: (columnName: string, isVisible: boolean) => void;
  initialVisibleColumns?: string[]; // Colonnes initialement visibles
}

const ColumnVisibilityFilter: React.FC<ColumnVisibilityFilterProps> = ({
  columns,
  onColumnToggle,
  initialVisibleColumns,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Utilise un Set pour des opérations de recherche/ajout/suppression efficaces
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(initialVisibleColumns || columns) // Par défaut, toutes les colonnes sont visibles
  );

  const dropdownRef = useRef<HTMLDivElement>(null); // Pour détecter les clics en dehors du dropdown

  // Gérer la fermeture du dropdown au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (columnName: string, isChecked: boolean) => {
    const updatedVisibleColumns = new Set(visibleColumns);
    if (isChecked) {
      updatedVisibleColumns.add(columnName);
    } else {
      updatedVisibleColumns.delete(columnName);
    }
    setVisibleColumns(updatedVisibleColumns);
    onColumnToggle(columnName, isChecked); // Notifie le parent du changement
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <MdFilterList className="mr-2 h-5 w-5" /> {/* Icône de filtre */}
        Filtrer
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-gray-700 dark:ring-white/[0.05]">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {columns.map((column) => (
              <label
                key={column}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              >
                <Checkbox
                  checked={visibleColumns.has(column)}
                  onChange={(isChecked) => handleCheckboxChange(column, isChecked)}
                  id={`checkbox-${column}`}
                  className="mr-2"
                />
                {column}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnVisibilityFilter;
