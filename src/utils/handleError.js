// Traduce cualquier error a una respuesta HTTP con el código correcto
const handleError = (res, error) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error.name === "ValidationError") {
    const detalles = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ message: "Datos inválidos", detalles });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "ID inválido" });
  }
  if (error.code === 11000) {
    return res
      .status(409)
      .json({ message: "Ya existe un registro con esos datos" });
  }
  console.error(error);
  return res.status(500).json({ message: "Error interno del servidor" });
};

module.exports = handleError;
