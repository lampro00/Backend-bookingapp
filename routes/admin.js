const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();
router.get("/login", adminController.login);
router.post("/singup", adminController.singup);
router.get("/admin/pagehome", adminController.getAdminpage);
router.get("/admin/deletehotel", adminController.postDeletehotel);
router.get("/admin/hotels", adminController.getHotels);
router.get("/admin/getroom", adminController.getRooms);
router.post("/admin/addhotels", adminController.addhotels);
router.post("/admin/edithotels", adminController.edithotels);
router.post("/admin/addrom", adminController.Addrooms);
router.get("/admin/deleteroom", adminController.postdeleteroom);
router.get("/admin/trans", adminController.gettrans);
router.get("/admin/getidhotel", adminController.getIdHotels);
router.get("/admin/getIdroom", adminController.getIdRoom);
router.post("/admin/posteditroom", adminController.editRoom);
module.exports = router;
