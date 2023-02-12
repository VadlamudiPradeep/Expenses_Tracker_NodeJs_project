let express = require('express');
let app = express();

let bodyParser = require('body-parser');

let cors = require('cors');
app.use(cors());

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//models


//routes
let userRoutes = require('./routes/userRoutes');
let expensesRoutes =  require('./routes/expensesRoutes');


app.use('/user', userRoutes);
app.use('/expenses' , expensesRoutes);

let sequelize = require('./util/database');

sequelize.sync()
.then(response =>{
    app.listen(3000,()=>{
        console.log('Port is  running on 3000')
    });
})
.catch(err=>{
    console.log(err);
})