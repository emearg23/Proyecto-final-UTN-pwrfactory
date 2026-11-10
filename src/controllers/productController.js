const productService = require("../services/productService");
const handleError = require("../utils/handleError");

const getAll = async (req, res) => {
  try {
    const products = await productService.getAll();
    res.status(200).json(products);
  } catch (error) {
    handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await productService.remove(req.params.id);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getAll, getById, create, update, remove };
