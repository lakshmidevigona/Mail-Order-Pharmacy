const express = require("express");
const getrequireddrug  = require("../controllers/searchcontrollers");

const router = express.Router();
router.get("/:location/:drugName",getrequireddrug);
module.exports=router;