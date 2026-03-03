export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // Formatear errores para que el frontend pueda mostrarlos campo por campo
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      message: "Datos inválidos en el formulario",
      errors: errors
    });
  }

  next();
};

