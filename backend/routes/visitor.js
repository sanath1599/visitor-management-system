var express = require("express");
const VisitorController = require("../controllers/VisitorController");

var router = express.Router();

router.get("/", VisitorController.visitorList);
router.get("/:id", VisitorController.visitorDetail);
router.post("/", VisitorController.visitorStore);
router.put("/:id", VisitorController.visitorUpdate);
router.delete("/:id", VisitorController.visitorDelete);

module.exports = router;