const tables = require("../../database/tables");

const read = async (req, res, next) => {
  try {
    const userId = req.user;
    const reservations = await tables.reservation.read(userId);
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the user data from the request body
  const reservations = req.body;
  try {
    // Insert the user into the database
    const insertId = await tables.reservation.create(reservations);
    req.reservation_id = insertId;
    res.sendStatus(201);
    next();
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
// Reads reservations received as a home structure
const received = async (req, res, next) => {
  try {
    const userId = req.user;
    const reservations = await tables.reservation.readReceived(userId);
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  const { type } = req.query;
  const userId = req.user;
  const reservationId = req.body.id;

  try {
    // Verify if user can edit this reservation
    let verify = 0;
    if (type === "cancel") {
      verify = await tables.reservation.verifyCancel(userId, reservationId);
    } else {
      verify = await tables.reservation.verify(userId, reservationId);
    }
    if (verify === 1) {
      await tables.reservation.edit(reservationId, type);
      res.sendStatus(204);

      // adapts the values for the notification.
      req.reservation_id = reservationId;
      req.body = [req.body];
      next();
    } else {
      res.status(403).json("unauthoriez acces");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  read,
  add,
  received,
  edit,
};
