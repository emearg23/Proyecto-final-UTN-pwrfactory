const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const createError = require("../utils/createError");

const CAMPOS_PERMITIDOS = ["nombre", "descripcion", "precio", "stock", "categoria"];

const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, "ID inválido");
  }
};

const ensureCategoryExists = async (categoriaId) => {
  if (!categoriaId) {
    throw createError(400, "La categoría es obligatoria");
  }
  if (!mongoose.isValidObjectId(categoriaId)) {
    throw createError(400, "El ID de la categoría es inválido");
  }
  const existe = await Category.exists({ _id: categoriaId });
  if (!existe) {
    throw createError(400, "La categoría indicada no existe");
  }
};

const getAll = async () => {
  return Product.find().populate("categoria").sort({ createdAt: -1 });
};

const getById = async (id) => {
  validateId(id);
  const product = await Product.findById(id).populate("categoria");
  if (!product) {
    throw createError(404, "Producto no encontrado");
  }
  return product;
};

const create = async (data) => {
  const { nombre, descripcion, precio, stock, categoria } = data;
  await ensureCategoryExists(categoria);
  const product = await Product.create({
    nombre,
    descripcion,
    precio,
    stock,
    categoria,
  });
  return product.populate("categoria");
};

const update = async (id, data) => {
  validateId(id);

  const campos = {};
  CAMPOS_PERMITIDOS.forEach((campo) => {
    if (data[campo] !== undefined) campos[campo] = data[campo];
  });

  if (campos.categoria !== undefined) {
    await ensureCategoryExists(campos.categoria);
  }

  const product = await Product.findByIdAndUpdate(id, campos, {
    new: true,
    runValidators: true,
  }).populate("categoria");

  if (!product) {
    throw createError(404, "Producto no encontrado");
  }
  return product;
};

const remove = async (id) => {
  validateId(id);
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw createError(404, "Producto no encontrado");
  }
};

module.exports = { getAll, getById, create, update, remove };
