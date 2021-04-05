const jwt = require("jsonwebtoken")
const User = require("../schemas/user")  
require("dotenv").config()

module.exports = (req, res, next) => {

    const { authorization } = req.headers;     
    const [tokenType, tokenValue] = authorization.split(' ');   

    //1)
    if (tokenType !== 'Bearer'){   
        res.json({
            msg : 'TypeIncorrect',
        });
        return; 
    }

    try { 
        const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY)  

        User.findById(userId, {_id : true, id : true, nickname : true, area : true }).exec().then((user) => {
            console.log(user)
            res.locals.user = user
            next();
        });

    }catch(error){
        res.json({
            msg : "not_login"
        })
        return;
    }
}

