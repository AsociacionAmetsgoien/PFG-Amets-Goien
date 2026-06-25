import fs from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';

const TEMPLATE_PATH = new URL('../Formulario_Ametsgoien_Aportaciones.pdf', import.meta.url);

const CHECKBOX_FIELD_MAP = {
  mensual: 'Mensual',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual'
};

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeIban(value) {
  return normalizeText(value).replace(/\s+/g, '').toUpperCase();
}

function formatIbanForPdf(value) {
  const clean = normalizeIban(value);
  return clean.replace(/(.{4})/g, '$1 ').trim();
}

function maskIban(value) {
  const clean = normalizeIban(value);
  if (clean.length <= 4) {
    return clean;
  }

  return `**** **** **** ${clean.slice(-4)}`;
}

function formatDate(value = new Date()) {
  return value.toLocaleDateString('es-ES');
}

function getSignatureBytes(signatureDataUrl) {
  const base64 = signatureDataUrl.split(',')[1] || '';
  return Buffer.from(base64, 'base64');
}

async function embedSignatureImage(pdfDoc, signatureDataUrl) {
  const signatureBytes = getSignatureBytes(signatureDataUrl);

  if (signatureDataUrl.startsWith('data:image/jpeg')) {
    return pdfDoc.embedJpg(signatureBytes);
  }

  return pdfDoc.embedPng(signatureBytes);
}

export function getRecurrentDonationSummary(data) {
  const nombreCompleto = `${normalizeText(data.nombre)} ${normalizeText(data.apellidos)}`.trim();
  return {
    nombreCompleto,
    email: normalizeText(data.email).toLowerCase(),
    dni: normalizeText(data.dni),
    direccion: normalizeText(data.direccion),
    codigoPostal: normalizeText(data.codigo_postal),
    localidad: normalizeText(data.localidad),
    telefono: normalizeText(data.telefono),
    titularCuenta: normalizeText(data.titular_cuenta),
    iban: normalizeIban(data.iban),
    ibanFormateado: formatIbanForPdf(data.iban),
    ibanMascara: maskIban(data.iban),
    cantidad: Number(data.cantidad),
    periodicidad: normalizeText(data.periodicidad),
    fecha: formatDate(new Date())
  };
}

export async function buildRecurrentDonationPdf(data) {
  const templateBytes = await fs.readFile(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const summary = getRecurrentDonationSummary(data);

  form.getTextField('nombre').setText(summary.nombreCompleto);
  form.getTextField('dni').setText(summary.dni);
  form.getTextField('direccion').setText(summary.direccion);
  form.getTextField('cp').setText(
    summary.localidad ? `${summary.codigoPostal} ${summary.localidad}`.trim() : summary.codigoPostal
  );
  form.getTextField('telefono').setText(summary.telefono);
  form.getTextField('correo').setText(summary.email);
  form.getTextField('titular').setText(summary.titularCuenta);
  form.getTextField('iban').setText(summary.ibanFormateado);
  form.getTextField('cantidad').setText(`${summary.cantidad} €`);
  form.getTextField('fecha').setText(summary.fecha);

  const checkboxName = CHECKBOX_FIELD_MAP[summary.periodicidad] || CHECKBOX_FIELD_MAP.mensual;
  form.getCheckBox(checkboxName).check();

  form.flatten();

  if (typeof data.signatureDataUrl === 'string' && data.signatureDataUrl.startsWith('data:image/')) {
    const signatureImage = await embedSignatureImage(pdfDoc, data.signatureDataUrl);
    firstPage.drawImage(signatureImage, {
      x: 113.3858,
      y: 183.6108,
      width: 170.0788,
      height: 28
    });
  }

  const finalBytes = await pdfDoc.save();
  return {
    pdfBytes: Buffer.from(finalBytes),
    summary
  };
}
