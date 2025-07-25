import { useState } from 'react';
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function MaterialRequestForm() {
    const { isOpen, openModal, closeModal } = useModal();

    // State pour le matricule de l'employé
    const [employeeId, setEmployeeId] = useState('');
    // State pour stocker les détails de l'employé une fois récupérés
    const [employeeDetails, setEmployeeDetails] = useState(null);
    // States pour les champs de la demande de matériel
    const [designation, setDesignation] = useState('');
    const [quantity, setQuantity] = useState('');
    const [technicalCharacteristics, setTechnicalCharacteristics] = useState('');
    // State pour la gestion du chargement et des erreurs
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [generatedReference, setGeneratedReference] = useState(null);

    // Fonction pour réinitialiser le formulaire
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

    // Gère la vérification du matricule de l'employé
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

            setEmployeeDetails(data.employeeDetails);
            setSuccessMessage(data.message);
        } catch (err) {
            setError(err.message);
            setEmployeeDetails(null); // Réinitialiser les détails de l'employé en cas d'erreur
        } finally {
            setIsLoading(false);
        }
    };

    // Gère la soumission de la demande de matériel
    const handleSubmitRequest = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        setError(null);
        setSuccessMessage(null);
        setGeneratedReference(null);
        setIsLoading(true);

        // Validation simple côté client
        if (!designation || !quantity || !employeeId) {
            setError("Veuillez remplir tous les champs obligatoires (désignation, quantité).");
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
                    quantity: parseInt(quantity, 10), // Convertir en nombre
                    technical_characteristics: technicalCharacteristics,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la création de la demande.');
            }

            setSuccessMessage(data.message);
            setGeneratedReference(data.request.request_id);
            // Optionnel: Réinitialiser les champs de la demande après succès
            setDesignation('');
            setQuantity('');
            setTechnicalCharacteristics('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour fermer le modal et réinitialiser l'état
    const handleCloseModal = () => {
        resetForm();
        closeModal();
    };

    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        {/* Supprimé l'image d'utilisateur et les liens sociaux pour simplifier */}
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
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                fill=""
                            />
                        </svg>
                        Nouvelle Demande
                    </button>
                </div>
            </div>

            <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Demande de Matériel Informatique
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Veuillez entrer le matricule de l'employé pour afficher ses détails, puis compléter la demande.
                        </p>
                    </div>

                    <form onSubmit={employeeDetails ? handleSubmitRequest : handleCheckEmployee} className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            {/* Section Saisie Matricule */}
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
                                            
                                            //disabled={isLoading || employeeDetails} // Désactiver une fois l'employé trouvé
                                        />
                                    </div>
                                    {!employeeDetails && (
                                        <div className="col-span-2">
                                            <Button
                                                //type="button" // Important: pour ne pas soumettre tout le formulaire
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

                            {/* Affichage des détails de l'employé si trouvé */}
                            {employeeDetails && (
                                <div className="mt-7">
                                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                        Détails de l'employé
                                    </h5>
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Nom</Label>
                                            <Input type="text" value={employeeDetails.last_name} disabled />
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Prénom(s)</Label>
                                            <Input type="text" value={employeeDetails.first_name} disabled />
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Fonction</Label>
                                            <Input type="text" value={employeeDetails.position} disabled />
                                        </div>
                                        <div className="col-span-2 lg:col-span-1">
                                            <Label>Département</Label>
                                            <Input type="text" value={employeeDetails.department} disabled />
                                        </div>
                                        <div className="col-span-2">
                                            <Label>Numéro de Bureau</Label>
                                            <Input type="text" value={employeeDetails.office_number} disabled />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Formulaire de Demande de Matériel (visible si employé trouvé) */}
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
                                            <Label htmlFor="quantity">Quantité</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                min="1"
                                                placeholder="1"
                                            
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor="technicalCharacteristics">Caractéristiques Techniques</Label>
                                            {/* Utilisez une textarea pour de multiples lignes */}
                                            <textarea
                                                id="technicalCharacteristics"
                                                value={technicalCharacteristics}
                                                onChange={(e) => setTechnicalCharacteristics(e.target.value)}
                                                placeholder="Ex: Modèle Dell XPS 15, Processeur i7, 16Go RAM, SSD 512Go"
                                                //rows="3"
                                                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Messages de statut */}
                            {isLoading && <p className="mt-4 text-center text-blue-500">Chargement...</p>}
                            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                            {successMessage && !generatedReference && <p className="mt-4 text-center text-green-500">{successMessage}</p>}
                            {generatedReference && (
                                <p className="mt-4 text-center text-green-500 font-bold">
                                    {successMessage} Votre référence de demande est : <span className="text-blue-600">{generatedReference}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={handleCloseModal}>
                                Fermer
                            </Button>
                            {employeeDetails && ( // Le bouton de soumission n'apparaît que si l'employé est validé
                                <Button size="sm"  disabled={isLoading}>
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
