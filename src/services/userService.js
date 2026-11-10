const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const createError = require("../utils/createError");

const formatUser = (user) => ({
  id: user._id,
  nombre: user.nombre,
  email: user.email,
});

const register = async (data) => {
  const { nombre, email, password } = data;
  const user = await User.create({ nombre, email, password });
  return formatUser(user);
};

const login = async (data) => {
  const { email, password } = data;
  if (!email || !password) {
    throw createError(400, "Email y contraseña son obligatorios");
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select(
    "+password"
  );
  const passwordOk = user && (await user.comparePassword(String(password)));
  if (!passwordOk) {
    throw createError(401, "Credenciales inválidas");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );

  return { token, user: formatUser(user) };
};

module.exports = { register, login };
