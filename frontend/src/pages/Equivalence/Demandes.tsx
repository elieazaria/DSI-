import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ListeDemand from "../../components/equivalence/ListeDemand";
import NavbarDemandes from "../../components/equivalence/NavbarDemandes";
import { useState, useEffect, useMemo } from 'react'; 
import axios from 'axios';

import * as XLSX from 'xlsx'; 
import { saveAs } from 'file-saver';

// Interface pour les demandes de matériel
interface MaterialRequest {
    request_id: string;
    employee_id: string;
    designation: string;
    quantite: number;
    caracteristiques: string | null;
    request_date: string;
    statut: 'En attente' | 'Approuvée' | 'Rejetée' | 'Livrée';
    nom: string;
    prenom: string;
    fonction: string;
    departement: string;
    numero_porte: string;
}

export default function DemandesPage() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [tableData, setTableData] = useState<MaterialRequest[]>([]);
    const [error, setError] = useState<string | null>(null);

    // L'état pour les sélections est conservé pour l'export Excel et d'autres actions potentielles
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

    const fetchDemandes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/material-requests'); 
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
        fetchDemandes();
    }, []);

    // Gérer le changement des cases à cocher
    const handleCheckboxChange = (id: string, isChecked: boolean) => {
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

    // Définir tous les titres de colonnes possibles
    const allColumnTitles = [
        "Date Demande", "Référence", "Désignation", "Quantité", "Demandeur", "Département", "Statut", "Sélection"
    ];

    // État pour les colonnes visibles
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(allColumnTitles));

    // Mapper les titres de colonnes aux clés de données
    const columnMap: { [key: string]: keyof MaterialRequest | undefined } = {
        "Date Demande": "request_date",
        "Référence": "request_id",
        "Désignation": "designation",
        "Quantité": "quantite",
        "Demandeur": undefined, 
        "Département": "departement",
        "Statut": "statut",
    };
    
    // Ordre des colonnes pour l'export Excel
    const orderedColumns = [
        "Date Demande", "Référence", "Désignation", "Quantité", "Demandeur", "Département", "Statut"
    ];

    // Filtrer les données en fonction du terme de recherche
    const filteredData = useMemo(() => {
        return tableData.filter(item =>
            item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.request_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tableData, searchTerm]);

    // Gérer la visibilité des colonnes
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

    // Exporter les données vers un fichier Excel
    const handleExportToExcel = () => {
        const dataToExport = filteredData.map(item => {
            const row: { [key: string]: any } = {};
            orderedColumns.forEach(columnTitle => {
                if (visibleColumns.has(columnTitle)) {
                    if (columnTitle === "Demandeur") {
                        row[columnTitle] = `${item.nom} ${item.prenom}`;
                    } else {
                        const dataKey = columnMap[columnTitle];
                        if (dataKey) {
                            let cellValue = item[dataKey];
                            if (dataKey === 'request_date' && typeof cellValue === 'string') {
                                cellValue = cellValue.split('T')[0];
                            }
                            row[columnTitle] = cellValue;
                        }
                    }
                }
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DemandesMateriel");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'demandes_materiel.xlsx');
    };

    return (
        <>
            <PageMeta
                title="Tableau de bord des Demandes de Matériel"
                description="Page pour visualiser et gérer les demandes de matériel"
            />
            <PageBreadcrumb pageTitle="Demandes de Matériel" />
            <div className="space-y-6">
                <ComponentCard title="Liste des Demandes">
                    <NavbarDemandes
                        onSearch={setSearchTerm}
                        //onExportToExcel={handleExportToExcel}
                        onColumnVisibilityChange={handleColumnVisibilityChange}
                        columnTitles={allColumnTitles}
                        initialVisibleColumns={Array.from(visibleColumns)}
                    />
                    <ListeDemand
                        setTableData={setTableData}
                        tableData={filteredData}
                        searchTerm={searchTerm}
                        selectedItemIds={selectedItemIds}
                        onCheckboxChange={handleCheckboxChange}
                        visibleColumns={visibleColumns}
                    />
                </ComponentCard>
            </div>
        </>
    );
}