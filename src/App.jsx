import React, { useState } from 'react'
import './App.css'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { PDFDocument, StandardFonts } from 'pdf-lib';

function App() {
  const [file, setFile] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [status, setStatus] = useState('')
  const [redactedFileUrl, setRedactedFileUrl] = useState(null)
  const [fileText, setFileText] = useState('')
  const [downloadAsPdf, setDownloadAsPdf] = useState(false)

  // Helper: Extract text from PDF using pdfjs-dist
  const extractTextFromPDF = async (file) => {
    setStatus('Extracting text from PDF...');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  };

  // Handle file upload and extract text
  const handleFileChange = async (file) => {
    setFile(file);
    setRedactedFileUrl(null);
    setFileText('');
    setStatus('Reading file...');
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    try {
      if (ext === 'txt') {
        const text = await file.text();
        setFileText(text);
        setStatus('Text file loaded.');
      } else if (ext === 'pdf') {
        const text = await extractTextFromPDF(file);
        setFileText(text);
        setStatus('PDF text extracted.');
      } else {
        setStatus('Unsupported file type. Only PDF and TXT are supported.');
      }
    } catch (err) {
      setStatus('Error reading file.');
    }
  };

  // Regex-based PII redaction
  const redactPII = (text) => {
    // Email
    let redacted = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED EMAIL]');
    // Phone (simple, international and local)
    redacted = redacted.replace(/(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4,6}/g, '[REDACTED PHONE]');
    // Name (very basic, capitalized words, not perfect)
    redacted = redacted.replace(/\b([A-Z][a-z]+\s[A-Z][a-z]+)\b/g, '[REDACTED NAME]');
    // Address (very basic, numbers followed by street, not perfect)
    redacted = redacted.replace(/\b\d{1,5}\s+([A-Za-z0-9.,\s]+(Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Blvd|Boulevard|Drive|Dr|Court|Ct)\b)/gi, '[REDACTED ADDRESS]');
    return redacted;
  };

  // Generate a PDF file from redacted text using pdf-lib
  const generatePdfFromText = async (text, fileName) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    // Split text into lines that fit the page width
    const maxWidth = width - 80;
    const lines = [];
    let currentLine = '';
    text.split(/\r?\n/).forEach(paragraph => {
      paragraph.split(' ').forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      lines.push(''); // Paragraph break
    });
    let y = height - 40;
    for (const line of lines) {
      if (y < 40) {
        page.drawText('...continued', { x: 40, y, size: fontSize, font });
        break;
      }
      page.drawText(line, { x: 40, y, size: fontSize, font });
      y -= fontSize + 4;
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };

  // Handle Redact button
  const handleRedact = async () => {
    if (!fileText) {
      setStatus('No text to redact.');
      return;
    }
    setStatus('Redacting PII...');
    const redacted = redactPII(fileText);
    setStatus('PII redacted. Ready to download.');
    let url;
    if (downloadAsPdf) {
      url = await generatePdfFromText(redacted, file.name);
    } else {
      const blob = new Blob([redacted], { type: 'text/plain' });
      url = URL.createObjectURL(blob);
    }
    setRedactedFileUrl(url);
  };

  // Handle Download button
  const handleDownload = () => {
    if (!redactedFileUrl) return;
    const ext = downloadAsPdf ? 'pdf' : 'txt';
    const downloadName = file.name.replace(/\.[^.]+$/, '') + '_redacted.' + ext;
    const a = document.createElement('a');
    a.href = redactedFileUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="app-container">
      <h1>PII Redactor Tool</h1>
      <div className="input-section">
        <label>
          Upload PDF or TXT:
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={e => handleFileChange(e.target.files[0])}
          />
        </label>
      </div>
      <div className="input-section">
        <label>
          Gemini API Key (optional):
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter Gemini API Key"
          />
        </label>
      </div>
      <div className="input-section">
        <label>
          <input
            type="checkbox"
            checked={downloadAsPdf}
            onChange={e => setDownloadAsPdf(e.target.checked)}
          />
          Download as PDF
        </label>
      </div>
      <div className="button-section">
        <button disabled={!fileText} onClick={handleRedact}>Redact PII</button>
        <button disabled={!redactedFileUrl} onClick={handleDownload}>Download Redacted File</button>
      </div>
      <div className="status-section">
        <p>{status}</p>
      </div>
    </div>
  )
}

export default App
