const jwt = require("jsonwebtoken")
const User = require("../schemas/user")  // User모델이 불러와짐

module.exports = (req, res, next) => {

    const { authorization } = req.headers; 
    const [tokenType, tokenValue] = authorization.split(' ');   

    if (tokenType !== 'Bearer'){   
        res.status(401).send({
            errorMessage : '로그인 후 사용하세요',
        });
        return; 
    }

    try { 
        const { userId } = jwt.verify(tokenValue, "fake_carrot_market")  
        console.log("userID 값 : ", userId)  

        User.findById(userId).exec().then((user) => {
            res.locals.user = user;

            next();
        });

    }catch(error){
        res.status(400).send({
            errorMessage : "로그인 후 사용하세요",
        })
        return;
    }
}

