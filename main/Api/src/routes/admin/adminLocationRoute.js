const { addLocation, getLocation, deleteLocation, updateLocation } = require("../../controllers/admin/adminLocaltionConto");

const router = require("express").Router();

/* ------------------------- add Location data route ------------------------ */
router.post("/add-location", addLocation);

/* ------------------------- get list Location data route ------------------------ */
router.get("/get-location", getLocation);

/* ------------------------- delete list Location data route ------------------------ */
router.delete("/delete-location/:id", deleteLocation);

/* ------------------------- update list Location data route ------------------------ */
router.put("/update-location/:id", updateLocation);

module.exports = router;
