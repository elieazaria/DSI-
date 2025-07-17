import React, { useState } from "react"; // Importer React
import DatePicker, { registerLocale } from "react-datepicker"; // Importer DatePicker et registerLocale
import "react-datepicker/dist/react-datepicker.css"; // Styles pour DatePicker
import { fr } from "date-fns/locale/fr"; // Locale française

// Enregistrer la locale française pour le calendrier
registerLocale("fr", fr);

// Définition du composant fonctionnel avec React.FC (bonne pratique en TypeScript)
const DateRdv: React.FC = () => {
  // État pour stocker la date sélectionnée.
  // Le type est Date | null car initialement aucune date n'est sélectionnée.
  const [date, setDate] = useState<Date | null>(null);

  // Liste des jours fériés (objets Date)
  // Note: Les mois sont indexés à partir de 0 (janvier = 0, décembre = 11)
  // Il est plus sûr de créer les dates ainsi pour éviter les problèmes de fuseau horaire
  const joursFeries: Date[] = [
    new Date(2025, 0, 1),  // 1er Janvier 2025
    new Date(2025, 3, 21), // Lundi de Pâques 2025
    new Date(2025, 4, 1),  // 1er Mai 2025
    new Date(2025, 4, 8),  // 8 Mai 2025
    new Date(2025, 4, 29), // Ascension 2025
    new Date(2025, 5, 9),  // Lundi de Pentecôte 2025
    new Date(2025, 5, 26), // 26 Juin 2025
    new Date(2025, 7, 15), // Assomption 2025
    new Date(2025, 10, 1), // Toussaint 2025
    new Date(2025, 10, 11),// Armistice 1918
    new Date(2025, 11, 25),// Noël 2025
  ];

  /**
   * Fonction pour filtrer les dates affichées dans le calendrier.
   * Elle retourne true si la date est un jour de semaine ET n'est pas fériée.
   * @param dateToCheck - La date à vérifier (type Date)
   * @returns boolean - True si la date est valide, false sinon.
   */
  const isWeekdayAndNotHoliday = (dateToCheck: Date): boolean => {
    const day = dateToCheck.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    const isWeekend = day === 0 || day === 6;

    // Vérifie si la dateToCheck correspond à un jour férié
    const isHoliday = joursFeries.some(
      (ferie) =>
        dateToCheck.getDate() === ferie.getDate() &&
        dateToCheck.getMonth() === ferie.getMonth() &&
        dateToCheck.getFullYear() === ferie.getFullYear()
    );

    // La date est valide si ce n'est PAS un weekend ET PAS un jour férié
    return !isWeekend && !isHoliday;
  };

  // Création des objets Date pour minTime et maxTime
  const minTimeDate = new Date();
  minTimeDate.setHours(8, 0, 0, 0); // Définit l'heure à 08:00:00.000

  const maxTimeDate = new Date();
  maxTimeDate.setHours(11, 45, 0, 0); // Définit l'heure à 11:45:00.000

  return (
    <div>
      <DatePicker
        selected={date}
        // La fonction onChange reçoit une Date ou null, ou un tableau [Date | null, Date | null] si range
        // Ici on s'attend à Date | null
        onChange={(newDate: Date | null) => setDate(newDate)}
        locale="fr" // Utiliser la locale française
        dateFormat="dd/MM/yyyy HH:mm" // Format d'affichage
        filterDate={isWeekdayAndNotHoliday} // Fonction pour désactiver certains jours
        minDate={new Date()} // Désactive les dates passées (aujourd'hui inclus au début)
        showTimeSelect // Activer la sélection de l'heure
        timeIntervals={15} // Intervalles de temps (en minutes)
        timeCaption="Heure" // Libellé pour la colonne des heures
        minTime={minTimeDate} // Heure minimale sélectionnable (objet Date)
        maxTime={maxTimeDate} // Heure maximale sélectionnable (objet Date)
        placeholderText="Choisissez une date et une heure" // Texte indicatif
        inline // Optionnel: afficher le calendrier directement sur la page
        // excludeTimes={[...]} // Optionnel: pour exclure des heures spécifiques
        // highlightDates={[...]} // Optionnel: pour mettre en évidence certaines dates
      />
      {/* Afficher la date sélectionnée (pour le débogage ou confirmation) */}
      {date && (
        <p style={{marginTop: '10px'}}>Date sélectionnée : {date.toLocaleString('fr-FR')}</p>
      )}
    </div>
  );
};

export default DateRdv;
