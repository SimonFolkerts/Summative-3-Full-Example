const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // send back the data to confirm reciept
  res.json(req.body);
});

module.exports = router;
