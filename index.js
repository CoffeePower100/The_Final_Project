const express = require("express");
const bodyParser = require("body-parser");
const database = require("./utilis/database");

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


const accountsRoute = require('./controllers/account');
app.use('/', accountsRoute);

const productsRoute = require('./controllers/category');
app.use('/category', productsRoute);

const port = 5070;

database
.sync()
.then(results => {
    console.log(results);
    app.listen(port, function(){
        console.log(`Server working with port ${port}`);
    })
})
.catch(err => console.log(err))
