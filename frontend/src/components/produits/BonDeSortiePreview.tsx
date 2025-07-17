// src/components/produits/BonDeSortiePreview.tsx
import React from 'react';
import { Modal } from "../../components/ui/modal"; 
import Button from "../../components/ui/button/Button";

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

interface BonDeSortiePreviewProps {
  selectedItems: ListeSortie[];
  totalQuantity: number;
  isOpen: boolean; // Pour contrôler la visibilité du modal
  onClose: () => void; // Pour fermer le modal
  targetRef: React.RefObject<HTMLDivElement>; // Ref pour la génération PDF
  onGeneratePdf: () => void; // Fonction pour générer le PDF
}

const BonDeSortiePreview: React.FC<BonDeSortiePreviewProps> = ({
  selectedItems,
  totalQuantity,
  isOpen,
  onClose,
  targetRef,
  onGeneratePdf,
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[900px] max-h-[90vh] overflow-y-auto p-6 md:p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
    >
      {/* Contenu qui sera dans le PDF - enveloppé par la ref */}
      <div
        ref={targetRef}
        className="flex flex-col p-20 bg-white text-black w-[790px] h-[1120px]" // Padding interne A4 et fond blanc
        //style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }} 
        
      >
        
        <div className="text-center mb-8"> 
          <img src="../../../public/images/logo/hatmad.jpg" alt="Logo" className="mx-auto mb-4 w-[100px] h-[80px] " /> 
          <h1 className="text-lg font-bold mb-0.5">REPOBLIKAN'I MADAGASIKARA</h1> {/* Taille ajustée, marge basse */}
          <p className="text-sm">Fitiavana - Tanindrazana - Fandrosoana</p> {/* Taille ajustée */}
          <div className="border-b border-black w-1/2 mx-auto mt-2 mb-1"></div> {/* Séparateur */}
        </div>

        
        <div className="flex justify-between text-sm mb-6 items-start"> 
          <div>
            <p className="mb-0.5 pl-5">MINISTERE DU TRAVAIL, DE L'EMPLOI</p>
            <p className="mb-0.5 pl-10">DE LA FONCTION PUBLIQUE</p>
            <div className="w-1/3 pl-20"> ----------------</div> {/* Petit séparateur */}
            <p className="mb-0.5 pl-13">SECRETARIAT GENERAL</p>
            <div className="w-1/3 pl-20"> ----------------</div>
            <p>DIRECTION DU SYSTEME D'INFORMATION</p>
          </div>
          <div className="text-right"> {/* Align droit */}
            <p>Antananarivo, le .............</p>
          </div>
        </div>

        {/* Section Référence */}
        <div className="text-sm mb-6"> 
          <p>N° ........-25/MTEFoP/SG/DSI</p> 
        </div>

        
        <h2 className="text-center text-base font-bold underline mb-6">BON DE SORTIE DES MATERIELS INFORMATIQUES</h2> {/* Centré, gras, souligné, marge basse */}

        <table className="w-full border-collapse mb-6"> {/* Largeur complète, bordures collapsées, marge basse */}
          <thead>
            <tr>
              <th className="border border-black p-2 text-center text-xs font-bold w-[40%]" >DESIGNATION DES PIECES</th> 
              <th className="border border-black p-2 text-center text-xs font-bold" style={{ width: '15%' }}>QUANTITE</th>
              <th className="border border-black p-2 text-center text-xs font-bold" style={{ width: '15%' }}>ETAT</th>
              <th className="border border-black p-2 text-center text-xs font-bold" style={{ width: '30%' }}>OBSERVATIONS</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item) => (
              <tr key={item.id}>
                <td className="border border-black p-2 text-sm">{item.designation}</td> {/* Bordures, padding, taille ajustée */}
                <td className="border border-black p-2 text-xs text-center">{item.quantite_sortie} </td> {/* Centré */}
                <td className="border border-black p-2 text-xs text-center">{item.etat}</td> {/* Centré */}
                <td className="border border-black p-2 text-xs">{item.observation}</td>
              </tr>
            ))}
            {/* Ligne Total */}
            <tr className="font-bold"> {/* Texte en gras */}
              <td className="border border-black p-2 text-xs">Total</td>
              <td className="border border-black p-2 text-xs text-center">{totalQuantity}</td> {/* Centré */}
              <td className="border border-black p-2 text-xs"></td> {/* Cellules vides */}
              <td className="border border-black p-2 text-xs"></td>
            </tr>
          </tbody>
        </table>

        {/* Section Footer (Détenteur) */}
        <div className="text-right mt-5 p-20 pt-2"> {/* Align droit, marge top automatique pour pousser vers le bas, padding top */}
          <p className="font-bold mb-1">Détenteur</p> 
        </div>
      </div>

      {/* Le bouton pour générer le PDF, placé en bas du modal, en dehors du contenu PDF */}
      <div className="flex justify-center mt-6"> 
           <Button
               className="px-6 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 disabled:opacity-50"
               onClick={selectedItems.length > 0 ? onGeneratePdf : undefined}
               disabled={selectedItems.length === 0}
           >
               Générer le PDF
           </Button>
      </div>

    </Modal>
  );
};

export default BonDeSortiePreview;
