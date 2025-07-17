import React from 'react';
import Checkbox from "../form/input/Checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
 


interface ListeSortie {
  id: number;
  designation: string;
  quantite_sortie: number;
  etat: 'nouveau' | 'bon' | 'mauvaise';
  detenteur: string;
  numero_porte: string;
  observation?: string | null;
  date_sortie: string;
}

interface ListeProduitsProps {
  tableData: ListeSortie[];
  selectedItemIds: Set<number>;
  onCheckboxChange: (id: number, isChecked: boolean) => void;
  setTableData: React.Dispatch<React.SetStateAction<ListeSortie[]>>;
  visibleColumns: Set<string>;
  searchTerm: string;
}

const columnMap: { [key: string]: keyof ListeSortie | 'checkbox' } = {
  "Date Sortie": "date_sortie",
  "Désignation": "designation",
  "Quantité": "quantite_sortie",
  "Etat": "etat",
  "Detenteur": "detenteur",
  "Porte": "numero_porte",
  "Observation": "observation",
  "Sélection": "checkbox"
};

const orderedColumns = [
  "Date Sortie",
  "Désignation",
  "Quantité",
  "Etat",
  "Detenteur",
  "Porte",
  "Observation",
  "Sélection",
];

export default function ListeSorties({ selectedItemIds, onCheckboxChange, tableData, searchTerm, visibleColumns }: ListeProduitsProps) {

  // Filter the tableData based on the searchTerm
  const filteredData = tableData.filter((produit) =>
    produit.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produit.numero_porte.toString().includes(searchTerm.toLowerCase()) ||
    produit.detenteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <>
      

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">

          <Table className="table-auto">
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {orderedColumns.map((columnTitle) =>
                  visibleColumns.has(columnTitle) && ( // Afficher seulement si la colonne est visible
                    <TableCell
                      key={columnTitle}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {columnTitle}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredData.map((produit) => (
                <TableRow key={produit.id}>
                  {orderedColumns.map((columnTitle) => {
                    if (!visibleColumns.has(columnTitle)) {
                      return null; // Ne pas rendre la cellule si la colonne n'est pas visible
                    }

                    const dataKey = columnMap[columnTitle];
                    if (dataKey === 'checkbox') {
                      return (
                        <TableCell key={`${produit.id}-checkbox`} className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Checkbox
                            checked={selectedItemIds.has(produit.id)}
                            onChange={() => onCheckboxChange(produit.id, !selectedItemIds.has(produit.id))}
                          />
                        </TableCell>
                      );
                    } else if (dataKey) {
                      let cellValue: React.ReactNode = produit[dataKey] as any;
                      // Formatter la date si c'est la colonne "Date Sortie"
                      if (dataKey === 'date_sortie' && typeof cellValue === 'string') {
                        cellValue = cellValue.split('T')[0];
                      }
                      return (
                        <TableCell key={`${produit.id}-${columnTitle}`} className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {cellValue}
                        </TableCell>
                      );
                    }
                    return null;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </div>
      </div>
    </>
  );
}