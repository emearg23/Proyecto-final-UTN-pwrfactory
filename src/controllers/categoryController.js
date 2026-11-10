const categoryService = require("../services/categoryService");
const handleError = require("../utils/handleError");

const getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAll();
    res.status(200).json(categories);
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    const category = await categoryService.getById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await categoryService.remove(req.params.id);
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getAll, getById, create, remove };
