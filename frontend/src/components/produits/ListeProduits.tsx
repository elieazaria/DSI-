import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table"; // Assurez-vous que TableRow est bien exporté avec forwardRef depuis ce fichier

import Badge from "../ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import axios from 'axios';
import { useState, useRef } from 'react';

import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { MdMoreVert, MdOutlineRemoveCircleOutline } from 'react-icons/md';

import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

interface ProduitData {
  id: number;
  designation: string;
  quantite: number;
  etat: 'nouveau' | 'bon' | 'mauvaise';
  date_entree: string;
}

interface ListeProduitsProps {
  handleOpen: (mode: 'add' | 'edit', produit: ProduitData) => void;
  handleSortir: (produit: ProduitData) => void;
  tableData: ProduitData[];
  setTableData: React.Dispatch<React.SetStateAction<ProduitData[]>>;
  searchTerm: string;
}

export default function ListeProduits({ handleOpen, tableData, setTableData, searchTerm, handleSortir }: ListeProduitsProps) {
  const [error, setError] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const rowRefs = useRef<{ [key: number]: HTMLTableRowElement | null }>({});

  const filteredData = tableData.filter((produit) =>
    produit.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produit.quantite.toString().includes(searchTerm.toLowerCase()) ||
    produit.etat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Effacer le produit?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/produits/${id}`);
        setTableData((prevData) => prevData.filter((produit) => produit.id !== id));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }
    setOpenDropdownId(null);
  };

  const handleEditClick = (produit: ProduitData) => {
    handleOpen('edit', produit);
    setOpenDropdownId(null);
  };

  const handleSortirClick = (produit: ProduitData) => {
    handleSortir(produit);
    setOpenDropdownId(null);
  };

  const toggleProductDropdown = (productId: number) => {
    const rowElement = rowRefs.current[productId];
    if (rowElement) {
      const rect = rowElement.getBoundingClientRect(); // Coordonnées de la ligne
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Hauteur estimée du dropdown. C'est CRUCIAL.
      // Mesurez-la précisément dans votre navigateur (environ 3 items de 40px + padding + bordures)
      const DROPDOWN_HEIGHT_ESTIMATE = 150; // Ajustez cette valeur si nécessaire!

      // Distance entre le bas de la ligne et le bas du viewport
      const spaceBelow = viewportHeight - rect.bottom;

      // Distance entre le haut de la ligne et le haut du viewport
      const spaceAbove = rect.top;

      // Logique de positionnement:
      // Si le dropdown déborde par le bas
      // ET qu'il y a suffisamment d'espace au-dessus de la ligne pour l'afficher
      if (spaceBelow < DROPDOWN_HEIGHT_ESTIMATE && spaceAbove >= DROPDOWN_HEIGHT_ESTIMATE) {
        setDropdownPosition('top'); // Afficher vers le haut
      } else {
        setDropdownPosition('bottom'); // Afficher vers le bas (par défaut ou si pas de place en haut)
      }
    }
    setOpenDropdownId(openDropdownId === productId ? null : productId);
  };

  const closeProductDropdown = () => {
    setOpenDropdownId(null);
  };

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="table-auto">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Désignation</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Quantité</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Etat</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date d'entrée</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"> </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredData.map((produit) => (
                <TableRow
                  key={produit.id}
                  ref={(el) => {
                    rowRefs.current[produit.id] = el;
                  }}
                  onMouseEnter={() => setHoveredRowId(produit.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  className="relative group"
                >
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {produit.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {produit.designation}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {produit.quantite}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        produit.etat === "nouveau"
                          ? "success"
                          : produit.etat === "bon"
                            ? "warning"
                            : produit.etat === "mauvaise"
                              ? "error"
                              : "light"
                      }
                    >
                      {produit.etat}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {produit.date_entree.split('T')[0]}
                  </TableCell>
                  {/* IMPORTANT: Rendre la cellule parent du dropdown relative */}
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-right relative">
                    {/* Conteneur pour le bouton d'options (visible au survol ET si aucun dropdown n'est ouvert, ou si le dropdown actuel est ouvert) */}
                    <div
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                        (hoveredRowId === produit.id && openDropdownId === null) || openDropdownId === produit.id
                          ? 'opacity-100 pointer-events-auto'
                          : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <button
                        onClick={() => toggleProductDropdown(produit.id)}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                        aria-haspopup="true"
                        aria-expanded={openDropdownId === produit.id}
                      >
                        <MdMoreVert className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="sr-only">Options</span>
                      </button>
                    </div>

                    {/* Affichage du Dropdown (visible UNIQUEMENT si ouvert) */}
                    <div
                      className={`absolute right-4 z-10 transition-opacity duration-300 ${
                        // Appliquer la position basée sur l'état dropdownPosition
                        dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                      } ${
                        openDropdownId === produit.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <Dropdown
                        isOpen={openDropdownId === produit.id}
                        onClose={closeProductDropdown}
                        className="w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1"
                      >
                        <ul className="flex flex-col gap-1">
                          <li>
                            <DropdownItem
                              onItemClick={() => handleEditClick(produit)}
                              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                              <FaEdit className="h-4 w-4 text-blue-500" />
                              <span>Editer</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              onItemClick={() => handleSortirClick(produit)}
                              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                              <MdOutlineRemoveCircleOutline className="h-4 w-4 text-green-500" />
                              <span>Sortir</span>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              onItemClick={() => handleDelete(produit.id)}
                              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                              <FaTrashAlt className="h-4 w-4 text-red-500" />
                              <span>Supprimer</span>
                            </DropdownItem>
                          </li>
                        </ul>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}