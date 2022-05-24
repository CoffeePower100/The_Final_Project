// imports:
//...
import auth from ".auth.js";
import express from "express";
const router = express.Router();


router.get('/getAllProducts', auth, async(request, response) => {
    return response.status(200).json({
        message: `Welcome ${request.account.fname}`,
        products: [{name: 'Chair'}] //products
    });
})


export default router;