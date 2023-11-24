// comunas.js
const express = require("express");
const router = express.Router();
const ComunaController = require("../controllers/comuna");

router.get("/comunas", ComunaController.obtenerComunas);
router.get("/comunas/region/:regionId", ComunaController.obtenerComunasPorRegion);

module.exports = router;
