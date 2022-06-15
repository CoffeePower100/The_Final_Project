const express = require('express');
const router = express.Router();

const bcrypt = require("bcryptjs");
const jsonWebToken = require('jsonwebtoken');
const Account = require('../models/account');

let isRegisterSucceed = true;
let isVerifySucceed = true;
let loginStatusNum = 2; // 0 - email or user not found
                        // 1 - user didn't verified his / her account
                        // 2 - login succeed

function randRange(minNum, maxNum)
{
    return Math.floor(Math.random() * (maxNum - minNum)) + minNum;
}

router.post('/register', async (request, response) =>
{
    const {email, pass, firstName, lastName} = request.body;
    const passCode = randRange(1000, 9999);

    encryptPass = await bcrypt.hash(pass, 10);

    Account.create({
        firstName: firstName,
        lastName: lastName,
        pass: encryptPass,
        verifyPassCode: passCode,
        updatePassCode: 123412, // default update password's pass code.
        isApproved: false,
        email: email
    })
    .then(account => {
        isRegisterSucceed = true;
        return response.status(200).json({
            userAccount: account
        });
    })
    .catch(err => {
        console.log(err);
        // error: failed creating new user account
        // (one option: new user with exists email address)
        isRegisterSucceed = false;
        return response.status(500).json({
            message : "entered email already used by existed user"        });
    });
})

router.post('/verifyPassCode', (request, response) =>
{
    const {email, verifyPassCode} = request.body;
    Account.findByPk(email)
    .then(account => {
        // if account with email in request not found:
        if (null == account)
        {
            isVerifySucceed = false;
            return response.status(200).json({
                message: "entered email doesn't exist for any user" 
            });
        }
        else
        {
            if (verifyPassCode != account.verifyPassCode)
            {
                isVerifySucceed = false;
                return response.status(200).json({
                    message: "entered verify code isn't for current user's account"    
                });
            }
            else
            {
                isVerifySucceed = true;
                account.isApproved = true;
                account.save();
                return response.status(200).json({
                    userAccount : account
                });
            }
        }
    })
    .catch(err => {
        console.log(err);
        return response.status(500).json({
            error: err
        });
    })
})

router.post('/login', (request, response) => 
{
    const {email, pass} = request.body;
    Account.findByPk(email)
    .then(account => {
        // if there's no account with email in request:
        if (null == account)
        {
            // user not found, login failed:
            loginStatusNum = 0;
            return response.status(200).json({
                message: "entered email doesn't exist for any user"
            });
        }
        else
        {
            bcrypt.compare(pass, account.pass)
            .then(async isPassMatch => {
                if(isPassMatch) 
                {
                    // if found user's account wasn't verified:
                    if (false == account.isApproved)
                    {
                        // user's account wasn't verified, login failed:
                        loginStatusNum = 1;
                        return response.status(200).json({
                            message: "user's account isn't verified"
                        })
                    }
                    else
                    {
                        // login succeed:
                        loginStatusNum = 2;
                        // const userTok = await jsonWebToken.sign(request.body, "A2");
                        console.log("logged");
                        userTok = await jsonWebToken.sign(request.body, "KswkWJ3j4ljL2");
                        return response.status(200).json({
                            userToken: userTok
                        });
                    } 
                }
                else
                {
                    // given password doesn't match user's account, login failed:
                    loginStatusNum = 0;
                    return response.status(200).json({
                        message: "entered password doesn't match with given email"
                    });
                }
            })
            .catch(err => {
                return response.status(500).json({
                    error: err
                });
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

router.post("/reqPassUpdate", (request, response) => {
    Account.findByPk(request.body.email)
    .then(account => {
        if (null == account)
        {
            // user's account with given email doesn't exist:
            return response.status(200).json({
                message : "entered email doesn't exist for any user"
            });
        }
        else
        {
            account.updatePassCode = randRange(10000, 99999);
            account.save();
            return response.status(200).json({
                updatePassCode: account.updatePassCode
            });
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

router.put("/updatePass", (request, response) => {
    const {updatePassCode, email, newPass} = request.body;
    Account.findByPk(email)
    .then(async account => {
        if (null == account)
        {
            // user's account with given email doesn't exist:
            return response.status(200).json({
                message: "entered email doesn't exist for any user"
            });
        }
        else
        {
            if (updatePassCode != account.updatePassCode)
            {
                return response.status(200).json({
                    message: "entered update pass code isn't for given user's account"
                });
            }
            else
            {
                // if given password's update pass code isn't 5 digits long: 
                if (10000 > updatePassCode || 99999 < updatePassCode)
                {
                    return response.status(200).json({
                        message: "entered update pass code must be five digits long"
                    });
                }
                else
                {
                    account.pass = await bcrypt.hash(newPass, 10);
                    account.save();
                    return response.status(200).json({
                        userAccount: account
                    });
                }
            }
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

module.exports = router;