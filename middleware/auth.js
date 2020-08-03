const { json } = require("express");

module.exports = {
    ensureAuth: function (req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else {
            res.status(400).json({message: "Please Login"})
        }
    },
    ensureGuest: function (req, res, next){
        if(req.isAuthenticated()){
            res.status(200).json({message: "User still logged in"})
        } else {
            return next()
        }
    },
}