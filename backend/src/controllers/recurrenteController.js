import Colaborador from '../models/Colaborador.js';
import { sendEmail, isEmailConfigured } from '../services/mailer.js';
import { buildRecurrentDonationPdf, getRecurrentDonationSummary } from '../services/recurrentePdfService.js';
import { recurrentePublicoSchema } from '../validations/recurrenteValidation.js';

const recentRecurrentSubmissions = new Map();
const RECURRENT_COOLDOWN_MS = 15 * 60 * 1000;
const MIN_FORM_FILL_TIME_MS = 4000;

async function findExistingColaboradorByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const colaboradores = await Colaborador.getAll();
  return colaboradores.find((colaborador) => (
    colaborador.email && colaborador.email.trim().toLowerCase() === normalizedEmail
  ));
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim() !== '') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function cleanupRecentSubmissions(now) {
  for (const [key, timestamp] of recentRecurrentSubmissions.entries()) {
    if (now - timestamp > RECURRENT_COOLDOWN_MS) {
      recentRecurrentSubmissions.delete(key);
    }
  }
}

function buildSubmissionKey(req, email) {
  return `${getClientIp(req)}:${String(email || '').trim().toLowerCase()}`;
}

function isAllowedPublicOrigin(value) {
  if (!value) {
    return false;
  }

  if (value.includes('localhost') || value.includes('vercel.app')) {
    return true;
  }

  return Boolean(process.env.FRONTEND_URL && value.startsWith(process.env.FRONTEND_URL));
}

function isSuspiciousSubmission(req, value) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin.trim() : '';
  const referer = typeof req.headers.referer === 'string' ? req.headers.referer.trim() : '';
  const userAgent = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'].trim() : '';

  if (!userAgent || (!isAllowedPublicOrigin(origin) && !isAllowedPublicOrigin(referer))) {
    return 'browser_fingerprint';
  }

  if (value.website) {
    return 'honeypot';
  }

  if (!value.formStartedAt || Date.now() - Number(value.formStartedAt) < MIN_FORM_FILL_TIME_MS) {
    return 'too_fast';
  }

  const now = Date.now();
  cleanupRecentSubmissions(now);

  const key = buildSubmissionKey(req, value.email);
  const lastSubmissionAt = recentRecurrentSubmissions.get(key);
  if (lastSubmissionAt && now - lastSubmissionAt < RECURRENT_COOLDOWN_MS) {
    return 'cooldown';
  }

  recentRecurrentSubmissions.set(key, now);
  return null;
}

function buildAnnotation(summary) {
  const dateTag = new Date().toISOString().split('T')[0];
  return `[${dateTag}] Donacion recurrente ${summary.cantidad}\u20ac (${summary.periodicidad}) solicitada`;
}

function buildAdminHtml(summary) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 24px; background: #f8f4fb; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${process.env.FRONTEND_URL || 'http://localhost:3000'}/logo.png" alt="Ametsgoien" style="max-width: 180px; height: auto;" />
      </div>
      <h2 style="color: #8A4D76; margin-bottom: 16px;">Nueva solicitud de donación recurrente</h2>
      <div style="background: white; padding: 20px; border-radius: 10px; line-height: 1.6; color: #333;">
        <p><strong>Nombre:</strong> ${summary.nombreCompleto}</p>
        <p><strong>DNI:</strong> ${summary.dni}</p>
        <p><strong>Email:</strong> ${summary.email}</p>
        <p><strong>Teléfono:</strong> ${summary.telefono || '-'}</p>
        <p><strong>Dirección:</strong> ${summary.direccion}</p>
        <p><strong>CP / Localidad:</strong> ${summary.codigoPostal} ${summary.localidad}</p>
        <p><strong>Titular de la cuenta:</strong> ${summary.titularCuenta}</p>
        <p><strong>IBAN:</strong> ${summary.ibanMascara}</p>
        <p><strong>Importe:</strong> ${summary.cantidad}€</p>
        <p><strong>Periodicidad:</strong> ${summary.periodicidad}</p>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 18px;">Se adjunta el PDF rellenado y firmado.</p>
    </div>
  `;
}

function buildUserHtml(summary) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 12px;">
      <h2 style="color: #8A4D76;">Hemos recibido tu solicitud</h2>
      <p>Hola ${summary.nombreCompleto},</p>
      <p>Hemos recibido correctamente tu formulario de donación recurrente. Revisaremos tu solicitud y te contactaremos si necesitamos confirmar algún dato.</p>
      <p><strong>Importe:</strong> ${summary.cantidad}€</p>
      <p><strong>Periodicidad:</strong> ${summary.periodicidad}</p>
      <p style="color: #666; font-size: 12px; margin-top: 18px;">Este es un mensaje automÃ¡tico. No respondas a este correo.</p>
    </div>
  `;
}

