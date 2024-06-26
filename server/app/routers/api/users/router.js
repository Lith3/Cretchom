const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import users-related actions
const {
  browse,
  read,
  edit,
  add,
  destroy,
  checkLog,
} = require("../../../controllers/usersActions");

const validateLogin = require("../../../services/ValidateLogin");

const validateSignUp = require("../../../services/validateSignUp");

const validateProfileEdit = require("../../../services/ValidateProfileEdit");

const validatecookie = require("../../../services/validatecookie");

// Route to get a list of categories
router.get("/", browse);

// Route to get a specific user by ID
router.get("/:id", validatecookie , read);

// Route to edit an existing user
router.put("/:id", validateProfileEdit, edit);

// Route to add a new user
router.post("/", validateSignUp, add);

// Route to check the login
router.post("/login", validateLogin, checkLog);

// Route to delete an existing users
router.delete("/:id", destroy);

/* ************************************************************************* */

module.exports = router;
