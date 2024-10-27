const express = require("express");
const multer = require("multer");
const {
    getDrugByName,
    createDrug,
    updateDrugByName,
    deleteDrugByName,
    getAllDrugs,
} = require("../controllers/drugscontrollers");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Directory where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Append unique timestamp to the file name
    },
});

const upload = multer({ storage: storage });

// Route to create a new drug with an image upload
router.post("/", upload.single('image'), createDrug);

// Route to update a drug by name
router.put("/:name", upload.single('image'), updateDrugByName); // Use multer for file uploads

// Route to get a drug by name
router.get("/:name", getDrugByName);

// Route to delete a drug by name
router.delete("/:name", deleteDrugByName); // Changed to delete by name

// Route to get all drugs
router.get("/", getAllDrugs);

module.exports = router;