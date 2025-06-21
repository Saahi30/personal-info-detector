# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# PII Redactor Tool

A minimal, functional web tool to detect and redact Personally Identifiable Information (PII) such as email addresses, phone numbers, names, and addresses from PDF and TXT files. The tool can extract text from uploaded files, redact sensitive information using regex (and optionally Gemini LLM), and regenerate the file for download as TXT or PDF.

## Features
- Upload PDF or TXT files
- Extracts text from digital PDFs and plain text files
- Detects and redacts PII (emails, phone numbers, names, addresses)
- Download the redacted file as TXT or PDF
- Minimal, clean UI
- (Optional) Integrate Gemini LLM for advanced PII detection

## How It Works
1. **Upload** a PDF or TXT file.
2. **Extract** text from the file (OCR for scanned PDFs coming soon).
3. **Redact** PII using built-in regex patterns (emails, phones, names, addresses).
4. **Download** the redacted file as TXT or PDF.

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)

### Installation
```bash
# Clone the repository
https://github.com/Saahi30/personal-info-detector.git
cd personal-info-detector

# Install dependencies
npm install
```

### Running the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage
1. Click **Upload PDF or TXT** and select your file.
2. (Optional) Enter your Gemini API key for advanced PII detection.
3. Click **Redact PII**.
4. Click **Download Redacted File** to save the output as TXT or PDF.

## Roadmap
- [x] PDF and TXT support
- [x] Regex-based PII detection
- [x] Download as TXT or PDF
- [ ] OCR for scanned PDFs/images
- [ ] Gemini LLM integration for smarter PII detection
- [ ] DOC/DOCX support

## License
MIT
