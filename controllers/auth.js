// Postman: Authorization > Type (Bearer Token) + Insert received token after successful login.

const jsonWebToken =  require('jsonwebtoken');
const Account = require('../models/account');

const auth = async(request, response, next) => {

    const bearerHeader = request.headers['authorization'];
    
    // if given token isn't string's type:
    if ("string" == typeof(bearerHeader))
    {
        const bearer = bearerHeader.split(" ");
    
        const token = bearer[1];

        const tokenVerify = jsonWebToken.verify(token, 'KswkWJ3j4ljL2');
        Account.findByPk(tokenVerify.email)
        .then(account => {
            if (null == account)
            {
                // Request from Unauthorized source:
                return response.status(403).json({
                    message: "unautorized user"
                });
            }
            else
            {
                next();
            }
        })
        .catch(err => {
            return response.status(500).json({
                error: err
            });
        })
    }
    else
    {
        return response.status(200).json({
            error: "given auth token isn't a string"
        });
    }

}


module.exports = auth;
