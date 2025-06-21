# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# PII Redactor Tool

A minimal web tool to detect and redact Personally Identifiable Information (PII) such as email addresses, phone numbers, names, and addresses from PDF and TXT files.

## Features
- Accepts PDF or TXT input
- Detects and redacts PII using regex, LLMs (Gemini), or hybrid logic
- Displays both original and redacted outputs
- Shows a table of what was removed, with type, value, and reason
- Allows export of the redacted output as PDF or TXT

This tool is designed for privacy-focused document review and redaction with a simple, functional interface.

## Roadmap
- [x] PDF and TXT support
- [x] Regex-based PII detection
- [x] Download as TXT or PDF
- [ ] OCR for scanned PDFs/images
- [ ] Gemini LLM integration for smarter PII detection
- [ ] DOC/DOCX support

## License
MIT
