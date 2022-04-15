const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/SaucesController");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const isown = require("../middleware/isOwn")
 router.post("/", auth,  multer, sauceCtrl.createSauce,); 
 router.post('/:id/like', auth, sauceCtrl.likeOrDislike)
router.get("/", auth, sauceCtrl.getAllSauces);

router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, isown, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth,isown, sauceCtrl.deleteSauce);

module.exports = router;