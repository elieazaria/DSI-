import React from 'react';
import { AiOutlineCopy } from 'react-icons/ai'; // Importez l'icône de copie

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

interface ListeDemandProps {
tableData: MaterialRequest[];
searchTerm: string;
selectedItemIds: Set<string>;
onCheckboxChange: (id: string, isChecked: boolean) => void;
visibleColumns: Set<string>;
setTableData: React.Dispatch<React.SetStateAction<MaterialRequest[]>>; // Bien que non utilisé ici, il est dans votre code
}

const ListeDemand: React.FC<ListeDemandProps> = ({
tableData,
searchTerm,
selectedItemIds,
onCheckboxChange,
visibleColumns,
}) => {
const filteredData = tableData.filter(item =>
item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.departement.toLowerCase().includes(searchTerm.toLowerCase()) ||
item.request_id.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Référence "${text}" copiée dans le presse-papiers.`); // Optionnel: feedback à l'utilisateur
};

return (
    <div style={{ overflowX: 'auto' }}> {/* Conteneur pour le défilement horizontal */}
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {Array.from(visibleColumns).map(columnTitle => (
                        <th
                            key={columnTitle}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            {columnTitle === 'Référence' ? 'Références' : columnTitle}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map(item => (
                    <tr key={item.request_id}>
                        {Array.from(visibleColumns).map(columnTitle => (
                            <td key={`${item.request_id}-${columnTitle}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {columnTitle === 'Sélection' ? (
                                    <input
                                        type="checkbox"
                                        checked={selectedItemIds.has(item.request_id)}
                                        onChange={(e) => onCheckboxChange(item.request_id, e.target.checked)}
                                    />
                                ) : columnTitle === 'Date Demande' ? (
                                    item.request_date.split('T')[0]
                                ) : columnTitle === 'Références' ? (
                                    <div className="flex items-center">
                                        <span>{item.request_id}</span>
                                        <button
                                            className="ml-2 text-gray-400 hover:text-blue-500 focus:outline-none"
                                            onClick={() => handleCopyToClipboard(item.request_id)}
                                        >
                                            <AiOutlineCopy className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : columnTitle === 'Demandeur' ? (
                                    `${item.nom} ${item.prenom}`
                                ) : (
                                    item[(columnTitle.toLowerCase().replace(' ', '_') as keyof MaterialRequest)]?.toString() || ''
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);