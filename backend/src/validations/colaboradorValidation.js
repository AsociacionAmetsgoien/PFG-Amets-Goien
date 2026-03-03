import Joi from "joi";

export const colaboradorSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(100).required(),
  apellidos: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().email().max(255).optional().allow('', null),
  telefono: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).optional().allow('', null),
  direccion: Joi.string().trim().optional().allow('', null),
  anotacion: Joi.string().trim().optional().allow('', null),
  tipo_colaboracion: Joi.string().valid('monetario', 'voluntario', 'ambos').optional().default('monetario'),
  periodicidad: Joi.string().valid('puntual', 'mensual', 'trimestral', 'semestral', 'anual').optional().default('puntual'),
  // stripe_subscription_id eliminado - ahora usamos Redsys
}).unknown(false);

// Validación específica para registro público de voluntarios (email obligatorio)
export const voluntarioPublicoSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'El nombre es obligatorio',
      'string.min': 'El nombre debe tener al menos 2 caracteres'
    }),
  apellidos: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Los apellidos son obligatorios',
      'string.min': 'Los apellidos deben tener al menos 2 caracteres'
    }),
  email: Joi.string().trim().email().max(255).required()
    .messages({
      'string.empty': 'El email es obligatorio',
      'string.email': 'El formato del email no es válido'
    }),
  telefono: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,20}$/).optional().allow('', null),
  direccion: Joi.string().trim().max(500).optional().allow('', null),
  mensaje: Joi.string().trim().max(1000).optional().allow('', null)
}).unknown(false);