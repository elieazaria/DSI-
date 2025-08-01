import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ListeProduits from "../../components/produits/ListeProduits";
import NavbarProduits from "../../components/produits/NavbarProduits";
import ModalformProduits from "../../components/produits/ModalformProduits";
import ModalformSorties from "../../components/produits/ModalformSorties";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ProduitData {
  id: number;
  designation: string;
  quantite: number;
  etat: 'nouveau' | 'bon' | 'mauvaise';
  date_entree: string;
}

interface NewSortieProduitData {
  produit_id: number;
  quantite_sortie: number;
  detenteur: string;
  numero_porte: string;
  observation?: string | null;
}

export default function BasicTables() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [produitData, setClientData] = useState<ProduitData | undefined>(undefined);
  const [tableData, setTableData] = useState<ProduitData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isSortieModalOpen, setIsSortieModalOpen] = useState<boolean>(false);
  const [produitPourSortie, setProduitPourSortie] = useState<ProduitData | undefined>(undefined);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/produits');
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
    fetchClients();
  }, []);

  const handleOpen = (mode: 'add' | 'edit', produit: ProduitData) => {
    setClientData(produit);
    setModalMode(mode);
    setIsOpen(true);
  };

  const handleSubmit = async (newProduitData: ProduitData) => {
    if (modalMode === 'add') {
      try {
        const response = await axios.post('http://localhost:3000/api/produits', newProduitData); // Replace with your actual API URL
        console.log('Client added:', response.data); // Log the response
        setTableData((prevData) => [...prevData, response.data]);
        // Optionally, update your state here to reflect the newly added client
      } catch (error) {
        console.error('Error adding client:', error); // Log any errors
      }
      console.log('modal mode Add');
    } else {
      console.log('Updating client with ID:', produitData?.id); // Log the ID being updated
      try {
        const response = await axios.put(`http://localhost:3000/api/produits/${produitData?.id}`, newProduitData);
        console.log('Client updated:', response.data);
        setTableData((prevData) =>
          prevData.map((produit) => (produit.id === produitData?.id ? response.data : produit))
        );
      } catch (error) {
        console.error('Error updating client:', error);
      }
    }
  };
 

  const handleOpenSortieModal = (produit: ProduitData) => {
    setProduitPourSortie(produit);     
    setIsSortieModalOpen(true);      
  };

  const handleSubmitSortie = async (sortieData: NewSortieProduitData) => {

    try {
      const response = await axios.post('http://localhost:3000/api/sorties', sortieData); // URL suggérée
      console.log('Sortie enregistrée:', response.data);

      setTableData(prevData =>
        prevData.map(p =>
          // Utiliser l'ID venant des données soumises
          p.id === sortieData.produit_id
            ? {
                ...p,
                quantite: p.quantite - Number(sortieData.quantite_sortie) 
              }
            : p
        )
      );


      setIsSortieModalOpen(false); // Fermer la modale après succès
    } catch (error) {
      console.error('Error adding sortie:', error);
    }
  }
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <NavbarProduits onOpen={() => handleOpen('add', {} as ProduitData)} onSearch={setSearchTerm} />
          <ListeProduits 
          setTableData={setTableData} 
          tableData={tableData} 
          handleOpen={handleOpen} 
          searchTerm={searchTerm} 
          handleSortir={handleOpenSortieModal} 
          />
          <ModalformProduits
            isOpen={isOpen}
            onSubmit={handleSubmit}
            onClose={() => setIsOpen(false)}
            mode={modalMode}
            produitData={produitData}
          />
          <ModalformSorties
           isOpen={isSortieModalOpen}
           onSubmit={handleSubmitSortie}
           onClose={() => setIsSortieModalOpen(false)} 
           produitData={produitPourSortie}
          />
        </ComponentCard>
      </div>
    </>
  );
 }
