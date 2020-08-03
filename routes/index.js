const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
//@desc  Login/Landing page
//@route GET /
router.get("/", (req, res) => {
  res.send("We are live")

});

//@desc  DashBoard
//@route GET /dashboard
router.get("/test", checkAuth, (req, res) => {
console.log(req.userData)

res.send("We must be happy")

});

module.exports = router;