export const registerRecurrentePublico = async (req, res) => {
  const requestId = `REC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    console.log(`[${requestId}] Solicitud de donacion recurrente recibida`);
    const { error, value } = recurrentePublicoSchema.validate(req.body, { abortEarly: false });

    if (error) {
      console.warn(`[${requestId}] Validacion recurrente fallida:`, error.details.map((detail) => detail.message));
      return res.status(400).json({
        message: 'Datos invÃ¡lidos',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const suspiciousReason = isSuspiciousSubmission(req, value);
    if (suspiciousReason) {
      console.warn(`[${requestId}] Solicitud recurrente bloqueada por seguridad:`, {
        reason: suspiciousReason,
        ip: getClientIp(req),
        email: value.email
      });
      return res.status(429).json({
        success: false,
        message: 'No se ha podido procesar la solicitud en este momento. Intentalo de nuevo mas tarde.'
      });
    }

    const summary = getRecurrentDonationSummary(value);
    const existing = await findExistingColaboradorByEmail(summary.email);
    const annotation = buildAnnotation(summary);

    let colaborador;

    if (existing) {
      console.log(`[${requestId}] Colaborador existente encontrado para recurrente:`, existing.id);
      const updatedAnnotation = existing.anotacion
        ? `${existing.anotacion}\n${annotation}`
        : annotation;

      const updatedTipo = existing.tipo_colaboracion === 'voluntario'
        ? 'ambos'
        : existing.tipo_colaboracion === 'ambos'
          ? 'ambos'
          : 'monetario';

      colaborador = await Colaborador.update(existing.id, {
        ...existing,
        nombre: value.nombre.trim(),
        apellidos: value.apellidos.trim(),
        email: summary.email,
        telefono: summary.telefono || existing.telefono || '',
        direccion: summary.direccion || existing.direccion || '',
        anotacion: updatedAnnotation,
        tipo_colaboracion: updatedTipo,
        periodicidad: summary.periodicidad
      });
    } else {
      console.log(`[${requestId}] Creando nuevo colaborador para recurrente:`, summary.email);
      colaborador = await Colaborador.create({
        nombre: value.nombre.trim(),
        apellidos: value.apellidos.trim(),
        email: summary.email,
        telefono: summary.telefono || '',
        direccion: summary.direccion,
        anotacion: annotation,
        tipo_colaboracion: 'monetario',
        periodicidad: summary.periodicidad
      });
    }

    console.log(`[${requestId}] Generando PDF recurrente`);
    const { pdfBytes } = await buildRecurrentDonationPdf({
      ...value,
      email: summary.email
    });
    console.log(`[${requestId}] PDF recurrente generado (${pdfBytes.length} bytes)`);

    const pdfFileName = `Formulario_Ametsgoien_Aportaciones_${summary.nombreCompleto
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_|_$/g, '') || 'colaborador'}.pdf`;

    if (isEmailConfigured()) {
      try {
        console.log(`[${requestId}] Enviando email recurrente a la asociacion:`, process.env.CONTACT_EMAIL);
        await sendEmail({
          to: process.env.CONTACT_EMAIL,
          from: `"Ametsgoien" <${process.env.CONTACT_EMAIL}>`,
          subject: `Nueva solicitud de donacion recurrente: ${summary.nombreCompleto}`,
          html: buildAdminHtml(summary),
          replyTo: summary.email,
          attachments: [
            {
              filename: pdfFileName,
              content: pdfBytes.toString('base64')
            }
          ]
        });

        console.log(`[${requestId}] Enviando confirmacion recurrente al usuario:`, summary.email);
        await sendEmail({
          to: summary.email,
          from: `"Ametsgoien" <${process.env.CONTACT_EMAIL}>`,
          subject: 'Hemos recibido tu solicitud de donacion recurrente - Ametsgoien',
          html: buildUserHtml(summary)
        });
        console.log(`[${requestId}] Emails recurrentes enviados correctamente`);
      } catch (emailError) {
        console.error(`[${requestId}] Error enviando emails de donacion recurrente:`, emailError);
        return res.status(502).json({
          success: false,
          message: 'La solicitud se ha registrado, pero no se ha podido enviar el PDF por correo. Por favor, contacta con la asociacion.',
          error: emailError.message
        });
      }
    } else {
      console.warn(`[${requestId}] Email deshabilitado por configuracion, pero la solicitud recurrente se guardo`);
      return res.status(503).json({
        success: false,
        message: 'La solicitud se ha registrado, pero el correo no esta configurado y no se ha podido enviar el PDF.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Solicitud de donaciÃ³n recurrente recibida correctamente',
      colaborador: {
        id: colaborador.id,
        nombre: colaborador.nombre,
        apellidos: colaborador.apellidos,
        email: colaborador.email
      }
    });
  } catch (error) {
    console.error(`[${requestId}] Error al procesar la solicitud recurrente:`, error);
    return res.status(500).json({
      message: 'Error al procesar la solicitud. Por favor, intÃ©ntalo de nuevo mÃ¡s tarde.',
      error: error.message
    });
  }
};
