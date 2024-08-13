const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */
const {
  read,
  add,
  readReceived,
  edit,
} = require("../../../controllers/reservationActions");

const { newNotification } = require("../../../controllers/notificationAction");

const userIdCookie = require("../../../services/userIdCookie");

// Import reservation-related actions

router.get("/", userIdCookie, read);

router.get("/received", userIdCookie, readReceived);

router.put("/status", userIdCookie, edit, newNotification);

router.post("/", add, newNotification);

module.exports = router;
