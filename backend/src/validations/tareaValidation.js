import Joi from "joi";

export const tareaSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(255).required(),
  descripcion: Joi.string().trim().max(1000).optional().allow('', null),
  estado: Joi.string().valid("Pendiente", "Asignada", "Finalizada", "sin asignar", "asignado", "realizado").optional(),
  asignado_a: Joi.string().trim().optional().allow('', null),
  creado_por: Joi.string().trim().optional().allow('', null)
}).unknown(false);