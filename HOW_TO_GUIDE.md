# NALA Career-Ops Desktop: How-To Guide / Bedienungsanleitung

> **Language / Sprache:** [Deutsch](#deutsch-bedienungsanleitung) | [English](#english-user-guide)

---

## Deutsch: Bedienungsanleitung

Diese Anleitung erklärt Schritt für Schritt, wie Sie die NALA Career-Ops Desktop-Anwendung installieren, einrichten und nutzen.

### 🗺️ Dokumentenfluss (Mermaid Diagramm)

Das folgende Diagramm zeigt den genauen Weg Ihrer Dokumente von der Inbox bis zum fertigen Bewerbungs-Paket:

```mermaid
graph TD
    User([Nutzer]) -->|1. Drag & Drop PDF/Docx| Inbox[Paperless Inbox Zone]
    User -->|2. Fügt Job-URL / Text hinzu| JobInput[Job-Analyse Feld]
    
    Inbox -->|Automatische Klassifizierung| Parser{Docling Parser}
    Parser -->|Extraktion von Text & Tabellen| DB[(MemPalace SQLite)]
    
    JobInput -->|Stellenprofil auswerten| Matcher{ATS Matcher}
    DB -->|Historische Erfolgsberichte & Lebenslauf| Matcher
    
    Matcher -->|Tuning-Vorschläge| Tuner[CV-Tuner Interface]
    Tuner -->|Vergleichansicht: Original vs. Neu| Review[Agenten-Debatte: Recruiter & ATS]
    
    Review -->|Finaler Export| PDF[Optimierter Lebenslauf PDF]
    Review -->|Bewerbungshilfe| Spickzettel[Phone Cheat Sheet & STAR Briefing]
    
    PDF & Spickzettel --> Backup[Backup & Export ZIP]
```

---

### 1. Doppelklick-Installation auf Windows
1. Laden Sie die Datei `NALA-Career-Ops-Setup.exe` aus den GitHub Releases herunter.
2. Klicken Sie doppelt auf die Datei.
3. Der Windows-Installationsassistent öffnet sich und installiert das Programm automatisch unter `%LOCALAPPDATA%/Programs/Nala-Career-Ops`.
4. Nach Abschluss finden Sie ein Desktop-Symbol namens **NALA Career-Ops**. Klicken Sie doppelt darauf, um das Programm zu starten.

---

### 2. KI-Modelle einrichten (Local & Cloud)
Öffnen Sie das Programm und klicken Sie links unten auf das **Zahnrad-Symbol (Einstellungen)**:

#### A) Lokale Modelle (Ollama / LM Studio)
- Stellen Sie sicher, dass **Ollama** auf Ihrem Computer läuft (`Ollama App` im Hintergrund geöffnet).
- Klicken Sie auf **"Lokale Modelle suchen"**. Die App scannt Port `11434` und lädt Ihre installierten Modelle (z. B. `qwen3:32b`, `llama3`).
- Wählen Sie Ihr Standard-Modell aus.

#### B) Cloud-Modelle (Gemini / OpenAI)
- Tragen Sie Ihren API-Schlüssel in das entsprechende Feld ein (z. B. `Gemini API Key`).
- Ihre Schlüssel werden sicher und verschlüsselt in Ihrer lokalen Einstellungsdatei gespeichert.

---

### 3. Drag-and-Drop Inbox nutzen
1. Navigieren Sie im Menü links zum Bereich **Inbox**.
2. Ziehen Sie Ihre Bewerbungsdokumente per Drag-and-Drop in das markierte Feld:
   - Aktueller Lebenslauf (`Lebenslauf_2026.pdf`)
   - Arbeitszeugnisse (`Zeugnis_Firma_A.docx`)
   - Diplome & Zertifikate (`Zertifikat_Cloud.pdf`)
3. Das Programm analysiert die Dateien im Hintergrund mit **Docling** und speichert die extrahierten Texte in Ihrer lokalen **MemPalace-Datenbank**.
4. Die Dokumente erhalten automatisch Tags (z. B. `#cv`, `#zeugnis`).

---

### 4. CV-Tuning & HR-Simulation starten
1. Gehen Sie auf den Reiter **CV-Tuner**.
2. Fügen Sie den Text oder die URL der gewünschten Stellenanzeige ein.
3. Wählen Sie Ihren Lebenslauf aus der Liste Ihrer importierten Dokumente.
4. Klicken Sie auf **"Tuning & Simulation starten"**:
   - Der **ATS-Matcher** bewertet die Relevanz Ihrer Fähigkeiten (Score A bis F).
   - Das **HR-Debate Team** simuliert die Meinung eines Personalers, Fachbereichsleiters und eines Roboter-Scanners (ATS).
5. Überprüfen Sie im Split-Screen die vorgeschlagenen Anpassungen und übernehmen Sie diese mit einem Klick.

---

### 5. Telefon-Spickzettel (Phone Cheat Sheet) erstellen
1. Nach der Optimierung können Sie im Bereich **Interview Coach** auf **"Telefon-Spickzettel generieren"** klicken.
2. Dies erzeugt eine kompakte Liste, die Sie ausdrucken oder auf Ihrem Smartphone anzeigen können:
   - **STAR-Beispiele:** Kurze Antworten für kritische Fragen (Situation, Task, Action, Result).
   - **TALK-Points:** Ihre 3 stärksten Erfolge, exakt passend zur Stelle.
   - **Fragen an die Firma:** Clevere Fragen, die Sie im Gespräch stellen können.

---

### 6. Daten sichern (Import & Export)
- **Komplett-Backup:** Klicken Sie in den Einstellungen auf **"Daten exportieren"**, um alle Dokumente, Bewerbungen und MemPalace-Daten als verschlüsselte `.zip` zu sichern.
- **Einzel-Job-Export:** Exportieren Sie eine spezifische Bewerbung inklusive des maßgeschneiderten Lebenslaufs, Anschreibens und des Profil-Scoring-Reports als PDF-Paket.

---
---

## English: User Guide

This guide explains step-by-step how to install, configure, and use the NALA Career-Ops Desktop application.

### 🗺️ Document Flow

*Please refer to the Mermaid diagram in the German section above for a visual representation of how your documents flow through the system.*

---

### 1. Double-Click Installation on Windows
1. Download the `NALA-Career-Ops-Setup.exe` file from the GitHub Releases page.
2. Double-click the downloaded file.
3. The Windows installer will open and automatically install the application under `%LOCALAPPDATA%/Programs/Nala-Career-Ops`.
4. Once completed, a desktop icon named **NALA Career-Ops** will appear. Double-click it to launch the app.

---

### 2. Setting Up AI Models (Local & Cloud)
Open the application and click the **Gear Icon (Settings)** at the bottom left:

#### A) Local Models (Ollama / LM Studio)
- Ensure **Ollama** is running on your computer (Ollama app active in the background).
- Click **"Scan Local Models"**. The app will scan port `11434` and retrieve your installed models (e.g., `qwen3:32b`, `llama3`).
- Select your preferred default model.

#### B) Cloud Models (Gemini / OpenAI)
- Enter your API Key into the designated field (e.g., `Gemini API Key`).
- Your keys are saved securely in your local settings file.

---

### 3. Using the Drag-and-Drop Inbox
1. Navigate to the **Inbox** tab on the left sidebar.
2. Drag and drop your application documents into the marked drop-zone:
   - Current Resume/CV (`resume_2026.pdf`)
   - Work certificates (`reference_company_a.docx`)
   - Diplomas & certifications (`cloud_certificate.pdf`)
3. The app parses the files in the background using **Docling** and stores the extracted content in your local **MemPalace database**.
4. Files are automatically tagged (e.g., `#cv`, `#certificate`).

---

### 4. Running CV Tuning & HR Simulation
1. Go to the **CV-Tuner** tab.
2. Paste the text or paste the URL of the target job listing.
3. Select your resume from the list of imported documents.
4. Click **"Start Tuning & Simulation"**:
   - The **ATS Matcher** scores your profile's fit (Grade A to F).
   - The **HR Debate Team** simulates feedback from a recruiter, hiring manager, and ATS scanner.
5. Review the proposed modifications side-by-side and apply changes with a single click.

---

### 5. Generating a Phone Cheat Sheet
1. After tuning, go to the **Interview Coach** section and click **"Generate Phone Cheat Sheet"**.
2. This creates a compact briefing card to print or view on your phone:
   - **STAR Examples:** Direct answers for tough questions (Situation, Task, Action, Result).
   - **TALK Points:** Your top 3 achievements aligned with the role.
   - **Smart Questions:** Questions to ask the interviewer.

---

### 6. Backing Up and Exporting Data
- **Full Backup:** Click **"Export All Data"** in Settings to save all documents, applications, and MemPalace memories into a secure `.zip` file.
- **Single Job Export:** Export a specific job application package including the tailored resume, cover letter, and scoring reports.
