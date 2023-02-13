let express = require('express');
let app = express();

let bodyParser = require('body-parser');

let cors = require('cors');
app.use(cors());

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//models
let userModels  = require('./models/user');
let expensesModels = require('./models/expenses');
let ordersModels = require('./models/orders');

//routes
let userRoutes = require('./routes/userRoutes');
let expensesRoutes =  require('./routes/expensesRoutes');
let purchaseRoutes = require('./routes/purchaseRoutes');

const dotenv = require('dotenv');

// get config 
dotenv.config();

app.use('/user', userRoutes);
app.use('/expenses' , expensesRoutes);
app.use('/purchase',purchaseRoutes);

//Asociation 
userModels.hasMany(expensesModels);
expensesModels.belongsTo(userModels);
userModels.hasMany(ordersModels);
ordersModels.belongsTo(userModels);

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