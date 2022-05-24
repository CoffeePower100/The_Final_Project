// Postman: Authorization > Type (Bearer Token) + Insert received token after successful login.

import jsonWebToken from 'jsonwebtoken';
const users = [{email: "a@w.com", pass: "1234", fname = "name"}];

const auth = async(request, response, next) => {

    const bearerHeader = request.headers['authorization'];
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    const tokenVerify = await jsonWebToken.verify(token, 't Key');
    const account = /*await*/ users.find(x => x.email == tokenVerify.email);

    if (account){
        request.account = account;
        next();
    }
    else
    {
        return response.sendStatus(403); // Unauthorized
    }
}


export default auth;