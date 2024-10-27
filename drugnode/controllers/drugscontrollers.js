const Drug = require("../models/drugs");

const getAllDrugs = async (req, res) => {
    try {
        const drugs = await Drug.find();
        if (drugs && drugs.length > 0) {
            return res.status(200).send(drugs);
        } else {
            return res.status(204).send({ message: "No Drugs" });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

const getDrugByName = async (req, res) => {
    const drugName = req.params.name; // Get the drug name from route params
    try {
        const drug = await Drug.findOne({ drugName });
        if (!drug) {
            return res.status(404).send(`{ message: No drug found with name: ${drugName}}`);
        } else {
            return res.status(200).send(drug);
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

const deleteDrugByName = async (req, res) => {
    const drugName = req.params.name; // Deleting by drug name
    try {
        const result = await Drug.deleteOne({ drugName });
        if (result.deletedCount === 0) {
            return res.status(404).send(`{ message: No drug found with name: ${drugName} }`);
        }
        return res.status(200).send(`{ message: Deleted successfully for drugName: ${drugName} }`);
    } catch (err) {
        return res.status(500).send(err);
    }
};

const updateDrugByName = async (req, res) => {
    const drugName = req.params.name;
    const body = req.body;

    try {
        // Check if an image was uploaded
        if (req.file) {
            body.image = req.file.path; // Update the image path if a new file is uploaded
        } else {
            // If no new image is uploaded, retain the existing image path
            const existingDrug = await Drug.findOne({ drugName });
            if (existingDrug) {
                body.image = existingDrug.image; // Keep the existing image
            }
        }

        const drug = await Drug.findOneAndUpdate(
            { drugName },
            body,
            { new: true, runValidators: true }
        );

        if (drug) {
            return res.status(202).send(drug);
        } else {
            return res.status(404).send({ message: 'Drug not found' });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

const createDrug = async (req, res) => {
    try {
        const { drugName, location, Cost, CapsulesPerPack, Company } = req.body;

        // Check if the image was uploaded and get the filename
        const image = req.file ? req.file.path : null; // req.file.path gives the relative path to the image

        const drug = new Drug({
            drugName,
            location,
            Cost,
            CapsulesPerPack,
            Company,
            image, // Store the image path here
        });

        const result = await drug.save(); // Save the drug to the database
        return res.status(201).send(result);
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports = {
    getAllDrugs,
    getDrugByName,
    updateDrugByName,
    createDrug,
    deleteDrugByName,
};