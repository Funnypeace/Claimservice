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
