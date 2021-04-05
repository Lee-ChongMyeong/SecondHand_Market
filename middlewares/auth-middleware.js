const jwt = require("jsonwebtoken")
const User = require("../schemas/user")  // User모델이 불러와짐
require("dotenv").config()

module.exports = (req, res, next) => {

    const { authorization } = req.headers;     //  (Type = Bearer  Value = 진짜 token 값)
    const [tokenType, tokenValue] = authorization.split(' ');   

    //1)
    if (tokenType !== 'Bearer'){   
        res.status(401).send({
            errorMessage : '로그인 후 사용하세요',
        });
        return; 
    }

    try { 
        const { userId } = jwt.verify(tokenValue, process.SECRET_KEY)  
        console.log("userID 값 : ", userId)  // 진짜 사용자 인증에 대한 ID ( 그말인 즉슨, 사용자 인증이 완료됬다. )

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

