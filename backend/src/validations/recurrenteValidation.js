import Joi from 'joi';

export const recurrentePublicoSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required(),
  apellidos: Joi.string().trim().min(2).max(100).required(),
  dni: Joi.string().trim().min(4).max(30).required(),
  direccion: Joi.string().trim().min(3).max(200).required(),
  codigo_postal: Joi.string().trim().min(4).max(10).required(),
  localidad: Joi.string().trim().min(2).max(100).required(),
  telefono: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).optional().allow('', null),
  email: Joi.string().trim().email().max(255).required(),
  titular_cuenta: Joi.string().trim().min(2).max(150).required(),
  iban: Joi.string().trim().pattern(/^[A-Z]{2}[0-9A-Z\s]{13,38}$/i).required(),
  cantidad: Joi.number().positive().max(10000).required(),
  periodicidad: Joi.string().valid('mensual', 'trimestral', 'semestral', 'anual').required(),
  recurrente: Joi.boolean().optional().default(true),
  signatureDataUrl: Joi.string().trim().max(750000).pattern(/^data:image\/(png|jpeg);base64,/).required(),
  formStartedAt: Joi.number().integer().positive().required(),
  website: Joi.string().trim().max(0).optional().allow('')
}).unknown(false);
