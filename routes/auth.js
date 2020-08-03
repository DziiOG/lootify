const express = require("express");
const passport = require('passport');
const router = express.Router();

const AuthController =  require('../controllers/AuthController');

//@desc  Auth with Google
//@route GET /auth/google
router.get("/google", passport.authenticate('google', {
    scope: 'profile'
}));

//@desc  Google auth callback
//@route GET /auth/google/callback
router.get("/google/callback", passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res)=>{
    return res.status(200).json({message: "Login was successful"})
});


//@desc  Logout user
//@route /auth/logout
router.get('/logout', (req, res)=>{
    req.logout()
    res.status(201).json({message: "User was logged out"})
})







//newClient Register

router.post('/register', AuthController.register)
router.post('/signin', AuthController.signin)

module.exports = router;
