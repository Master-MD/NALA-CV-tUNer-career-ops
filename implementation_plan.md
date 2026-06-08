# Implementation Plan v4.1: NALA-CV-tUNer-career-ops

This plan details the implementation of NALA Career-Ops Desktop, an AI-powered desktop application wrapper for [career-ops](https://github.com/santifer/career-ops). 

The goal is to provide a "Safe Haven" environment where installation is completely guided and automated via an interactive, client-side setup wizard.

---

## Client-Side Hardware & Service Scan (Runtime)

To keep the application highly portable and avoid hardcoding developer specs (such as macOS/M4 Max), the hardware and port scanning logic is executed **programmatically on the end user's machine at first startup**.

### 1. User Permission Gate
At first launch, the Setup Wizard presents a clear, user-friendly modal requesting permission to check system specs.
- **If Allowed:** The app checks the processor, total RAM, free disk space, and open ports.
- **If Denied:** The app skips auto-detection and presents manual configuration text inputs (port numbers, host IP, model name).

### 2. De-duplication & Conflict Prevention
Before proposing any installation steps, the app scans common paths and active ports to prevent duplicate installations:
- **Paths Scanned:**
  - *Windows:* `%LOCALAPPDATA%/Programs/Ollama/ollama.exe`, `%ProgramFiles%/Ollama/ollama.exe`
  - *macOS:* `/Applications/Ollama.app`
- **Ports Scanned:**
  - Scans `11434` (Ollama), `8188` (ComfyUI), `6333` (Qdrant), and standard database ports to identify active instances.
- **Result:** If a running service or installed executable is detected, the Wizard bypasses the installation step for that tool and links directly to the existing instance.

---

## User Review Required

> [IMPORTANT]
> **Ollama Installation Wizard:**
> - If Ollama is missing and the user approves installation, the Electron backend downloads the appropriate official installer (e.g., `.exe` for Windows, `.zip` for macOS) directly into a local temp directory, runs the installer silently (or with standard GUI), and monitors port `11434` for successful startup.

> [IMPORTANT]
> **RAM-Based Gemma Model Recommendations:**
> - The Wizard dynamically selects the best local models based on the scanned RAM:
>   - **< 8GB RAM:** Recommends `gemma2:2b` (can run in 1GB of memory).
>   - **8GB - 16GB RAM:** Recommends `gemma2:9b`.
>   - **16GB - 32GB RAM:** Recommends `gemma:12b` (Gemma 4).
>   - **> 32GB RAM:** Recommends `qwen3:32b` or `gemma2:27b` for deep multi-agent evaluation.
> - Supports entering a **Hugging Face API Key** to download gated models (such as Gemma variants) directly through the integrated Model Manager UI.

---

## Proposed Changes

All created and updated files are located relative to the repository workspace root:

### 1. Auto-Setup & Port Scanner

#### [MODIFY] [setup-all.mjs](setup-all.mjs)
The script handles initial repository provisioning:
1. Installs npm packages (`npm install`).
2. Configures default onboarding files with mock details (for local developer safety).
3. Installs the Git pre-commit hook that dynamically blocks commits containing personal info.

#### [NEW] [hardwareScanner.ts](src/services/hardwareScanner.ts)
Backend Electron service to query hardware specifications on the user's machine at runtime:
- Returns CPU brand, total RAM, free disk space, and OS platform.
- Scans common filesystem paths for existing Ollama/LM Studio executables.
- Scans local TCP ports to check for running local AI endpoints.

---

### 2. ADHD-Friendly UI & Guided Wizard

#### [NEW] [SetupWizard.tsx](src/components/SetupWizard.tsx)
Interactive onboarding flow:
- **Permission Prompt:** Asks user for permission to scan system specifications.
- **Hardware Profile:** Lists scanned CPU, GPU, RAM, and disk space if permitted, otherwise provides manual dropdown selectors.
- **Existing Setup Check:** Displays status of local port checks (Ollama/ComfyUI/Qdrant) to verify connections.
- **Install Coordinator:** Guides download and setup of missing components, avoiding duplicates.

#### [NEW] [ModelManager.tsx](src/components/ModelManager.tsx)
The Model Manager panel:
- **Hugging Face API Key Input:** Save keys in local config to download gated GGUF models.
- **Pull Progress:** Renders download speed and progress percentages by parsing the Ollama `/api/pull` event stream.
- **LLM Fit Guard:** Checks system memory allocation to ensure models fit within available RAM.

#### [MODIFY] [App.tsx](src/App.tsx)
Integrates routing between:
- **ADHD skin modes:** Switchable Dark, Light, and Urgency-Red themes.
- **Urgency Warning:** Alters UI style to alert indicators (borders, warnings) if application deadlines are approaching.
- **Setup Wizard Overlay:** Blocks access to dashboard until local LLM endpoints are verified.

---

## Verification Plan

### Automated Tests
- Run `npm run setup` and verify it configures workspace templates and registers the pre-commit privacy check.
- Verify `git commit` triggers the privacy check, blocking files with real names/addresses.

### Manual Verification
- **Wizard Permission Flow:** Confirm that denying scanning permissions skips automatic discovery and allows typing manual ports.
- **Ollama De-duplication:** Run Ollama on port 11434 and launch the app. Confirm the wizard skips the installation step and shows "Ollama Running".
- **ADHD Urgency Mode:** Verify that changing a simulated deadline triggers red alerting styles on borders and sidebar badges.
