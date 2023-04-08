const path = require("path");

const express = require("express");

const hotelsController = require("../controllers/hotel");

const router = express.Router();
router.get("/", hotelsController.getHotels);
router.get("/Search", hotelsController.search);
router.get("/hotel", hotelsController.getHotelsid);
router.post("/book", hotelsController.getbook);
router.get("/transaction", hotelsController.getTrans);
router.post("/chekcroomdate", hotelsController.getOrderRoom);
module.exports = router;
