const express = require("express");
const productController = require("../controllers/productController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", verifyToken, productController.create);
router.put("/:id", verifyToken, productController.update);
router.delete("/:id", verifyToken, productController.remove);

module.exports = router;
