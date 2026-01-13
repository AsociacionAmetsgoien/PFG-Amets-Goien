export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: "Error de validación",
      details: error.details.map(d => d.message)
    });
  }

  next();
};
