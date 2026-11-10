const express = require("express");
const categoryController = require("../controllers/categoryController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);
router.post("/", verifyToken, categoryController.create);
router.delete("/:id", verifyToken, categoryController.remove);

module.exports = router;
