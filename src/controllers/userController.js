const userService = require("../services/userService");
const handleError = require("../utils/handleError");

const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { register, login };
