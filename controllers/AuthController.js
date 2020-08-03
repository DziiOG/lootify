const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateRegisterData, validateSignInData } = require("../helpers/validators");

const register = (req, res, next) => {
  const rawUserInput = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const {errors, valid } = validateRegisterData(rawUserInput)

  if(valid){
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        
        if (err) {
            return   res.status(401).json({
            error: err,
          });
        }
        Client.findOne({ email: rawUserInput.email})
        .then(user => {
            if(user){
                return res.status.json({error: "user already exists with same email"})
            }else {
                let newClient = new Client({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    displayName: req.body.firstName + " " + req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPass,
                  });
          
                 
              
                  newClient
                    .save()
                    .then(() => {
                     return res.status(200).json({
                        message: "User created Successfully",
                      });
                      
                    })
                    .catch((error) => {
                     return res.status(404).json({
                        message: "An error occured" + error,
                      });
                    });
            }
        }).catch(err=> {
            res.status(400).json({
                error: err
            })
        })

        
      });
  }else {
     return res.status(400).json(errors)
  }
 
};

const signin = (req, res, next) => {
  const loggingUser = {
    email: req.body.email,
    password: req.body.password,
  };

  const {errors, valid} = validateSignInData(loggingUser);

  if(valid){
    Client.findOne({
        email: loggingUser.email,
      }).then((user) => {
        if (user) {
          bcrypt.compare(loggingUser.password, user.password, function (
            err,
            result
          ) {
            if (err) {
              res.json({
                error: err,
              });
            }
    
            if (result) {
              let token = jwt.sign(
               {
                 name: user.displayName,
                 id: user._id,
                 phone: user.phone,
                 email: user.email,
                 firstName: user.firstName,
                 lastName: user.lastName
               },
                "verySecretValue",
                { expiresIn: "24h" }
              );
              res.status(200).json({
                message: "Login Successful",
                token,
              });
            } else {
             return res.status(400).json({
                message: "Password does not match",
              });
            }
          });
        } else {
         return res.status(400).json({
            message: "No user found",
          });
        }
      });
  }else {
      return res.status(400).json(errors)
  }

 
};

module.exports = {
  register,
  signin,
};
