require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const categoryRoute = require("./src/routes/categoryRoute");
const productRoute = require("./src/routes/productRoute");
const userRoute = require("./src/routes/userRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API de Pwr Factory funcionando" });
});

app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El JSON enviado es inválido" });
  }
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
