const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        if(!req.headers.authorization.split(" ")[1]){
           
        }else {

            const token = req.headers.authorization.split(" ")[1];
            if(!token){
                return res.status(400).json({
                    error: "Server could not authenticate"
                })
            }
            const decoded = jwt.verify(token, "verySecretValue")
            req.userData = decoded;
            next();
        }
    
    }catch(err){
        console.log(err)

        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    
    
}