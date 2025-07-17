import { usePDF } from 'react-to-pdf';
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ListeSorties from "../../components/produits/ListeSorties";
import NavbarSorties from "../../components/produits/NavbarSorties";
import BonDeSortiePreview from "../../components/produits/BonDeSortiePreview";
import { useState, useEffect, useMemo } from 'react'; 
import axios from 'axios';

import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver';

// Supposant que ListeSortie interface est définie ici ou dans types.ts
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

export default function SortiesPage() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [tableData, setTableData] = useState<ListeSortie[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
    const [showPreview, setShowPreview] = useState<boolean>(false); // État pour contrôler la visibilité du modal

    const fetchSorties = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/sorties');
            setTableData(response.data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    useEffect(() => {
        fetchSorties();
    }, []);

    // Ref for the content to be converted to PDF
    // Le ref est utilisé sur le contenu *à l'intérieur* du modal dans BonDeSortiePreview
    const { toPDF, targetRef } = usePDF({ filename: 'bon-de-sortie.pdf' });

    // Filter the initial list to get only the selected items
    const selectedItems = useMemo(() => {
        return tableData.filter(item => selectedItemIds.has(item.id));
    }, [selectedItemIds, tableData]);

    // Calculate the total quantity of selected items
    const totalQuantity = useMemo(() => {
        return selectedItems.reduce((total, item) => total + item.quantite_sortie, 0);
    }, [selectedItems]);

    // Handler for checkbox changes
    const handleCheckboxChange = (id: number, isChecked: boolean) => {
        setSelectedItemIds(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (isChecked) {
                newSelected.add(id);
            } else {
                newSelected.delete(id);
            }
            return newSelected;
        });
    };

    // Handler to open the modal
    const handleOpenPreviewModal = () => {
        if (selectedItems.length === 0) {
            alert("Veuillez sélectionner au moins un article pour générer le bon de sortie.");
            return;
        }
        setShowPreview(true);
    };

    // Handler to close the modal
    const handleClosePreviewModal = () => {
        setShowPreview(false);
    };

    // Handler for the PDF generation button inside the modal
    // Cette fonction appelle toPDF() en utilisant la ref
    const handleGeneratePdfClick = () => {
        if (targetRef.current) {
            toPDF();
        } else {
            console.error("Target ref is not available for PDF generation.");
        }
    };

    // Définir les titres des colonnes pour le filtre. Doit correspondre à l'ordre dans ListeSorties.
    const allColumnTitles = [
        "Date Sortie",
        "Désignation",
        "Quantité",
        "Etat",
        "Detenteur",
        "Porte",
        "Observation",
        "Sélection", // "Sélection" est un cas spécial, non une donnée directe
    ];

    // État des colonnes visibles
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(allColumnTitles));

    // Ajout de columnMap pour mapper les titres affichables aux clés des données
    const columnMap: { [key: string]: keyof ListeSortie | undefined } = {
        "Date Sortie": "date_sortie",
        "Désignation": "designation",
        "Quantité": "quantite_sortie",
        "Etat": "etat",
        "Detenteur": "detenteur",
        "Porte": "numero_porte",
        "Observation": "observation",
        // "Sélection" n'a pas de clé correspondante dans ListeSortie, donc pas besoin de la mapper
    };

    // Définir l'ordre des colonnes pour l'exportation Excel
    // Il est important que "Sélection" soit exclu si vous ne voulez pas l'exporter
    const orderedColumns = [
        "Date Sortie",
        "Désignation",
        "Quantité",
        "Etat",
        "Detenteur",
        "Porte",
        "Observation",
    ];

    // Filtrer les données en fonction du searchTerm
    const filteredData = useMemo(() => {
        return tableData.filter(item =>
            item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.detenteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.numero_porte.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.observation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.date_sortie.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tableData, searchTerm]);


    const handleColumnVisibilityChange = (columnName: string, isVisible: boolean) => {
        setVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
                newSet.add(columnName);
            } else {
                newSet.delete(columnName);
            }
            return newSet;
        });
    };

    const handleExportToExcel = () => {
        const dataToExport = filteredData.map(item => {
            const row: { [key: string]: any } = {};
            // Utiliser orderedColumns pour s'assurer de l'ordre et des colonnes à inclure
            orderedColumns.forEach(columnTitle => {
                // Vérifier si la colonne est visible et n'est pas "Sélection"
                if (visibleColumns.has(columnTitle) && columnTitle !== "Sélection") { 
                    const dataKey = columnMap[columnTitle] as keyof ListeSortie | undefined; // Peut être undefined si la clé n'est pas mappée
                    if (dataKey) { // S'assurer que dataKey est défini
                        let cellValue = item[dataKey];
                        if (dataKey === 'date_sortie' && typeof cellValue === 'string') {
                            cellValue = cellValue.split('T')[0]; 
                        }
                        row[columnTitle] = cellValue;
                    }
                }
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ListeSorties");

        // Écrire le fichier et le déclencher le téléchargement
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'liste_sorties.xlsx');
    };

    return (
        <>
            {/* Vos autres composants comme PageMeta, PageBreadcrumb */}
            <PageMeta
                title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Basic Tables" />
            <div className="space-y-6">
                <ComponentCard title="Historique de sorties">
                    {/* NavbarSorties component pour ouvrir le modal */}
                    <NavbarSorties
                        onOpen={handleOpenPreviewModal} 
                        onExportToExcel={handleExportToExcel}
                        onColumnVisibilityChange={handleColumnVisibilityChange}
                        columnTitles={allColumnTitles}
                        initialVisibleColumns={Array.from(visibleColumns)} // Passer les colonnes initialement visibles
                    />

                    {/* ListeSorties component */}
                    <ListeSorties
                        setTableData={setTableData}
                        tableData={tableData}
                        searchTerm={searchTerm} // Passer le searchTerm
                        selectedItemIds={selectedItemIds}
                        onCheckboxChange={handleCheckboxChange}
                        visibleColumns={visibleColumns} // Passer les colonnes visibles à ListeSorties
                    />

                    {selectedItems.length > 0 && ( // Rendre le modal component seulement s'il y a des items sélectionnés
                        <BonDeSortiePreview
                            selectedItems={selectedItems}
                            totalQuantity={totalQuantity}
                            isOpen={showPreview} // Passe l'état showPreview à isOpen
                            onClose={handleClosePreviewModal} // Passe la fonction pour fermer le modal
                            targetRef={targetRef} // Passe la ref
                            onGeneratePdf={handleGeneratePdfClick} // Passe la fonction pour générer le PDF
                        />
                    )}

                </ComponentCard>
            </div>
        </>
    );
}