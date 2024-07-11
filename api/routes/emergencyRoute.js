const express = require('express')
const router = express.Router()
const {getAllEmergencies, getSingleEmergency, updateEmergency, createEmergency } = require("../controllers/emergencyController")

router.route("/").get(getAllEmergencies)
router.route("/:id").get(getSingleEmergency)
router.route("/").post(createEmergency)
router.route("/:id").patch(updateEmergency)

module.exports = router