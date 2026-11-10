const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const createError = require("../utils/createError");

const getAll = async () => {
  return Category.find().sort({ nombre: 1 });
};

const getById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createError(400, "ID inválido");
  }
  const category = await Category.findById(id);
  if (!category) {
    throw createError(404, "Categoría no encontrada");
  }
  return category;
};

const create = async (data) => {
  const { nombre, descripcion } = data;
  return Category.create({ nombre, descripcion });
};

const remove = async (id) => {
  await getById(id);
  const enUso = await Product.exists({ categoria: id });
  if (enUso) {
    throw createError(
      409,
      "No se puede eliminar: hay productos que usan esta categoría"
    );
  }
  await Category.findByIdAndDelete(id);
};

module.exports = { getAll, getById, create, remove };
