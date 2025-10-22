/*
Barrierefreiheitsmaßnahmen für ReportCard-Komponente:

1. ARIA-Labels und Rollen:
   - Hauptcontainer als <article role="listitem"> kennzeichnen.
   - Buttons für Details/Bearbeiten mit aria-label versehen (z.B. "Details zu Schadenfall {ID}").
2. Tastatur-Navigation:
   - Sicherstellen, dass alle interaktiven Elemente (Buttons, Links) per Tab erreichbar sind.
   - Visuellen Fokuszustand für Tastatur-Nutzer hervorheben.
3. Screenreader-Unterstützung:
   - Überschriften und wichtige Felder mit aria-label oder aria-labelledby versehen.
   - Status-Badge mit aria-label (z.B. "Status: Eingereicht").
   - Erstellungsdatum als Zeit-Element mit aria-label (z.B. "Erstellt am: 21.10.2025").
4. Weitere Maßnahmen:
   - Icons mit aria-hidden oder zugänglichem Label versehen.
   - Strukturierte, semantische HTML-Elemente (article, header, section) verwenden.
*/

// --- Accessibility-Implementierung ---

import React from "react";

interface ReportCardProps {
  id: string;
  status: string;
  createdAt: string;
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    vin: string;
  };
  onClick: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  id,
  status,
  createdAt,
  vehicle,
  onClick,
}) => {
  return (
    <article
      role="listitem"
      aria-labelledby={`report-title-${id}`}
      tabIndex={0}
      style={{ outline: "none" }}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="report-card"
    >
      <header>
        <h2 id={`report-title-${id}`}>Schadenfall {id}</h2>
      </header>
      <section>
        <div>
          <span aria-label="Status" className="status-badge">{status}</span>
        </div>
        <div>
          <time dateTime={createdAt} aria-label={`Erstellt am: ${new Date(createdAt).toLocaleDateString("de-DE")}`}>
            {new Date(createdAt).toLocaleDateString("de-DE")}
          </time>
        </div>
        <div>
          <span aria-label="Fahrzeugmarke">{vehicle.make}</span> –
          <span aria-label="Fahrzeugmodell">{vehicle.model}</span> –
          <span aria-label="Kennzeichen">{vehicle.licensePlate}</span>
        </div>
      </section>
      <button
        type="button"
        aria-label={`Details zu Schadenfall ${id}`}
        onClick={onClick}
        className="details-btn"
      >
        Details anzeigen
      </button>
    </article>
  );
};
