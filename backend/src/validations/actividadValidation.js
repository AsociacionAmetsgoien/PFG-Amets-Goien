import Joi from "joi";

export const actividadSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(255).required(),
  descripcion: Joi.string().trim().optional().allow('', null),
  fecha: Joi.string().optional().allow('', null),
  creador_id: Joi.string().trim().optional().allow('', null)
}).unknown(false);