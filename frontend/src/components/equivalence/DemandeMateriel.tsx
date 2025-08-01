import { useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';

interface EmployeeDetails {
  nom: string;
  prenom: string;
  fonction: string;
  departement: string;
  numero_porte: string;
}

export default function MaterialRequestForm() {
  const { isOpen, openModal, closeModal } = useModal();

  const [employeeId, setEmployeeId] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
  const [designation, setDesignation] = useState('');
  const [quantite, setQuantity] = useState('');
  const [caracteristiques, setTechnicalCharacteristics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatedReference, setGeneratedReference] = useState<string | null>(null);

  const resetForm = () => {
    setEmployeeId('');
    setEmployeeDetails(null);
    setDesignation('');
    setQuantity('');
    setTechnicalCharacteristics('');
    setError(null);
    setSuccessMessage(null);
    setGeneratedReference(null);
  };

  const handleCheckEmployee = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employee_id: employeeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la vérification du matricule.');
      }

      setEmployeeDetails(data.employeeDetails as EmployeeDetails);
      setSuccessMessage(data.message);
    } catch (err: any) {
      setError(err.message);
      setEmployeeDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setGeneratedReference(null);
    setIsLoading(true);

    // Ajout d'une vérification plus robuste pour s'assurer que la quantité est un nombre valide
    const parsedQuantite = parseInt(quantite, 10);
    if (!designation || isNaN(parsedQuantite) || parsedQuantite <= 0 || !employeeId) {
      setError("Veuillez remplir tous les champs obligatoires (désignation, quantité) avec des valeurs valides.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employeeId,
          designation,
          // CORRECTION: Remplacer 'quantity' par 'quantite' pour correspondre au backend
          quantite: parsedQuantite,
          caracteristiques,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la demande.');
      }

      setSuccessMessage(data.message);
      setGeneratedReference(data.request.request_id);
      setDesignation('');
      setQuantity('');
      setTechnicalCharacteristics('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    resetForm();
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                Formulaire de Demande de Matériel Informatique
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center xl:text-left">
                Saisissez le matricule de l'employé puis les détails du matériel.
              </p>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Nouvelle Demande
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] max-h-[90vh] flex flex-col rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Demande de Matériel Informatique
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Veuillez entrer le matricule de l'employé pour afficher ses détails, puis compléter la demande.
            </p>
          </div>

          <form onSubmit={employeeDetails ? handleSubmitRequest : handleCheckEmployee} className="flex flex-col flex-grow overflow-hidden">
            <div className="overflow-y-auto flex-grow px-2 pb-3 custom-scrollbar">
              <div className="mb-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informations Employé
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label htmlFor="employeeId">Matricule Employé</Label>
                    <Input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="Ex: EMP001"
                    />
                  </div>
                  {!employeeDetails && (
                    <div className="col-span-2">
                      <Button
                        size="sm"
                        onClick={handleCheckEmployee}
                        disabled={isLoading || !employeeId}
                      >
                        {isLoading ? 'Vérification...' : 'Vérifier Employé'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {employeeDetails && (
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Détails de l'employé
                  </h5>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Nom</Label>
                      <Input type="text" value={employeeDetails.nom} disabled />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Prénom(s)</Label>
                      <Input type="text" value={employeeDetails.prenom} disabled />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Fonction</Label>
                      <Input type="text" value={employeeDetails.fonction} disabled />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Département</Label>
                      <Input type="text" value={employeeDetails.departement} disabled />
                    </div>
                    <div className="col-span-2">
                      <Label>Numéro de Bureau</Label>
                      <Input type="text" value={employeeDetails.numero_porte} disabled />
                    </div>
                  </div>
                </div>
              )}

              {employeeDetails && (
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Détails de la Demande de Matériel
                  </h5>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2">
                      <Label htmlFor="designation">Désignation</Label>
                      <Input
                        id="designation"
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Ex: Ordinateur portable, Écran, Souris"
                      />
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                      <Label htmlFor="quantite">Quantité</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantite}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        placeholder="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="technicalCharacteristics">Caractéristiques Techniques</Label>
                      <textarea
                        id="technicalCharacteristics"
                        value={caracteristiques}
                        onChange={(e) => setTechnicalCharacteristics(e.target.value)}
                        placeholder="Ex: Modèle Dell XPS 15, Processeur i7, 16Go RAM, SSD 512Go"
                        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && <p className="mt-4 text-center text-blue-500">Chargement...</p>}
              {error && <p className="mt-4 text-center text-red-500">{error}</p>}
              {successMessage && !generatedReference && <p className="mt-4 text-center text-green-500">{successMessage}</p>}
              {generatedReference && (
                <p className="mt-4 text-center text-green-500 font-bold">
                  {successMessage} Votre référence de demande est : <span className="text-blue-600">{generatedReference}</span>
                </p>
              )}
            </div>

            <div className="flex-shrink-0 flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Fermer
              </Button>
              {employeeDetails && (
                <Button size="sm" disabled={isLoading}>
                  {isLoading ? 'Soumission...' : 'Soumettre Demande'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
